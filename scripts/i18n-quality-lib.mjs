// Pure structural + glossary checks for messages/{pt,en}.json (#55) —
// extracted so both `i18n:quality` (standalone CLI, unchanged behavior)
// and `i18n:check` (#52's CI-safe wrapper, adds manifest health) share one
// implementation instead of two copies that could drift apart.
import { readFileSync } from "node:fs";
import {
  loadGlossary,
  flattenMessages,
  extractPlaceholders,
  extractProtectedSpans,
  checkGlossary,
  glossaryTargetPresent,
} from "./i18n-lib.mjs";

export function checkMessageCatalogs({
  ptPath = "messages/pt.json",
  enPath = "messages/en.json",
  glossary = loadGlossary(),
} = {}) {
  const pt = JSON.parse(readFileSync(ptPath, "utf8"));
  const en = JSON.parse(readFileSync(enPath, "utf8"));

  const ptFlat = flattenMessages(pt);
  const enFlat = flattenMessages(en);

  const errors = [];
  const warnings = [];

  const ptKeys = new Set(Object.keys(ptFlat));
  const enKeys = new Set(Object.keys(enFlat));
  for (const key of ptKeys) if (!enKeys.has(key)) errors.push(`missing in en.json: ${key}`);
  for (const key of enKeys)
    if (!ptKeys.has(key)) errors.push(`extra in en.json (not in pt.json): ${key}`);

  for (const key of ptKeys) {
    if (!enKeys.has(key)) continue;
    const ptValue = ptFlat[key];
    const enValue = enFlat[key];

    if (ptValue === "") errors.push(`empty value in pt.json: ${key}`);
    if (enValue === "") errors.push(`empty value in en.json: ${key}`);
    if (typeof ptValue !== "string" || typeof enValue !== "string") continue;

    const ptPlaceholders = extractPlaceholders(ptValue);
    const enPlaceholders = extractPlaceholders(enValue);
    if (ptPlaceholders.join(",") !== enPlaceholders.join(",")) {
      errors.push(
        `placeholder mismatch at ${key}: pt=[${ptPlaceholders.join(", ")}] en=[${enPlaceholders.join(", ")}]`,
      );
    }

    const ptSpans = extractProtectedSpans(ptValue);
    const enSpans = extractProtectedSpans(enValue);
    for (const kind of /** @type {const} */ (["urls", "emails", "codeSpans"])) {
      for (const span of ptSpans[kind]) {
        if (!enSpans[kind].includes(span)) {
          errors.push(
            `${kind.slice(0, -1)} from pt.json missing verbatim in en.json at ${key}: ${span}`,
          );
        }
      }
    }

    const ptCheck = checkGlossary(ptValue, glossary);
    const enCheck = checkGlossary(enValue, glossary);
    for (const v of [...ptCheck.violations, ...enCheck.violations]) {
      errors.push(`${key}: ${v.reason}`);
    }
    for (const { entry } of ptCheck.info) {
      if (entry.mode === "preserve" && !glossaryTargetPresent(enValue, entry)) {
        errors.push(
          `${key}: preserve term "${entry.source}" not found verbatim in en.json ("${entry.target}")`,
        );
      }
    }

    if (ptValue.length >= 20) {
      const ratio = enValue.length / ptValue.length;
      if (ratio > 2.5 || ratio < 0.4) {
        warnings.push(
          `${key}: unusually different length (pt=${ptValue.length}, en=${enValue.length}) — worth a look`,
        );
      }
    }
  }

  return { errors, warnings, keyCount: ptKeys.size };
}
