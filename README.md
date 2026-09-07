<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)"  srcset="https://readme-typing-svg.demolab.com?font=monospace&size=26&duration=0&pause=0&color=FFFFFF&center=true&vCenter=true&width=700&lines=links.thomastp.ch">
  <source media="(prefers-color-scheme: light)" srcset="https://readme-typing-svg.demolab.com?font=monospace&size=26&duration=0&pause=0&color=000000&center=true&vCenter=true&width=700&lines=links.thomastp.ch">
  <img alt="links.thomastp.ch" src="https://readme-typing-svg.demolab.com?font=monospace&size=26&duration=0&pause=0&color=000000&center=true&vCenter=true&width=700&lines=links.thomastp.ch">
</picture>

<br/>

**Personal link-in-bio — Astro · Cloudflare Workers**

<br/>

[![Live site](https://img.shields.io/website?url=https%3A%2F%2Flinks.thomastp.ch&label=live%20site&style=flat-square&color=000000&labelColor=555)](https://links.thomastp.ch)
[![Last commit](https://img.shields.io/github/last-commit/Thomas-TP/links?style=flat-square&color=000000&labelColor=555)](https://github.com/Thomas-TP/links/commits/main)
[![Repo size](https://img.shields.io/github/repo-size/Thomas-TP/links?style=flat-square&color=000000&labelColor=555)](https://github.com/Thomas-TP/links)
[![Commit activity](https://img.shields.io/github/commit-activity/m/Thomas-TP/links?style=flat-square&color=000000&labelColor=555&label=commits%2Fmonth)](https://github.com/Thomas-TP/links/commits/main)

</div>

---

## Features

- **Physics constellation** — draggable link nodes with spring physics on desktop
- **Card layout** — stacked cards with staggered entry animations on mobile
- **Starfield background** — canvas animation, automatically paused on `prefers-reduced-motion`
- **FR / EN i18n** — `localStorage` persistence, `de` / `it` → English fallback
- **WhatsApp privacy** — phone number hidden behind Cloudflare Worker + Turnstile CAPTCHA
- **Locale-aware CV link** — resolves to `cv.thomastp.ch/cv-fr.pdf` or `cv-en.pdf` based on the active language
- **GitHub stats widget** — live follower + repo count, `sessionStorage` cached (1 req/session)
- **Dark / light mode** — Tailwind `dark:` classes, theme-adaptive favicons + OG image
- **Static build** — zero server, Astro static output deployed as Cloudflare Worker static assets
- **SEO ready** — OG 1200×1200 PNG (`sharp`), `twitter:card`, canonical URL

---

## Tech Stack

<div align="center">

![Astro](https://img.shields.io/badge/Astro_7-000000?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React_19-000000?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-000000?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-000000?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-000000?style=for-the-badge&logo=framer&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-000000?style=for-the-badge&logo=cloudflare&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

</div>

---

## CI / CD

Deployment is handled entirely by **Cloudflare Workers Builds** — the `links` Worker is connected directly to this GitHub repo. Every push to `main` triggers an automatic remote build (`bun install` → `bun run build`) and deploy, no GitHub Actions involved.

To redeploy manually from a local checkout:

```bash
bun run build
bunx wrangler deploy
```

---

## File Structure

```
links/
├─ public/
│   ├─ favicon.svg                  # Dark mode favicon
│   ├─ favicon-light.svg            # Light mode favicon
│   ├─ memoji-nobg.webp             # Profile picture
│   └─ og-image.png                 # Open Graph image (1200×1200, generated)
│
├─ src/
│   ├─ pages/
│   │   ├─ index.astro              # Root shell — meta/OG/favicons, mounts <Home client:load>
│   │   └─ 404.astro                # Not-found page
│   │
│   ├─ components/
│   │   ├─ Home.tsx                 # Entry — desktop/mobile routing · toast state
│   │   ├─ PhysicsConstellation.tsx # Desktop — spring physics engine
│   │   ├─ MobileLayout.tsx         # Mobile — card list
│   │   ├─ LinkNode.tsx             # Shared link atom (orbit + card)
│   │   ├─ Starfield.tsx            # Canvas star background
│   │   ├─ FloatingControls.tsx     # Theme + language toggle
│   │   ├─ GitHubStats.tsx          # GitHub API widget (sessionStorage cached)
│   │   ├─ Toast.tsx                # Notification toast
│   │   └─ Icons.tsx
│   │
│   ├─ data/
│   │   └─ links.ts                 # Link definitions + locale-aware URL resolution
│   │
│   ├─ i18n/
│   │   ├─ translations.ts          # FR / EN string map
│   │   └─ useLocale.ts             # Locale detection + localStorage persistence
│   │
│   └─ styles/
│       └─ global.css               # Tailwind v4 theme + custom utilities
│
├─ workers/
│   ├─ wa-worker.js                 # Separate Cloudflare Worker — Turnstile + WhatsApp redirect
│   └─ wrangler.toml                # Its own Worker config
│
├─ scripts/
│   └─ generate-og.mjs              # OG PNG generator (sharp — 1200×1200)
│
├─ astro.config.mjs                 # Astro + @astrojs/react + @tailwindcss/vite
├─ wrangler.jsonc                   # Cloudflare Worker config (static assets from ./dist)
├─ .oxlintrc.json / .oxfmtrc.json   # Lint + format config
└─ bun.lock
```

---

## Quick Start

```bash
# Install dependencies
bun install

# Start the dev server
bun dev                 # http://localhost:4321

# Production build (static output → ./dist)
bun run build

# Preview the production build locally
bun run preview

# Regenerate the OG image
bun run generate-og     # rewrites public/og-image.png (1200×1200)

# Lint / format
bun run lint
bun run format
```

---

<div align="center">

[![Live site](https://img.shields.io/website?url=https%3A%2F%2Flinks.thomastp.ch&label=live%20site&style=flat-square&color=000000&labelColor=555)](https://links.thomastp.ch)&nbsp;
[![GitHub last commit](https://img.shields.io/github/last-commit/Thomas-TP/links?style=flat-square&color=000000&labelColor=555)](https://github.com/Thomas-TP/links/commits/main)

</div>
