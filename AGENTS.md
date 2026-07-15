# Agent instructions

- Canonical commands: `npm run dev|build|start|lint|typecheck|format:check|test|preflight`. Run `npm run preflight` before considering a change done.
- Content lives in `src/lib/portfolio-data.ts` (profile/experience/projects) and `src/lib/translations.ts` (UI strings). Every localized field needs both `pt` and `en`.
- Don't fabricate experience, metrics, or results — this is a real CV-backed portfolio (see issue #14/#11 constraints).
- Server Components are the default; only add `"use client"` where interaction is required.
- `src/proxy.ts` is Next.js middleware (renamed in Next 16) — don't rename it back.
