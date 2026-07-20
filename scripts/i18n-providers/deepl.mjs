// DeepL provider (#52) — the only place that knows about DeepL's HTTP
// contract. Everything else in the i18n CLI talks to the small
// `translateBatch`/`ensureGlossary` interface so swapping providers later
// (see docs/adr/0001-deepl-translation-provider.md) never touches the
// manifest/CLI logic.
const ENDPOINTS = {
  free: "https://api-free.deepl.com",
  pro: "https://api.deepl.com",
};

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_RETRIES = 3;
const GLOSSARY_NAME_PREFIX = "portfolio-i18n";

/**
 * `endpoint` ("free" | "pro") must be passed explicitly — DeepL API keys for
 * Free accounts happen to end in ":fx" today, but inferring the tier from
 * key shape is an undocumented implementation detail, not a contract.
 */
export function createDeepLProvider({
  apiKey,
  endpoint,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxRetries = DEFAULT_MAX_RETRIES,
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}) {
  if (!apiKey) throw new Error("createDeepLProvider: apiKey is required");
  if (endpoint !== "free" && endpoint !== "pro") {
    throw new Error(
      `createDeepLProvider: endpoint must be "free" or "pro", got ${JSON.stringify(endpoint)}`,
    );
  }
  const baseUrl = ENDPOINTS[endpoint];

  async function request(path, { method = "POST", body } = {}) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetchImpl(`${baseUrl}${path}`, {
          method,
          headers: {
            Authorization: `DeepL-Auth-Key ${apiKey}`,
            ...(body ? { "Content-Type": "application/json" } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429) {
          if (attempt === maxRetries) throw new DeepLError("rate-limited", 429);
          const retryAfterHeader = res.headers.get("retry-after");
          const retryAfterMs = retryAfterHeader
            ? Number(retryAfterHeader) * 1000
            : 2 ** attempt * 1000;
          await sleepImpl(retryAfterMs);
          continue;
        }

        if (res.status >= 500) {
          if (attempt === maxRetries) throw new DeepLError("provider-unavailable", res.status);
          await sleepImpl(2 ** attempt * 500);
          continue;
        }

        if (!res.ok) {
          // 4xx other than 429 is a validation/auth error — never worth a
          // retry, and never log the body (may echo back request content).
          throw new DeepLError("request-rejected", res.status);
        }

        if (res.status === 204) return null;
        return await res.json();
      } catch (err) {
        clearTimeout(timeout);
        if (err instanceof DeepLError) throw err;
        if (err?.name === "AbortError") {
          lastError = new DeepLError("timeout", undefined);
          if (attempt === maxRetries) throw lastError;
          await sleepImpl(2 ** attempt * 500);
          continue;
        }
        throw err;
      }
    }
    throw lastError ?? new DeepLError("unknown", undefined);
  }

  return {
    /**
     * Translates a batch of plain strings. `context` (optional) is passed
     * once for the whole batch — DeepL uses it as surrounding context, not
     * per-item, so callers should group texts that share one context.
     */
    async translateBatch(texts, { sourceLang, targetLang, glossaryId, context }) {
      if (texts.length === 0) return [];
      const data = await request("/v2/translate", {
        body: {
          text: texts,
          source_lang: sourceLang,
          target_lang: targetLang,
          ...(glossaryId ? { glossary_id: glossaryId } : {}),
          ...(context ? { context } : {}),
          preserve_formatting: true,
        },
      });
      return data.translations.map((t) => t.text);
    },

    /**
     * Returns a glossary id for the given source→target entry pairs,
     * reusing an existing DeepL glossary when one with matching content
     * already exists (name-encodes a content hash, so a changed glossary
     * naturally gets a new id instead of silently reusing stale terms).
     * Best-effort prunes older glossaries for the same language pair.
     *
     * DeepL's (classic v2) Glossary API only accepts base language codes —
     * passing a regional variant like "EN-US" as target_lang is rejected
     * with a 400, even though /v2/translate itself requires exactly that
     * variant. Glossary matching is base-language-only regardless, so this
     * normalizes here rather than pushing the distinction onto callers.
     */
    async ensureGlossary({ sourceLang, targetLang, entries, contentHash }) {
      const glossarySourceLang = sourceLang.split("-")[0];
      const glossaryTargetLang = targetLang.split("-")[0];
      const name = `${GLOSSARY_NAME_PREFIX}-${glossarySourceLang}-${glossaryTargetLang}-${contentHash}`;
      const list = await request("/v2/glossaries", { method: "GET" }).catch(() => null);
      const existing = list?.glossaries?.find((g) => g.name === name);
      if (existing) return existing.glossary_id;

      const created = await request("/v2/glossaries", {
        body: {
          name,
          source_lang: glossarySourceLang,
          target_lang: glossaryTargetLang,
          entries: entries.map(([source, target]) => `${source}\t${target}`).join("\n"),
          entries_format: "tsv",
        },
      });

      const stalePrefix = `${GLOSSARY_NAME_PREFIX}-${glossarySourceLang}-${glossaryTargetLang}-`;
      const stale = (list?.glossaries ?? []).filter(
        (g) => g.name.startsWith(stalePrefix) && g.name !== name,
      );
      await Promise.allSettled(
        stale.map((g) => request(`/v2/glossaries/${g.glossary_id}`, { method: "DELETE" })),
      );

      return created.glossary_id;
    },
  };
}

export class DeepLError extends Error {
  constructor(reason, status) {
    super(`DeepL request failed: ${reason}${status ? ` (HTTP ${status})` : ""}`);
    this.name = "DeepLError";
    this.reason = reason;
    this.status = status;
  }
}
