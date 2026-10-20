/**
 * ============================================================================
 *  ARTWORK GENERATOR
 * ============================================================================
 *  Creates every raster asset the site ships with, from vector definitions.
 *
 *  Hey Tech has no stock photography, no client logos and no shipped project
 *  screenshots, so placeholder artwork is *generated* from the brand system:
 *  near-black navy panels, a low-poly mesh, hairline rules and the signature
 *  red slash. No borrowed images anywhere.
 *
 *  Run after changing brand colours:
 *      npm run assets
 *
 *  Outputs (all committed, so a plain `npm install && npm run build` works):
 *    public/favicon.svg · favicon.ico · apple-icon.png · icon-192/512.png
 *    public/services/service-*.png   6 abstract capability panels (960×600)
 *    public/projects/project-*.png   4 abstract project panels (1600×1000)
 * ============================================================================
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');

/* Brand tokens — keep in sync with styles/globals.css */
const BRAND = {
  bg: '#04090f',
  bg2: '#01060b',
  panel: '#071016',
  panel2: '#0b151d',
  accent: '#ff1f1a',
  mesh: '#60a8c8',
  meshSoft: '#2c5f76',
  fg: '#ffffff',
  muted: '#8d9aa6',
  muted2: '#5e6a75',
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic low-poly mesh, mirroring components/ui/MeshBackdrop.tsx */
function mesh({ w, h, cols, seed = 42, opacity = 1 }) {
  const random = mulberry32(seed);
  const rows = Math.max(3, Math.round(cols * 0.6));
  const cellW = w / (cols - 1);
  const cellH = h / (rows - 1);
  const pts = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      pts.push({
        x: c * cellW + (random() - 0.5) * cellW * 0.8,
        y: r * cellH + (random() - 0.5) * cellH * 0.8,
      });
    }
  }

  const at = (r, c) => pts[r * cols + c];
  let out = '';

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const p = at(r, c);
      const candidates = [
        [c + 1 < cols ? at(r, c + 1) : null, 0.9],
        [r + 1 < rows ? at(r + 1, c) : null, 0.9],
        [c + 1 < cols && r + 1 < rows ? at(r + 1, c + 1) : null, 0.5],
        [c - 1 >= 0 && r + 1 < rows ? at(r + 1, c - 1) : null, 0.3],
      ];
      for (const [q, chance] of candidates) {
        if (!q || random() > chance) continue;
        const strong = random() > 0.7;
        out += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="${strong ? BRAND.mesh : BRAND.meshSoft}" stroke-width="1" opacity="${strong ? 0.55 : 0.32}"/>`;
      }
    }
  }

  const dots = pts
    .filter((_, index) => index % 5 === 0)
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.8" fill="${BRAND.mesh}" opacity="0.6"/>`)
    .join('');

  return `<g opacity="${opacity}">${out}${dots}</g>`;
}

/** Thin grid + frame used on every panel */
function frame(w, h, inset = 28) {
  const step = 40;
  let grid = '';
  for (let x = step; x < w; x += step) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#ffffff" stroke-width="1" opacity="0.035"/>`;
  for (let y = step; y < h; y += step) grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#ffffff" stroke-width="1" opacity="0.035"/>`;

  return `${grid}
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>
  <rect x="${w - inset - 4}" y="${inset}" width="4" height="${(h - inset * 2) * 0.34}" fill="${BRAND.accent}" transform="skewX(-6)" style="transform-origin:${w - inset}px 0"/>`;
}

/** Mono-style label bar, drawn as vector blocks (no font dependency) */
function labelBar(x, y, width, opacity = 0.5) {
  return `<rect x="${x}" y="${y}" width="${width}" height="7" fill="${BRAND.fg}" opacity="${opacity}"/>
  <rect x="${x}" y="${y + 16}" width="${Math.max(18, width * 0.42)}" height="5" fill="${BRAND.accent}" opacity="0.9"/>`;
}

