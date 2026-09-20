import { isValidUrl, normalizeUrl, extractDomain, faviconUrl } from './url';

describe('url utils', () => {
  test('validates http(s) only', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com/a')).toBe(true);
    expect(isValidUrl('ftp://example.com')).toBe(false);
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });

  test('normalizes bare domains and strips hash', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com/');
    expect(normalizeUrl('https://example.com/#frag')).toBe('https://example.com/');
  });

  test('extracts domain without www', () => {
    expect(extractDomain('https://www.nngroup.com/a')).toBe('nngroup.com');
    expect(extractDomain('not a url with spaces')).toBe('');
  });

  test('builds favicon url for a domain', () => {
    expect(faviconUrl('nngroup.com')).toBe(
      'https://www.google.com/s2/favicons?domain=nngroup.com&sz=64',
    );
    expect(faviconUrl('www.nngroup.com', 128)).toContain('sz=128');
    expect(faviconUrl('')).toBe('');
  });
});
