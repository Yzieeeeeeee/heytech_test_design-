'use client';

import { siteConfig, isGithubConfigured } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Slash } from '@/components/ui/Slash';

/**
 * GitHubSection — "11 / EXPLORE OUR CODE"
 * ---------------------------------------------------------------------------
 * Rendered as a full-width bordered row on the paper band. The button is a
 * real link only once a GitHub URL exists in config; while the placeholder is
 * in place we show an explicit disabled state rather than a link to nowhere.
 */

export function GitHubSection() {
  const hasGithub = isGithubConfigured();

  return (
    <section
      id="github"
      aria-labelledby="github-heading"
      className="section section-paper py-0"
    >
      <div className="container-page">
        <Reveal>
          <div className="grid gap-8 border-y border-[var(--line)] py-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:py-16">
            <div>
              <p className="eyebrow">
                <span className="text-[var(--accent)]">{siteConfig.numbering.github}</span>
                <Slash size="h-3" />
                {siteConfig.github.eyebrow}
              </p>
              <h2
                id="github-heading"
                className="mt-4 font-display text-h2 uppercase text-[var(--fg-strong)]"
              >
                {siteConfig.github.heading}
              </h2>
              <p className="mt-5 max-w-xl text-statement text-[var(--fg-soft)]">
                {siteConfig.github.paragraph}
              </p>
            </div>

            <div className="lg:justify-self-end">
              {hasGithub ? (
                <Button href={siteConfig.socials.github} variant="primary" size="lg" withArrow>
                  {siteConfig.github.cta}
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="lg" disabled fullWidth className="lg:w-auto">
                    {siteConfig.github.cta}
                  </Button>
                  <p className="mt-4 max-w-xs font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-[var(--muted-2)]">
                    The GitHub profile is not linked yet. Repositories will be published here as
                    they are ready.
                  </p>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default GitHubSection;
