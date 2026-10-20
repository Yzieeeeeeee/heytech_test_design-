'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hoverState, setHoverState] = useState<'default' | 'link' | 'view'>('default');
  const reduceMotion = useReducedMotion();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const wideEnough = window.matchMedia('(min-width: 1024px)').matches;
    if (!supportsHover || reduceMotion || !wideEnough) return;
    
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      
      // Determine hover state
      if (target.closest('a') || target.closest('button')) {
        if (target.closest('article.group')) {
          setHoverState('view');
        } else {
          setHoverState('link');
        }
      } else {
        setHoverState('default');
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [cursorX, cursorY, reduceMotion]);

  if (!enabled) return null;

  const variants = {
    default: { width: 16, height: 16, opacity: 0.6 },
    link: { width: 32, height: 32, opacity: 0.8 },
    view: { width: 64, height: 64, opacity: 1 },
  };

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full mix-blend-difference hidden lg:flex"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: 'var(--fg)',
        color: 'var(--bg)',
      }}
      variants={variants}
      animate={hoverState}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <motion.span 
        className="font-mono text-[10px] font-bold uppercase tracking-wider"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: hoverState === 'view' ? 1 : 0,
          scale: hoverState === 'view' ? 1 : 0.5
        }}
        transition={{ duration: 0.2 }}
      >
        VIEW
      </motion.span>
    </motion.div>
  );
}

export default CustomCursor;
