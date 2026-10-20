/**
 * SkipLink
 * ---------------------------------------------------------------------------
 * Keyboard-only shortcut past the navigation. Hidden until focused, then
 * appears clearly at the top-left with a high-contrast treatment.
 */

interface SkipLinkProps {
  label: string;
  targetId?: string;
}

export function SkipLink({ label, targetId = 'main-content' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-[var(--accent)] focus:px-5 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
    >
      {label}
    </a>
  );
}

export default SkipLink;
