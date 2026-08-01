/**
 * String utility functions — pure, no side effects.
 */

/** Capitalize the first letter of a string */
export function capitalize(str: string): string {
  if (!str) { return ''; }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Convert camelCase or snake_case to Title Case */
export function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(capitalize)
    .join(' ');
}

/** Truncate string to max length with ellipsis */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) { return str; }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/** Convert string to URL-friendly slug */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generate a full display name from parts */
export function getDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/** Get initials from name (up to 2 chars) */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Mask email for privacy (e.g., "j***@example.com") */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) { return email; }
  const visible = localPart.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(localPart.length - 1, 3))}@${domain}`;
}

/** Generate a random alphanumeric string */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/** Check if string is a valid URL */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/** Format bytes to human readable size */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) { return '0 Bytes'; }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
