<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)"  srcset="https://readme-typing-svg.demolab.com?font=monospace&size=26&duration=0&pause=0&color=FFFFFF&center=true&vCenter=true&width=700&lines=thomastp.ch%2Flinks">
  <source media="(prefers-color-scheme: light)" srcset="https://readme-typing-svg.demolab.com?font=monospace&size=26&duration=0&pause=0&color=000000&center=true&vCenter=true&width=700&lines=thomastp.ch%2Flinks">
  <img alt="thomastp.ch/links" src="https://readme-typing-svg.demolab.com?font=monospace&size=26&duration=0&pause=0&color=000000&center=true&vCenter=true&width=700&lines=thomastp.ch%2Flinks">
</picture>

<br/>

**Personal link-in-bio — Next.js · Static Export · GitHub Pages**

<br/>

[![Deploy to GitHub Pages](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml)
[![Live site](https://img.shields.io/website?url=https%3A%2F%2Fthomastp.ch%2Flinks&label=live%20site&style=flat-square&color=000000&labelColor=555)](https://thomastp.ch/links)
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
- **CV download toast** — confirmation toast with 3 s auto-dismiss (FR & EN)
- **GitHub stats widget** — live follower + repo count, `sessionStorage` cached (1 req/session)
- **Dark / light mode** — Tailwind `dark:` classes, theme-adaptive favicons + OG image
- **Static export** — zero server, `next export` → GitHub Pages, free hosting
- **SEO ready** — OG 1200×1200 PNG (`sharp`), `twitter:card`, canonical URL

---

## Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-000000?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-000000?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-000000?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-000000?style=for-the-badge&logo=framer&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-000000?style=for-the-badge&logo=cloudflare&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-000000?style=for-the-badge&logo=github&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-000000?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

---

## CI / CD

Every push to `main` triggers the automated [deploy workflow](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml):

| # | Job | Step | Detail |
|---|-----|------|--------|
| 1 | **build** | Checkout | `actions/checkout@v4` |
| 2 | **build** | Setup | pnpm 10 · Node 20 · cache enabled |
| 3 | **build** | Install | `pnpm install --frozen-lockfile` |
| 4 | **build** | Build | `pnpm build` → static export `./out` |
| 5 | **build** | Upload | `actions/upload-pages-artifact@v3` |
| 6 | **deploy** | Publish | `actions/deploy-pages@v4` → `thomastp.ch/links` |

> **Live pipeline status** — [![Deploy to GitHub Pages](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml)
>
> Trigger a manual re-deploy anytime from the [**Actions tab → Run workflow**](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml).

---

## File Structure

```
links-main/
├─ .github/
│   └─ workflows/
│       └─ deploy.yml               # CI/CD — build + deploy to GitHub Pages
│
├─ public/
│   ├─ favicon.svg                  # Dark mode favicon
│   ├─ favicon-light.svg            # Light mode favicon
│   ├─ memoji-nobg.webp             # Profile picture
│   ├─ og-image.png                 # Open Graph image (1200×1200, generated)
│   └─ ThomasPrudhommeCV.pdf
│
├─ src/
│   ├─ app/
│   │   ├─ layout.tsx               # Root layout — metadata · OG · canonical
│   │   ├─ page.tsx                 # Entry — desktop/mobile routing · toast state
│   │   ├─ not-found.tsx            # 404 → redirect to /links
│   │   └─ global_styles.css
│   │
│   ├─ components/
│   │   ├─ PhysicsConstellation.tsx # Desktop — spring physics engine
│   │   ├─ MobileLayout.tsx         # Mobile — card list
│   │   ├─ LinkNode.tsx             # Shared link atom (orbit + card)
│   │   ├─ Starfield.tsx            # Canvas star background
│   │   ├─ FloatingControls.tsx     # Theme + language toggle
│   │   ├─ GitHubStats.tsx          # GitHub API widget (sessionStorage cached)
│   │   ├─ Toast.tsx                # Download confirmation toast
│   │   └─ Icons.tsx
│   │
│   ├─ data/
│   │   └─ links.ts                 # Link definitions + metadata
│   │
│   └─ i18n/
│       ├─ translations.ts          # FR / EN string map
│       └─ useLocale.ts             # Locale detection + localStorage persistence
│
├─ workers/
│   ├─ wa-worker.js                 # Cloudflare Worker — Turnstile + WhatsApp redirect
│   └─ wrangler.toml                # Worker config
│
├─ scripts/
│   └─ generate-og.mjs              # OG PNG generator (sharp — 1200×1200)
│
└─ next.config.ts                   # Static export · basePath /links (prod)
```

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev                # http://localhost:3000/links

# Production build (static export → ./out)
pnpm build

# Regenerate the OG image
pnpm generate-og        # rewrites public/og-image.png (1200×1200)
```

---

<div align="center">

[![Deploy to GitHub Pages](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml/badge.svg)](https://github.com/Thomas-TP/links/actions/workflows/deploy.yml)&nbsp;
[![GitHub deployments](https://img.shields.io/github/deployments/Thomas-TP/links/github-pages?label=github-pages&style=flat-square&color=000000&labelColor=555)](https://github.com/Thomas-TP/links/deployments)&nbsp;
[![GitHub last commit](https://img.shields.io/github/last-commit/Thomas-TP/links?style=flat-square&color=000000&labelColor=555)](https://github.com/Thomas-TP/links/commits/main)

</div>
