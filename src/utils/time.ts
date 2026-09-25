/**
 * Relative-time formatting for link creation timestamps.
 *
 * `links.saved_at` is a real timestamptz from Postgres (default now()), so
 * every surface formats it at render time instead of storing a canned
 * "2h ago" string. Hand-rolled month names keep output deterministic and
 * avoid depending on Hermes Intl locale data.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * "Just now" / "7m ago" / "3h ago" / "2d ago", falling back to an absolute
 * date past a week. Unparseable or future-dated input is clamped to "Just now"
 * rather than rendering "in 3 minutes" (clock skew between device and server).
 */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return '';

  const diff = now - then;
  if (diff < MINUTE) return 'Just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d ago`;

  const d = new Date(then);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** ISO timestamp `hours` in the past — used to keep mock rows time-accurate. */
export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * HOUR).toISOString();
}

/** ISO timestamp `days` in the past — used to keep mock rows time-accurate. */
export function daysAgo(days: number): string {
  return new Date(Date.now() - days * DAY).toISOString();
}
