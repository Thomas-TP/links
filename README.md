<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)"  srcset="https://readme-typing-svg.demolab.com?font=monospace&size=22&duration=0&pause=0&color=FFFFFF&center=true&vCenter=true&width=600&lines=thomastp.ch%2Flinks">
  <source media="(prefers-color-scheme: light)" srcset="https://readme-typing-svg.demolab.com?font=monospace&size=22&duration=0&pause=0&color=000000&center=true&vCenter=true&width=600&lines=thomastp.ch%2Flinks">
  <img alt="thomastp.ch/links" src="https://readme-typing-svg.demolab.com?font=monospace&size=22&duration=0&pause=0&color=000000&center=true&vCenter=true&width=600&lines=thomastp.ch%2Flinks">
</picture>

**Personal link-in-bio — Next.js · Static Export · GitHub Pages**

</div>

---

## Architecture

```
Browser
  │
  ├─ thomastp.ch/links          (GitHub Pages — static export)
  │    ├─ /                     → page.tsx  (desktop + mobile layout)
  │    ├─ /404                  → not-found.tsx  (redirect → /links)
  │    └─ /ThomasPrudhommeCV.pdf
  │
  └─ wa-redirect.thomastp.workers.dev   (Cloudflare Worker)
       ├─ GET  /   → Turnstile CAPTCHA page
       └─ POST /   → verify token → redirect wa.me/<secret number>
```

---

## Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
└───────────────────────┬─────────────────────┬───────────────────┘
                        │                     │
              Visit /links             Click WhatsApp
                        │                     │
          ┌─────────────▼──────────┐  ┌───────▼─────────────────┐
          │      GitHub Pages      │  │   Cloudflare Worker      │
          │  (static Next.js app)  │  │   wa-redirect.*.dev      │
          │                        │  │                          │
          │  page.tsx              │  │  GET  → CAPTCHA page     │
          │  ├─ Starfield          │  │  POST → verify Turnstile │
          │  ├─ PhysicsConstell.   │  │         ↓                │
          │  │  (desktop)          │  │  302 → wa.me/[secret]    │
          │  ├─ MobileLayout       │  └──────────────────────────┘
          │  │  (mobile)           │
          │  ├─ FloatingControls   │
          │  └─ Toast              │
          │                        │
          │  not-found.tsx         │
          │  └─ redirect → /links  │
          └────────────┬───────────┘
                       │
          ┌────────────▼───────────┐
          │    External APIs       │
          │  api.github.com/users  │
          │  (cached sessionStorage│
          │   — 1 req/session)     │
          └────────────────────────┘
```

---

## File Structure

```
links-main/
├─ public/
│   ├─ favicon.svg            # Dark mode favicon
│   ├─ favicon-light.svg      # Light mode favicon
│   ├─ memoji-nobg.webp       # Profile picture
│   ├─ og-image.png           # Open Graph image (1200×1200)
│   └─ ThomasPrudhommeCV.pdf
│
├─ src/
│   ├─ app/
│   │   ├─ layout.tsx         # Root layout — metadata, OG, canonical
│   │   ├─ page.tsx           # Entry point — desktop/mobile routing
│   │   ├─ not-found.tsx      # 404 → redirect to /links
│   │   └─ global_styles.css
│   │
│   ├─ components/
│   │   ├─ PhysicsConstellation.tsx  # Desktop — canvas physics engine
│   │   ├─ MobileLayout.tsx          # Mobile — card list
│   │   ├─ LinkNode.tsx              # Shared link component (orbit/card)
│   │   ├─ Starfield.tsx             # Animated canvas background
│   │   ├─ FloatingControls.tsx      # Theme + language toggle
│   │   ├─ GitHubStats.tsx           # GitHub API widget (cached)
│   │   ├─ Toast.tsx                 # Download confirmation toast
│   │   └─ Icons.tsx
│   │
│   ├─ data/
│   │   └─ links.ts           # Link definitions
│   │
│   └─ i18n/
│       ├─ translations.ts    # FR / EN strings
│       └─ useLocale.ts       # Locale detection + persistence
│
├─ workers/
│   ├─ wa-worker.js           # Cloudflare Worker — WhatsApp + Turnstile
│   └─ wrangler.toml
│
├─ scripts/
│   └─ generate-og.mjs        # OG image generator (node + sharp)
│
└─ next.config.ts             # Static export — basePath: /links
```

---

## Dev

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # static export → ./out
pnpm generate-og  # regenerate public/og-image.png
```

## Deploy

Pushes to `main` trigger GitHub Actions → build → deploy to GitHub Pages.

```
main branch push
  └─ .github/workflows/deploy.yml
       ├─ pnpm install
       ├─ pnpm build  (output: ./out)
       └─ upload artifact → GitHub Pages
```

## Worker deploy

```bash
cd workers
wrangler login
wrangler deploy
wrangler secret put TURNSTILE_SITE_KEY
wrangler secret put TURNSTILE_SECRET
wrangler secret put WA_NUMBER
```

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)"  srcset="https://img.shields.io/badge/Next.js-16-ffffff?style=flat-square&logo=nextdotjs&logoColor=000&labelColor=fff">
  <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=fff&labelColor=000">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)"  srcset="https://img.shields.io/badge/GitHub_Pages-deployed-ffffff?style=flat-square&logo=github&logoColor=000&labelColor=fff">
  <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/GitHub_Pages-deployed-000000?style=flat-square&logo=github&logoColor=fff&labelColor=000">
  <img alt="GitHub Pages" src="https://img.shields.io/badge/GitHub_Pages-deployed-000000?style=flat-square">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)"  srcset="https://img.shields.io/badge/Cloudflare_Workers-protected-ffffff?style=flat-square&logo=cloudflare&logoColor=000&labelColor=fff">
  <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/Cloudflare_Workers-protected-000000?style=flat-square&logo=cloudflare&logoColor=fff&labelColor=000">
  <img alt="Cloudflare Workers" src="https://img.shields.io/badge/Cloudflare_Workers-protected-000000?style=flat-square">
</picture>

</div>
