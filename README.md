# Vinicius Santos — Backend Engineer Portfolio

A single-page portfolio website for Vinicius de Oliveira Santos, Backend Software Engineer at UOL (São Paulo, Brazil).

Built with Next.js 16, TypeScript, Tailwind CSS 4, and shadcn/ui. Dark-themed with an emerald-on-zinc palette that reflects the "infra/DevOps" aesthetic of modern backend engineering.

## What's inside

- **Hero** with availability badge and primary CTA
- **Experience** — 3 jobs in chronological order (UOL, Autbank as dev, Autbank as QA), each with summary, bullets, and stack
- **Stack** — focused toolkit organized by category (Backend, Quality, Data, DevOps, Infrastructure, Methods)
- **Selected Work** — 3 personal projects from GitHub, picked for depth
- **Project detail pages** — each project has a dedicated deep-dive page at `/{lang}/projects/{slug}` with full problem/approach/outcomes
- **Case Study** — deep dive on `personal-platform-infra` with architecture diagram, problem, approach, outcomes
- **Education** — FATEC Ferraz de Vasconcelos + Full Stack Developer postgraduate at Faculdade Impacta
- **About** — long-form narrative of the QA-to-backend path
- **Footer** with email, GitHub, and LinkedIn

All content reflects the real CV — no fabricated experience or projects.

## Internationalization

Bilingual (PT/EN) is implemented as **real locale routing** (not cookie-only):

- `/pt` and `/en` are distinct, indexable URLs with proper `hreflang` alternates.
- The proxy (`src/proxy.ts`) detects the visitor locale (cookie → `Accept-Language`) and redirects `/` to the right locale. In Next.js 16 the middleware file was renamed to `proxy.ts`, but the role is the same.
- The language toggle navigates between locale URLs, preserving the current path.
- Metadata (`title`, `description`, `openGraph.locale`) is localized per route.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI components | shadcn/ui (New York style) + Lucide icons |
| Font | Geist Sans + Geist Mono (via `next/font`) |
| Images | `next/image` (AVIF/WebP, responsive) |
| i18n | Locale routing (`/pt`, `/en`) via middleware |
| Theme | Dark/light via `next-themes`, emerald on zinc |

## Local development

```bash
npm install
npm run dev   # open http://localhost:3000 (redirects to /pt or /en)
```

Requires Node 20+ (see `.nvmrc`).

## Canonical commands

These npm scripts are the source of truth — used in local dev, CI, and deploy alike:

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Standard Next.js dev/build/start |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier write / check |
| `npm run test` / `test:watch` | Vitest |
| `npm run test:e2e` / `test:e2e:ui` | Playwright E2E + accessibility suite |
| `npm run preflight` | Everything above except E2E, in order — same as CI's `quality`/`build` jobs |
| `npm run clean` / `clean:all` | Remove `.next` / full reset (also `node_modules`) |
| `npm run check-env` | Warn about missing optional env vars |
| `npm run doctor` | Node/npm/env/`build` sanity check |

