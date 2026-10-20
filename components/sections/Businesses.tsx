'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Slash } from '@/components/ui/Slash';

/**
 * Businesses — "06 / BUILDING FOR BUSINESSES TOO"
 * ---------------------------------------------------------------------------
 * Dark band after the light students section, so the page keeps the
 * alternating rhythm. Capability chips are mono labels rather than invented
 * case studies or client logos.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Businesses() {
  const reduceMotion = useReducedMotion();
  const { businesses, numbering } = siteConfig;

  return (
    <section id="businesses" aria-labelledby="businesses-heading" className="section">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              index={numbering.businesses}
              eyebrow="For businesses"
              title={businesses.heading}
              id="businesses-heading"
              statement={businesses.paragraph}
            />
            <div className="mt-9">
              <Button href={businesses.cta.href} variant="accent" size="lg" withArrow>
                {businesses.cta.label}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
              {businesses.chips.map((chip, index) => (
                <motion.li
                  key={chip}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.28), ease: EASE }}
                  className="flex min-h-16 items-center gap-3 bg-[var(--panel)] px-5 py-4 transition-colors duration-300 hover:bg-[var(--panel-2)]"
                >
                  <Slash size="h-3" />
                  <span className="font-mono text-[0.7rem] uppercase leading-snug tracking-[0.14em] text-[var(--fg-soft)]">
                    {chip}
                  </span>
                </motion.li>
              ))}
            </ul>

            <p className="mt-6 flex gap-3 text-sm text-[var(--muted-2)]">
              <Slash size="h-4" className="mt-1" />
              <span>
                Whether it is a first internal tool or a customer-facing product, we scope the work
                around what your business actually needs next.
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Businesses;
