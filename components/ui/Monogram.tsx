import { cn } from '@/lib/utils';

/**
 * Monogram
 * ---------------------------------------------------------------------------
 * "HT" constructed from two squared strokes, drawn inline so it inherits the
 * theme and needs no network request. Used in the footer, favicons and the
 * hero's floating mark.
 */

interface MonogramProps {
  className?: string;
  /** Accent colour for the diagonal stroke. */
  accentColor?: string;
  title?: string;
}

export function Monogram({ className, accentColor, title }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('h-full w-full', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <g stroke="currentColor" strokeWidth="6" fill="none">
        <path d="M12 14v36M30 14v36M12 32h18" />
        <path d="M40 14h14M47 14v36" />
      </g>
      <rect
        x="52"
        y="8"
        width="4"
        height="48"
        fill={accentColor ?? 'var(--accent)'}
        transform="skewX(-14) skewY(0)"
        style={{ transformOrigin: '54px 32px' }}
      />
    </svg>
  );
}

export default Monogram;
