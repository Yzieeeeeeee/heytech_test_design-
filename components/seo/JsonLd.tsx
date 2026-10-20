import { siteConfig, absoluteUrl, isConfigured } from '@/data/site';

/**
 * JsonLd
 * ---------------------------------------------------------------------------
 * Structured data for search engines — Organization + WebSite + the two
 * founders, built entirely from data/site.ts.
 *
 * Authenticity rules respected here:
 *  • No aggregateRating, no numberOfEmployees, no foundingLocation claims.
 *  • Email / telephone only emitted once they are real (not placeholders).
 *  • sameAs entries are filtered so placeholder socials are never published.
 */

export function JsonLd() {
  const sameAs = [
    siteConfig.socials.github,
    siteConfig.socials.instagram,
    siteConfig.socials.linkedin,
  ].filter((url) => isConfigured(url));

  const contactPoint =
    isConfigured(siteConfig.contact.email) || isConfigured(siteConfig.contact.whatsapp)
      ? [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            ...(isConfigured(siteConfig.contact.email)
              ? { email: siteConfig.contact.email }
              : {}),
            ...(isConfigured(siteConfig.contact.whatsapp)
              ? { telephone: `+${siteConfig.contact.whatsapp.replace(/[^\d]/g, '')}` }
              : {}),
            availableLanguage: ['en', 'ml', 'hi'],
          },
        ]
      : undefined;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: siteConfig.companyName,
    alternateName: siteConfig.shortName,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
    image: absoluteUrl(siteConfig.seo.ogImage),
    description: siteConfig.seo.description,
    slogan: siteConfig.tagline,
    foundingDate: String(siteConfig.foundedYear),
    areaServed: 'Worldwide',
    knowsAbout: siteConfig.services.map((service) => service.title),
    ...(sameAs.length ? { sameAs } : {}),
    ...(contactPoint ? { contactPoint } : {}),
    founder: siteConfig.founders.map((founder) => ({
      '@type': 'Person',
      name: founder.name,
      jobTitle: founder.role,
      description: founder.bio,
      ...(isConfigured(founder.socials.linkedin) ? { sameAs: [founder.socials.linkedin] } : {}),
    })),
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: siteConfig.companyName,
    description: siteConfig.seo.description,
    publisher: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en',
  };

  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': absoluteUrl('/#service'),
    name: siteConfig.companyName,
    description: siteConfig.seo.description,
    url: absoluteUrl('/'),
    parentOrganization: { '@id': absoluteUrl('/#organization') },
    makesOffer: siteConfig.services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
    </>
  );
}

export default JsonLd;
