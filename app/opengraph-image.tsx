import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from '@/data/site';

/**
 * Generated Open Graph image — no design tooling required, and it stays in
 * sync with data/site.ts automatically.
 *
 * The artwork is pure geometry (grid, gradient glows, HT monogram) so it needs
 * no external fonts or images at build time.
 */

export const runtime = 'nodejs';
export const alt = `${siteConfig.companyName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The display font is bundled in the repo (SIL Open Font License, see
 * assets/fonts/OFL.txt) rather than fetched at build time, so OG generation
 * works offline and on any host. If the file is ever missing the artwork
 * still renders, just with the system fallback.
 */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const file = await readFile(join(process.cwd(), 'assets', 'fonts', 'SpaceGrotesk-Bold.ttf'));
    return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const displayFont = await loadDisplayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: '#06080c',
          color: '#eaf0f7',
          position: 'relative',
          fontFamily: displayFont ? '"Space Grotesk", sans-serif' : 'sans-serif',
        }}
      >
        {/* Soft grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* Gradient lights */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(59,140,255,0.42), transparent 68%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -220,
            left: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(154,123,255,0.32), transparent 70%)',
          }}
        />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'linear-gradient(150deg, rgba(59,140,255,0.28), rgba(154,123,255,0.22))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: '-1px',
                color: '#9fd9ff',
              }}
            >
              HT
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '4px' }}>HEY TECH</div>
            <div
              style={{
                fontSize: 17,
                letterSpacing: '5px',
                color: '#9aa7b9',
                textTransform: 'uppercase',
              }}
            >
              Technologies
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.03,
              letterSpacing: '-3px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>BUILDING IDEAS</span>
            <span>INTO DIGITAL PRODUCTS.</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 26, color: '#9aa7b9', maxWidth: 880 }}>
            Mobile apps, web apps, backend systems and digital products
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            fontSize: 22,
            color: '#6f7d92',
          }}
        >
          <span>{siteConfig.legalDescriptor}</span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#6fe4f2',
            }}
          >
            {/* Drawn dot instead of a glyph — keeps OG generation font-free */}
            <span
              style={{
                display: 'flex',
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: '#2ad4e8',
              }}
            />
            Currently accepting selected projects
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(displayFont
        ? {
            fonts: [
              { name: 'Space Grotesk', data: displayFont, weight: 700 as const, style: 'normal' as const },
            ],
          }
        : {}),
    },
  );
}
