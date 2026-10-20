/**
 * Tiny class-name joiner. Keeps the project dependency-free (no clsx /
 * tailwind-merge) while staying readable.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/** 01, 02, 03 … from an index. */
export function pad(index: number, size = 2): string {
  return String(index).padStart(size, '0');
}

/** "Muhammed Yasir" -> "MY" (fallback when config has no explicit initials). */
export function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Slug safe enough for ids / aria-controls. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
