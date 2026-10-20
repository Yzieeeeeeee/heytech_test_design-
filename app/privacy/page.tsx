import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/data/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="container-page pb-24 pt-32 sm:pt-40">
      <SectionHeading title="Privacy Policy" eyebrow="Legal" />
      
      <div className="mt-12 max-w-3xl space-y-8 text-body text-[var(--muted)]">
        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">1. Information We Collect</h2>
          <p>
            When you contact us or start a project with {siteConfig.companyName}, we collect basic identifying information such as your name, email address, company name, and project details. We do not use invasive tracking technologies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">2. How We Use Your Information</h2>
          <p>
            We use your information exclusively to communicate regarding your project, provide technical consulting, and fulfill our contractual obligations. We do not sell, rent, or lease your personal information to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect the data you share with us. Our communication channels and code repositories are secured using modern encryption standards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">4. Third-Party Services</h2>
          <p>
            We may use trusted third-party services (such as secure cloud hosting or email providers) to facilitate our business operations. These providers are bound by strict confidentiality and data protection agreements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">5. Your Rights</h2>
          <p>
            You have the right to request access to the personal data we hold about you, or to request its deletion. If you wish to exercise these rights, please contact us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-h3 uppercase text-[var(--fg-strong)]">6. Contact</h2>
          <p>
            For any questions or concerns regarding our privacy practices, please contact us at {siteConfig.contact.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
