#!/usr/bin/env node
// i18n:status (#52) — read-only report of translation state per key.
// No network calls, no secret required.
import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { flattenMessages } from "./i18n-lib.mjs";
import { loadManifest, classifyEntries } from "./i18n-manifest.mjs";

const PT_PATH = "messages/pt.json";

export function runStatus({ only, ptPath = PT_PATH, log = console.log }) {
  const pt = JSON.parse(readFileSync(ptPath, "utf8"));
  const ptFlat = flattenMessages(pt);
  const manifest = loadManifest();
  const { entries, removed } = classifyEntries(ptFlat, manifest);

  const rows = Object.entries(entries)
    .map(([key, e]) => ({ key, status: e.status }))
    .concat(removed.map((key) => ({ key, status: "removed" })));

  const filtered = only ? rows.filter((r) => r.status === only) : rows;

  if (filtered.length === 0) {
    log(only ? `No entries with status "${only}".` : "No entries.");
    return 0;
  }

  const counts = rows.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  log(
    Object.entries(counts)
      .map(([status, count]) => `${status}: ${count}`)
      .join(" · "),
  );
  log("");
  for (const row of filtered.sort((a, b) => a.key.localeCompare(b.key))) {
    log(`  [${row.status}] ${row.key}`);
  }
  return 0;
}

async function main() {
  const { values } = parseArgs({ options: { only: { type: "string" } } });
  process.exit(runStatus({ only: values.only }));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
