'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { cn } from '@/lib/utils';
import { useActiveSection, useFocusTrap, useScrolled, useScrollLock } from '@/lib/hooks';
import { Wordmark, Slash } from '@/components/ui/Slash';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Close } from '@/components/ui/icons';

/**
 * Navbar
 * ---------------------------------------------------------------------------
 * Fixed bar in the studio-technical style: transparent over the hero, then a
 * solid hairline-ruled bar once scrolled. Links are mono uppercase at 12px
 * with wide tracking, and the active section is marked with the red slash
 * rather than a pill.
 *
 * Mobile uses a full-screen drawer with a focus trap, scroll lock, numbered
 * links, Esc-to-close and close-on-navigate.
 */

const SECTION_IDS = siteConfig.nav
  .map((link) => link.href.replace('#', ''))
  .filter(Boolean);

export function Navbar() {
  const scrolled = useScrolled(20);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const activeSection = useActiveSection(SECTION_IDS, true);

  useFocusTrap(panelRef, menuOpen);
  useScrollLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      setMenuOpen(false);

      const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior });
      window.history.replaceState(null, '', href);
      target.setAttribute('tabindex', '-1');
      window.setTimeout(() => target.focus({ preventScroll: true }), behavior === 'auto' ? 0 : 420);
    },
    [reduceMotion],
  );

  const navLinks = useMemo(() => siteConfig.nav, []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
          scrolled
            ? 'border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className={cn(
          "container-page flex items-center justify-between gap-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-[4.5rem]"
        )}>
          {/* Brand ------------------------------------------------------- */}
          <a
            href="#home"
            onClick={(event) => handleAnchorClick(event, '#home')}
            className="tap-target flex shrink-0 items-center"
            aria-label={`${siteConfig.companyName} — home`}
          >
            <Wordmark className="text-[1.35rem] sm:text-[1.5rem]" />
          </a>

          {/* Desktop links ---------------------------------------------- */}
          <nav aria-label={siteConfig.a11y.primaryNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(event) => handleAnchorClick(event, link.href)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative inline-flex min-h-11 items-center gap-2 px-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-200',
                        isActive
                          ? 'text-[var(--fg-strong)]'
                          : 'text-[var(--muted)] hover:text-[var(--fg-strong)]',
                      )}
                    >
                      {isActive && <Slash size="h-3" />}
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions ---------------------------------------------------- */}
          <div className="flex items-center gap-2">
            <ThemeToggle label={siteConfig.a11y.toggleTheme} />

            {/* Reference-style icon CTA on desktop, full button in the drawer */}
            <a
              href="#contact"
              onClick={(event) => handleAnchorClick(event, '#contact')}
              aria-label="Contact Hey Tech Technologies"
              className="hidden h-11 w-11 items-center justify-center border border-[var(--accent)] text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-white lg:inline-flex"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M4 6h16v12H4z" />
                <path d="m4.6 6.8 7.4 5.4 7.4-5.4" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? siteConfig.a11y.closeMenu : siteConfig.a11y.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="tap-target inline-flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] text-[var(--fg-strong)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] lg:hidden"
            >
              <span aria-hidden className="relative block h-4 w-5">
                <motion.span
                  className="absolute left-0 block h-[2px] w-full bg-current"
                  animate={menuOpen ? { top: 7, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                  style={{ top: 0 }}
                />
                <motion.span
                  className="absolute left-0 block h-[2px] w-full bg-current"
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  style={{ top: 7 }}
                />
                <motion.span
                  className="absolute left-0 block h-[2px] w-full bg-current"
                  animate={menuOpen ? { top: 7, rotate: -45 } : { top: 14, rotate: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                  style={{ top: 14 }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer ------------------------------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            tabIndex={-1}
            className="fixed inset-0 z-[60] flex flex-col bg-[var(--bg-2)] lg:hidden"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <div className="container-page flex h-16 items-center justify-between">
              <Wordmark className="text-[1.35rem]" />
              <button
                type="button"
                onClick={closeMenu}
                aria-label={siteConfig.a11y.closeMenu}
                className="tap-target inline-flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] text-[var(--fg-strong)]"
              >
                <Close width={20} height={20} />
              </button>
            </div>

            <div className="rule container-page" />

            <nav className="flex-1 overflow-y-auto overscroll-contain py-2">
              <ul className="container-page flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.28,
                      delay: reduceMotion ? 0 : 0.03 * index,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-[var(--line)]"
                  >
                    <a
                      href={link.href}
                      onClick={(event) => handleAnchorClick(event, link.href)}
                      className="flex min-h-16 items-center gap-4 font-display text-[1.5rem] font-800 uppercase text-[var(--fg-strong)]"
                      style={{ fontWeight: 800 }}
                    >
                      <span className="font-mono text-[0.65rem] font-normal tracking-[0.2em] text-[var(--accent)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div
              className="container-page border-t border-[var(--line)] pt-5"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              <a
                href="#contact"
                onClick={(event) => handleAnchorClick(event, '#contact')}
                className="flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--accent)] px-6 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-white"
              >
                Start a project
                <span aria-hidden>→</span>
              </a>
              <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
                {siteConfig.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
