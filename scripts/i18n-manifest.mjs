// Manifest of translation state (#52) — tracks a stable hash per pt.json key
// so the DeepL CLI only ever sends new/changed content, and so a reviewed
// translation is never silently overwritten once its source has moved on.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

export const DEFAULT_MANIFEST_PATH = "i18n/translation-manifest.json";

export function computeHash(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

export function loadManifest(path = DEFAULT_MANIFEST_PATH) {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

/**
 * Serializes with sorted keys and stable formatting so running the CLI
 * twice with no source changes produces no diff.
 */
export function saveManifest(manifest, path = DEFAULT_MANIFEST_PATH) {
  const sorted = Object.fromEntries(
    Object.keys(manifest)
      .sort()
      .map((key) => [key, manifest[key]]),
  );
  writeFileSync(path, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
}

/**
 * Classifies every key in `sourceFlat` (flattened pt.json) against the
 * manifest:
 *  - "new": no manifest entry yet.
 *  - "changed": manifest entry exists, but the source text changed and the
 *    entry was still machine-translated (safe to regenerate).
 *  - "stale": manifest entry exists, source text changed, but a human had
 *    marked the previous translation "reviewed" — never regenerated
 *    without an explicit --force-reviewed flag.
 *  - "reviewed": source unchanged, a human marked this entry reviewed.
 *  - "unchanged": source unchanged, still machine-translated.
 * Keys present in the manifest but absent from `sourceFlat` are reported
 * separately as "removed".
 */
export function classifyEntries(sourceFlat, manifest) {
  const entries = {};
  for (const [key, sourceText] of Object.entries(sourceFlat)) {
    if (typeof sourceText !== "string") continue;
    const sourceHash = computeHash(sourceText);
    const previous = manifest[key];

    if (!previous) {
      entries[key] = { status: "new", sourceHash, previous: null };
    } else if (previous.sourceHash !== sourceHash) {
      entries[key] = {
        status: previous.status === "reviewed" ? "stale" : "changed",
        sourceHash,
        previous,
      };
    } else {
      entries[key] = {
        status: previous.status === "reviewed" ? "reviewed" : "unchanged",
        sourceHash,
        previous,
      };
    }
  }

  const removed = Object.keys(manifest).filter((key) => !(key in sourceFlat));
  return { entries, removed };
}

/** Keys that a translate run should actually send to the provider. */
export function selectTranslatable(entries, { forceReviewed = false } = {}) {
  return Object.entries(entries)
    .filter(
      ([, e]) =>
        e.status === "new" || e.status === "changed" || (forceReviewed && e.status === "stale"),
    )
    .map(([key]) => key);
}
