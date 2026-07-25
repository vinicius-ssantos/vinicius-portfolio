# Vinicius Santos — Backend Engineer Portfolio

A bilingual portfolio and project-dossier hub for Vinicius de Oliveira Santos, Backend Software Engineer at UOL in São Paulo, Brazil.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and shadcn/ui. The product combines verified career content with architecture storytelling, accessible interaction, production observability, and quality gates intended to demonstrate backend-engineering depth rather than only visual polish.

## What's inside

- **Hero and career positioning** with availability state, primary CTA, verified statistics, and a lightweight Backend System Pulse 2.5D
- **Experience** — UOL and the QA-to-backend path at Autbank, with responsibilities, outcomes, and stack
- **Focused stack** organized across backend, data, quality, DevOps, infrastructure, and engineering methods
- **Six project pages** generated from typed content: AccountShield Orchestrator, Sentinel Ledger, FlagForge, Personal Platform Infra, Spring Cloud, and API REST Cars
- **Four flagship dossiers** with problem framing, architecture, decisions, trade-offs, delivery status, repository evidence, and localized content
- **Architecture exploration** backed by one typed topology model: accessible HTML/2.5D for every device and an allowlisted Three.js explorer only for selected desktop dossiers
- **Production integrations** for GitHub metadata, Vercel Analytics and Speed Insights, protected contact delivery, and distributed rate limiting
- **Education, about, CV, contact, theme, and locale navigation** designed as one recruiter-oriented flow

All content reflects the real CV — no fabricated experience or projects.

## Internationalization

Bilingual PT/EN support uses `next-intl` with real, indexable locale routes:

- `/pt` and `/en` are distinct URLs with localized metadata, canonical URLs, and `hreflang` alternates.
- `src/proxy.ts` resolves the preferred locale from the cookie and `Accept-Language`, then redirects `/` without hiding the locale from the URL.
- UI messages live in `messages/pt.json` and `messages/en.json`; typed portfolio content remains colocated under `src/content/`.
- The language toggle preserves the current project path when switching locales.
- Translation automation runs outside the application runtime through reviewable scripts, a versioned manifest, a technical glossary, and editorial quality gates.
- DeepL is an optional provider for incremental translation; generated text remains subject to repository review before publication.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + semantic motion tokens |
| UI components | shadcn/ui primitives, Radix UI, and Lucide icons |
| i18n | `next-intl`, locale routing, glossary, manifest, and optional DeepL workflow |
| Architecture visuals | HTML/SVG 2.5D plus Three.js and React Three Fiber behind a project allowlist and kill switch |
| Backend integrations | Next.js route handlers, Resend, Cloudflare Turnstile, Upstash Redis, and distributed rate limiting |
| Observability | Vercel Analytics, Vercel Speed Insights, and verified GitHub repository snapshots |
| Quality | ESLint, TypeScript, Prettier, Vitest, Playwright, and axe-core |
| Delivery | GitHub Actions, Dependabot, Vercel previews, and production deployment |
| Theme and media | `next-themes`, Geist, `next/image`, AVIF/WebP, and responsive SVG assets |

## Local development

```bash
npm install
npm run dev   # open http://localhost:3000 (redirects to /pt or /en)
```

Requires Node 22.12+ (see `.nvmrc`, which pins 24).

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

The E2E suite has already exposed and driven fixes for light-theme contrast, keyboard access to horizontally scrollable architecture content, and project soft 404 behavior. Unknown project slugs now return a real HTTP 404 in both PT and EN while preserving the intended loading experience. These regressions remain covered by automated tests rather than documented as accepted limitations.

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
│   │   ├── layout.tsx               # Localized metadata, JSON-LD, analytics, and providers
│   │   ├── page.tsx                 # Home composition
│   │   └── projects/[slug]/         # SSG dossier, loading state, and dynamic OG image
│   ├── api/contact/                 # Turnstile, rate limiting, validation, and Resend delivery
│   ├── robots.ts / sitemap.ts       # Canonical SEO resources
│   └── styles/                      # Tokens, motion, and print rules
├── components/
│   ├── sections/                    # Portfolio and dossier sections
│   ├── topology/                    # Shared 2.5D/3D architecture explorer
│   ├── animations/                  # Viewport-aware and reduced-motion-safe behavior
│   └── ui/                          # Reusable interface primitives
├── content/
│   ├── projects/                    # One typed source file per project and shared selectors
│   └── profile.ts / stack.ts / experience.ts / education.ts
├── hooks/                           # Scroll-spy and interaction lifecycle helpers
└── lib/                             # i18n, SEO, GitHub metadata, analytics, and feature flags

messages/                             # next-intl PT/EN UI catalogs
scripts/                              # i18n, environment, cleanup, and doctor tooling
e2e/                                  # Desktop/mobile Playwright and axe coverage
docs/                                 # ADRs, motion, performance, translation, and Three.js decisions
```

To update content (job history, stack, projects), edit the relevant file under `src/content/` — the UI and sitemap update automatically.

## License

MIT — see [LICENSE](./LICENSE). Feel free to fork and adapt for your own portfolio.

## Contact

- **Email:** viniciusoli2020@gmail.com
- **GitHub:** [@vinicius-ssantos](https://github.com/vinicius-ssantos)
- **LinkedIn:** [vinicius-oliveira-7ba1bb204](https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/)
