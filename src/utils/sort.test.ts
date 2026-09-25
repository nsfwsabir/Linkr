import { byTitle, sortByTitle } from './sort';

describe('sortByTitle', () => {
  test('orders alphabetically, case-insensitively', () => {
    const input = [
      { title: 'notion for Creators' },
      { title: 'A Guide to Focus' },
      { title: 'beautiful web apps' },
    ];
    expect(sortByTitle(input).map((x) => x.title)).toEqual([
      'A Guide to Focus',
      'beautiful web apps',
      'notion for Creators',
    ]);
  });

  test('does not mutate the input', () => {
    const input = [{ title: 'b' }, { title: 'a' }];
    sortByTitle(input);
    expect(input.map((x) => x.title)).toEqual(['b', 'a']);
  });

  test('is stable for equal titles and ignores surrounding space', () => {
    const input = [{ title: 'Same', id: 1 }, { title: ' same ', id: 2 }];
    expect(sortByTitle(input).map((x) => x.id)).toEqual([1, 2]);
    expect(byTitle({ title: 'a' }, { title: 'a' })).toBe(0);
  });
});
