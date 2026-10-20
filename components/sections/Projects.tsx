'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig, isConfigured, type Project } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Slash } from '@/components/ui/Slash';
import { cn, slugify } from '@/lib/utils';

/**
 * Projects — "04 / SELECTED WORK"
 * ---------------------------------------------------------------------------
 * Case-study rows in the reference style: brand mark, description and a
 * "VIEW DETAILS →" action on the left; artwork on the right, alternating
 * sides on desktop and stacking on mobile.
 *
 * Everything is driven by the `projects` array in data/site.ts. Filter tabs
 * are mono, keyboard-operable (arrow keys) and show live counts; an explicit
 * empty state appears whenever a category has no items.
 */

type Filter = (typeof siteConfig.projectFilters)[number];

const FILTER_TO_CATEGORY: Record<string, Project['category'] | null> = {
  ALL: null,
  MOBILE: 'Mobile',
  WEB: 'Web',
  BACKEND: 'Backend',
  'UI/UX': 'UI/UX',
};

export function Projects() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const visible = useMemo(() => {
    const category = FILTER_TO_CATEGORY[filter];
    return category ? siteConfig.projects.filter((p) => p.category === category) : siteConfig.projects;
  }, [filter]);

  const countFor = useCallback((candidate: Filter) => {
    const category = FILTER_TO_CATEGORY[candidate];
    return category
      ? siteConfig.projects.filter((p) => p.category === category).length
      : siteConfig.projects.length;
  }, []);

  const handleTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = siteConfig.projectFilters.length - 1;
      let next = -1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = last;
      if (next < 0) return;

      event.preventDefault();
      tabRefs.current[next]?.focus();
      const label = siteConfig.projectFilters[next];
      if (label) setFilter(label);
    },
    [],
  );

  const hasRealProjects = siteConfig.projects.some((project) => !project.isPlaceholder);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            index={siteConfig.numbering.projects}
            eyebrow="Work"
            title="Selected work"
            id="projects-heading"
            statement={siteConfig.projectsIntro}
          />
        </Reveal>

        {/* Filters ------------------------------------------------------ */}
        <div className="mt-10 flex flex-wrap items-stretch gap-px border border-[var(--line)] bg-[var(--line)] sm:inline-flex">
          {siteConfig.projectFilters.map((label, index) => {
            const isActive = filter === label;
            const count = countFor(label);
            return (
              <button
                key={label}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(label)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={cn(
                  'tap-target inline-flex items-center gap-2.5 px-4 font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors duration-300',
                  isActive
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--panel)] text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--fg-strong)]',
                )}
              >
                {isActive && !reduceMotion ? <Slash size="h-2.5" className="bg-white" /> : null}
                {label}
                <span className={cn('text-[0.6rem]', isActive ? 'text-white/70' : 'text-[var(--muted-2)]')}>
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="sr-only">
          Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          {filter === 'ALL' ? '' : ` in ${filter}`}.
        </p>

        {/* Rows --------------------------------------------------------- */}
        <ul className="mt-6 flex flex-col">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                onOpen={setOpenProject}
                flip={index % 2 === 1}
              />
            ))}
          </AnimatePresence>
        </ul>

        {/* Empty state -------------------------------------------------- */}
        {visible.length === 0 && (
          <div className="mt-6 flex flex-col items-start gap-4 border border-dashed border-[var(--line-strong)] p-8 sm:p-12">
            <p className="eyebrow">
              <Slash size="h-3" />
              Nothing here yet
            </p>
            <h3 className="font-display text-h3 uppercase">No projects in this category</h3>
            <p className="max-w-md text-sm text-[var(--muted)]">
              Switch filters to see the rest of the board — or start the first one with us.
            </p>
            <Button href="#contact" variant="primary" size="sm" withArrow className="mt-2">
              Start a project
            </Button>
          </div>
        )}

        {/* Placeholder disclosure + CTA --------------------------------- */}
        {!hasRealProjects && (
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col gap-5 border border-[var(--line)] bg-[var(--panel)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex gap-3">
                <Slash size="h-4" className="mt-1.5" />
                <div>
                  <h3 className="font-display text-[1.05rem] uppercase">
                    These rows are placeholders — on purpose
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
                    We would rather show nothing than invent work we have not done. Every slot
                    below is labelled until a real project replaces it.
                  </p>
                </div>
              </div>
              <Button href="#contact" variant="outline" size="md" withArrow className="shrink-0">
                Start a project
              </Button>
            </div>
          </Reveal>
        )}
      </div>

      <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row                                                                       */
/* -------------------------------------------------------------------------- */

function ProjectRow({
  project,
  index,
  onOpen,
  flip,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  flip: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const hasGithub = isConfigured(project.github);

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.05, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[var(--line)]"
    >
      <article
        className={cn(
          'group grid gap-6 py-8 lg:grid-cols-2 lg:items-center lg:gap-12',
        )}
      >
        {/* Copy -------------------------------------------------------- */}
        <div className={cn('flex flex-col', flip && 'lg:order-2')}>
          <p className="eyebrow">
            <span className="text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
            <Slash size="h-3" />
            {project.category}
            {project.isPlaceholder && (
              <span className="ml-1 border border-[var(--line-strong)] px-2 py-1 text-[0.58rem] tracking-[0.16em] text-[var(--muted-2)]">
                {project.badge ?? 'Placeholder'}
              </span>
            )}
          </p>

          <h3 className="mt-4 font-display text-[clamp(1.5rem,1.1rem+1.8vw,2.5rem)] uppercase text-[var(--fg-strong)]">
            {project.name}
          </h3>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
            {project.summary}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              withArrow
              onClick={() => onOpen(project)}
              ariaLabel={`View details for ${project.name}`}
            >
              View details
            </Button>
            {hasGithub && (
              <Button
                variant="bare"
                size="sm"
                withArrow
                href={project.github}
                ariaLabel={`Open the GitHub repository for ${project.name}`}
              >
                GitHub
              </Button>
            )}
          </div>
        </div>

        {/* Artwork ----------------------------------------------------- */}
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`Open details for ${project.name}`}
          className={cn(
            'relative block aspect-[16/10] w-full overflow-hidden border border-[var(--line)] bg-[var(--panel)]',
            'transition-colors duration-300 hover:border-[var(--line-strong)]',
            flip && 'lg:order-1',
          )}
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
          />
        </button>
      </article>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Detail dialog                                                             */
/* -------------------------------------------------------------------------- */

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const titleId = project ? `project-dialog-${slugify(project.id)}` : 'project-dialog';

  return (
    <Dialog open={Boolean(project)} onClose={onClose} title={project?.name ?? ''} titleId={titleId}>
      {project && (
        <div>
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--line)] bg-[var(--panel-2)]">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="accent">{project.category}</Chip>
              {project.isPlaceholder && <Chip>{project.badge ?? 'Placeholder slot'}</Chip>}
              {project.year && <Chip>{project.year}</Chip>}
            </div>

            <h4 className="mt-5 font-display text-[1.75rem] uppercase">{project.name}</h4>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{project.description}</p>

            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Chip>{tag}</Chip>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              {isConfigured(project.github) && (
                <Button href={project.github} variant="outline" size="sm" withArrow>
                  View on GitHub
                </Button>
              )}
              {isConfigured(project.liveUrl) && (
                <Button href={project.liveUrl} variant="outline" size="sm" withArrow>
                  Open live site
                </Button>
              )}
              <Button href="#contact" variant="primary" size="sm" withArrow onClick={onClose}>
                Start a project like this
              </Button>
            </div>

            {project.isPlaceholder && (
              <p className="mt-7 flex gap-3 border border-[var(--line)] bg-[var(--panel-2)] p-4 text-xs leading-relaxed text-[var(--muted-2)]">
                <Slash size="h-3" className="mt-0.5" />
                <span>
                  This is a reserved slot, not a completed project. When real work ships, it
                  replaces this row with the problem, the build and the outcome.
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}

export default Projects;
