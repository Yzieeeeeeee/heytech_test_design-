import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';

/**
 * Web app manifest — makes the site installable-looking on mobile without
 * claiming to be a full PWA (no service worker is registered).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.companyName,
    short_name: siteConfig.shortName,
    description: siteConfig.seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#06080c',
    theme_color: '#06080c',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
