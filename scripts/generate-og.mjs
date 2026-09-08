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
    detail: 'Exploitation & Infrastructure · 3ème année',
    location: 'Arc lémanique, Suisse',
    available: 'Disponible',
    scan: 'Scanner pour visiter',
    out: 'og-image.png',
  },
  en: {
    subtitle: 'IT Apprentice (CFC)',
    detail: 'Operations & Infrastructure · 3rd year',
    location: 'Lake Geneva region, Switzerland',
    available: 'Available',
    scan: 'Scan to visit',
    out: 'og-image-en.png',
  },
};

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/* ── Custom "styled" QR code: rounded dots, rounded finder eyes, logo hole ── */

function buildQrMarkup(url, { unit = 10, darkColor = '#09090b', lightColor = '#fafafa' } = {}) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const size = qr.modules.size;
  const get = (r, c) => qr.modules.get(r, c) === 1;

  const finderOrigins = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
  const inFinder = (r, c) =>
    finderOrigins.some(([fr, fc]) => r >= fr && r < fr + 7 && c >= fc && c < fc + 7);

  const logoSize = size >= 29 ? 7 : 5;
  const logoStart = Math.floor((size - logoSize) / 2);
  const inLogo = (r, c) =>
    r >= logoStart && r < logoStart + logoSize && c >= logoStart && c < logoStart + logoSize;

  let dots = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (inFinder(r, c) || inLogo(r, c)) continue;
      if (!get(r, c)) continue;
      const cx = (c + 0.5) * unit;
      const cy = (r + 0.5) * unit;
      dots += `<circle cx="${cx}" cy="${cy}" r="${unit * 0.48}" fill="${darkColor}"/>`;
    }
  }

  let eyes = '';
  for (const [fr, fc] of finderOrigins) {
    const ox = fc * unit;
    const oy = fr * unit;
    eyes += `
      <rect x="${ox}" y="${oy}" width="${7 * unit}" height="${7 * unit}" rx="${unit * 2}" fill="${darkColor}"/>
      <rect x="${ox + unit}" y="${oy + unit}" width="${5 * unit}" height="${5 * unit}" rx="${unit * 1.4}" fill="${lightColor}"/>
      <rect x="${ox + 2 * unit}" y="${oy + 2 * unit}" width="${3 * unit}" height="${3 * unit}" rx="${unit}" fill="${darkColor}"/>`;
  }

  // Logo hole: white rounded backing + the favicon mark, in module-grid coordinates.
  const logoPx = logoSize * unit;
  const logoOx = logoStart * unit;
  const logoOy = logoStart * unit;
  const logoPad = unit * 0.6;
  const iconInset = logoPad + unit * 0.9;
  const iconSize = logoPx - iconInset * 2;
  const logo = `
    <rect x="${logoOx - logoPad}" y="${logoOy - logoPad}" width="${logoPx + logoPad * 2}" height="${logoPx + logoPad * 2}"
          rx="${unit * 1.6}" fill="${lightColor}"/>
    <g transform="translate(${logoOx + iconInset}, ${logoOy + iconInset}) scale(${iconSize / 100})">
      <rect width="100" height="100" rx="20" fill="${darkColor}"/>
      <path d="M35 35H65M50 35V65" stroke="${lightColor}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="40" stroke="${lightColor}" stroke-width="4" stroke-opacity="0.35"/>
    </g>`;

  const span = size * unit;
  return { markup: dots + eyes + logo, span };
}

function background(copy, qr) {
  const qrDisplayPx = 172;
  const qrFrameSize = qrDisplayPx + 36;
  const qrFrameX = 1030 - qrFrameSize / 2;
  const qrFrameY = 310 - qrFrameSize / 2;
  const qrInnerPad = 12;

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
    <radialGradient id="qrGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#06b6d4" stop-opacity="0.25"/>
      <stop offset="60%"  stop-color="#7c3aed" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accentBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="qrFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#22d3ee"/>
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
  <circle cx="850" cy="560" r="1.5" fill="rgba(255,255,255,0.22)"/>
  <circle cx="1150" cy="90" r="1.4" fill="rgba(255,255,255,0.24)"/>

  <!-- Vertical divider before the QR column -->
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

  <!-- Scan label -->
  <text x="1030" y="${qrFrameY - 24}" text-anchor="middle" font-family="${FONT_BODY}" font-size="14"
        font-weight="600" letter-spacing="1" fill="rgba(255,255,255,0.45)">${esc(copy.scan.toUpperCase())}</text>

  <!-- QR glow + gradient frame -->
  <ellipse cx="1030" cy="310" rx="150" ry="150" fill="url(#qrGlow)"/>
  <rect x="${qrFrameX}" y="${qrFrameY}" width="${qrFrameSize}" height="${qrFrameSize}" rx="24"
        fill="none" stroke="url(#qrFrameGrad)" stroke-width="2.5" opacity="0.85"/>
  <rect x="${qrFrameX + qrInnerPad}" y="${qrFrameY + qrInnerPad}"
        width="${qrFrameSize - qrInnerPad * 2}" height="${qrFrameSize - qrInnerPad * 2}" rx="16"
        fill="#fafafa"/>

  <!-- QR code -->
  <g transform="translate(${qrFrameX + (qrFrameSize - qrDisplayPx) / 2}, ${qrFrameY + (qrFrameSize - qrDisplayPx) / 2}) scale(${qrDisplayPx / qr.span})">
    ${qr.markup}
  </g>

  <!-- Domain -->
  <text x="1030" y="${qrFrameY + qrFrameSize + 40}" text-anchor="middle" font-family="${FONT}" font-size="18"
        font-weight="700" fill="rgba(255,255,255,0.85)" letter-spacing="-0.2">links.thomastp.ch</text>
</svg>`;
}

async function buildVariant(locale) {
  const copy = COPY[locale];
  const qr = buildQrMarkup(SITE_URL);

  const bgBuffer = await sharp(Buffer.from(background(copy, qr)))
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

  await sharp(bgBuffer)
    .composite([{ input: memojiBuffer, left: 60, top: 65 }])
    .png({ compressionLevel: 9 })
    .toFile(join(pub, copy.out));

  console.log(`✓  public/${copy.out} generated (${W}×${H})`);
}

await buildVariant('fr');
await buildVariant('en');
