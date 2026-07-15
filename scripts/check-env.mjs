#!/usr/bin/env node
// Cross-platform env check — warns about missing optional vars, fails only
// on missing required ones. Never assumes `.env` must exist: every var in
// this project currently has a documented fallback.
import { existsSync, readFileSync } from "node:fs";
import { ENV_VARS } from "./env-vars.mjs";

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const keys = new Set();
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) keys.add(match[1]);
  }
  return keys;
}

const fileKeys = parseEnvFile(".env");

let hasMissingRequired = false;

if (!existsSync(".env")) {
  console.warn(
    "⚠ .env not found — copy .env.example to .env if you need any of the optional vars below.",
  );
}

for (const { name, required, note } of ENV_VARS) {
  const isSet = Boolean(process.env[name]) || fileKeys.has(name);
  if (isSet) continue;
  if (required) {
    console.error(`✗ ${name} is not set (required). ${note}`);
    hasMissingRequired = true;
  } else {
    console.warn(`⚠ ${name} is not set (optional) — ${note}.`);
  }
}

if (hasMissingRequired) {
  process.exit(1);
}
