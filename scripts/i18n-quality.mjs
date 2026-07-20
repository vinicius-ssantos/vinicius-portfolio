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
import { checkMessageCatalogs } from "./i18n-quality-lib.mjs";

const { errors, warnings, keyCount } = checkMessageCatalogs();

for (const w of warnings) console.warn(`⚠ ${w}`);

if (errors.length > 0) {
  console.error(`\n✗ i18n:quality found ${errors.length} blocking issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ i18n:quality passed — ${keyCount} keys checked, ${warnings.length} warning(s).`);
