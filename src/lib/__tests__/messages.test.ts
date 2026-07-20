import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pt from "../../../messages/pt.json";

/** Recursively collects every leaf key path ("a.b.c") in a nested message object. */
function keyPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];

  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
    keyPaths(value, prefix ? `${prefix}.${key}` : key),
  );
}

describe("message catalogs (messages/pt.json, messages/en.json)", () => {
  it("have exactly the same set of keys — no missing, no extra", () => {
    const enKeys = new Set(keyPaths(en));
    const ptKeys = new Set(keyPaths(pt));

    const missingInPt = [...enKeys].filter((k) => !ptKeys.has(k));
    const extraInPt = [...ptKeys].filter((k) => !enKeys.has(k));

    expect(missingInPt, `pt.json is missing keys present in en.json`).toEqual([]);
    expect(extraInPt, `pt.json has keys not present in en.json`).toEqual([]);
  });

  it("has no empty string values in either catalog", () => {
    for (const [name, catalog] of [
      ["en", en],
      ["pt", pt],
    ] as const) {
      const empty = keyPaths(catalog).filter((path) => {
        const value = path.split(".").reduce<unknown>((acc, segment) => {
          return typeof acc === "object" && acc !== null
            ? (acc as Record<string, unknown>)[segment]
            : undefined;
        }, catalog);
        return value === "";
      });
      expect(empty, `${name}.json has empty-string values at: ${empty.join(", ")}`).toEqual([]);
    }
  });

  it("experience.description doesn't hardcode a relative year count that will go stale", () => {
    // Regression guard for issue #11: the copy previously said "Five years" /
    // "Cinco anos", which drifted out of sync with the dynamically computed
    // stat as time passed. Calendar years ("since 2021") don't go stale.
    expect(en.experience.description).not.toMatch(/\bfive years\b/i);
    expect(pt.experience.description).not.toMatch(/\bcinco anos\b/i);
  });
});
