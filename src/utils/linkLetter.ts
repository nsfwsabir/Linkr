import type { Link } from '../types';

/**
 * The single letter a list tile shows.
 *
 * Seeded labels win so the designed letters stay put ("F" for fs.blog even
 * though the title starts with "A"); anything without one — notably every row
 * loaded from Postgres, which has no `thumb` — falls back to an initial of the
 * title, then the domain. Shared by the tile and the list sort so the order
 * always matches what is on screen.
 */
export function linkLetter(link: Link): string {
  const seeded = link.thumb?.label?.trim();
  if (seeded) return seeded;
  const title = (link.title ?? '').trim();
  if (title) return title.charAt(0).toUpperCase();
  const domain = (link.source_domain ?? '').trim();
  return domain ? domain.charAt(0).toUpperCase() : '#';
}
