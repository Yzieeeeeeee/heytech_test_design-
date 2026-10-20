'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CursorGlow
 * ---------------------------------------------------------------------------
 * A very subtle accent-coloured glow that follows the pointer on desktop.
 *
 * • Desktop only: requires a fine pointer with hover support.
 * • Disabled entirely for `prefers-reduced-motion`.
 * • `pointer-events: none` + fixed positioning means it can never interfere
 *   with clicks or cover content, and it is removed from the a11y tree.
 * • Transform/opacity only — no layout work on mousemove.
 */

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const springX = useSpring(x, { stiffness: 150, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wideEnough = window.matchMedia('(min-width: 1024px)').matches;

    if (!supportsHover || reduceMotion || !wideEnough) return;
    setEnabled(true);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const onLeave = (event: MouseEvent) => {
      if (event.relatedTarget === null || event.clientY <= 0) setVisible(false);
    };
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden lg:block"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="h-[420px] w-[420px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 62%)',
          filter: 'blur(14px)',
        }}
      />
    </motion.div>
  );
}

export default CursorGlow;
