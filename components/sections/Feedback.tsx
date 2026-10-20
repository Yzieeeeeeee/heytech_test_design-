'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig, isConfigured } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Slash } from '@/components/ui/Slash';
import { initialsFrom } from '@/lib/utils';

/**
 * Feedback — "10 / CLIENT FEEDBACK"
 * ---------------------------------------------------------------------------
 * `siteConfig.testimonials` is intentionally empty at launch, so this renders
 * an honest empty state rather than invented praise. Add a real, permissioned
 * testimonial to data/site.ts and this same component renders the quote cards.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Feedback() {
  const reduceMotion = useReducedMotion();
  const { testimonials, numbering } = siteConfig;

  return (
    <section id="feedback" aria-labelledby="feedback-heading" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            index={numbering.feedback}
            eyebrow="Client feedback"
            title="What clients say"
            id="feedback-heading"
            statement="Feedback will appear here as projects wrap up — published with permission, and only when it is real."
          />
        </Reveal>

        {testimonials.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-[1.2fr_1fr]">
              <div className="bg-[var(--panel)] p-7 sm:p-10">
                <span aria-hidden className="font-display text-[3rem] leading-none text-[var(--accent)]">
                  “
                </span>
                <p className="mt-2 font-display text-[clamp(1.15rem,1rem+1vw,1.75rem)] uppercase leading-tight text-[var(--fg-strong)]">
                  {siteConfig.feedbackEmptyState}
                </p>
              </div>

              <div className="flex flex-col justify-between gap-6 bg-[var(--panel)] p-7 sm:p-10">
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  In the meantime, the fastest way to judge us is to talk to us directly — ask what
                  we would build, and how.
                </p>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
                    <Slash size="h-3" />
                    No paid placements, no borrowed logos
                  </li>
                  <li className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
                    <Slash size="h-3" />
                    Quotes added only with permission
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.li
                key={testimonial.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.25), ease: EASE }}
                className="bg-[var(--panel)]"
              >
                <figure className="flex h-full flex-col gap-5 p-6 sm:p-7">
                  <span aria-hidden className="font-display text-[2rem] leading-none text-[var(--accent)]">
                    “
                  </span>
                  <blockquote className="flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-4 border-t border-[var(--line)] pt-5">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] font-mono text-[0.68rem] text-[var(--fg-strong)]"
                    >
                      {initialsFrom(testimonial.authorName)}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--fg-strong)]">
                        {testimonial.authorName}
                      </span>
                      <span className="mt-1 text-[0.72rem] text-[var(--muted-2)]">
                        {testimonial.authorRole}
                        {isConfigured(testimonial.context ?? '') ? ` · ${testimonial.context}` : ''}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Feedback;
