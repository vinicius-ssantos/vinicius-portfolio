# Agent instructions

- Canonical commands: `npm run dev|build|start|lint|typecheck|format:check|test|preflight`. Run `npm run preflight` before considering a change done.
- Content lives in `src/content/` (profile/experience/projects, one file per project under `src/content/projects/`) and `src/lib/translations.ts` (UI strings). Every localized field needs both `pt` and `en`.
- New project: copy `src/content/projects/_template.ts`, fill it in, add it to the `projects` array in `src/content/projects/index.ts`. Keep `visible: false` until it meets the minimum bar documented in the template (defined problem, consistent README, initial architecture, public activity, clear next milestone).
- Don't fabricate experience, metrics, or results — this is a real CV-backed portfolio (see issue #14/#11 constraints). `metrics` on a project must come from something verifiable (public dashboard, CI badge, repo insights), never invented.
- Server Components are the default; only add `"use client"` where interaction is required.
- `src/proxy.ts` is Next.js middleware (renamed in Next 16) — don't rename it back.
