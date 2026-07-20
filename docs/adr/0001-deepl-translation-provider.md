# ADR 0001: DeepL as the machine-translation provider

## Status

Accepted (#52).

## Context

The portfolio's UI copy (`messages/pt.json`) is authored in Portuguese and
needs an English translation (`messages/en.json`). Keeping both by hand is
fine at today's volume (125 keys, ~2.7k characters total) but doesn't scale
past a handful of new sections, and it's the kind of mechanical work worth
automating incrementally rather than by hand every time a sentence changes.

A machine-translation draft must never become the published translation
without review — see `docs/i18n-editorial-guide.md` and the `i18n:quality`
gate (#55) for how that boundary is enforced. This ADR is only about which
provider generates the first draft.

## Decision

Use DeepL's REST API (`/v2/translate`, `/v2/glossaries`) as the sole
provider, called only from the CLI (`npm run i18n:translate`) and from a
manual (`workflow_dispatch`) GitHub Actions workflow — never at runtime,
never in a normal PR's CI.

Why DeepL over the alternatives considered:

- **Quality for PT→EN**: DeepL's PT-BR→EN-US output for technical writing
  is noticeably more natural than Google Translate's for this kind of
  content in informal testing, and it doesn't require prompting/steering
  the way a general-purpose LLM translation would.
- **Glossary support**: DeepL's Glossary API (`/v2/glossaries`) accepts
  exact source→target term pairs and enforces them during translation —
  a direct fit for `i18n/glossary.json`'s `preserve`/`preferred` entries
  (see `scripts/i18n-providers/deepl.mjs`'s `ensureGlossary`), without
  needing prompt engineering to keep "k3s" from becoming "K3S" or
  "Kubernetes" from being translated at all.
- **Free tier**: 500,000 characters/month free, no credit card required to
  start. This project's entire catalog is ~2.7k characters; even
  translating it from scratch weekly wouldn't come close to the limit.
- **Simple, stable REST contract**: no SDK dependency — `fetch` plus an
  API key header. Easy to keep the provider surface small (see below).

## Cost and limits

- Free tier: 500,000 characters/month, rate-limited. No spend risk — the
  local `.env` key is a `:fx`-suffixed Free-tier key.
- If usage ever approaches the free limit (extremely unlikely at this
  project's content volume), DeepL Pro is pay-as-you-go with a published
  per-character rate — see https://www.deepl.com/pro-api for current
  pricing before upgrading.
- `DEEPL_API_ENDPOINT` (`free` | `pro`) is set explicitly, never inferred
  from the key's shape — the `:fx` suffix on Free-tier keys is an
  implementation detail DeepL could change, not a documented contract.

## Fallback / portability

The domain code never imports the DeepL SDK or talks to
`api(-free).deepl.com` directly. Every call goes through the small
interface in `scripts/i18n-providers/deepl.mjs`:

```js
{
  translateBatch(texts, { sourceLang, targetLang, glossaryId, context }): Promise<string[]>,
  ensureGlossary({ sourceLang, targetLang, entries, contentHash }): Promise<string>,
}
```

`scripts/i18n-translate.mjs`, the manifest logic, and the validation
pipeline (placeholders, protected spans, glossary preservation) only know
about this interface. Swapping providers — Google Cloud Translation, an
LLM-based translator, or anything else — means writing one new file that
implements the same two functions; nothing else in the pipeline changes.

Google Cloud Translation and LLM-based translation were considered and
explicitly deferred (not rejected) — see the issue's "Fora de escopo".
Google Cloud lacks DeepL's glossary ergonomics for this use case; an LLM
provider would need its own prompt-based validation story instead of a
native glossary API. Neither is needed at this project's current scale.

## Consequences

- A GitHub account with write access must add `DEEPL_API_KEY` as a
  repository secret before the `i18n-translate` workflow can run for
  real — it is never available to CI triggered by `push`/`pull_request`,
  by design (see `.github/workflows/i18n-translate.yml`).
- The first real workflow run creates one DeepL glossary resource in the
  configured account (named `portfolio-i18n-PT-EN-US-<hash>`); later runs
  reuse it unless `i18n/glossary.json`'s preserve/preferred entries
  change, in which case a new one is created and the old one is pruned.
