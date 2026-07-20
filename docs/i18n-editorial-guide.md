# i18n editorial guide

Short, opinionated rules for writing and reviewing PT-BR and EN-US content
in this portfolio. Applies to `messages/{pt,en}.json` and the translatable
text in `src/content/*.ts`. See `i18n/glossary.json` for specific
term-level rules, and `AGENTS.md` for the no-fabrication constraint this
whole portfolio operates under.

## Português (PT-BR)

- Linguagem técnica natural para profissionais brasileiros — não force uma
  tradução quando o termo em inglês já é o que um dev brasileiro diria
  (ex.: "deploy", "release", "pull request" ficam em inglês).
- Evite anglicismo quando existe um termo claro em português, mas nunca
  traduza nomes de tecnologias, empresas ou produtos já consolidados.
- Evite superlativos, senioridade ou escala não comprovada ("revolucionário",
  "expert", "milhões de usuários" sem uma fonte verificável).
- Tom direto, concreto, orientado a evidências — prefira "implementei X
  para resolver Y" a "sou apaixonado por criar soluções inovadoras".

## English (EN-US)

- Adapt, don't translate word-for-word — a literal PT→EN rendering usually
  reads stiff or grammatically foreign. Rewrite the sentence in natural
  English that says the same thing.
- Prefer consistent American English (color, not colour; organize, not
  organise).
- Preserve conciseness and the first-person voice — don't pad short
  technical sentences into longer "professional-sounding" ones.
- Don't inflate impact, results, or responsibilities beyond what the PT
  source actually claims.
- Avoid corporate jargon ("leverage", "synergy", "world-class") and generic
  AI-generated-sounding phrasing ("in today's fast-paced world...").

## Both locales

- Never invent metrics, dates, employers, or outcomes — every professional
  claim in this repo is meant to be verifiable (see `AGENTS.md`).
- Keep terminology consistent across the whole page — don't alternate
  between two ways of saying the same thing in different sections
  (`i18n/glossary.json`'s `preferred` entries exist to prevent this).
- Never translate: proper names, technology/product names, commands, file
  names, slugs, URLs, or code spans. `npm run i18n:quality` checks this
  structurally; the glossary's `preserve` entries check it by term.

## When to reconsider an external platform (Crowdin or similar)

Out of scope today — the glossary + `i18n:quality` gate here is deliberately
lightweight (two locales, low volume, reviewed by the repo owner). Revisit
only if at least one of these becomes true:

- Three or more active locales.
- Non-technical reviewers collaborating on translations regularly.
- Content volume makes PR-based review impractical.
- A real need for translation memory and per-reviewer attribution emerges.

Until then, PR-based review plus this gate is the right amount of process.
