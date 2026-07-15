#!/usr/bin/env node
// Cross-platform clean — safe no-op when the target doesn't exist.
import { rmSync } from "node:fs";

const targets = {
  build: [".next"],
  cache: ["node_modules/.cache"],
  all: [".next", "node_modules/.cache", "node_modules"],
};

const mode = process.argv[2] ?? "build";
const paths = targets[mode];

if (!paths) {
  console.error(`Unknown clean target "${mode}". Use one of: ${Object.keys(targets).join(", ")}`);
  process.exit(1);
}

for (const path of paths) {
  rmSync(path, { recursive: true, force: true });
  console.log(`removed ${path} (if it existed)`);
}
