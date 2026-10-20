import Image from 'next/image';
import { cn } from '@/lib/utils';
import { initialsFrom } from '@/lib/utils';

/**
 * Avatar
 * ---------------------------------------------------------------------------
 * Founders are shown as styled initials inside a gradient ring — never as
 * generated or stock portraits. Pass `photo` (a path in /public) to swap in a
 * real photograph; the component then renders it with next/image so it is
 * optimised, lazily loaded and correctly sized.
 */

interface AvatarProps {
  name: string;
  initials?: string;
  photo?: string;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  md: { box: 'h-16 w-16', text: 'text-[1.05rem]', px: 64 },
  lg: { box: 'h-20 w-20 sm:h-24 sm:w-24', text: 'text-[1.5rem]', px: 96 },
  xl: { box: 'h-32 w-32 sm:h-36 sm:w-36', text: 'text-[2rem]', px: 144 },
} as const;

export function Avatar({ name, initials, photo, size = 'lg', className }: AvatarProps) {
  const mark = initials || initialsFrom(name);
  const dims = SIZES[size];
  const hasPhoto = Boolean(photo && photo.trim());

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center border border-[var(--line-strong)]',
        dims.box,
        className,
      )}
      style={{ background: 'var(--panel-2)' }}
    >
      {/* accent slash marker in the corner, matching the brand system */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] bg-[var(--accent)]"
      />
      <span className="flex h-full w-full items-center justify-center overflow-hidden pl-[3px]">
        {hasPhoto ? (
          <Image
            src={photo as string}
            alt={`${name}, Co-Founder at Hey Tech Technologies`}
            width={dims.px}
            height={dims.px}
            className="h-full w-full object-cover"
            sizes={`${dims.px}px`}
            loading="lazy"
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              'select-none font-display font-800 uppercase tracking-[-0.01em] text-[var(--fg-strong)]',
              dims.text,
            )}
            style={{ fontWeight: 800 }}
          >
            {mark}
          </span>
        )}
      </span>
    </span>
  );
}

export default Avatar;
