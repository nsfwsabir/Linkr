/**
 * Alphabetical ordering for link lists.
 *
 * Plain case-folded comparison rather than `localeCompare` with options: the
 * lists are sorted in Hermes, where relying on full ICU collation data for
 * every build is fragile, and a stable A-Z is all the UI needs.
 */
export function byTitle<T extends { title: string }>(a: T, b: T): number {
  const left = a.title.trim().toLowerCase();
  const right = b.title.trim().toLowerCase();
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/** Non-mutating A-Z copy. */
export function sortByTitle<T extends { title: string }>(items: T[]): T[] {
  return [...items].sort(byTitle);
}
