import { formatRelativeTime, hoursAgo, daysAgo } from './time';

const NOW = Date.parse('2026-03-15T12:00:00.000Z');
const at = (iso: string) => formatRelativeTime(iso, NOW);

describe('formatRelativeTime', () => {
  test('collapses the first minute to "Just now"', () => {
    expect(at('2026-03-15T11:59:30.000Z')).toBe('Just now');
    expect(at('2026-03-15T11:59:59.999Z')).toBe('Just now');
  });

  test('reports minutes, hours and days', () => {
    expect(at('2026-03-15T11:45:00.000Z')).toBe('15m ago');
    expect(at('2026-03-15T09:00:00.000Z')).toBe('3h ago');
    expect(at('2026-03-13T12:00:00.000Z')).toBe('2d ago');
    expect(at('2026-03-09T12:00:00.000Z')).toBe('6d ago');
  });

  test('falls back to an absolute date past a week', () => {
    expect(at('2026-03-01T12:00:00.000Z')).toBe('1 Mar 2026');
  });

  test('clamps future timestamps instead of showing negative ages', () => {
    expect(at('2026-03-15T12:05:00.000Z')).toBe('Just now');
  });

  test('returns empty string for unparseable input', () => {
    expect(at('not-a-date')).toBe('');
    expect(at('')).toBe('');
  });
});

describe('mock timestamp helpers', () => {
  test('produce ISO strings in the past', () => {
    expect(Date.parse(hoursAgo(2))).toBeLessThanOrEqual(Date.now());
    expect(Date.parse(daysAgo(1))).toBeLessThanOrEqual(Date.now());
    expect(formatRelativeTime(hoursAgo(2))).toBe('2h ago');
  });
});
