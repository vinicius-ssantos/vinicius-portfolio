#!/usr/bin/env node
// i18n:check (#52) — the command CI runs on every PR (no secret required,
// safe for fork PRs). Wraps i18n:quality's structural/glossary gate and
// adds a translation-manifest health report.
//
// The manifest is opt-in: only keys ever touched by `i18n:translate` or
// `i18n:review` are tracked. A hand-written key pair with no manifest
// entry at all is completely normal (most of messages/*.json today was
// authored that way) and must never fail this gate. Manifest findings
// (stale reviewed entries, keys removed from pt.json but still tracked)
// are surfaced as warnings only.
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { checkMessageCatalogs } from "./i18n-quality-lib.mjs";
import { flattenMessages } from "./i18n-lib.mjs";
import { loadManifest, classifyEntries, DEFAULT_MANIFEST_PATH } from "./i18n-manifest.mjs";

const { errors, warnings, keyCount } = checkMessageCatalogs();

if (existsSync(DEFAULT_MANIFEST_PATH)) {
  const pt = JSON.parse(readFileSync("messages/pt.json", "utf8"));
  const ptFlat = flattenMessages(pt);
  const manifest = loadManifest();
  const { entries, removed } = classifyEntries(ptFlat, manifest);

  const stale = Object.entries(entries).filter(([, e]) => e.status === "stale");
  for (const [key] of stale) {
    warnings.push(`${key}: reviewed translation is stale (source changed since it was reviewed)`);
  }
  for (const key of removed) {
    warnings.push(`${key}: tracked in the translation manifest but no longer present in pt.json`);
  }
}

for (const w of warnings) console.warn(`⚠ ${w}`);

if (errors.length > 0) {
  console.error(`\n✗ i18n:check found ${errors.length} blocking issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ i18n:check passed — ${keyCount} keys checked, ${warnings.length} warning(s).`);
