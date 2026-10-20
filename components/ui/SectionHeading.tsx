import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Slash } from '@/components/ui/Slash';

/**
 * SectionHeading
 * ---------------------------------------------------------------------------
 * The studio-technical heading block: a mono eyebrow of the form
 * "01 / ABOUT US" with the red slash, a heavy uppercase display line, and an
 * optional statement paragraph beneath it.
 *
 * Server component — no interactivity, so it never ships JavaScript.
 */

interface SectionHeadingProps {
  /** Section number shown in the eyebrow, e.g. "01". */
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  /** Large secondary statement, used the way the reference site leads sections. */
  statement?: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
  size?: 'default' | 'large';
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  statement,
  description,
  align = 'left',
  className,
  id,
  size = 'default',
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('flex flex-col', centered && 'items-center text-center', className)}>
      {(index || eyebrow) && (
        <p className={cn('eyebrow', centered && 'justify-center')}>
          {index && <span className="text-[var(--accent)]">{index}</span>}
          <Slash size="h-3" />
          {eyebrow && <span>{eyebrow}</span>}
        </p>
      )}

      <h2
        id={id}
        className={cn(
          'mt-4 font-display uppercase text-[var(--fg-strong)]',
          size === 'large' ? 'text-h2' : 'text-h2 max-w-4xl',
        )}
      >
        {title}
      </h2>

      {statement && (
        <p
          className={cn(
            'mt-5 max-w-3xl text-statement font-normal text-[var(--fg-soft)]',
            centered && 'mx-auto',
          )}
        >
          {statement}
        </p>
      )}

      {description && (
        <p className={cn('mt-4 max-w-xl text-body text-[var(--muted)]', centered && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
