'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  siteConfig,
  getMailtoHref,
  getWhatsAppHref,
  isEmailConfigured,
  isGithubConfigured,
  isInstagramConfigured,
  isLinkedinConfigured,
  isWhatsAppConfigured,
} from '@/data/site';
import { GitHub, Instagram, LinkedIn, Mail, WhatsApp } from '@/components/ui/icons';
import { Slash } from '@/components/ui/Slash';
import type { ReactNode } from 'react';

/**
 * ContactChannels
 * ---------------------------------------------------------------------------
 * Direct contact rows (WhatsApp, email, GitHub, Instagram, LinkedIn).
 *
 * Every channel is gated by isConfigured(): while a value is still a YOUR_…
 * placeholder the row renders as a disabled "link pending" state instead of
 * pointing at a dead URL. Fill the value in data/site.ts and it goes live.
 */

interface Channel {
  key: string;
  label: string;
  href: string | null;
  Icon: (props: { width?: number; height?: number; className?: string }) => ReactNode;
  hint: string;
}

export function ContactChannels() {
  const reduceMotion = useReducedMotion();

  const channels: Channel[] = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      href: getWhatsAppHref(),
      Icon: WhatsApp,
      hint: isWhatsAppConfigured() ? 'Fastest reply' : 'Number to be added',
    },
    {
      key: 'email',
      label: 'Email',
      href: getMailtoHref(`Project enquiry — ${siteConfig.companyName}`),
      Icon: Mail,
      hint: isEmailConfigured() ? siteConfig.contact.email : 'Address to be added',
    },
    {
      key: 'github',
      label: 'GitHub',
      href: isGithubConfigured() ? siteConfig.socials.github : null,
      Icon: GitHub,
      hint: isGithubConfigured() ? 'Code and repositories' : 'Link to be added',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: isInstagramConfigured() ? siteConfig.socials.instagram : null,
      Icon: Instagram,
      hint: isInstagramConfigured() ? 'Behind the scenes' : 'Link to be added',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: isLinkedinConfigured() ? siteConfig.socials.linkedin : null,
      Icon: LinkedIn,
      hint: isLinkedinConfigured() ? 'Professional profile' : 'Link to be added',
    },
  ];

  return (
    <div>
      <p className="eyebrow">
        <Slash size="h-3" />
        Direct contact
      </p>

      <ul className="mt-5 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
        {channels.map((channel, index) => (
          <motion.li
            key={channel.key}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
            className={channel.key === 'whatsapp' && channel.href ? 'sm:col-span-2' : undefined}
          >
            {channel.href ? (
              <a
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex min-h-16 items-center gap-4 bg-[var(--panel-2)] px-4 py-3.5 transition-colors duration-300 hover:bg-[var(--panel-3)]"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line-strong)] text-[var(--fg-soft)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                >
                  <channel.Icon width={17} height={17} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--fg-strong)]">
                    {channel.label}
                  </span>
                  <span className="mt-1 truncate text-[0.72rem] text-[var(--muted-2)]">
                    {channel.hint}
                  </span>
                </span>
                <span aria-hidden className="ml-auto text-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  →
                </span>
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="flex min-h-16 cursor-not-allowed items-center gap-4 bg-[var(--panel-2)] px-4 py-3.5 opacity-60"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-dashed border-[var(--line-strong)] text-[var(--muted-2)]"
                >
                  <channel.Icon width={17} height={17} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                    {channel.label}
                  </span>
                  <span className="mt-1 truncate text-[0.72rem] text-[var(--muted-2)]">
                    {channel.hint}
                  </span>
                </span>
              </span>
            )}
          </motion.li>
        ))}
      </ul>

      {(!isWhatsAppConfigured() || !isEmailConfigured()) && (
        <p className="mt-4 flex gap-3 border border-[var(--line)] bg-[var(--panel-2)] p-4 text-[0.72rem] leading-relaxed text-[var(--muted-2)]">
          <Slash size="h-3" className="mt-1" />
          <span>
            <strong className="font-medium text-[var(--muted)]">Setup note:</strong> the direct
            links activate as soon as the WhatsApp number and email address are set in{' '}
            <code className="font-mono text-[0.68rem] text-[var(--fg-soft)]">data/site.ts</code>.
            Until then use the form — it will tell you honestly if it cannot send yet.
          </span>
        </p>
      )}
    </div>
  );
}

export default ContactChannels;
