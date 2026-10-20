'use client';

import { useCallback, useEffect, useState } from 'react';
import { applyTheme, getCurrentTheme, type ThemeMode } from '@/lib/theme';
import { cn } from '@/lib/utils';

/**
 * ThemeToggle
 * ---------------------------------------------------------------------------
 * Squared mono toggle matching the button language: shows "DARK" / "LIGHT"
 * with a sun/moon glyph. The real theme is applied before paint by the inline
 * script in app/layout.tsx, so this only reads it on mount — the server and
 * first client render are identical, so there is no hydration mismatch.
 *
 * Exposed as a switch with an explicit state label and keyboard operable.
 */

interface ThemeToggleProps {
  className?: string;
  label?: string;
}

export function ThemeToggle({ className, label = 'Colour theme' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode | null>(null);

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key && (event.newValue === 'dark' || event.newValue === 'light')) {
        setTheme(event.newValue);
        applyTheme(event.newValue, { animate: false });
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isDark = theme !== 'light';

  const toggle = useCallback(() => {
    const next: ThemeMode = getCurrentTheme() === 'light' ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`${label} — currently ${isDark ? 'dark' : 'light'}`}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
      className={cn(
        'tap-target group inline-flex h-11 items-center gap-2 border border-[var(--line-strong)] px-3 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[var(--muted)]',
        'transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--fg-strong)]',
        className,
      )}
    >
      <span aria-hidden className="flex h-4 w-4 items-center justify-center">
        {isDark ? (
          /* moon */
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
          </svg>
        ) : (
          /* sun */
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        )}
      </span>
      <span className="hidden sm:inline">{theme === null ? '—' : isDark ? 'DARK' : 'LIGHT'}</span>
      <span className="sr-only">{isDark ? 'Dark theme active' : 'Light theme active'}</span>
    </button>
  );
}

export default ThemeToggle;
