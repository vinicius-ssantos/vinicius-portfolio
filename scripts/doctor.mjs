#!/usr/bin/env node
// Cross-platform health check.
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

console.log("=== Node ===");
console.log(process.version);

console.log("=== npm ===");
console.log(execSync("npm --version").toString().trim());

console.log("=== .env ===");
console.log(existsSync(".env") ? "found" : "missing (optional — see .env.example)");

console.log("=== .next ===");
console.log(existsSync(".next") ? "build exists" : "no build yet (run: npm run build)");
