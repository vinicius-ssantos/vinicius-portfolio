#!/usr/bin/env node
// Appends any env var used by the app that's missing from .env.example.
// Never rewrites existing lines, so committed comments/documentation are
// preserved — this only fills gaps, it doesn't regenerate the file.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { ENV_VARS } from "./env-vars.mjs";

const path = ".env.example";
const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
const documentedKeys = new Set([...existing.matchAll(/^([A-Z_][A-Z0-9_]*)=/gm)].map((m) => m[1]));

const missing = ENV_VARS.filter((v) => !documentedKeys.has(v.name));

if (missing.length === 0) {
  console.log(`${path} already documents every known env var.`);
  process.exit(0);
}

if (!existsSync(path)) {
  writeFileSync(path, "");
}

const additions = missing.map((v) => `\n# ${v.note}\n${v.name}=\n`).join("");

appendFileSync(path, additions);
console.log(
  `Added ${missing.length} missing var(s) to ${path}: ${missing.map((v) => v.name).join(", ")}`,
);
