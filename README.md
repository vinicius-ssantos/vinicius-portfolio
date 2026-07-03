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
- The middleware detects the visitor locale (cookie → `Accept-Language`) and redirects `/` to the right locale.
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
# Install dependencies
npm install

# Start dev server
npm run dev   # open http://localhost:3000 (redirects to /pt or /en)
```

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
└── lib/
    ├── i18n.ts                     # Locale config + helpers
    ├── portfolio-data.ts           # All profile/experience/projects/stack data
    └── translations.ts             # UI strings (PT + EN)
```

To update content (job history, stack, projects), edit `src/lib/portfolio-data.ts` — the UI and sitemap update automatically.

## License

MIT — feel free to fork and adapt for your own portfolio.

## Contact

- **Email:** viniciusoli2020@gmail.com
- **GitHub:** [@vinicius-ssantos](https://github.com/vinicius-ssantos)
- **LinkedIn:** [vinicius-oliveira-7ba1bb204](https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/)
