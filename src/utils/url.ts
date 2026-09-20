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
