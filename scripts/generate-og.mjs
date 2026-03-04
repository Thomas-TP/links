#!/usr/bin/env node
/**
 * Génère public/og-image.png — 1200×630px
 * Usage: node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');
const W = 1200, H = 630;

/* ── SVG background layer (vector only, no raster images) ── */
const svgBg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="gL" cx="22%" cy="48%" r="62%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gR" cx="85%" cy="36%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gM" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#7c3aed" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#09090b"/>
  <rect width="${W}" height="${H}" fill="url(#gL)"/>
  <rect width="${W}" height="${H}" fill="url(#gR)"/>

  <!-- Outer border -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="24"
        fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1.5"/>

  <!-- Vertical separator -->
  <line x1="750" y1="56" x2="750" y2="${H - 56}"
        stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

  <!-- Glow circle behind where memoji will be composited -->
  <ellipse cx="988" cy="315" rx="185" ry="185" fill="url(#gM)"/>

  <!-- ── Left: text content ── -->

  <!-- Name -->
  <text x="72" y="200"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="64" font-weight="700" fill="white" letter-spacing="-2">
    Thomas Prud&apos;homme
  </text>

  <!-- Purple accent underline -->
  <rect x="72" y="218" width="520" height="3" rx="2" fill="rgba(124,58,237,0.55)"/>

  <!-- Subtitle -->
  <text x="72" y="272"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="31" font-weight="400" fill="rgba(255,255,255,0.58)">
    Apprenti CFC Informaticien
  </text>

  <!-- Detail line -->
  <text x="72" y="313"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="20" fill="rgba(255,255,255,0.30)">
    Exploitation &amp; Infrastructure  ·  2&#232;me ann&#233;e
  </text>

  <!-- Horizontal rule -->
  <line x1="72" y1="344" x2="690" y2="344"
        stroke="rgba(255,255,255,0.07)" stroke-width="1"/>

  <!-- Location badge -->
  <rect x="72" y="362" width="244" height="44" rx="22"
        fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.11)" stroke-width="1"/>
  <circle cx="99" cy="384" r="5.5" fill="rgba(255,255,255,0.38)"/>
  <text x="115" y="391"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="17" fill="rgba(255,255,255,0.52)">Arc l&#233;manique, Suisse</text>

  <!-- Available badge -->
  <rect x="330" y="362" width="304" height="44" rx="22"
        fill="rgba(16,185,129,0.09)" stroke="rgba(16,185,129,0.30)" stroke-width="1"/>
  <circle cx="357" cy="384" r="5.5" fill="#10b981"/>
  <text x="373" y="391"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="17" fill="rgba(16,185,129,0.90)">Disponible d&#232;s juillet 2026</text>

  <!-- CTA button -->
  <rect x="72" y="442" width="304" height="58" rx="16"
        fill="rgba(124,58,237,0.20)" stroke="rgba(124,58,237,0.52)" stroke-width="1.5"/>
  <text x="224" y="477" text-anchor="middle"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="20" font-weight="600" fill="rgba(196,172,255,1)">
    Voir tous mes liens &#8594;
  </text>

  <!-- URL watermark -->
  <text x="72" y="570"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="18" fill="rgba(255,255,255,0.20)">thomastp.ch/links</text>

  <!-- ── Stars (right side decoration) ── -->
  <circle cx="860"  cy="95"  r="2.4" fill="rgba(255,255,255,0.60)"/>
  <circle cx="1110" cy="78"  r="1.8" fill="rgba(255,255,255,0.48)"/>
  <circle cx="1165" cy="195" r="2.6" fill="rgba(255,255,255,0.52)"/>
  <circle cx="800"  cy="490" r="1.9" fill="rgba(255,255,255,0.42)"/>
  <circle cx="1075" cy="530" r="2.1" fill="rgba(255,255,255,0.46)"/>
  <circle cx="1155" cy="450" r="1.6" fill="rgba(255,255,255,0.36)"/>
  <circle cx="835"  cy="565" r="1.7" fill="rgba(255,255,255,0.32)"/>
  <circle cx="1170" cy="560" r="1.4" fill="rgba(255,255,255,0.30)"/>

  <!-- Stars glow -->
  <circle cx="860"  cy="95"  r="7" fill="rgba(124,58,237,0.16)"/>
  <circle cx="1165" cy="195" r="9" fill="rgba(6,182,212,0.13)"/>
  <circle cx="1075" cy="530" r="7" fill="rgba(124,58,237,0.12)"/>
</svg>`;

/* ── Build the PNG ── */

// 1. Rasterise SVG background to PNG buffer
const bgBuffer = await sharp(Buffer.from(svgBg))
  .resize(W, H)
  .png()
  .toBuffer();

// 2. Resize memoji, keep transparency
const memojiBuffer = await sharp(join(pub, 'memoji-nobg.webp'))
  .resize(340, 340, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

// 3. Composite memoji centred on the right side
const memojiTop  = Math.round((H - 340) / 2);   // 145
const memojiLeft = 818;                           // centred around x=988

await sharp(bgBuffer)
  .composite([{ input: memojiBuffer, top: memojiTop, left: memojiLeft }])
  .png({ compressionLevel: 9 })
  .toFile(join(pub, 'og-image.png'));

console.log('✓  public/og-image.png generated (1200×630)');
