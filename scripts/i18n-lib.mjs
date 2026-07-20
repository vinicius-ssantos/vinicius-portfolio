// Shared helpers for the i18n quality gate — used by scripts/i18n-quality.mjs
// (Node CLI, JSON catalogs only) and by vitest tests that also check the
// TypeScript content files (src/content/__tests__/i18n-glossary.test.ts),
// which need a real module loader to read `get*(lang)` output and so can't
// run from a plain Node script.
import { readFileSync } from "node:fs";

export function loadGlossary(path = "i18n/glossary.json") {
  return JSON.parse(readFileSync(path, "utf8"));
}

/** Recursively collects every leaf key path ("a.b.c") -> string value. */
export function flattenMessages(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(out, flattenMessages(value, path));
    } else {
      out[path] = value;
    }
  }
  return out;
}

/**
 * Extracts ICU MessageFormat placeholder names from a string, e.g.
 * "Hello {name}" -> ["name"], "{count, plural, one {# item} other {# items}}" -> ["count"].
 * Only the top-level argument names matter for parity — nested plural/select
 * option text isn't itself a placeholder.
 */
export function extractPlaceholders(text) {
  if (typeof text !== "string") return [];
  const names = new Set();
  for (const match of text.matchAll(/\{\s*([a-zA-Z0-9_]+)/g)) {
    names.add(match[1]);
  }
  return [...names].sort();
}

const URL_RE = /https?:\/\/[^\s")\]}]+/g;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const CODE_SPAN_RE = /`[^`]+`/g;

/** Extracts URLs, emails, and inline code spans — content that must survive translation byte-for-byte. */
export function extractProtectedSpans(text) {
  if (typeof text !== "string") return { urls: [], emails: [], codeSpans: [] };
  return {
    urls: text.match(URL_RE) ?? [],
    emails: text.match(EMAIL_RE) ?? [],
    codeSpans: text.match(CODE_SPAN_RE) ?? [],
  };
}

/**
 * Checks `text` against the glossary. Returns violations only for `forbidden`
 * matches and `preserve` terms that appear to have been altered (the exact
 * source string is absent from a same-language check, or the target isn't
 * present in a cross-language check — callers decide which side to check).
 * `preferred`/`contextual` entries never block; they're reported separately
 * as informational matches so callers can warn without failing the gate.
 */
export function checkGlossary(text, glossary) {
  const violations = [];
  const info = [];
  if (typeof text !== "string" || !text) return { violations, info };

  for (const entry of glossary.entries) {
    if (glossaryPattern(entry).test(text)) {
      if (entry.mode === "forbidden") {
        violations.push({ entry, reason: `forbidden term "${entry.source}" found` });
      } else {
        info.push({ entry });
      }
    }
  }

  return { violations, info };
}

/**
 * Whether `entry.target` appears verbatim in `text` — respecting
 * `caseSensitive` the same way matching the source term does. Plain
 * `string.includes()` is always case-sensitive, so callers checking a
 * case-insensitive `preserve` entry (e.g. target "case study" against an
 * actual "Case study") must use this instead.
 */
export function glossaryTargetPresent(text, entry) {
  return glossaryPattern({ ...entry, source: entry.target }).test(text);
}

/**
 * Word-boundary-anchored so short terms (e.g. "age", "Just") don't match as
 * a substring of an unrelated word — "age" must not match inside "abordagem".
 */
function glossaryPattern(entry) {
  const flags = entry.caseSensitive ? "" : "i";
  return new RegExp(`\\b${escapeRegExp(entry.source)}\\b`, flags);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
