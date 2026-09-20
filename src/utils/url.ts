/** URL helpers — unit-tested in Phase 7. */

export function isValidUrl(input: string): boolean {
  try {
    const u = new URL(input.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  const withProto =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const u = new URL(withProto);
  u.hash = '';
  // Strip trailing slash on root only
  return u.toString();
}

export function extractDomain(input: string): string {
  try {
    return new URL(normalizeUrl(input)).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Site icon for a domain, served from the preview pipeline's icon provider. */
export function faviconUrl(domain: string, size = 64): string {
  const d = domain.trim().toLowerCase().replace(/^www\./, '');
  if (!d) return '';
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=${size}`;
}
