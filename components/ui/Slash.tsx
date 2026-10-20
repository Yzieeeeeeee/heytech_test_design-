import { cn } from '@/lib/utils';

/**
 * Slash
 * ---------------------------------------------------------------------------
 * The brand's signature mark: a skewed red bar, used before section labels,
 * card titles, list items and inside the wordmark — exactly the way the
 * reference studio language uses its accent slash.
 *
 * Purely decorative, so it is always hidden from assistive tech.
 */

interface SlashProps {
  className?: string;
  /** Height of the mark, e.g. 'h-3'. Defaults to matching small caps. */
  size?: string;
  /** Renders a faint slash instead of a solid accent-coloured one. */
  muted?: boolean;
}

export function Slash({ className, size = 'h-3', muted = false }: SlashProps) {
  return (
    <span
      aria-hidden
      className={cn('slash', size, muted && 'opacity-35', className)}
      style={muted ? { background: 'var(--muted-2)' } : undefined}
    />
  );
}

/**
 * Wordmark — "HEY/TECH" with the slash as the divider, matching the reference
 * logo treatment (lowercase word · red slash · lowercase word).
 */
export function Wordmark({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline font-display text-lg font-800 leading-none tracking-[-0.01em]',
        invert ? 'text-[var(--paper-fg)]' : 'text-[var(--fg-strong)]',
        className,
      )}
      style={{ fontWeight: 800 }}
    >
      <span>HEY</span>
      <span
        aria-hidden
        className="mx-[0.12em] inline-block h-[1em] w-[3px] self-center"
        style={{ background: 'var(--accent)', transform: 'skewX(-14deg)' }}
      />
      <span>TECH</span>
    </span>
  );
}

export default Slash;
