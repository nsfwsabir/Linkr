import { sortByLetter, byLetter } from './sort';
import { linkLetter } from './linkLetter';
import type { Link } from '../types';

const link = (over: Partial<Link>): Link => ({
  id: 'id',
  user_id: 'u',
  canonical_url: 'https://example.com',
  original_url: 'https://example.com',
  title: 'Title',
  description: null,
  source_domain: 'example.com',
  preview_image_url: null,
  metadata_status: 'ready',
  saved_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...over,
});

describe('linkLetter', () => {
  test('prefers the seeded label over the title initial', () => {
    expect(linkLetter(link({ title: 'A Guide to Focus', thumb: { label: 'F' } }))).toBe('F');
  });

  test('falls back to the title initial, then the domain', () => {
    expect(linkLetter(link({ title: 'Beautiful Web Apps' }))).toBe('B');
    expect(linkLetter(link({ title: '   ', source_domain: 'fs.blog' }))).toBe('F');
    expect(linkLetter(link({ title: '', source_domain: '' }))).toBe('#');
  });
});

describe('sortByLetter', () => {
  test('orders by the displayed letter, not the title', () => {
    const input = [
      link({ title: 'Minimalist Living', thumb: { label: 'M' } }),
      link({ title: 'A Guide to Focus', thumb: { label: 'F' } }),
      link({ title: 'The Science of Better Sleep', thumb: { label: 'T' } }),
      link({ title: 'Beautiful Web Apps' }),
    ];
    // 'A Guide to Focus' sorts under F, not A.
    expect(sortByLetter(input).map(linkLetter)).toEqual(['B', 'F', 'M', 'T']);
  });

  test('is case-insensitive and does not mutate the input', () => {
    const input = [link({ title: 'b' }), link({ title: 'a' })];
    sortByLetter(input);
    expect(input.map((x) => x.title)).toEqual(['b', 'a']);
  });

  test('is stable for equal letters', () => {
    const a = link({ id: '1', title: 'Alpha' });
    const b = link({ id: '2', title: 'Another' });
    expect(sortByLetter([a, b]).map((x) => x.id)).toEqual(['1', '2']);
    expect(byLetter(a, a)).toBe(0);
  });
});
