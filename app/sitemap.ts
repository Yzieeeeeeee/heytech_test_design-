import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';

/**
 * Sitemap — a single page site, so one canonical entry plus the section
 * anchors are declared. Anchors are not separately indexed; the entry below
 * is the canonical URL search engines should use.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
