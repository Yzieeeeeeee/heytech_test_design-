'use client';

import { useCallback, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig, type ProcessStep } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Slash } from '@/components/ui/Slash';
import { cn } from '@/lib/utils';

/**
 * Process — "07 / HOW WE WORK"
 * ---------------------------------------------------------------------------
 * Numbered accordion rows: STEP 01..06 with a slash marker, the step title and
 * a +/− control that expands the detail. This is the reference's process
 * module, rebuilt with real disclosure semantics:
 *
 *  • each row is a <button> with aria-expanded + aria-controls
 *  • the panel is a labelled region, animated with transform/opacity only
 *  • rows are keyboard operable and the first one opens by default
 *  • reduced-motion visitors get an instant open/close
 */

export function Process() {
  const [open, setOpen] = useState<string | null>(siteConfig.process[0]?.number ?? null);
  const reduceMotion = useReducedMotion();

  const toggle = useCallback(
    (number: string) => setOpen((current) => (current === number ? null : number)),
    [],
  );

  return (
    <section id="process" aria-labelledby="process-heading" className="section">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              index={siteConfig.numbering.process}
              eyebrow="Our process"
              title="How we work"
              id="process-heading"
              statement="Six stages, the same every time. You always know what is happening and what comes next."
            />
          </Reveal>

          <div className="border-t border-[var(--line)]">
            {siteConfig.process.map((step, index) => (
              <ProcessRow
                key={step.number}
                step={step}
                isOpen={open === step.number}
                onToggle={() => toggle(step.number)}
                reduceMotion={Boolean(reduceMotion)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessRow({
  step,
  isOpen,
  onToggle,
  reduceMotion,
  index,
}: {
  step: ProcessStep;
  isOpen: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
  index: number;
}) {
  const uid = useId();
  const panelId = `${uid}-panel`;
  const buttonId = `${uid}-button`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[var(--line)]"
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6"
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
            Step
            <span className="ml-1 text-[var(--accent)]">{step.number}</span>
          </span>

          <Slash size="h-4" />

          <span
            className={cn(
              'flex-1 font-display text-[clamp(1.05rem,0.95rem+0.7vw,1.6rem)] uppercase transition-colors duration-300',
              isOpen ? 'text-[var(--accent)]' : 'text-[var(--fg-strong)] group-hover:text-[var(--accent)]',
            )}
          >
            {step.title}
          </span>

          <span
            aria-hidden
            className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--line-strong)] transition-colors duration-300 group-hover:border-[var(--accent)]"
          >
            <span className="absolute h-[1.5px] w-3.5 bg-current" />
            <motion.span
              className="absolute h-3.5 w-[1.5px] bg-current"
              animate={{ scaleY: isOpen ? 0 : 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-2 pb-6 pl-0 sm:pl-[7.5rem]">
              <p className="text-sm text-[var(--fg-soft)]">{step.description}</p>
              <p className="text-sm text-[var(--muted)]">{step.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Process;
