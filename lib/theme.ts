import { siteConfig } from '@/data/site';

/**
 * ============================================================================
 *  THEME
 * ============================================================================
 *  The theme lives on <html> as a class:
 *    <html class="dark">  → midnight / charcoal (default)
 *    <html class="light"> → white / light gray
 *
 *  `THEME_SCRIPT` runs **before paint** (inline, blocking, ~350 bytes) so the
 *  correct theme is applied on the very first frame — no flash of the wrong
 *  theme, and no hydration mismatch because we never render theme-dependent
 *  markup on the server.
 * ============================================================================
 */

export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = siteConfig.theme.storageKey;

/**
 * Builds the pre-paint script from data/site.ts so the config stays the single
 * source of truth for the default theme and system-preference behaviour.
 */
function buildThemeScript(): string {
  const { default: fallback, respectSystemPreference, storageKey } = siteConfig.theme;

  return `(function(){try{
var k=${JSON.stringify(storageKey)};
var d=document.documentElement;
var s=null;
try{s=window.localStorage.getItem(k)}catch(e){}
var m=(s==='light'||s==='dark')?s:${
    respectSystemPreference
      ? `(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')`
      : JSON.stringify(fallback)
  };
d.classList.remove('dark','light');
d.classList.add(m);
d.style.colorScheme=m;
d.setAttribute('data-theme',m);
}catch(e){var d=document.documentElement;d.classList.add(${JSON.stringify(fallback)});}})();`;
}

export const THEME_SCRIPT = buildThemeScript();

/**
 * Applies a theme and persists it. Temporarily adds a class that lets CSS
 * transition background/border/colour smoothly across the whole page, then
 * removes it so the transition never interferes with other interactions.
 */
export function applyTheme(mode: ThemeMode, options: { animate?: boolean } = {}): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const { animate = true } = options;

  if (animate) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 380);
  }

  root.classList.remove('dark', 'light');
  root.classList.add(mode);
  root.style.colorScheme = mode;
  root.setAttribute('data-theme', mode);

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* storage can be blocked (private mode) — theming still works in-memory */
  }
}

export function readStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function getCurrentTheme(): ThemeMode {
  if (typeof document === 'undefined') return siteConfig.theme.default;
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}
