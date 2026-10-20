import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';

/**
 * robots.txt — generated at build time from NEXT_PUBLIC_SITE_URL.
 * The API route is excluded so no crawler treats it as a page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
