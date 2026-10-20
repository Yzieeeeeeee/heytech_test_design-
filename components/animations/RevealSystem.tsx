'use client';

import { useRef, type ReactNode, type ElementType } from 'react';
import { motion, useReducedMotion, useInView, useScroll, useTransform, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// 1. STAGGER SYSTEM
// ---------------------------------------------------------------------------
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  as?: ElementType;
  amount?: number;
}

export function StaggerContainer({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.08, // 80ms stagger
  as = 'div',
  amount = 0.15,
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as as keyof typeof motion] as any;

  if (reduceMotion) {
    const FallbackTag = as as ElementType;
    return <FallbackTag className={className}>{children}</FallbackTag>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={containerVariants}
    >
      {children}
    </Tag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as as keyof typeof motion] as any;

  if (reduceMotion) {
    const FallbackTag = as as ElementType;
    return <FallbackTag className={className}>{children}</FallbackTag>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 35, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// 2. TEXT REVEAL
// ---------------------------------------------------------------------------
interface TextRevealProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}

export function TextReveal({ text, className, as = 'span', delay = 0 }: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as as keyof typeof motion] as any;
  const lines = text.split('\n');

  if (reduceMotion) {
    const FallbackTag = as as ElementType;
    return <FallbackTag className={className}>{text}</FallbackTag>;
  }

  const lineVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <StaggerContainer as={as} className={className} delayChildren={delay} staggerChildren={0.1}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-1">
          <Tag className="block" variants={lineVariants}>
            {line}
          </Tag>
        </span>
      ))}
    </StaggerContainer>
  );
}

// ---------------------------------------------------------------------------
// 3. PARALLAX
// ---------------------------------------------------------------------------
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function Parallax({ children, className, offset = 40 }: ParallaxProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. ANIMATED COUNTER
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { useSpring } from 'framer-motion';

export function AnimatedCounter({ value, duration = 1500, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const spring = useSpring(0, { stiffness: 50, damping: 20, duration });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value, reduceMotion]);

  useEffect(() => {
    return spring.onChange((latest) => {
      setDisplay(Math.floor(latest));
    });
  }, [spring]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
