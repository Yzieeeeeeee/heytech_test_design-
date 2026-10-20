'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig, type Service } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Slash } from '@/components/ui/Slash';
import { cn } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/animations/RevealSystem';

/**
 * Services — "02 / WHAT WE BUILD"
 * ---------------------------------------------------------------------------
 * Rendered on the light "paper" band, matching the reference rhythm of dark
 * hero → light services → dark process.
 *
 * Because `.section-paper` re-scopes every design token, the cards, borders
 * and type inside this section invert automatically — no dark:/light: pairs.
 *
 * Each card carries generated abstract artwork (never stock photography) and
 * reveals its capability list on hover, focus or tap.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const { services, numbering } = siteConfig;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section section-paper"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            index={numbering.services}
            eyebrow="Services"
            title="What we build"
            id="services-heading"
            statement="Ad-hoc help or full end-to-end development — from a first prototype to a deployed product with a real backend."
            align="center"
          />
        </Reveal>

        <StaggerContainer as="ul" className="mt-14 flex flex-col gap-16 lg:gap-24">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <StaggerItem
      as="li"
      className={cn(
        "group relative flex flex-col items-center gap-8 lg:gap-16",
        index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
      )}
    >
      {/* Generated artwork panel ---------------------------------------- */}
      <div className="relative aspect-[4/3] w-full lg:w-3/5 overflow-hidden bg-[var(--panel)] border border-[var(--line)] shadow-sm">
        <Image
          src={service.art}
          alt={`Abstract artwork representing ${service.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-within:scale-y-100"
        />
      </div>

      {/* Body ------------------------------------------------------------ */}
      <div className="flex w-full lg:w-2/5 flex-col py-5 lg:py-10">
        <p className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted-2)]">
          <span className="text-[var(--accent)]">{service.number}</span>
          <Slash size="h-2.5" />
          <span className="truncate">{service.slug.replace(/-/g, ' ')}</span>
        </p>

        <h3 className="mt-3 font-display text-h3 uppercase text-[var(--fg-strong)]">
          {service.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {service.description}
        </p>

        {/* Capability points — revealed on hover / focus, always in the DOM */}
        <ul
          className={cn(
            'mt-4 grid gap-2 overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100',
            'group-focus-within:max-h-40 group-focus-within:opacity-100',
          )}
        >
          {service.points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              <Slash size="h-2.5" />
              {point}
            </li>
          ))}
        </ul>

        {/* Always-visible fallback for touch + reduced motion */}
        <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--muted-2)] group-hover:hidden group-focus-within:hidden">
          {service.points.join(' · ')}
        </p>
      </div>
    </StaggerItem>
  );
}

export default Services;
