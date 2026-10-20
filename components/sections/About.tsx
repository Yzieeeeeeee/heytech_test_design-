'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Slash } from '@/components/ui/Slash';
import { Button } from '@/components/ui/Button';

/**
 * About
 * ---------------------------------------------------------------------------
 * Two columns: the narrative with an honest two-entry timeline on the left,
 * and the Idea → Delivery flow as a numbered list on the right. The flow uses
 * the same numbered-row pattern as the process module, so the page reads as
 * one system rather than a set of unrelated widgets.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function About() {
  const reduceMotion = useReducedMotion();
  const { about, numbering } = siteConfig;

  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Narrative --------------------------------------------------- */}
          <div>
            <Reveal>
              <SectionHeading
                index={numbering.about}
                eyebrow="About us"
                title={about.heading}
                id="about-heading"
              />
            </Reveal>

            <div className="mt-7 space-y-5">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.06 * (index + 1)}>
                  <p className="max-w-xl text-body text-[var(--muted)]">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* Honest timeline — one real entry plus the present */}
            <Reveal delay={0.2}>
              <ul className="mt-10 border-t border-[var(--line)]">
                {about.timeline.map((entry) => (
                  <li
                    key={entry.label}
                    className="flex items-baseline gap-4 border-b border-[var(--line)] py-4"
                  >
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                      {entry.year}
                    </span>
                    <span className="text-sm text-[var(--fg-soft)]">{entry.label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
                <span>{siteConfig.location}</span>
                <span aria-hidden className="hidden h-3 w-px bg-[var(--line-strong)] sm:block" />
                <span>Working with clients remotely</span>
              </div>
            </Reveal>
          </div>

          {/* Flow -------------------------------------------------------- */}
          <Reveal delay={0.12}>
            <div className="panel panel-tint relative h-full p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">
                  <Slash size="h-3" />
                  Our workflow
                </p>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  05 stages
                </span>
              </div>

              <ol className="mt-7 flex flex-col">
                {about.flow.map((step, index) => (
                  <motion.li
                    key={step.label}
                    initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: index * 0.07, ease: EASE }}
                    className="flex items-center gap-4 border-b border-[var(--line)] py-4 last:border-0"
                  >
                    <span className="font-mono text-[0.62rem] tracking-[0.18em] text-[var(--muted-2)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1"
                      style={{
                        background:
                          'linear-gradient(to right, var(--line-strong), transparent)',
                      }}
                    />
                    <span className="font-display text-[0.95rem] font-700 uppercase tracking-[0.06em] text-[var(--fg-strong)]" style={{ fontWeight: 700 }}>
                      {step.label}
                    </span>
                  </motion.li>
                ))}
              </ol>

              <Button
                href="#process"
                variant="bare"
                size="sm"
                withArrow
                className="mt-7 text-[0.68rem] tracking-[0.18em]"
              >
                See how we work
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default About;
