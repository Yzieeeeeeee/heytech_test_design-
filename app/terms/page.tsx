import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/data/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="container-page pb-24 pt-32 sm:pt-40">
      <SectionHeading title="Terms of Service" eyebrow="Legal" />
      
      <div className="mt-12 max-w-3xl space-y-8 text-body text-[var(--muted)]">
        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">1. Introduction</h2>
          <p>
            By accessing or using {siteConfig.companyName}'s services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">2. Services Provided</h2>
          <p>
            We provide software development, design, and technical consulting services. All project scopes, deliverables, and timelines are bespoke and defined in a separate Statement of Work (SOW) agreed upon by both parties before work begins.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">3. Intellectual Property</h2>
          <p>
            Upon full payment of all invoices, the client receives full intellectual property rights to the custom software code developed for their project, unless otherwise specified in the project agreement. We reserve the right to reuse generic algorithms or open-source libraries.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">4. Confidentiality</h2>
          <p>
            We adhere to strict confidentiality regarding any proprietary business logic, trade secrets, or sensitive data shared with us during the course of a project. Mutual Non-Disclosure Agreements (NDAs) can be executed upon request.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">5. Limitation of Liability</h2>
          <p>
            In no event shall {siteConfig.companyName} be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our software or services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">6. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at {siteConfig.contact.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
