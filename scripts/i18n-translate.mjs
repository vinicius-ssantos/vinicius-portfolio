#!/usr/bin/env node
// i18n:translate (#52) — sends only new/changed messages/pt.json keys to
// DeepL, validates the response, and writes messages/en.json + the
// translation manifest. `--dry-run` never touches the network or the
// filesystem; a real run requires DEEPL_API_KEY (never available in CI —
// see .github/workflows/i18n-translate.yml, which is the only place this
// runs for real).
import { parseArgs } from "node:util";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  loadGlossary,
  flattenMessages,
  setNested,
  extractPlaceholders,
  extractProtectedSpans,
  checkGlossary,
  glossaryTargetPresent,
} from "./i18n-lib.mjs";
import {
  loadManifest,
  saveManifest,
  classifyEntries,
  selectTranslatable,
  computeHash,
} from "./i18n-manifest.mjs";
import { createDeepLProvider } from "./i18n-providers/deepl.mjs";

const PT_PATH = "messages/pt.json";
const EN_PATH = "messages/en.json";
const SOURCE_LANG = "PT";
const TARGET_LANG = "EN-US";
const MAX_BATCH_SIZE = 50; // DeepL's documented per-request text-array limit.

function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
  return out;
}

/** Groups keys by their top-level namespace so each DeepL request can carry one coherent `context` string. */
function groupByNamespace(keys) {
  const groups = new Map();
  for (const key of keys) {
    const namespace = key.split(".")[0];
    if (!groups.has(namespace)) groups.set(namespace, []);
    groups.get(namespace).push(key);
  }
  return groups;
}

