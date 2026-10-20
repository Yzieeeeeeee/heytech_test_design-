import {
  siteConfig,
  getWhatsAppHref,
  getMailtoHref,
  isGithubConfigured,
  isInstagramConfigured,
  isLinkedinConfigured,
  isEmailConfigured,
} from '@/data/site';
import { Wordmark, Slash } from '@/components/ui/Slash';
import { GitHub, Instagram, LinkedIn, Mail, WhatsApp } from '@/components/ui/icons';

/**
 * Footer
 * ---------------------------------------------------------------------------
 * Static, server-rendered. Hairline-ruled mono columns on the deep band.
 * Social icons render only for real URLs; placeholder values never produce a
 * dead link. Bottom padding reserves space for the floating WhatsApp button.
 */

export function Footer() {
  const socials = [
    { key: 'instagram', label: `Instagram — ${siteConfig.companyName}`, href: isInstagramConfigured() ? siteConfig.socials.instagram : null, Icon: Instagram },
    { key: 'github', label: `GitHub — ${siteConfig.companyName}`, href: isGithubConfigured() ? siteConfig.socials.github : null, Icon: GitHub },
    { key: 'linkedin', label: `LinkedIn — ${siteConfig.companyName}`, href: isLinkedinConfigured() ? siteConfig.socials.linkedin : null, Icon: LinkedIn },
    { key: 'whatsapp', label: `WhatsApp — ${siteConfig.companyName}`, href: getWhatsAppHref(), Icon: WhatsApp },
  ].filter((entry) => Boolean(entry.href));

  const email = isEmailConfigured() ? getMailtoHref('Project enquiry') : null;
  const phone = siteConfig.contact.phoneDisplay.trim();

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--bg-2)]">
      {/* Closing statement band ---------------------------------------- */}
      <div className="container-page border-b border-[var(--line)] py-12 sm:py-16">
        <p className="text-statement font-display uppercase text-[var(--fg-strong)]">
          {siteConfig.tagline}
        </p>
        <p className="mt-4 flex gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
          <Slash size="h-3" className="mt-0.5" />
          {siteConfig.message}
        </p>
      </div>

      <div className="container-page grid gap-10 py-12 pb-28 sm:pb-24 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
        {/* Brand --------------------------------------------------------- */}
        <div>
          <Wordmark className="text-[1.5rem]" />

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            {siteConfig.seo.description}
          </p>

          <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
            {siteConfig.legalDescriptor}
          </p>
        </div>

        {/* Navigate ------------------------------------------------------ */}
        <nav aria-label="Footer navigation">
          <h2 className="eyebrow">
            <Slash size="h-3" />
            Navigate
          </h2>
          <ul className="mt-5 flex flex-col">
            {siteConfig.footer.links.map((link) => (
              <li key={link.href} className="border-b border-[var(--line)] last:border-0">
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  <span aria-hidden className="text-[var(--muted-2)]">
                    /
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact ------------------------------------------------------- */}
        <div>
          <h2 className="eyebrow">
            <Slash size="h-3" />
            Get in touch
          </h2>

          <ul className="mt-5 flex flex-col gap-1">
            {email && (
              <li>
                <a
                  href={email}
                  className="inline-flex min-h-11 items-center gap-3 text-sm text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  <Mail width={15} height={15} />
                  <span className="break-all">{siteConfig.contact.email}</span>
                </a>
              </li>
            )}
            {phone && (
              <li className="inline-flex min-h-11 items-center gap-3 text-sm text-[var(--muted)]">
                <WhatsApp width={15} height={15} />
                {phone}
              </li>
            )}
          </ul>

          {socials.length > 0 ? (
            <ul className="mt-4 flex flex-wrap items-center gap-px border border-[var(--line)] bg-[var(--line)] w-fit">
              {socials.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="tap-target inline-flex h-12 w-12 items-center justify-center bg-[var(--panel)] text-[var(--muted)] transition-colors duration-300 hover:bg-[var(--panel-2)] hover:text-[var(--accent)]"
                  >
                    <Icon width={16} height={16} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-xs font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-[var(--muted-2)]">
              Social links appear here once they are added in data/site.ts.
            </p>
          )}
        </div>
      </div>

      {/* Legal strip ----------------------------------------------------- */}
      <div className="border-t border-[var(--line)]">
        <div className="container-page flex flex-col gap-3 py-6 pb-24 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted-2)]">
            {siteConfig.footer.copyright}
          </p>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted-2)]">
            {siteConfig.footer.credit}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
