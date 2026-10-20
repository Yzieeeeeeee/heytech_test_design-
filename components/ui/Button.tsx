'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/icons';

/**
 * Button
 * ---------------------------------------------------------------------------
 * Rectangular (zero-radius) mono-uppercase button with an optional trailing
 * arrow — the studio-technical style used throughout the site.
 *
 * Variants
 *  primary   — white fill on dark, dark fill on light (auto-inverts)
 *  accent    — signature red fill
 *  outline   — 1px hairline border + hover fill
 *  ghost     — text only
 *  bare      — mono link with a red underline reveal
 *
 * Animation is transform/opacity only; the magnetic cursor effect is
 * desktop-only and disabled for reduced-motion visitors.
 */

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'bare';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  withArrow?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  title?: string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
}

const SIZES: Record<Size, string> = {
  sm: 'min-h-11 px-4 text-[0.66rem] tracking-[0.16em]',
  md: 'min-h-12 px-5 text-[0.7rem] tracking-[0.18em]',
  lg: 'min-h-14 px-6 sm:px-8 text-[0.72rem] tracking-[0.2em]',
};

const VARIANTS: Record<Variant, string> = {
  // White on dark → automatically black on light because we reference tokens.
  primary:
    'border border-transparent bg-[var(--fg-strong)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-white',
  accent:
    'border border-transparent bg-[var(--accent)] text-white hover:bg-[color-mix(in_srgb,var(--accent)_82%,black)]',
  outline:
    'border border-[var(--line-strong)] bg-transparent text-[var(--fg-strong)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]',
  ghost:
    'border border-transparent bg-transparent text-[var(--muted)] hover:text-[var(--fg-strong)]',
  bare: 'border border-transparent bg-transparent px-0 text-[var(--fg-strong)]',
};

const BASE =
  'group relative inline-flex items-center justify-center gap-3 font-mono font-medium uppercase ' +
  'transition-[background-color,border-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'select-none disabled:pointer-events-none disabled:opacity-45';

export function Button({
  children,
  href,
  variant = 'outline',
  size = 'md',
  magnetic = false,
  withArrow = false,
  className,
  type = 'button',
  target,
  rel,
  disabled = false,
  loading = false,
  fullWidth = false,
  ariaLabel,
  title,
  onClick,
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isMagnetic = magnetic && canHover && !reduceMotion && !disabled && !loading;

  const handleMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (!isMagnetic || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset({
        x: (event.clientX - rect.left - rect.width / 2) * 0.12,
        y: (event.clientY - rect.top - rect.height / 2) * 0.2,
      });
    },
    [isMagnetic],
  );

  const handleLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  const isBare = variant === 'bare';
  const classes = cn(
    BASE,
    SIZES[size],
    VARIANTS[variant],
    fullWidth && 'w-full',
    isBare && 'px-0',
    !isBare && 'py-2.5',
    className,
  );

  const arrow = withArrow ? (
    <span
      aria-hidden
      className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
      style={{ color: variant === 'outline' || variant === 'ghost' || isBare ? 'var(--accent)' : 'currentColor' }}
    >
      →
    </span>
  ) : null;

  const inner = (
    <>
      <span className="relative inline-flex items-center gap-3">
        {loading && <Spinner width={15} height={15} className="animate-spin" />}
        {children}
      </span>
      {arrow}
    </>
  );

  const motionProps = reduceMotion
    ? {}
    : {
        animate: { x: offset.x, y: offset.y },
        transition: { type: 'spring' as const, stiffness: 260, damping: 24, mass: 0.4 },
      };

  const isExternalLink = Boolean(href && /^https?:\/\//i.test(href));
  const resolvedRel = rel ?? (isExternalLink ? 'noopener noreferrer' : undefined);

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target ?? (isExternalLink ? '_blank' : undefined)}
        rel={resolvedRel}
        aria-label={ariaLabel}
        title={title}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          classes,
          isBare &&
            'link-underline w-fit pb-1 after:!h-px',
        )}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      title={title}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(classes, isBare && 'link-underline w-fit pb-1 after:!h-px')}
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}

export default Button;
