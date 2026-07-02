# Vinicius Santos — Backend Engineer Portfolio

A single-page portfolio website for Vinicius de Oliveira Santos, Backend Software Engineer at UOL (São Paulo, Brazil).

Built with Next.js 16, TypeScript, Tailwind CSS 4, and shadcn/ui. Dark-themed with an emerald-on-zinc palette that reflects the "infra/DevOps" aesthetic of modern backend engineering.

## What's inside

- **Hero** with availability badge and primary CTA
- **Experience** — 3 jobs in chronological order (UOL, Autbank as dev, Autbank as QA), each with summary, bullets, and stack
- **Stack** — focused toolkit organized by category (Backend, Quality, Data, DevOps, Infrastructure, Methods, Languages)
- **Selected Work** — 3 personal projects from GitHub, picked for depth
- **Case Study** — deep dive on `personal-platform-infra` with architecture diagram, problem, approach, outcomes
- **Education** — FATEC Ferraz de Vasconcelos + Full Stack Developer postgraduate at Faculdade Impacta
- **About** — long-form narrative of the QA-to-backend path
- **Footer** with email, GitHub, and LinkedIn

All content reflects the real CV — no fabricated experience or projects.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI components | shadcn/ui (New York style) + Lucide icons |
| Font | Geist Sans + Geist Mono (via `next/font`) |
| Theme | Dark mode only, emerald on zinc |

## Local development

```bash
# Install dependencies
bun install   # or npm install

# Start dev server
bun run dev   # or npm run dev

# Open http://localhost:3000
```

## Build for production

```bash
bun run build
bun run start
```

## Deploy on Vercel

The easiest way to deploy this Next.js app is via [Vercel](https://vercel.com/new).

1. Push this repository to your GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Next.js — click Deploy

No environment variables are required (the portfolio is fully static, no database needed for the public site).

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata + dark theme
│   ├── page.tsx            # Single-page portfolio (all sections)
│   └── globals.css         # Emerald-on-zinc palette + grid background
├── components/ui/          # shadcn/ui primitives (Card, Badge, Button, ...)
└── lib/
    └── portfolio-data.ts   # All profile/experience/projects/stack data as typed exports
```

To update content (job history, stack, projects), edit `src/lib/portfolio-data.ts` — the UI updates automatically.

## License

MIT — feel free to fork and adapt for your own portfolio.

## Contact

- **Email:** viniciusoli2020@gmail.com
- **GitHub:** [@vinicius-ssantos](https://github.com/vinicius-ssantos)
- **LinkedIn:** [vinicius-oliveira-7ba1bb204](https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/)
