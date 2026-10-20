import { siteConfig } from '@/data/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactChannels } from '@/components/sections/ContactChannels';
import { Slash } from '@/components/ui/Slash';

/**
 * Contact — "12 / LET'S BUILD SOMETHING"
 * ---------------------------------------------------------------------------
 * Server component wrapper: heading, channel list and studio facts render on
 * the server; only the form and the channel links ship as client components.
 */

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            index={siteConfig.numbering.contact}
            eyebrow={siteConfig.contactSection.eyebrow}
            title={siteConfig.contactSection.heading}
            id="contact-heading"
            statement={siteConfig.contactSection.paragraph}
          />
        </Reveal>

        <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-[0.85fr_1.15fr]">
          {/* Channels + studio facts -------------------------------------- */}
          <div className="flex flex-col gap-8 bg-[var(--panel)] p-6 sm:p-8">
            <ContactChannels />

            <dl className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
              {[
                { label: 'Based in', value: siteConfig.location },
                { label: 'Studio', value: siteConfig.legalDescriptor },
                { label: 'Reply time', value: siteConfig.contact.responseNote },
                {
                  label: 'Working hours',
                  value: 'Messages answered in the order they arrive',
                },
              ].map((fact) => (
                <div key={fact.label} className="bg-[var(--panel-2)] p-4">
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[var(--muted-2)]">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-[0.82rem] leading-snug text-[var(--fg-soft)]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Form -------------------------------------------------------- */}
          <div className="bg-[var(--panel)] p-6 sm:p-8 lg:p-10">
            <h3 className="font-display text-[1.15rem] uppercase text-[var(--fg-strong)]">
              Send a project request
            </h3>
            <p className="mt-3 flex gap-3 text-sm text-[var(--muted)]">
              <Slash size="h-4" className="mt-1" />
              <span>
                A few details are enough to start. If the form cannot send, we will tell you and
                give you a direct link instead.
              </span>
            </p>

            <div className="mt-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
