#!/usr/bin/env node
// i18n:review (#52) — the ONLY way a translation becomes "reviewed". Marks
// one or more keys as human-approved: records the current source/target
// hashes so the entry survives future runs untouched, until the pt.json
// source changes again (at which point it becomes "stale", not silently
// regenerated). No automation calls this — it's a deliberate human action.
import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { flattenMessages, getNested } from "./i18n-lib.mjs";
import { loadManifest, saveManifest, computeHash } from "./i18n-manifest.mjs";

const PT_PATH = "messages/pt.json";
const EN_PATH = "messages/en.json";

export function runReview({
  keys,
  ptPath = PT_PATH,
  enPath = EN_PATH,
  manifestPath = undefined,
  log = console.log,
  error = console.error,
}) {
  if (!keys || keys.length === 0) {
    error("✗ i18n:review requires at least one --key=<dotted.key>.");
    return 1;
  }

  const pt = JSON.parse(readFileSync(ptPath, "utf8"));
  const en = JSON.parse(readFileSync(enPath, "utf8"));
  const ptFlat = flattenMessages(pt);
  const manifest = loadManifest(manifestPath);

  const errors = [];
  const now = new Date().toISOString().slice(0, 10);

  for (const key of keys) {
    const sourceText = ptFlat[key];
    const targetText = getNested(en, key);
    if (typeof sourceText !== "string") {
      errors.push(`${key}: not found in ${ptPath}`);
      continue;
    }
    if (typeof targetText !== "string" || !targetText.trim()) {
      errors.push(
        `${key}: no translated value found in ${enPath} — translate it before marking it reviewed`,
      );
      continue;
    }
    manifest[key] = {
      sourceHash: computeHash(sourceText),
      targetHash: computeHash(targetText),
      status: "reviewed",
      provider: manifest[key]?.provider ?? "deepl",
      updatedAt: now,
    };
  }

  if (errors.length > 0) {
    error(`✗ i18n:review could not mark ${errors.length} key(s) reviewed:`);
    for (const e of errors) error(`  - ${e}`);
    return 1;
  }

  saveManifest(manifest, manifestPath);
  log(`✓ i18n:review — marked ${keys.length} key(s) reviewed.`);
  return 0;
}

async function main() {
  const { values } = parseArgs({ options: { key: { type: "string", multiple: true } } });
  process.exit(runReview({ keys: values.key ?? [] }));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
