import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { TechStack } from '@/components/sections/TechStack';
import { Projects } from '@/components/sections/Projects';
import { Students } from '@/components/sections/Students';
import { Businesses } from '@/components/sections/Businesses';
import { Process } from '@/components/sections/Process';
import { Founders } from '@/components/sections/Founders';
import { WhyHeyTech } from '@/components/sections/WhyHeyTech';
import { Feedback } from '@/components/sections/Feedback';
import { GitHubSection } from '@/components/sections/GitHubSection';
import { Contact } from '@/components/sections/Contact';

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  alternates: { canonical: '/' },
};

/**
 * Home
 * ---------------------------------------------------------------------------
 * A single, well-structured landing page. Section order follows the brief:
 * Hero → About → Services → Stack → Projects → Students → Businesses →
 * Process → Founders → Why → Feedback → GitHub → Contact.
 *
 * Every section is a landmark with its own h2 (the hero owns the single h1),
 * and each one is server-rendered with client interactivity pushed down into
 * the smallest possible leaf components.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <TechStack />
      <Projects />
      <Students />
      <Businesses />
      <Process />
      <Founders />
      <WhyHeyTech />
      <Feedback />
      <GitHubSection />
      <Contact />
    </>
  );
}
