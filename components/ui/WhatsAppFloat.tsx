'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig, getWhatsAppHref } from '@/data/site';

/**
 * WhatsAppFloat
 * ---------------------------------------------------------------------------
 * Squared floating action button, bottom-right, matching the button language.
 *
 * • Rendered only when a real WhatsApp number exists — never a dead link.
 * • 48px on mobile, 56px from `sm` up; respects `env(safe-area-inset-bottom)`.
 * • The tooltip appears on hover *and* keyboard focus; the label is also the
 *   accessible name, so screen-reader users get it without hovering.
 * • Entrance is delayed slightly so it never competes with the hero paint.
 */

export function WhatsAppFloat() {
  const href = getWhatsAppHref();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!href) return null;

  return (
    <motion.div
      className="safe-bottom fixed right-4 z-[70] sm:right-6"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={siteConfig.whatsapp.ariaLabel}
        className="group relative flex h-12 w-12 items-center justify-center border border-[var(--accent)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] focus-visible:scale-[1.04] sm:h-14 sm:w-14"
        style={{
          backgroundImage: 'linear-gradient(150deg, var(--accent) 0%, #b8100c 100%)',
          color: '#ffffff',
        }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden focusable="false">
          <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.38 1.26 4.8L2 22l5.5-1.42a9.83 9.83 0 0 0 4.54 1.1h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm0 17.96h-.01a8.2 8.2 0 0 1-4.16-1.13l-.3-.18-3.09.8.83-3-.19-.31a8.12 8.12 0 0 1-1.25-4.3c0-4.5 3.67-8.16 8.18-8.16 2.18 0 4.23.85 5.77 2.39a8.09 8.09 0 0 1 2.39 5.78c0 4.51-3.67 8.17-8.17 8.17Zm4.5-6.12c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.13-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.5.11-.12.25-.3.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.24 1.02.39 1.37.5.57.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.47-.28Z" />
        </svg>

        {/* Tooltip — hover and keyboard focus */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap border border-[var(--line-strong)] bg-[var(--panel)] px-3.5 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--fg-strong)] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block"
        >
          {siteConfig.whatsapp.tooltip}
        </span>
      </a>
    </motion.div>
  );
}

export default WhatsAppFloat;
