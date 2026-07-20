#!/usr/bin/env node
// i18n quality gate (#55) — validates messages/{pt,en}.json for structural
// invariants and glossary compliance. Runs with no external service and no
// secret, so it's safe to run on every PR (including from forks) — see
// package.json's `i18n:quality` and `preflight`.
//
// Blocking (exit 1): key parity, empty values, ICU placeholder parity,
// protected-span (URL/email/code) parity, forbidden glossary terms,
// altered `preserve` glossary terms.
// Non-blocking (printed, exit 0): unusually large PT/EN length differences
// per key — a real signal worth a human look, but not something a naive
// length threshold should ever be allowed to fail CI over (see #55's own
// "heuristics warn, invariants block" rule).
import { readFileSync } from "node:fs";
import {
  loadGlossary,
  flattenMessages,
  extractPlaceholders,
  extractProtectedSpans,
  checkGlossary,
  glossaryTargetPresent,
} from "./i18n-lib.mjs";

const pt = JSON.parse(readFileSync("messages/pt.json", "utf8"));
const en = JSON.parse(readFileSync("messages/en.json", "utf8"));
const glossary = loadGlossary();

const ptFlat = flattenMessages(pt);
const enFlat = flattenMessages(en);

const errors = [];
const warnings = [];

// --- Key parity ---
const ptKeys = new Set(Object.keys(ptFlat));
const enKeys = new Set(Object.keys(enFlat));
for (const key of ptKeys) if (!enKeys.has(key)) errors.push(`missing in en.json: ${key}`);
for (const key of enKeys)
  if (!ptKeys.has(key)) errors.push(`extra in en.json (not in pt.json): ${key}`);

// --- Per-key checks (only where both sides have the key) ---
for (const key of ptKeys) {
  if (!enKeys.has(key)) continue;
  const ptValue = ptFlat[key];
  const enValue = enFlat[key];

  if (ptValue === "") errors.push(`empty value in pt.json: ${key}`);
  if (enValue === "") errors.push(`empty value in en.json: ${key}`);
  if (typeof ptValue !== "string" || typeof enValue !== "string") continue;

  // Placeholders (ICU args like {name}) must match exactly.
  const ptPlaceholders = extractPlaceholders(ptValue);
  const enPlaceholders = extractPlaceholders(enValue);
  if (ptPlaceholders.join(",") !== enPlaceholders.join(",")) {
    errors.push(
      `placeholder mismatch at ${key}: pt=[${ptPlaceholders.join(", ")}] en=[${enPlaceholders.join(", ")}]`,
    );
  }

  // URLs/emails/code spans present in the source must survive verbatim.
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

  // Glossary: forbidden terms block; preserve terms must survive verbatim.
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

  // Length heuristic — warning only, never blocks.
  if (ptValue.length >= 20) {
    const ratio = enValue.length / ptValue.length;
    if (ratio > 2.5 || ratio < 0.4) {
      warnings.push(
        `${key}: unusually different length (pt=${ptValue.length}, en=${enValue.length}) — worth a look`,
      );
    }
  }
}

for (const w of warnings) console.warn(`⚠ ${w}`);

if (errors.length > 0) {
  console.error(`\n✗ i18n:quality found ${errors.length} blocking issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ i18n:quality passed — ${ptKeys.size} keys checked, ${warnings.length} warning(s).`);
