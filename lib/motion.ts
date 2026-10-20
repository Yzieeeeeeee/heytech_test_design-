import type { Variants, Transition } from 'framer-motion';

/**
 * ============================================================================
 *  SHARED MOTION TOKENS
 * ============================================================================
 *  Only transform + opacity are animated anywhere on this site, and every
 *  variant here is written so that `prefers-reduced-motion` can collapse it
 *  to a no-op via the `useReducedMotion()` hook in each component.
 * ============================================================================
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 220, damping: 26, mass: 0.7 };
export const springSnappy: Transition = { type: 'spring', stiffness: 380, damping: 30 };

/** Sections: fade + rise, triggered once when scrolled into view. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

/** Parent wrapper for staggered children (hero, card grids). */
export function staggerContainer(stagger = 0.08, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Project grid re-ordering / filtering. */
export const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: EASE_OUT } },
  exit: { opacity: 0, y: -10, scale: 0.985, transition: { duration: 0.22, ease: 'easeIn' } },
};

/** Card hover lift, used with `whileHover` / `whileFocus` (desktop only). */
export const hoverLift = {
  y: -6,
  transition: { duration: 0.28, ease: EASE_OUT },
};

/** Viewport config shared by scroll reveals. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
