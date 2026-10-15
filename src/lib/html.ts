/**
 * Small, dependency-free helpers for producing safe HTML.
 * All content strings are escaped before they reach the page, so text typed
 * into content files can never inject markup or scripts.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape text for use inside HTML elements or quoted attributes. */
export function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/** Join template fragments, dropping false/null/undefined. */
export function join(parts: Array<string | false | null | undefined>, sep = ''): string {
  return parts.filter((p): p is string => typeof p === 'string' && p.length > 0).join(sep);
}

/** Allowed URL schemes for links coming from content files. */
export function isSafeUrl(url: string): boolean {
  const u = url.trim();
  if (u === '') return false;
  if (u.startsWith('#') || u.startsWith('./') || u.startsWith('../')) return true;
  if (/^[a-z0-9][a-z0-9/_\-.]*$/i.test(u) && !u.includes(':')) return true; // relative path
  try {
    const parsed = new URL(u);
    return ['https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function isExternal(url: string): boolean {
  return /^https:\/\//i.test(url);
}

/**
 * Attributes for an external link opened in a new tab, safely
 * (rel="noopener noreferrer" prevents the new page controlling this one).
 */
export function externalAttrs(url: string): string {
  return isExternal(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
}

/** Visually-hidden suffix announcing that a link opens in a new tab. */
export const NEW_TAB_SR = '<span class="sr-only"> (opens in a new tab)</span>';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number;
}

export function parseIsoDate(iso: string): DateParts {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Invalid date "${iso}" — use YYYY-MM-DD`);
  const parts = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  if (d.getUTCFullYear() !== parts.year || d.getUTCMonth() !== parts.month - 1 || d.getUTCDate() !== parts.day) {
    throw new Error(`Invalid calendar date "${iso}"`);
  }
  return parts;
}

export function weekday(iso: string): string {
  const p = parseIsoDate(iso);
  return WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()] ?? '';
}

/** "15 April 2027" */
export function formatDate(iso: string): string {
  const p = parseIsoDate(iso);
  return `${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
}

/** "15 Apr" */
export function formatDayMonthShort(iso: string): string {
  const p = parseIsoDate(iso);
  return `${p.day} ${MONTHS_SHORT[p.month - 1]}`;
}

export function monthShort(iso: string): string {
  return MONTHS_SHORT[parseIsoDate(iso).month - 1] ?? '';
}

/** "15–17 April 2027", "30 March – 2 April 2027", or a single date. */
export function formatDateRange(start: string, end?: string): string {
  if (!end || end === start) return formatDate(start);
  const a = parseIsoDate(start);
  const b = parseIsoDate(end);
  if (a.year === b.year && a.month === b.month) return `${a.day}–${b.day} ${MONTHS[b.month - 1]} ${b.year}`;
  if (a.year === b.year) return `${a.day} ${MONTHS[a.month - 1]} – ${b.day} ${MONTHS[b.month - 1]} ${b.year}`;
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** "₹5,000" using Indian digit grouping. */
export function formatInr(amount: number): string {
  const s = Math.round(amount).toString();
  if (s.length <= 3) return `₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${rest},${last3}`;
}
