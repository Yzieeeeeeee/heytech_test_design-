import { cn } from '@/lib/utils';

/**
 * Chip / Tag
 * ---------------------------------------------------------------------------
 * Rectangular mono label used for technology tags, categories and capability
 * lists. No radius — the whole system is squared off.
 */

interface ChipProps {
  children: React.ReactNode;
  className?: string;
  tone?: 'neutral' | 'accent' | 'outline' | 'paper';
  size?: 'sm' | 'md';
  as?: 'span' | 'li';
}

const TONES: Record<NonNullable<ChipProps['tone']>, string> = {
  neutral: 'border-[var(--line)] bg-[var(--panel-2)] text-[var(--muted)]',
  accent: 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-text)]',
  outline: 'border-[var(--line-strong)] bg-transparent text-[var(--fg-soft)]',
  paper: 'border-[var(--paper-line-strong)] bg-transparent text-[var(--paper-muted)]',
};

export function Chip({ children, className, tone = 'neutral', size = 'sm', as = 'span' }: ChipProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-2 border font-mono uppercase leading-none',
        size === 'sm'
          ? 'px-2.5 py-2 text-[0.62rem] tracking-[0.14em]'
          : 'px-3.5 py-2.5 text-[0.68rem] tracking-[0.16em]',
        TONES[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default Chip;
