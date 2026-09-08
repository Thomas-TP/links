#!/usr/bin/env node
/**
 * Génère public/og-image.png (FR) et public/og-image-en.png (EN) — 1200×630px,
 * le format standard le mieux supporté par WhatsApp, X, LinkedIn, Discord, Slack…
 * Usage: node scripts/generate-og.mjs
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');

const W = 1200;
const H = 630;
const SITE_URL = 'https://links.thomastp.ch';
const FONT = 'Outfit,Segoe UI,system-ui,-apple-system,sans-serif';
const FONT_BODY = "'DM Sans',Segoe UI,system-ui,-apple-system,sans-serif";

const COPY = {
  fr: {
    subtitle: 'Apprenti CFC Informaticien',
    detail: 'Exploitation & Infrastructure · 2ème année',
    location: 'Arc lémanique, Suisse',
    available: 'Disponible dès juillet 2026',
    scan: 'Scanner pour visiter',
    out: 'og-image.png',
  },
  en: {
    subtitle: 'IT Apprentice (CFC)',
    detail: 'Operations & Infrastructure · 2nd year',
    location: 'Lake Geneva region, Switzerland',
    available: 'Available from July 2026',
    scan: 'Scan to visit',
    out: 'og-image-en.png',
  },
};

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function background(copy) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bgGrad" cx="35%" cy="0%" r="100%">
      <stop offset="0%"   stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
    <radialGradient id="blobViolet" cx="14%" cy="20%" r="55%">
      <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blobCyan" cx="78%" cy="88%" r="55%">
      <stop offset="0%"   stop-color="#06b6d4" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="memojiGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.35"/>
      <stop offset="55%"  stop-color="#7c3aed" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accentBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect width="${W}" height="${H}" fill="url(#blobViolet)"/>
  <rect width="${W}" height="${H}" fill="url(#blobCyan)"/>

  <!-- Outer frame -->
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="26"
        fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1.5"/>

  <!-- Constellation motif (top strip) -->
  <circle cx="230" cy="72"  r="1.8" fill="rgba(255,255,255,0.4)"/>
  <circle cx="330" cy="52"  r="2.6" fill="rgba(255,255,255,0.55)"/>
  <circle cx="470" cy="86"  r="1.6" fill="rgba(255,255,255,0.32)"/>
  <circle cx="600" cy="58"  r="2.2" fill="rgba(255,255,255,0.45)"/>
  <circle cx="330" cy="52"  r="7"   fill="rgba(124,58,237,0.16)"/>
  <circle cx="600" cy="58"  r="7"   fill="rgba(6,182,212,0.12)"/>
  <line x1="230" y1="72" x2="330" y2="52" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
  <line x1="330" y1="52" x2="470" y2="86" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
  <line x1="470" y1="86" x2="600" y2="58" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>

  <!-- Extra scattered stars for atmosphere -->
  <circle cx="700" cy="45"  r="1.4" fill="rgba(255,255,255,0.30)"/>
  <circle cx="790" cy="110" r="1.8" fill="rgba(255,255,255,0.35)"/>
  <circle cx="700" cy="180" r="1.3" fill="rgba(255,255,255,0.22)"/>
  <circle cx="640" cy="480" r="1.6" fill="rgba(255,255,255,0.20)"/>
  <circle cx="470" cy="560" r="1.3" fill="rgba(255,255,255,0.18)"/>
  <circle cx="950" cy="60"  r="1.5" fill="rgba(255,255,255,0.28)"/>
  <circle cx="1090" cy="530" r="1.6" fill="rgba(255,255,255,0.22)"/>

  <!-- Vertical divider before the QR card -->
  <line x1="878" y1="80" x2="878" y2="${H - 80}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- Glow behind memoji -->
  <ellipse cx="180" cy="185" rx="190" ry="190" fill="url(#memojiGlow)"/>

  <!-- Name -->
  <text x="70" y="345" text-anchor="start"
        font-family="${FONT}" font-size="58" font-weight="700"
        fill="rgba(255,255,255,0.97)" letter-spacing="-1.5">${esc('Thomas Prud’homme')}</text>

  <!-- Accent bar -->
  <rect x="72" y="364" width="130" height="4" rx="2" fill="url(#accentBar)"/>

  <!-- Subtitle -->
  <text x="70" y="404" text-anchor="start"
        font-family="${FONT_BODY}" font-size="25" font-weight="500"
        fill="rgba(255,255,255,0.58)">${esc(copy.subtitle)}</text>

  <!-- Detail -->
  <text x="70" y="435" text-anchor="start"
        font-family="${FONT_BODY}" font-size="17"
        fill="rgba(255,255,255,0.32)">${esc(copy.detail)}</text>

  <!-- Location badge -->
  <rect x="70" y="472" width="330" height="42" rx="21"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
  <circle cx="96" cy="493" r="5.5" fill="rgba(255,255,255,0.42)"/>
  <text x="113" y="500" font-family="${FONT_BODY}" font-size="16"
        fill="rgba(255,255,255,0.52)">${esc(copy.location)}</text>

  <!-- Available badge -->
  <rect x="70" y="524" width="330" height="42" rx="21"
        fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.28)" stroke-width="1"/>
  <circle cx="96" cy="545" r="5.5" fill="#10b981"/>
  <text x="113" y="552" font-family="${FONT_BODY}" font-size="16"
        fill="rgba(16,185,129,0.88)">${esc(copy.available)}</text>

  <!-- QR card -->
  <rect x="928" y="145" width="204" height="340" rx="22" fill="#fafafa"/>
  <rect x="928.5" y="145.5" width="203" height="339" rx="21.5" fill="none" stroke="rgba(0,0,0,0.06)"/>
  <text x="1030" y="182" text-anchor="middle" font-family="${FONT_BODY}" font-size="13.5"
        font-weight="600" letter-spacing="0.5" fill="#3f3f46">${esc(copy.scan.toUpperCase())}</text>

  <!-- Domain -->
  <text x="1030" y="453" text-anchor="middle" font-family="${FONT}" font-size="16.5"
        font-weight="700" fill="#18181b" letter-spacing="-0.2">links.thomastp.ch</text>
</svg>`;
}

async function buildVariant(locale) {
  const copy = COPY[locale];

  const bgBuffer = await sharp(Buffer.from(background(copy)))
    .png()
    .toBuffer();

  const memojiSize = 240;
  const memojiBuffer = await sharp(join(pub, 'memoji-nobg.webp'))
    .resize(memojiSize, memojiSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const qrSize = 168;
  const qrBuffer = await QRCode.toBuffer(SITE_URL, {
    type: 'png',
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#09090bff', light: '#fafafaff' },
  });

  await sharp(bgBuffer)
    .composite([
      { input: memojiBuffer, left: 60, top: 65 },
      { input: qrBuffer, left: 1030 - qrSize / 2, top: 205 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(join(pub, copy.out));

  console.log(`✓  public/${copy.out} generated (${W}×${H})`);
}

await buildVariant('fr');
await buildVariant('en');
