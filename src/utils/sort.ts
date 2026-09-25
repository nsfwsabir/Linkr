import { linkLetter } from './linkLetter';
import type { Link } from '../types';

/**
 * Alphabetical ordering for link lists, keyed on the letter shown in the tile
 * rather than the title — so "A Guide to Focus" (tile shows "F") files under F.
 *
 * Plain case-folded comparison rather than `localeCompare` with options: the
 * lists are sorted in Hermes, where relying on full ICU collation data for
 * every build is fragile, and a stable A-Z is all the UI needs.
 */
export function byLetter<T extends Link>(a: T, b: T): number {
  const left = linkLetter(a).trim().toLowerCase();
  const right = linkLetter(b).trim().toLowerCase();
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/** Non-mutating A-Z copy ordered by the displayed letter. */
export function sortByLetter<T extends Link>(items: T[]): T[] {
  return [...items].sort(byLetter);
}
