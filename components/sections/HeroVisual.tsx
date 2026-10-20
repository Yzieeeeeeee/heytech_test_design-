'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Monogram } from '@/components/ui/Monogram';
import { useMediaQuery } from '@/lib/hooks';
import { siteConfig } from '@/data/site';

/**
 * HeroVisual
 * ---------------------------------------------------------------------------
 * The whole hero "scene" is drawn with SVG + CSS — no stock imagery, no images
 * at all, so it costs nothing to load and scales crisply.
 *
 * Layers (back to front):
 *   1. soft grid with a radial mask
 *   2. two slow-drifting gradient glows  → the "animated gradient light"
 *   3. fine connecting lines with a slowly animated dash offset
 *   4. floating geometric outlines + glow particles
 *   5. code-fragment cards (desktop only)
 *   6. the floating HT monogram on a rotating gradient ring
 *
 * Mobile: fewer particles, no code cards, lighter blurs.
 */

/* Deterministic particle field — fixed values keep SSR and hydration identical. */
const PARTICLES = [
  { x: 14, y: 22, s: 3, d: 0, dur: 17 },
  { x: 82, y: 16, s: 2, d: 1.4, dur: 21 },
  { x: 30, y: 74, s: 2.5, d: 2.2, dur: 19 },
  { x: 68, y: 82, s: 3, d: 0.8, dur: 16 },
  { x: 48, y: 8, s: 2, d: 3.1, dur: 23 },
  { x: 90, y: 58, s: 2.5, d: 1.9, dur: 18 },
  { x: 8, y: 52, s: 2, d: 2.7, dur: 20 },
  { x: 58, y: 44, s: 2.4, d: 0.4, dur: 22 },
  { x: 22, y: 38, s: 1.8, d: 3.6, dur: 24 },
  { x: 74, y: 34, s: 2.2, d: 1.1, dur: 17 },
  { x: 40, y: 92, s: 2, d: 2.5, dur: 19 },
  { x: 92, y: 88, s: 1.8, d: 0.6, dur: 21 },
  { x: 6, y: 84, s: 2.4, d: 1.6, dur: 18 },
  { x: 64, y: 64, s: 1.6, d: 3.3, dur: 25 },
  { x: 34, y: 12, s: 1.8, d: 2.9, dur: 20 },
  { x: 54, y: 78, s: 2, d: 0.2, dur: 23 },
  { x: 78, y: 70, s: 1.6, d: 1.3, dur: 19 },
  { x: 26, y: 58, s: 1.7, d: 3.8, dur: 22 },
];

/* Fine connecting lines between nodes of the scene. */
const CONNECTIONS = [
  'M14 22 L48 8 L82 16',
  'M14 22 L30 74 L68 82',
  'M82 16 L90 58 L68 82',
  'M48 8 L58 44 L90 58',
  'M8 52 L30 74',
  'M58 44 L74 34',
];

