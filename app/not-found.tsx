import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { Monogram } from '@/components/ui/Monogram';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Head back to the Hey Tech Technologies homepage.',
  robots: { index: false, follow: true },
};

/**
 * Custom 404 — on-brand, with a clear route back into the site.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-20">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage: 'radial-gradient(60% 60% at 50% 40%, #000, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(60% 60% at 50% 40%, #000, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)',
        }}
      />

      <div className="container-narrow text-center">
        <div className="mx-auto h-20 w-20 animate-float">
          <Monogram gradientId="notfound-monogram" title="Hey Tech Technologies monogram" />
        </div>

        <p className="mt-8 font-display text-eyebrow font-bold uppercase tracking-[0.28em] text-[var(--accent-text)]">
          404
        </p>
        <h1 className="mt-4 text-h2 font-bold uppercase tracking-[-0.02em]">
          This page took a wrong turn.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lead text-[var(--muted)]">
          The link may be old or mistyped. Everything we build lives on the homepage — start from
          there.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg" magnetic className="w-full sm:w-auto">
            Back to home
          </Button>
          <Button href="/#contact" size="lg" variant="outline" className="w-full sm:w-auto">
            Start a project
          </Button>
        </div>

        <p className="mt-10 text-xs text-[var(--muted-2)]">{siteConfig.message}</p>
      </div>
    </section>
  );
}
