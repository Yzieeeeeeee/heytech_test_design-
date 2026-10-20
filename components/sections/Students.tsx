'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Slash } from '@/components/ui/Slash';

/**
 * Students — "05 / HAVE A FINAL-YEAR PROJECT IDEA?"
 * ---------------------------------------------------------------------------
 * Sits on the light paper band. Six numbered stages as a hairline grid, with
 * the scope note stated plainly: software development support, technical
 * guidance, prototyping and project learning — no university affiliation, no
 * submission service, no grade guarantees.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Students() {
  const reduceMotion = useReducedMotion();
  const { students, numbering } = siteConfig;

  return (
    <section
      id="students"
      aria-labelledby="students-heading"
      className="section section-paper"
    >
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <SectionHeading
              index={numbering.students}
              eyebrow="For students"
              title={students.heading}
              id="students-heading"
              statement={students.paragraph}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="lg:pb-2">
              <Button href={students.cta.href} variant="primary" size="lg" withArrow>
                {students.cta.label}
              </Button>
              <p className="mt-5 flex gap-3 text-xs leading-relaxed text-[var(--muted-2)]">
                <Slash size="h-3" className="mt-0.5" />
                <span>{students.note}</span>
              </p>
            </div>
          </Reveal>
        </div>

        {/* Six stages ---------------------------------------------------- */}
        <ol className="mt-14 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {students.steps.map((step, index) => (
            <motion.li
              key={step.number}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
              className="group flex flex-col gap-3 bg-[var(--panel)] p-5 transition-colors duration-300 hover:bg-[var(--panel-2)] sm:p-6"
            >
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                Step {step.number}
              </span>
              <h3 className="font-display text-[1.05rem] uppercase leading-tight text-[var(--fg-strong)]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Students;