export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 640px)');

  const particleCount = isDesktop ? PARTICLES.length : isTablet ? 11 : 7;
  const showCodeCards = isDesktop;

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[34rem] select-none lg:max-w-none"
      aria-hidden
    >
      {/* 1 — soft grid, masked so it fades at the edges */}
      <div
        className="bg-grid absolute inset-0 rounded-[2rem]"
        style={{
          maskImage: 'radial-gradient(70% 70% at 50% 50%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, #000 35%, transparent 100%)',
        }}
      />

      {/* 2 — animated gradient light behind the logo */}
      <div
        className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 38% 38%, var(--glow-1) 0%, var(--glow-2) 45%, transparent 72%)',
          animation: reduceMotion ? undefined : 'ht-pulse 7s ease-in-out infinite',
        }}
      />
      <div
        className="animate-drift absolute right-[12%] top-[10%] h-40 w-40 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--glow-3) 0%, transparent 70%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="animate-drift absolute bottom-[8%] left-[10%] h-36 w-36 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--glow-2) 0%, transparent 70%)',
          animationDelay: '-11s',
        }}
      />

      {/* 3 — connecting lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {CONNECTIONS.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            stroke="var(--line-strong)"
            strokeWidth={0.22}
            strokeDasharray="1.6 3.2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 + index * 0.12 }}
            style={{ animation: reduceMotion ? undefined : 'ht-dash 12s linear infinite' }}
          />
        ))}
      </svg>

      {/* 4 — particles (transform-only drift) */}
      <div className="absolute inset-0">
        {PARTICLES.slice(0, particleCount).map((particle, index) => (
          <span
            key={`${particle.x}-${particle.y}`}
            className="animate-drift absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.s * 2,
              height: particle.s * 2,
              background:
                index % 3 === 0
                  ? 'var(--cyan)'
                  : index % 3 === 1
                    ? 'var(--accent)'
                    : 'var(--violet)',
              boxShadow: '0 0 10px currentColor',
              opacity: 0.65,
              animationDelay: `-${particle.d * 2}s`,
              animationDuration: `${particle.dur}s`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* floating geometric outlines */}
      <div
        className="animate-float absolute left-[6%] top-[18%] h-16 w-16 rounded-2xl border border-[var(--line-strong)] sm:h-20 sm:w-20"
        style={{ animationDelay: '-2s' }}
      />
      <div
        className="animate-spin-slow absolute right-[8%] bottom-[22%] h-24 w-24 rounded-full border border-dashed border-[var(--line-strong)] sm:h-28 sm:w-28"
      />
      <svg
        className="animate-float absolute right-[16%] top-[14%] h-10 w-10 text-[var(--cyan-text)] opacity-70"
        viewBox="0 0 40 40"
        fill="none"
        style={{ animationDelay: '-4.5s' }}
      >
        <path d="M20 4 L36 34 H4 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>

      {/* 5 — code fragment cards (desktop) */}
      {showCodeCards && (
        <>
          <CodeCard
            className="left-[-4%] top-[26%]"
            delay={0.9}
            file={siteConfig.hero.codeFragments[0].label}
            line={siteConfig.hero.codeFragments[0].line}
          />
          <CodeCard
            className="right-[-2%] top-[46%]"
            delay={1.15}
            file={siteConfig.hero.codeFragments[1].label}
            line={siteConfig.hero.codeFragments[1].line}
          />
          <CodeCard
            className="bottom-[14%] left-[8%]"
            delay={1.4}
            file={siteConfig.hero.codeFragments[2].label}
            line={siteConfig.hero.codeFragments[2].line}
          />
        </>
      )}

      {/* 6 — the floating HT monogram */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex items-center justify-center">
          {/* rotating gradient ring */}
          <motion.div
            className="animate-spin-slow absolute h-[13rem] w-[13rem] rounded-full sm:h-[16rem] sm:w-[16rem] lg:h-[18rem] lg:w-[18rem]"
            style={{
              background:
                'conic-gradient(from 0deg, var(--accent), var(--cyan), var(--violet), var(--accent))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))',
              WebkitMask:
                'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))',
              opacity: 0.85,
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* counter-rotating dashed orbit */}
          <div className="animate-spin-slow absolute h-[15.5rem] w-[15.5rem] rounded-full border border-dashed border-[var(--line)] opacity-60 sm:h-[19rem] sm:w-[19rem] lg:h-[21.5rem] lg:w-[21.5rem] [animation-direction:reverse]" />

          <motion.div
            className="animate-float relative"
            initial={{ opacity: 0, scale: 0.78, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative flex h-[8.5rem] w-[8.5rem] items-center justify-center rounded-[2rem] border border-[var(--line-strong)] p-5 sm:h-[10.5rem] sm:w-[10.5rem] lg:h-[12rem] lg:w-[12rem]"
              style={{
                background:
                  'linear-gradient(150deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--violet) 14%, transparent))',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 30px 80px -40px var(--glow-1)',
              }}
            >
              <Monogram gradientId="hero-monogram" strokeWidth={3} />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-1 font-display text-[0.6rem] font-semibold tracking-[0.22em] text-[var(--muted)]">
                HEY TECH
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CodeCard({
  className,
  delay,
  file,
  line,
}: {
  className: string;
  delay: number;
  file: string;
  line: string;
}) {
  return (
    <motion.div
      className={`absolute ${className} w-[11.5rem] rounded-xl border border-[var(--line)] bg-[var(--surface)]/90 p-3 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.8)] backdrop-blur`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />
        <span className="ml-1 font-mono text-[0.6rem] tracking-wide text-[var(--muted-2)]">
          {file}
        </span>
      </div>
      <code className="block truncate font-mono text-[0.7rem] text-[var(--accent-text)]">
        {line}
      </code>
      <div className="mt-2 space-y-1.5">
        <span className="block h-1 w-4/5 rounded-full bg-[var(--line-strong)]" />
        <span className="block h-1 w-3/5 rounded-full bg-[var(--line)]" />
      </div>
    </motion.div>
  );
}

export default HeroVisual;