function panelBase(w, h, seed, density = 8) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${BRAND.panel}"/>
      <stop offset="60%" stop-color="${BRAND.bg}"/>
      <stop offset="100%" stop-color="${BRAND.bg2}"/>
    </linearGradient>
    <radialGradient id="glowRed" cx="88%" cy="12%" r="60%">
      <stop offset="0%" stop-color="${BRAND.accent}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${BRAND.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowCyan" cx="8%" cy="92%" r="65%">
      <stop offset="0%" stop-color="${BRAND.mesh}" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="${BRAND.mesh}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#base)"/>
  ${mesh({ w, h, cols: density, seed, opacity: 0.9 })}
  <rect width="${w}" height="${h}" fill="url(#glowRed)"/>
  <rect width="${w}" height="${h}" fill="url(#glowCyan)"/>
  ${frame(w, h)}`;
}

/* -------------------------------------------------------------------------- */
/*  Service capability panels (960 × 600)                                     */
/* -------------------------------------------------------------------------- */

const SERVICE_PANELS = {
  mobile: (w, h) => `
    <rect x="${w * 0.38}" y="${h * 0.14}" width="${w * 0.24}" height="${h * 0.68}" rx="10" fill="${BRAND.panel2}" stroke="#ffffff" stroke-opacity="0.16"/>
    <rect x="${w * 0.415}" y="${h * 0.22}" width="${w * 0.17}" height="${h * 0.12}" fill="${BRAND.accent}" opacity="0.9"/>
    <rect x="${w * 0.415}" y="${h * 0.4}" width="${w * 0.17}" height="6" fill="#ffffff" opacity="0.25"/>
    <rect x="${w * 0.415}" y="${h * 0.46}" width="${w * 0.11}" height="6" fill="#ffffff" opacity="0.16"/>
    <rect x="${w * 0.415}" y="${h * 0.55}" width="${w * 0.17}" height="${h * 0.16}" fill="${BRAND.mesh}" opacity="0.22"/>
    <circle cx="${w * 0.5}" cy="${h * 0.76}" r="10" fill="${BRAND.accent}"/>
    ${labelBar(w * 0.08, h * 0.74, 90)}`,
  web: (w, h) => `
    <rect x="${w * 0.1}" y="${h * 0.16}" width="${w * 0.8}" height="${h * 0.64}" fill="${BRAND.panel2}" stroke="#ffffff" stroke-opacity="0.16"/>
    <rect x="${w * 0.1}" y="${h * 0.16}" width="${w * 0.8}" height="${h * 0.08}" fill="#ffffff" opacity="0.06"/>
    <circle cx="${w * 0.135}" cy="${h * 0.2}" r="4" fill="${BRAND.accent}"/>
    <circle cx="${w * 0.155}" cy="${h * 0.2}" r="4" fill="${BRAND.mesh}" opacity="0.8"/>
    <rect x="${w * 0.14}" y="${h * 0.3}" width="${w * 0.22}" height="${h * 0.42}" fill="${BRAND.accent}" opacity="0.28"/>
    <rect x="${w * 0.39}" y="${h * 0.3}" width="${w * 0.22}" height="${h * 0.18}" fill="${BRAND.mesh}" opacity="0.24"/>
    <rect x="${w * 0.39}" y="${h * 0.52}" width="${w * 0.22}" height="${h * 0.2}" fill="#ffffff" opacity="0.08"/>
    <rect x="${w * 0.64}" y="${h * 0.3}" width="${w * 0.22}" height="${h * 0.42}" fill="${BRAND.mesh}" opacity="0.14"/>
    ${labelBar(w * 0.1, h * 0.84, 110)}`,
  backend: (w, h) => `
    <g fill="none" stroke="${BRAND.mesh}" stroke-opacity="0.7" stroke-width="2">
      <path d="M${w * 0.5} ${h * 0.22} L${w * 0.74} ${h * 0.5} L${w * 0.5} ${h * 0.78} L${w * 0.26} ${h * 0.5} Z"/>
    </g>
    <rect x="${w * 0.44}" y="${h * 0.42}" width="${w * 0.12}" height="${h * 0.16}" fill="${BRAND.accent}" opacity="0.55"/>
    <circle cx="${w * 0.5}" cy="${h * 0.22}" r="9" fill="${BRAND.accent}"/>
    <circle cx="${w * 0.74}" cy="${h * 0.5}" r="9" fill="${BRAND.mesh}"/>
    <circle cx="${w * 0.5}" cy="${h * 0.78}" r="9" fill="${BRAND.mesh}"/>
    <circle cx="${w * 0.26}" cy="${h * 0.5}" r="9" fill="${BRAND.accent}" opacity="0.8"/>
    ${labelBar(w * 0.08, h * 0.16, 80)}`,
  api: (w, h) => `
    <g stroke="${BRAND.accent}" stroke-width="2" fill="none" opacity="0.9">
      <path d="M${w * 0.16} ${h * 0.3} H${w * 0.42}"/>
      <path d="M${w * 0.16} ${h * 0.5} H${w * 0.42}"/>
      <path d="M${w * 0.16} ${h * 0.7} H${w * 0.42}"/>
    </g>
    <g stroke="${BRAND.mesh}" stroke-width="2" fill="none" opacity="0.8">
      <path d="M${w * 0.58} ${h * 0.3} H${w * 0.84}"/>
      <path d="M${w * 0.58} ${h * 0.5} H${w * 0.84}"/>
      <path d="M${w * 0.58} ${h * 0.7} H${w * 0.84}"/>
    </g>
    <circle cx="${w * 0.16}" cy="${h * 0.3}" r="6" fill="${BRAND.mesh}"/>
    <circle cx="${w * 0.16}" cy="${h * 0.5}" r="6" fill="${BRAND.mesh}"/>
    <circle cx="${w * 0.16}" cy="${h * 0.7}" r="6" fill="${BRAND.mesh}"/>
    <circle cx="${w * 0.84}" cy="${h * 0.3}" r="6" fill="${BRAND.accent}"/>
    <circle cx="${w * 0.84}" cy="${h * 0.5}" r="6" fill="${BRAND.accent}"/>
    <circle cx="${w * 0.84}" cy="${h * 0.7}" r="6" fill="${BRAND.accent}"/>
    <rect x="${w * 0.42}" y="${h * 0.3}" width="${w * 0.16}" height="${h * 0.4}" fill="${BRAND.panel2}" stroke="#ffffff" stroke-opacity="0.2"/>
    ${labelBar(w * 0.42, h * 0.63, 60, 0.4)}`,
  uiux: (w, h) => `
    <rect x="${w * 0.12}" y="${h * 0.18}" width="${w * 0.34}" height="${h * 0.6}" fill="#ffffff" opacity="0.05" stroke="#ffffff" stroke-opacity="0.16"/>
    <rect x="${w * 0.16}" y="${h * 0.26}" width="${w * 0.26}" height="${h * 0.12}" fill="${BRAND.accent}" opacity="0.7"/>
    <rect x="${w * 0.16}" y="${h * 0.43}" width="${w * 0.12}" height="${h * 0.14}" fill="${BRAND.mesh}" opacity="0.3"/>
    <rect x="${w * 0.30}" y="${h * 0.43}" width="${w * 0.12}" height="${h * 0.14}" fill="${BRAND.mesh}" opacity="0.2"/>
    <rect x="${w * 0.16}" y="${h * 0.63}" width="${w * 0.26}" height="8" fill="#ffffff" opacity="0.2"/>
    <rect x="${w * 0.54}" y="${h * 0.3}" width="${w * 0.32}" height="${h * 0.4}" fill="none" stroke="${BRAND.accent}" stroke-opacity="0.5" stroke-dasharray="9 7"/>
    <circle cx="${w * 0.7}" cy="${h * 0.5}" r="26" fill="${BRAND.accent}" opacity="0.25"/>
    <circle cx="${w * 0.7}" cy="${h * 0.5}" r="10" fill="${BRAND.accent}" opacity="0.7"/>
    ${labelBar(w * 0.16, h * 0.74, 70)}`,
  student: (w, h) => `
    <g stroke="${BRAND.mesh}" stroke-width="2" fill="none" opacity="0.55">
      <path d="M${w * 0.12} ${h * 0.78} L${w * 0.34} ${h * 0.58} L${w * 0.52} ${h * 0.66} L${w * 0.72} ${h * 0.36} L${w * 0.88} ${h * 0.26}"/>
    </g>
    <g fill="${BRAND.accent}">
      <rect x="${w * 0.12 - 5}" y="${h * 0.78 - 5}" width="10" height="10"/>
      <rect x="${w * 0.34 - 5}" y="${h * 0.58 - 5}" width="10" height="10"/>
      <rect x="${w * 0.52 - 5}" y="${h * 0.66 - 5}" width="10" height="10"/>
      <rect x="${w * 0.72 - 5}" y="${h * 0.36 - 5}" width="10" height="10"/>
      <rect x="${w * 0.88 - 5}" y="${h * 0.26 - 5}" width="10" height="10"/>
    </g>
    <rect x="${w * 0.12}" y="${h * 0.2}" width="${w * 0.3}" height="${h * 0.08}" fill="#ffffff" opacity="0.14"/>
    <rect x="${w * 0.12}" y="${h * 0.32}" width="${w * 0.18}" height="${h * 0.05}" fill="#ffffff" opacity="0.09"/>
    ${labelBar(w * 0.72, h * 0.74, 70)}`,
};

/* -------------------------------------------------------------------------- */
/*  Project panels (1600 × 1000)                                              */
/* -------------------------------------------------------------------------- */

const PROJECT_PANELS = {
  mobile: (w, h) => `
    <rect x="${w * 0.4}" y="${h * 0.1}" width="${w * 0.2}" height="${h * 0.8}" rx="14" fill="${BRAND.panel2}" stroke="#ffffff" stroke-opacity="0.18"/>
    <rect x="${w * 0.435}" y="${h * 0.2}" width="${w * 0.13}" height="${h * 0.1}" fill="${BRAND.accent}" opacity="0.85"/>
    <rect x="${w * 0.435}" y="${h * 0.36}" width="${w * 0.13}" height="8" fill="#ffffff" opacity="0.24"/>
    <rect x="${w * 0.435}" y="${h * 0.42}" width="${w * 0.08}" height="8" fill="#ffffff" opacity="0.15"/>
    <rect x="${w * 0.435}" y="${h * 0.52}" width="${w * 0.13}" height="${h * 0.2}" fill="${BRAND.mesh}" opacity="0.2"/>
    <circle cx="${w * 0.5}" cy="${h * 0.79}" r="12" fill="${BRAND.accent}"/>
    ${labelBar(w * 0.08, h * 0.78, 150)}`,
  web: (w, h) => `
    <rect x="${w * 0.08}" y="${h * 0.14}" width="${w * 0.84}" height="${h * 0.68}" fill="${BRAND.panel2}" stroke="#ffffff" stroke-opacity="0.18"/>
    <rect x="${w * 0.08}" y="${h * 0.14}" width="${w * 0.84}" height="${h * 0.07}" fill="#ffffff" opacity="0.06"/>
    <circle cx="${w * 0.11}" cy="${h * 0.175}" r="5" fill="${BRAND.accent}"/>
    <circle cx="${w * 0.13}" cy="${h * 0.175}" r="5" fill="${BRAND.mesh}" opacity="0.8"/>
    <rect x="${w * 0.11}" y="${h * 0.28}" width="${w * 0.2}" height="${h * 0.46}" fill="${BRAND.accent}" opacity="0.3"/>
    <rect x="${w * 0.34}" y="${h * 0.28}" width="${w * 0.26}" height="${h * 0.2}" fill="${BRAND.mesh}" opacity="0.22"/>
    <rect x="${w * 0.34}" y="${h * 0.52}" width="${w * 0.26}" height="${h * 0.22}" fill="#ffffff" opacity="0.07"/>
    <rect x="${w * 0.63}" y="${h * 0.28}" width="${w * 0.26}" height="${h * 0.46}" fill="${BRAND.mesh}" opacity="0.13"/>
    ${labelBar(w * 0.08, h * 0.88, 190)}`,
  backend: (w, h) => `
    <g fill="none" stroke="${BRAND.mesh}" stroke-opacity="0.6" stroke-width="3">
      <path d="M${w * 0.5} ${h * 0.12} L${w * 0.78} ${h * 0.5} L${w * 0.5} ${h * 0.88} L${w * 0.22} ${h * 0.5} Z"/>
    </g>
    <rect x="${w * 0.44}" y="${h * 0.4}" width="${w * 0.12}" height="${h * 0.2}" fill="${BRAND.accent}" opacity="0.5"/>
    <circle cx="${w * 0.5}" cy="${h * 0.12}" r="12" fill="${BRAND.accent}"/>
    <circle cx="${w * 0.78}" cy="${h * 0.5}" r="12" fill="${BRAND.mesh}"/>
    <circle cx="${w * 0.5}" cy="${h * 0.88}" r="12" fill="${BRAND.mesh}"/>
    <circle cx="${w * 0.22}" cy="${h * 0.5}" r="12" fill="${BRAND.accent}" opacity="0.75"/>
    ${labelBar(w * 0.08, h * 0.16, 130)}`,
  uiux: (w, h) => `
    <rect x="${w * 0.08}" y="${h * 0.16}" width="${w * 0.42}" height="${h * 0.68}" fill="#ffffff" opacity="0.05" stroke="#ffffff" stroke-opacity="0.18"/>
    <rect x="${w * 0.12}" y="${h * 0.24}" width="${w * 0.34}" height="${h * 0.12}" fill="${BRAND.accent}" opacity="0.75"/>
    <rect x="${w * 0.12}" y="${h * 0.42}" width="${w * 0.16}" height="${h * 0.16}" fill="${BRAND.mesh}" opacity="0.28"/>
    <rect x="${w * 0.30}" y="${h * 0.42}" width="${w * 0.16}" height="${h * 0.16}" fill="${BRAND.mesh}" opacity="0.18"/>
    <rect x="${w * 0.12}" y="${h * 0.64}" width="${w * 0.34}" height="10" fill="#ffffff" opacity="0.18"/>
    <rect x="${w * 0.56}" y="${h * 0.3}" width="${w * 0.36}" height="${h * 0.44}" fill="none" stroke="${BRAND.accent}" stroke-opacity="0.5" stroke-dasharray="12 10"/>
    <circle cx="${w * 0.74}" cy="${h * 0.52}" r="40" fill="${BRAND.accent}" opacity="0.22"/>
    <circle cx="${w * 0.74}" cy="${h * 0.52}" r="15" fill="${BRAND.accent}" opacity="0.75"/>
    ${labelBar(w * 0.12, h * 0.78, 120)}`,
};

/* -------------------------------------------------------------------------- */
/*  Monogram / icons                                                          */
/* -------------------------------------------------------------------------- */

function monogramSvg(size, { glow = true } = {}) {
  const r = Math.round(size * 0.01);
  const s = size * 0.09;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    ${glow ? `<radialGradient id="g" cx="70%" cy="25%" r="70%">
      <stop offset="0%" stop-color="${BRAND.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${BRAND.accent}" stop-opacity="0"/>
    </radialGradient>` : ''}
  </defs>
  <rect width="64" height="64" rx="${r}" fill="${BRAND.bg}"/>
  ${glow ? `<rect width="64" height="64" rx="${r}" fill="url(#g)"/>` : ''}
  <g stroke="${BRAND.fg}" stroke-width="${s}" fill="none" stroke-linecap="square">
    <path d="M14 16v32M30 16v32M14 32h16"/>
    <path d="M40 16h12M46 16v32"/>
  </g>
  <rect x="53" y="9" width="4" height="46" fill="${BRAND.accent}" transform="skewX(-12)" style="transform-origin:55px 32px"/>
</svg>`;
}

