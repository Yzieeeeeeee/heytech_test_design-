'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/site';
import { isConfigured } from '@/data/site';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, GitHub } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

/**
 * ProjectCard
 * ---------------------------------------------------------------------------
 * Driven entirely by the `projects` array in data/site.ts.
 *
 * Placeholder slots are labelled as such (badge + dashed treatment) so the
 * site is never misleading; real projects render identically minus the badge.
 * The GitHub action only appears when a real URL exists.
 */

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const hasGithub = isConfigured(project.github);

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.05, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <article
        className={cn(
          'surface-card gradient-border relative flex h-full flex-col overflow-hidden',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
          'hover:-translate-y-1.5 focus-within:-translate-y-1.5',
          project.isPlaceholder && 'border-dashed',
        )}
      >
        {/* Artwork ---------------------------------------------------- */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--elevated)]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            loading="lazy"
          />
          {/* Readability + theme wash */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-70"
            style={{
              background:
                'linear-gradient(to top, color-mix(in srgb, var(--surface) 92%, transparent) 4%, transparent 58%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(130deg, color-mix(in srgb, var(--accent) 20%, transparent), transparent 55%, color-mix(in srgb, var(--violet) 18%, transparent))',
            }}
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Chip tone="accent" className="backdrop-blur-sm">
              {project.category}
            </Chip>
            {project.isPlaceholder && (
              <Chip className="border-[var(--line-strong)] bg-[var(--bg)]/80 text-[var(--muted)] backdrop-blur-sm">
                {project.badge ?? 'Placeholder'}
              </Chip>
            )}
          </div>
        </div>

        {/* Body ------------------------------------------------------- */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--fg-strong)]">
            {project.name}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
            {project.summary}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-[var(--line)] pt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onOpen(project)}
              ariaLabel={`View details for ${project.name}`}
            >
              View Details
              <ArrowUpRight width={15} height={15} />
            </Button>

            {hasGithub && (
              <Button
                size="sm"
                variant="ghost"
                href={project.github}
                ariaLabel={`Open the GitHub repository for ${project.name}`}
              >
                <GitHub width={16} height={16} />
                GitHub
              </Button>
            )}
          </div>
        </div>
      </article>
    </motion.li>
  );
}

export default ProjectCard;
