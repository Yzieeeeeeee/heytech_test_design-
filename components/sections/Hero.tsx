'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { Slash } from '@/components/ui/Slash';

/**
 * Hero
 * ---------------------------------------------------------------------------
 * Full-viewport opening panel in the studio-technical language:
 *
 *   • low-poly mesh backdrop with soft red / cyan glows
 *   • a single oversized red diagonal, echoing the reference hero mark
 *   • the H1 in heavy uppercase display type, left-aligned, with the third
 *     line carrying the accent colour
 *   • a right-hand column with a short statement and one outline CTA
 *   • a floating "WE BUILD WITH" capability strip pinned to the lower edge
 *   • a top-left eyebrow showing the studio's location and founding year
 *
 * The <h1> ships as real text in the HTML (a screen-reader-only copy plus the
 * animated visual lines), so search engines and the LCP paint get content
 * immediately. With reduced motion everything renders in its final state.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { hero } = siteConfig;

  const enter = (delay: number, customY = 40) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: customY },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-10 sm:pb-12"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-20 opacity-40 mix-blend-luminosity"
        src="/video/designarena_video_fa3rxmgo.mp4"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--bg)_0%,transparent_20%,var(--bg)_100%)]" aria-hidden />

      {/* Oversized red diagonal — decorative echo of the brand slash */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-0 sm:right-[4%] lg:right-[8%] top-[12%] lg:top-[15%] -z-[5] hidden h-[65%] w-[26px] sm:block"
        style={{
          background: 'linear-gradient(180deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 35%, transparent) 82%, transparent 100%)',
          transform: 'skewX(-14deg)',
          opacity: 0.85,
        }}
        initial={reduceMotion ? false : { opacity: 0, y: -40 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
      />

      <div className="container-page relative">
        {/* Location / status strip -------------------------------------- */}
        <motion.div
          {...enter(0.05)}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted-2)] sm:text-[0.68rem]"
        >
          <span className="inline-flex items-center gap-2">
            <Slash size="h-3" />
            {siteConfig.location}
          </span>
          <span aria-hidden className="hidden h-3 w-px bg-[var(--line-strong)] sm:block" />
          <span>Founded {siteConfig.foundedYear}</span>
          <span aria-hidden className="hidden h-3 w-px bg-[var(--line-strong)] sm:block" />
          <span className="inline-flex items-center gap-2 text-[var(--accent-text)]">
            <span
              aria-hidden
              className="animate-pulse-soft inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            />
            {hero.status}
          </span>
        </motion.div>

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[1.35fr_0.9fr] lg:items-end lg:gap-12">
          {/* Headline ---------------------------------------------------- */}
          <h1
            id="hero-heading"
            className="font-display text-hero uppercase text-[var(--fg-strong)]"
          >
            <span className="sr-only">{hero.headingPlain}</span>
            <span aria-hidden className="block">
              {hero.headingLines.map((line, index) => (
                <motion.span
                  key={line}
                  className="block overflow-hidden"
                  {...enter(0.12 + index * 0.08)}
                >
                  <span
                    className={
                      index === hero.headingLines.length - 1
                        ? 'inline-block text-[var(--accent)]'
                        : 'inline-block'
                    }
                  >
                    {line}
                  </span>
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Statement + CTA -------------------------------------------- */}
          <div className="lg:pb-3">
            <motion.p {...enter(0.4)} className="max-w-md text-lead text-[var(--fg-soft)]">
              {hero.paragraph}
            </motion.p>

            <motion.div {...enter(0.5)} className="mt-7">
              <a
                href={hero.secondaryCta.href}
                className="group inline-flex min-h-14 items-center gap-3 border border-[var(--line-strong)] px-6 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--fg-strong)] transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                {hero.secondaryCta.label}
                <span aria-hidden className="text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </motion.div>

            <motion.p
              {...enter(0.58)}
              className="mt-6 font-display text-[0.95rem] uppercase tracking-[0.04em] text-[var(--muted-2)]"
            >
              {siteConfig.message}
            </motion.p>
          </div>
        </div>

        {/* Floating capability strip ------------------------------------- */}
        <motion.div
          {...enter(0.7)}
          className="mt-12 border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_82%,transparent)] backdrop-blur-sm sm:mt-16"
        >
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <p className="eyebrow shrink-0 text-[var(--muted-2)]">
              We build with
            </p>
            <ul className="flex flex-wrap items-center gap-2 sm:gap-3">
              {siteConfig.heroStrip.map((item) => (
                <li
                  key={item}
                  className="border border-[var(--line-strong)] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--fg-soft)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