function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuffer]);
}

/* -------------------------------------------------------------------------- */
/*  Run                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  await mkdir(resolve(publicDir, 'projects'), { recursive: true });
  await mkdir(resolve(publicDir, 'services'), { recursive: true });

  /* favicon.svg */
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="${BRAND.bg}"/>
  <g stroke="${BRAND.fg}" stroke-width="6" fill="none" stroke-linecap="square">
    <path d="M14 16v32M30 16v32M14 32h16"/>
    <path d="M40 16h12M46 16v32"/>
  </g>
  <rect x="53" y="9" width="4" height="46" fill="${BRAND.accent}" transform="skewX(-12)" style="transform-origin:55px 32px"/>
</svg>`;
  await writeFile(resolve(publicDir, 'favicon.svg'), faviconSvg, 'utf8');

  /* Raster icons */
  for (const { file, size } of [
    { file: 'icon-512.png', size: 512 },
    { file: 'icon-192.png', size: 192 },
    { file: 'apple-icon.png', size: 180 },
  ]) {
    await sharp(Buffer.from(monogramSvg(size), 'utf8')).png({ compressionLevel: 9 }).toFile(resolve(publicDir, file));
  }

  const faviconPng = await sharp(Buffer.from(monogramSvg(48, { glow: false }), 'utf8'))
    .resize(48, 48)
    .png()
    .toBuffer();
  await writeFile(resolve(publicDir, 'favicon.ico'), pngToIco(faviconPng, 48));

  /* Service capability panels — 960 × 600 */
  let seed = 11;
  for (const [key, draw] of Object.entries(SERVICE_PANELS)) {
    seed += 7;
    const w = 960;
    const h = 600;
    const svg = `${panelBase(w, h, seed, 9)}${draw(w, h)}</svg>`;
    await sharp(Buffer.from(svg, 'utf8'), { density: 144 })
      .resize(w, h, { fit: 'cover' })
      .png({ compressionLevel: 9, palette: true })
      .toFile(resolve(publicDir, 'services', `service-${key}.png`));
  }

  /* Project panels — 1600 × 1000 */
  seed = 101;
  for (const [key, draw] of Object.entries(PROJECT_PANELS)) {
    seed += 13;
    const w = 1600;
    const h = 1000;
    const svg = `${panelBase(w, h, seed, 11)}${draw(w, h)}</svg>`;
    await sharp(Buffer.from(svg, 'utf8'), { density: 144 })
      .resize(w, h, { fit: 'cover' })
      .png({ compressionLevel: 9, palette: true })
      .toFile(resolve(publicDir, 'projects', `project-${key}.png`));
  }

  console.log('✔ favicon.svg, favicon.ico, apple-icon.png, icon-192.png, icon-512.png');
  console.log(`✔ ${Object.keys(SERVICE_PANELS).length} service panels in public/services/`);
  console.log(`✔ ${Object.keys(PROJECT_PANELS).length} project panels in public/projects/`);
}

main().catch((error) => {
  console.error('Asset generation failed:', error);
  process.exitCode = 1;
});