If you have [`just`](https://github.com/casey/just) installed, `just <recipe>` (e.g. `just up`, `just preflight`) wraps these same scripts for convenience — see the `Justfile`. It's entirely optional; every command above works standalone on Windows, Linux, and macOS.

## Quality budgets

What's checked, and where:

| Layer | Tool | Scope |
|---|---|---|
| Unit / component | Vitest | `src/**/__tests__` — content integrity, i18n helpers, SEO helpers, the contact API route, `MobileMenu` interactions |
| End-to-end | Playwright (`e2e/`) | Locale redirect, PT/EN navigation, anchors, desktop + mobile nav, theme toggle, project detail pages (incl. an unknown slug), CV link, contact modal (open/close/validate/submit — never hits the real API), essential resources (`robots.txt`, `sitemap.xml`, manifest, favicon, apple-icon) and that every sitemap URL actually resolves |
| Accessibility | `@axe-core/playwright`, run inside the E2E suite | Home (PT + EN), a project detail page, the open mobile menu — fails the build on any `serious`/`critical` violation |

Both Playwright projects (`Desktop Chrome`, `Mobile Chrome`) run on every PR via the `e2e` CI job, with trace/screenshot/video captured `on-failure` and uploaded as a `playwright-report` artifact.

**Lighthouse CI was evaluated and deferred for now** — running it reliably needs either a self-hosted runner or enough retries to absorb shared-GitHub-runner CPU variance, and flaky performance budgets are worse than no performance budget (they train people to ignore red CI). Vercel's own preview deployments already surface Core Web Vitals per-PR without that infra, which covers the immediate need; revisit `@lhci/cli` if a hard performance regression ever slips through unnoticed.

Two E2E findings from building this suite were fixed directly (not just documented): a color-contrast failure on the light theme's primary/accent tokens, and a horizontally-scrollable heatmap region that wasn't keyboard-focusable. One is tracked as a known, documented limitation rather than fixed here: `/en/projects/<unknown-slug>` responds `200` instead of `404` — `/[lang]/loading.tsx`'s Suspense boundary flushes the 200 status before `notFound()` resolves further down the tree, and removing that loading state trades away real UX (the home page's live GitHub stats fetch benefits from it) for correct status codes on a comparatively rare path. See the comment in `e2e/project-pages.spec.ts` for the full explanation.

## Build for production

```bash
npm run build
npm run start
```

## Deploy on Vercel

The easiest way to deploy this Next.js app is via [Vercel](https://vercel.com/new).

1. Push this repository to your GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Next.js — click Deploy

Optional env var: `NEXT_PUBLIC_SITE_URL` (defaults to the Vercel preview URL; set it to your production domain so canonical URLs / sitemap / JSON-LD point to the right place).

### Moving to a custom domain

All SEO-facing URLs (canonical, hreflang alternates, sitemap, robots.txt, JSON-LD, Open Graph) are derived from a single source — `SITE_URL` in `src/lib/site-config.ts`, which reads `NEXT_PUBLIC_SITE_URL`. To point the site at a custom domain instead of the `*.vercel.app` URL:

1. Add the domain in the Vercel project's **Settings → Domains**.
2. Set `NEXT_PUBLIC_SITE_URL` to `https://your-domain.tld` in **Settings → Environment Variables** (Production).
3. Redeploy — every canonical/hreflang/sitemap/OG URL updates automatically, no code changes needed.

## Project structure

```
src/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx              # Root layout: localized metadata, JSON-LD, fonts
│   │   ├── page.tsx                # Home (server component)
│   │   └── projects/[slug]/page.tsx# Project detail pages (SSG)
│   ├── robots.ts                   # Dynamic robots.txt (references sitemap)
│   ├── sitemap.ts                  # Sitemap with hreflang alternates + images
│   ├── error.tsx / not-found.tsx
│   └── globals.css
├── components/
│   ├── sections/                   # Server + client section components
│   ├── site-chrome.tsx             # Header + footer + contact modal wrapper
│   ├── contact-modal.tsx
│   ├── language-toggle.tsx         # Navigates between /pt and /en
│   ├── theme-toggle.tsx
│   └── ui/                         # shadcn/ui primitives
├── content/                        # Portfolio content domain (no React dependency)
│   ├── types.ts                    # Project/Experience/Education/LocalizedText + t()/yearsSince()
│   ├── profile.ts / stack.ts / experience.ts / education.ts
│   └── projects/                   # One file per project + selectors (getProjectBySlug, etc.)
└── lib/
    ├── i18n.ts                     # Locale config + helpers
    └── translations.ts             # UI strings (PT + EN)
```

To update content (job history, stack, projects), edit the relevant file under `src/content/` — the UI and sitemap update automatically.

## License

MIT — see [LICENSE](./LICENSE). Feel free to fork and adapt for your own portfolio.

## Contact

- **Email:** viniciusoli2020@gmail.com
- **GitHub:** [@vinicius-ssantos](https://github.com/vinicius-ssantos)
- **LinkedIn:** [vinicius-oliveira-7ba1bb204](https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/)