export async function runTranslate({
  locale,
  dryRun,
  forceReviewed,
  provider,
  apiKeyPresent,
  ptPath = PT_PATH,
  enPath = EN_PATH,
  manifestPath = undefined,
  log = console.log,
  warn = console.warn,
  error = console.error,
}) {
  if (locale !== "en") {
    error(`i18n:translate only supports --locale=en (pt is the source). Got: ${locale}`);
    return 1;
  }

  const pt = JSON.parse(readFileSync(ptPath, "utf8"));
  const en = JSON.parse(readFileSync(enPath, "utf8"));
  const ptFlat = flattenMessages(pt);

  const manifest = loadManifest(manifestPath);
  const { entries, removed } = classifyEntries(ptFlat, manifest);
  const keysToTranslate = selectTranslatable(entries, { forceReviewed });

  if (removed.length > 0) {
    warn(`⚠ ${removed.length} key(s) removed from pt.json but still tracked in the manifest:`);
    for (const key of removed) warn(`  - ${key}`);
  }

  const staleKeys = Object.entries(entries).filter(([, e]) => e.status === "stale");
  if (staleKeys.length > 0 && !forceReviewed) {
    warn(
      `⚠ ${staleKeys.length} reviewed translation(s) are stale (source changed) but were left untouched — rerun with --force-reviewed to regenerate:`,
    );
    for (const [key] of staleKeys) warn(`  - ${key}`);
  }

  if (keysToTranslate.length === 0) {
    log("✓ i18n:translate — nothing to do, all entries up to date.");
    return 0;
  }

  const totalChars = keysToTranslate.reduce((sum, key) => sum + ptFlat[key].length, 0);

  if (dryRun) {
    log(
      `i18n:translate --dry-run — would translate ${keysToTranslate.length} key(s), ${totalChars} character(s):`,
    );
    for (const key of keysToTranslate)
      log(`  [${entries[key].status}] ${key} (${ptFlat[key].length} chars)`);
    return 0;
  }

  if (!apiKeyPresent) {
    error("✗ DEEPL_API_KEY is not set — required for a real (non-dry-run) i18n:translate run.");
    return 1;
  }

  const glossary = loadGlossary();
  const glossaryPairs = glossary.entries
    .filter((e) => e.mode === "preserve" || e.mode === "preferred")
    .map((e) => [e.source, e.target]);
  const glossaryContentHash = createHash("sha256")
    .update(JSON.stringify(glossaryPairs))
    .digest("hex")
    .slice(0, 16);

  let glossaryId;
  try {
    glossaryId = await provider.ensureGlossary({
      sourceLang: SOURCE_LANG,
      targetLang: TARGET_LANG,
      entries: glossaryPairs,
      contentHash: glossaryContentHash,
    });
  } catch (err) {
    warn(
      `⚠ Could not set up the DeepL glossary (${err.reason ?? err.message}) — continuing without it.`,
    );
  }

  const translated = {};
  const requestErrors = [];

  for (const [namespace, keys] of groupByNamespace(keysToTranslate)) {
    for (const keyBatch of chunk(keys, MAX_BATCH_SIZE)) {
      const texts = keyBatch.map((key) => ptFlat[key]);
      let results;
      try {
        results = await provider.translateBatch(texts, {
          sourceLang: SOURCE_LANG,
          targetLang: TARGET_LANG,
          glossaryId,
          context: `UI copy for the "${namespace}" section of a backend engineer's technical portfolio website.`,
        });
      } catch (err) {
        error(
          `✗ DeepL translation failed for namespace "${namespace}": ${err.reason ?? err.message}`,
        );
        return 1;
      }

      if (results.length !== texts.length) {
        error(
          `✗ DeepL returned a partial response for namespace "${namespace}": expected ${texts.length} translation(s), got ${results.length}.`,
        );
        return 1;
      }

      keyBatch.forEach((key, i) => (translated[key] = results[i]));
    }
  }

  for (const key of keysToTranslate) {
    const sourceText = ptFlat[key];
    const translatedText = translated[key];

    if (!translatedText || !translatedText.trim()) {
      requestErrors.push(`${key}: empty translation returned`);
      continue;
    }

    const sourcePlaceholders = extractPlaceholders(sourceText);
    const targetPlaceholders = extractPlaceholders(translatedText);
    if (sourcePlaceholders.join(",") !== targetPlaceholders.join(",")) {
      requestErrors.push(
        `${key}: placeholder mismatch — source=[${sourcePlaceholders.join(", ")}] target=[${targetPlaceholders.join(", ")}]`,
      );
      continue;
    }

    const sourceSpans = extractProtectedSpans(sourceText);
    const targetSpans = extractProtectedSpans(translatedText);
    let spanError = false;
    for (const kind of /** @type {const} */ (["urls", "emails", "codeSpans"])) {
      for (const span of sourceSpans[kind]) {
        if (!targetSpans[kind].includes(span)) {
          requestErrors.push(
            `${key}: ${kind.slice(0, -1)} "${span}" missing verbatim from the translation`,
          );
          spanError = true;
        }
      }
    }
    if (spanError) continue;

    const { violations, info } = checkGlossary(sourceText, glossary);
    if (violations.length > 0) {
      requestErrors.push(`${key}: ${violations[0].reason}`);
      continue;
    }
    let preserveError = false;
    for (const { entry } of info) {
      if (entry.mode === "preserve" && !glossaryTargetPresent(translatedText, entry)) {
        requestErrors.push(
          `${key}: preserve term "${entry.source}" not found verbatim in the translation`,
        );
        preserveError = true;
      }
    }
    if (preserveError) continue;
  }

  if (requestErrors.length > 0) {
    error(
      `\n✗ i18n:translate rejected ${requestErrors.length} translation(s) — no files were written:\n`,
    );
    for (const e of requestErrors) error(`  - ${e}`);
    return 1;
  }

  // Every key in keysToTranslate has a validated translation by this point —
  // any rejection above would have already returned before reaching here.
  const acceptedKeys = keysToTranslate;
  const now = new Date().toISOString().slice(0, 10);
  for (const key of acceptedKeys) {
    const translatedText = translated[key];
    setNested(en, key, translatedText);
    manifest[key] = {
      sourceHash: entries[key].sourceHash,
      targetHash: computeHash(translatedText),
      status: "machine",
      provider: "deepl",
      updatedAt: now,
    };
  }

  writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
  saveManifest(manifest, manifestPath);

  log(`✓ i18n:translate — wrote ${acceptedKeys.length} translation(s) to ${enPath}.`);
  return 0;
}

async function main() {
  const { values } = parseArgs({
    options: {
      locale: { type: "string", default: "en" },
      "dry-run": { type: "boolean", default: false },
      "force-reviewed": { type: "boolean", default: false },
    },
  });

  const apiKey = process.env.DEEPL_API_KEY;
  const endpoint = process.env.DEEPL_API_ENDPOINT === "pro" ? "pro" : "free";
  const provider = apiKey ? createDeepLProvider({ apiKey, endpoint }) : undefined;

  const exitCode = await runTranslate({
    locale: values.locale,
    dryRun: values["dry-run"],
    forceReviewed: values["force-reviewed"],
    provider,
    apiKeyPresent: Boolean(apiKey),
  });
  process.exit(exitCode);
}

// Only run as a CLI when invoked directly — importable for tests otherwise.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
