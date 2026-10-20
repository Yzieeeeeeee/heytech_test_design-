import type { Metadata, Viewport } from 'next';
import { Archivo, Manrope, JetBrains_Mono } from 'next/font/google';
import { siteConfig, absoluteUrl } from '@/data/site';
import { THEME_SCRIPT, THEME_STORAGE_KEY } from '@/lib/theme';
import '@/styles/globals.css';
import { SkipLink } from '@/components/ui/SkipLink';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat';
import { JsonLd } from '@/components/seo/JsonLd';

/* -------------------------------------------------------------------------- */
/*  Fonts — self-hosted by next/font.                                         */
/*  • Archivo ExtraBold  → display / headings (heavy geometric uppercase)     */
/*  • Manrope            → body copy                                          */
/*  • JetBrains Mono     → nav, labels, buttons, numbers (technical voice)    */
/* -------------------------------------------------------------------------- */
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
  weight: ['600', '700', '800', '900'],
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['400', '500', '700'],
});

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  applicationName: siteConfig.companyName,
  authors: [{ name: siteConfig.companyName }],
  creator: siteConfig.companyName,
  publisher: siteConfig.companyName,
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: siteConfig.companyName,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: absoluteUrl('/'),
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#04090f' },
    { media: '(prefers-color-scheme: light)', color: '#f1f3f5' },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Root layout                                                               */
/* -------------------------------------------------------------------------- */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${manrope.variable} ${jetbrains.variable} dark`}
      data-theme={siteConfig.theme.default}
      data-theme-key={THEME_STORAGE_KEY}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-paint theme application — no flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} data-ht-theme-script="" />
      </head>
      <body className="min-h-svh bg-[var(--bg)] text-[var(--fg)] antialiased">
        <SkipLink label={siteConfig.a11y.skipToContent} />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <JsonLd />
      </body>
    </html>
  );
}
