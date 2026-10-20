'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { Slash } from '@/components/ui/Slash';

/**
 * IntroStatement
 * ---------------------------------------------------------------------------
 * The large statement band that sits directly under the hero — the reference
 * language leads every major section with one oversized sentence in body type
 * rather than a heading, which keeps the display face reserved for headings.
 */

export function IntroStatement() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="Studio introduction" className="section border-t border-[var(--line)]">
      <div className="container-page">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14"
        >
          <p className="text-statement text-[var(--fg-soft)]">{siteConfig.intro.statement}</p>

          <div className="flex flex-col justify-end gap-5 lg:pb-1">
            <span aria-hidden className="hidden h-px w-full bg-[var(--line)] lg:block" />
            <p className="flex gap-3 text-sm text-[var(--muted)]">
              <Slash size="h-4" className="mt-1" />
              <span>{siteConfig.intro.support}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default IntroStatement;
