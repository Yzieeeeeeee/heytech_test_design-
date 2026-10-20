'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig, isConfigured, type Founder } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Avatar } from '@/components/ui/Avatar';
import { Slash } from '@/components/ui/Slash';
import { GitHub, Instagram, LinkedIn } from '@/components/ui/icons';

/**
 * Founders — "08 / THE PEOPLE BEHIND HEY TECH"
 * ---------------------------------------------------------------------------
 * Two cards in the paper band. Portraits are styled initials until real photos
 * are added to config (`founders[].photo`) — never generated faces.
 *
 * Social buttons only render for values that are real URLs, so the placeholder
 * tokens in data/site.ts never produce a dead link.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Founders() {
  return (
    <section
      id="founders"
      aria-labelledby="founders-heading"
      className="section section-paper"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            index={siteConfig.numbering.founders}
            eyebrow="Founders"
            title="The people behind Hey Tech"
            id="founders-heading"
            statement="Two founders, one small studio. You talk to the people who actually build your project."
          />
        </Reveal>

        <ul className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {siteConfig.founders.map((founder, index) => (
            <FounderCard key={founder.name} founder={founder} index={index} />
          ))}
        </ul>

        <Reveal delay={0.15}>
          <p className="mt-8 flex gap-3 text-sm text-[var(--muted-2)]">
            <Slash size="h-4" className="mt-1" />
            <span>{siteConfig.message} — that is the whole team, and the whole point.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  const reduceMotion = useReducedMotion();

  const socials = [
    { key: 'github' as const, label: `GitHub profile of ${founder.name}`, url: founder.socials.github, Icon: GitHub },
    { key: 'linkedin' as const, label: `LinkedIn profile of ${founder.name}`, url: founder.socials.linkedin, Icon: LinkedIn },
    { key: 'instagram' as const, label: `Instagram profile of ${founder.name}`, url: founder.socials.instagram, Icon: Instagram },
  ].filter((entry) => isConfigured(entry.url));

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className="bg-[var(--panel)]"
    >
      <article className="flex h-full flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <Avatar name={founder.name} initials={founder.initials} photo={founder.photo} size="lg" />

          <div className="min-w-0">
            <h3 className="font-display text-[1.35rem] uppercase leading-tight text-[var(--fg-strong)]">
              {founder.name}
            </h3>
            <p className="mt-2 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--accent)]">
              <Slash size="h-2.5" />
              Co-founder
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{founder.focus}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--muted)]">{founder.bio}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted-2)]">
            {founder.role}
          </span>

          {socials.length > 0 ? (
            <ul className="flex items-center gap-2">
              {socials.map(({ key, label, url, Icon }) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="tap-target inline-flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <Icon width={16} height={16} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted-2)]">
              Profile links coming soon
            </span>
          )}
        </div>
      </article>
    </motion.li>
  );
}

export default Founders;
