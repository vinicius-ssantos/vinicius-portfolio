# Agent instructions

- Canonical commands: `npm run dev|build|start|lint|typecheck|format:check|test|preflight`. Run `npm run preflight` before considering a change done.
- Content lives in `src/content/` (profile/experience/education/stack/projects, one file per project under `src/content/projects/`). UI interface strings live in `messages/pt.json` and `messages/en.json` (next-intl catalogs).
- New project: copy `src/content/projects/_template.ts`, fill it in, then register it in `src/content/projects/index.ts` — add the `*Meta` object to `projectMetas` and the `get*Project` getter to `projectGetters`. Keep `visible: false` until it meets the minimum bar documented in the template (defined problem, consistent README, initial architecture, public activity, clear next milestone).
- Don't fabricate experience, metrics, or results — this is a real CV-backed portfolio (see issue #14/#11 constraints). `metrics` on a project must come from something verifiable (public dashboard, CI badge, repo insights), never invented.
- Server Components are the default; only add `"use client"` where interaction is required.
- `src/proxy.ts` is Next.js middleware (renamed in Next 16) — don't rename it back.

## Localization (next-intl)

- **UI/interface strings** (nav, buttons, labels, generic copy — not domain content): add the key to both `messages/en.json` and `messages/pt.json` at the same path, then read it with `useTranslations("namespace")` (Client Components) or `getTranslations("namespace")` (Server Components — `await` it, and call `setRequestLocale(lang)` earlier in that route if it's the first thing in the tree to touch translations). `src/lib/__tests__/messages.test.ts` fails the build if the two catalogs' key sets ever diverge — no separate "missing key" step needed.
- **Domain content** (profile bio, experience bullets, project narratives): each `src/content/*.ts` file separates locale-independent fields (dates, URLs, stack, flags — exported directly, safe to import without a `lang`) from translatable text (kept in per-locale objects/records in the same file, e.g. `profileTextPt`/`profileTextEn`). Read it via that module's `get*(lang)` function, which merges the two. Never reintroduce a scattered `{ pt, en }` object as a content field — keep translatable text grouped in the locale-keyed record instead.
- The special Next.js boundary files (`loading.tsx`, `error.tsx`, `not-found.tsx`) don't receive route `params` and may render outside `NextIntlClientProvider` — they read text via the plain, provider-independent `messages` export from `src/lib/messages.ts`, not `useTranslations`. Keep that pattern if you touch those files.
- Adding a third locale: add it to `locales` in `src/lib/i18n.ts` and `routing.ts` in `src/i18n/routing.ts`, add `messages/<locale>.json`, add a `Record<Lang, ...>` entry everywhere content splits text by locale (TypeScript will point at every spot once `Lang` grows).
