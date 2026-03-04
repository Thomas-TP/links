#!/usr/bin/env node
/**
 * Génère public/og-image.png — 1200×1200px (carré, universel)
 * Usage: node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');
const S = 1200; // carré 1:1

const svgBg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="0%" r="90%">
      <stop offset="0%"   stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
    <radialGradient id="blobViolet" cx="20%" cy="30%" r="55%">
      <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blobCyan" cx="85%" cy="75%" r="50%">
      <stop offset="0%"   stop-color="#06b6d4" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="memojiGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.32"/>
      <stop offset="55%"  stop-color="#7c3aed" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${S}" height="${S}" fill="url(#bgGrad)"/>
  <rect width="${S}" height="${S}" fill="url(#blobViolet)"/>
  <rect width="${S}" height="${S}" fill="url(#blobCyan)"/>

  <!-- Outer border -->
  <rect x="28" y="28" width="${S - 56}" height="${S - 56}" rx="32"
        fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>

  <!-- Stars -->
  <circle cx="980"  cy="110" r="2.6" fill="rgba(255,255,255,0.55)"/>
  <circle cx="1100" cy="165" r="2.0" fill="rgba(255,255,255,0.45)"/>
  <circle cx="880"  cy="195" r="1.5" fill="rgba(255,255,255,0.30)"/>
  <circle cx="1055" cy="245" r="2.8" fill="rgba(255,255,255,0.52)"/>
  <circle cx="1145" cy="320" r="1.8" fill="rgba(255,255,255,0.38)"/>
  <circle cx="960"  cy="280" r="1.4" fill="rgba(255,255,255,0.28)"/>
  <circle cx="1090" cy="390" r="1.6" fill="rgba(255,255,255,0.32)"/>
  <circle cx="870"  cy="340" r="2.2" fill="rgba(255,255,255,0.42)"/>
  <circle cx="980"  cy="110" r="8"   fill="rgba(124,58,237,0.14)"/>
  <circle cx="1055" cy="245" r="9"   fill="rgba(6,182,212,0.10)"/>
  <circle cx="870"  cy="340" r="7"   fill="rgba(124,58,237,0.12)"/>
  <line x1="980"  y1="110" x2="1055" y2="245" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <line x1="1055" y1="245" x2="870"  y2="340" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <line x1="1055" y1="245" x2="1145" y2="320" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

  <!-- Separator -->
  <line x1="72" y1="660" x2="${S - 72}" y2="660"
        stroke="rgba(255,255,255,0.07)" stroke-width="1"/>

  <!-- Name -->
  <text x="${S / 2}" y="760" text-anchor="middle"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="72" font-weight="700" fill="rgba(255,255,255,0.95)" letter-spacing="-2">
    Thomas Prud&apos;homme
  </text>

  <!-- Accent bar -->
  <rect x="340" y="778" width="520" height="3" rx="2" fill="rgba(124,58,237,0.55)"/>

  <!-- Subtitle -->
  <text x="${S / 2}" y="838" text-anchor="middle"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="34" font-weight="400" fill="rgba(255,255,255,0.52)">
    Apprenti CFC Informaticien
  </text>

  <!-- Detail -->
  <text x="${S / 2}" y="884" text-anchor="middle"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="22" fill="rgba(255,255,255,0.28)">
    Exploitation &amp; Infrastructure  ·  2&#232;me ann&#233;e
  </text>

  <!-- Location badge -->
  <rect x="${S / 2 - 270}" y="916" width="248" height="44" rx="22"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
  <circle cx="${S / 2 - 246}" cy="938" r="5.5" fill="rgba(255,255,255,0.38)"/>
  <text x="${S / 2 - 228}" y="945"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="17" fill="rgba(255,255,255,0.48)">Arc l&#233;manique, Suisse</text>

  <!-- Available badge -->
  <rect x="${S / 2 + 26}" y="916" width="244" height="44" rx="22"
        fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.28)" stroke-width="1"/>
  <circle cx="${S / 2 + 50}" cy="938" r="5.5" fill="#10b981"/>
  <text x="${S / 2 + 68}" y="945"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="17" fill="rgba(16,185,129,0.85)">Disponible d&#232;s juillet 2026</text>

  <!-- URL watermark -->
  <text x="${S / 2}" y="${S - 44}" text-anchor="middle"
        font-family="Segoe UI,system-ui,-apple-system,sans-serif"
        font-size="20" fill="rgba(255,255,255,0.16)">thomastp.ch/links</text>

  <!-- Glow behind memoji -->
  <ellipse cx="${S / 2}" cy="360" rx="220" ry="220" fill="url(#memojiGlow)"/>
</svg>`;

/* ── Build the PNG ── */

// 1. Rasterise SVG
const bgBuffer = await sharp(Buffer.from(svgBg))
  .resize(S, S)
  .png()
  .toBuffer();

// 2. Resize memoji — large, centred in top half (0→660)
const memojiSize = 460;
const memojiBuffer = await sharp(join(pub, 'memoji-nobg.webp'))
  .resize(memojiSize, memojiSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const memojiLeft = Math.round((S - memojiSize) / 2);   // 370
const memojiTop  = Math.round((660 - memojiSize) / 2); // 100

// 3. Composite and save
await sharp(bgBuffer)
  .composite([{ input: memojiBuffer, top: memojiTop, left: memojiLeft }])
  .png({ compressionLevel: 9 })
  .toFile(join(pub, 'og-image.png'));

console.log('✓  public/og-image.png generated (1200×1200)');
