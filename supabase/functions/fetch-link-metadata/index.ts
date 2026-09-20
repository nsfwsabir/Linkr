// Edge Function: fetch-link-metadata — SSRF-safe Open Graph extraction (TRD §5).
// Deploy with: supabase functions deploy fetch-link-metadata
// Never expose the service-role key to the client; this runs server-side only.

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const MAX_BYTES = 512 * 1024;
const TIMEOUT_MS = 8000;

function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h === 'localhost' ||
    h.endsWith('.local') ||
    h.endsWith('.internal') ||
    h === 'metadata.google.internal' ||
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    h === '169.254.169.254'
  );
}

function error(code: string, message: string, status = 400) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method !== 'POST') return error('INVALID_URL', 'POST with { url } required.', 405);
  let url: string;
  try {
    ({ url } = await req.json());
  } catch {
    return error('INVALID_URL', 'Invalid JSON body.');
  }
  let parsed: URL;
  try {
    parsed = new URL(String(url).trim());
  } catch {
    return error('INVALID_URL', 'The URL is not valid.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return error('INVALID_URL', 'Only http(s) URLs are allowed.');
  }
  if (isBlockedHost(parsed.hostname)) {
    return error('FORBIDDEN', 'URL target is not allowed.');
  }
  parsed.hash = '';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'LinkrBot/1.0 (+metadata-preview)' },
    });
    // Re-check final host after redirects (redirect-based SSRF guard)
    const finalHost = new URL(res.url).hostname;
    if (isBlockedHost(finalHost)) return error('FORBIDDEN', 'Redirect target is not allowed.');
    const buf = new Uint8Array(await res.arrayBuffer().then((b) => b.slice(0, MAX_BYTES)));
    const html = new TextDecoder().decode(buf);
    const pick = (re: RegExp): string | null => {
      const m = html.match(re);
      return m?.[1]?.trim().slice(0, 500) ?? null;
    };
    const title =
      pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ??
      pick(/<title[^>]*>([^<]+)<\/title>/i) ??
      parsed.hostname;
    const description =
      pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ??
      pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const image =
      pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    return new Response(
      JSON.stringify({
        title,
        description,
        source_domain: parsed.hostname.replace(/^www\./, ''),
        preview_image_url: image,
      }),
      { headers: { 'content-type': 'application/json' } },
    );
  } catch (e) {
    if ((e as Error).name === 'AbortError') return error('METADATA_TIMEOUT', 'Metadata fetch timed out.', 504);
    return error('METADATA_UNAVAILABLE', 'Metadata is unavailable; save the URL anyway.', 502);
  } finally {
    clearTimeout(timer);
  }
});
