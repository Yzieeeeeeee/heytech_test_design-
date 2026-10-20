'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Slash } from '@/components/ui/Slash';

/**
 * WhyHeyTech — "09 / WHY CHOOSE HEY TECH"
 * ---------------------------------------------------------------------------
 * Dark mesh-backed band (the reference closes on a mesh panel with a short
 * reason-to-believe list). Each claim is relative to being a small studio —
 * no invented scale, client counts or years of experience.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhyHeyTech() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="section relative overflow-hidden border-y border-[var(--line)] bg-[var(--bg-2)]"
    >
      <div className="container-page relative">
        <Reveal>
          <SectionHeading
            index={siteConfig.numbering.why}
            eyebrow="Why choose Hey Tech"
            title="A small team you can actually reach"
            id="why-heading"
            statement="No account managers, no ticket queues. Just two developers who answer their own messages."
          />
        </Reveal>

        <ul className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.whyCards.map((card, index) => (
            <motion.li
              key={card.number}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.25), ease: EASE }}
              className="group flex flex-col gap-4 bg-[var(--panel)] p-6 transition-colors duration-300 hover:bg-[var(--panel-2)]"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                {card.number}
              </span>
              <h3 className="font-display text-[1.02rem] uppercase leading-tight text-[var(--fg-strong)]">
                {card.title}
              </h3>
              <span aria-hidden className="h-px w-full bg-[var(--line)]" />
              <p className="text-sm leading-relaxed text-[var(--muted)]">{card.description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WhyHeyTech;
