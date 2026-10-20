'use client';

import { useRef, type ReactNode, type ElementType } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reveal
 * ---------------------------------------------------------------------------
 * Scroll entrance used across the site: a short 14px rise + fade, once.
 *
 * The reference language is deliberately restrained — no long parallax, no
 * scaling. Reduced-motion visitors get the final state immediately, and the
 * markup is visible markup either way (nothing is hidden behind JS).
 */

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
  once?: boolean;
  amount?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 50,
  as = 'div',
  once = true,
  amount = 0.2,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, amount });

  if (reduceMotion) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
