/**
 * Date utility functions — pure, no side effects.
 */

/** Format ISO date string to human-readable form */
export function formatDate(
  isoString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale = 'en-US',
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(isoString));
}

/** Format ISO date to relative time (e.g., "2 hours ago") */
export function formatRelativeTime(isoString: string, locale = 'en-US'): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSeconds < 60) { return rtf.format(-diffSeconds, 'second'); }
  if (diffMinutes < 60) { return rtf.format(-diffMinutes, 'minute'); }
  if (diffHours < 24) { return rtf.format(-diffHours, 'hour'); }
  if (diffDays < 7) { return rtf.format(-diffDays, 'day'); }
  if (diffWeeks < 4) { return rtf.format(-diffWeeks, 'week'); }
  if (diffMonths < 12) { return rtf.format(-diffMonths, 'month'); }
  return rtf.format(-diffYears, 'year');
}

/** Check if a date is today */
export function isToday(isoString: string): boolean {
  const date = new Date(isoString);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/** Add days to a date */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Return current ISO timestamp */
export function nowISO(): string {
  return new Date().toISOString();
}
