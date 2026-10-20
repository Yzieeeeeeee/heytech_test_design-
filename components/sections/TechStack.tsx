'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Slash } from '@/components/ui/Slash';
import { cn } from '@/lib/utils';

/**
 * TechStack — "03 / OUR TECHNOLOGY STACK"
 * ---------------------------------------------------------------------------
 * Squared mono badges. Hovering or focusing a badge reveals a neutral
 * one-line descriptor (no proficiency claims, no years of experience).
 *
 * On touch screens hover does not exist, so the descriptor is always visible
 * there — the interaction only *adds* emphasis on pointer devices.
 */

export function TechStack() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const { techStack, numbering } = siteConfig;

  return (
    <section id="stack" aria-labelledby="stack-heading" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            index={numbering.stack}
            eyebrow="Technologies"
            title="Our technology stack"
            id="stack-heading"
            statement="The frameworks, languages and services our projects are built with. Hover or tap a badge to see what we use it for."
          />
        </Reveal>

        <ul className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.li
                key={tech.name}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                  onClick={() => setActiveIndex(isActive ? null : index)}
                  aria-pressed={isActive}
                  className={cn(
                    'group flex h-full w-full items-center gap-4 bg-[var(--panel)] px-5 py-5 text-left transition-colors duration-300',
                    'hover:bg-[var(--panel-2)] focus-visible:bg-[var(--panel-2)]',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'h-8 w-[3px] shrink-0 transition-colors duration-300',
                      isActive ? 'bg-[var(--accent)]' : 'bg-[var(--line-strong)] group-hover:bg-[var(--accent)]',
                    )}
                    style={{ transform: 'skewX(-14deg)' }}
                  />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-mono text-[0.78rem] uppercase tracking-[0.12em] text-[var(--fg-strong)]">
                      {tech.name}
                    </span>
                    <span
                      className={cn(
                        'text-[0.72rem] leading-snug text-[var(--muted)] transition-opacity duration-200',
                        // Always readable on touch; emphasised on hover-capable devices
                        'opacity-100',
                        'sm:opacity-60 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100',
                        isActive && 'sm:opacity-100',
                      )}
                    >
                      {tech.descriptor}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <Reveal delay={0.15}>
          <p className="mt-8 flex max-w-2xl gap-3 text-sm text-[var(--muted-2)]">
            <Slash size="h-4" className="mt-1" />
            <span>
              We choose the stack that fits the project — these are the tools we reach for most
              often, not a fixed rulebook.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default TechStack;
