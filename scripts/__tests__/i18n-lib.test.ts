import { describe, expect, it } from "vitest";
import {
  checkGlossary,
  extractPlaceholders,
  extractProtectedSpans,
  flattenMessages,
  glossaryTargetPresent,
  type Glossary,
  type GlossaryEntry,
  type GlossaryMatch,
} from "../i18n-lib.mjs";

describe("flattenMessages", () => {
  it("flattens nested objects into dotted key paths", () => {
    expect(flattenMessages({ a: { b: "x", c: { d: "y" } } })).toEqual({
      "a.b": "x",
      "a.c.d": "y",
    });
  });
});

describe("extractPlaceholders", () => {
  it("extracts a simple {name} placeholder", () => {
    expect(extractPlaceholders("Hello {name}")).toEqual(["name"]);
  });

  it("extracts the argument name from ICU plural/select without nested option text", () => {
    expect(extractPlaceholders("{count, plural, one {# item} other {# items}}")).toEqual(["count"]);
  });

  it("returns a sorted, deduplicated list for multiple placeholders", () => {
    expect(extractPlaceholders("{b} and {a} and {a}")).toEqual(["a", "b"]);
  });

  it("returns an empty array for plain text", () => {
    expect(extractPlaceholders("No placeholders here")).toEqual([]);
  });
});

describe("extractProtectedSpans", () => {
  it("extracts URLs", () => {
    expect(extractProtectedSpans("See https://example.com/docs for more.").urls).toEqual([
      "https://example.com/docs",
    ]);
  });

  it("extracts emails", () => {
    expect(extractProtectedSpans("Contact me at hi@example.com.").emails).toEqual([
      "hi@example.com",
    ]);
  });

  it("extracts inline code spans", () => {
    expect(extractProtectedSpans("Run `npm test` first.").codeSpans).toEqual(["`npm test`"]);
  });

  it("returns empty arrays for plain text", () => {
    expect(extractProtectedSpans("Nothing special here.")).toEqual({
      urls: [],
      emails: [],
      codeSpans: [],
    });
  });
});

describe("checkGlossary", () => {
  const glossary: Glossary = {
    entries: [
      { source: "age", target: "age", mode: "preserve", caseSensitive: true },
      { source: "case study", target: "case study", mode: "preserve", caseSensitive: false },
      { source: "world-class", target: "world-class", mode: "forbidden", caseSensitive: false },
      { source: "observability", target: "observability", mode: "preferred", caseSensitive: false },
    ],
  };

  it("does not match a preserve term that's merely a substring of another word", () => {
    // Regression test: "age" previously matched inside "abordagem" (PT for
    // "approach") because the pattern had no word-boundary anchoring.
    const { info } = checkGlossary("A abordagem completa.", glossary);
    expect(info.map((i: GlossaryMatch) => i.entry.source)).not.toContain("age");
  });

  it("matches a preserve term as a whole word", () => {
    const { info } = checkGlossary("SOPS + age for secrets.", glossary);
    expect(info.map((i: GlossaryMatch) => i.entry.source)).toContain("age");
  });

  it("flags a forbidden term as a violation", () => {
    const { violations } = checkGlossary("A world-class engineer.", glossary);
    expect(violations).toHaveLength(1);
    expect(violations[0]?.entry.source).toBe("world-class");
  });

  it("reports a preferred term as info, never as a violation", () => {
    const { violations, info } = checkGlossary("Focused on observability.", glossary);
    expect(violations).toEqual([]);
    expect(info.map((i: GlossaryMatch) => i.entry.source)).toContain("observability");
  });

  it("returns nothing for empty or non-string input", () => {
    expect(checkGlossary("", glossary)).toEqual({ violations: [], info: [] });
  });
});

describe("glossaryTargetPresent", () => {
  it("matches case-insensitively when the entry isn't case-sensitive", () => {
    // Regression test: string.includes() is always case-sensitive, so a
    // case-insensitive entry with target "case study" previously failed to
    // match the real catalog value "Case study".
    const entry: GlossaryEntry = {
      source: "case study",
      target: "case study",
      mode: "preserve",
      caseSensitive: false,
    };
    expect(glossaryTargetPresent("Deep dive: Case study", entry)).toBe(true);
  });

  it("requires exact case when the entry is case-sensitive", () => {
    const entry: GlossaryEntry = {
      source: "k3s",
      target: "k3s",
      mode: "preserve",
      caseSensitive: true,
    };
    expect(glossaryTargetPresent("Running K3S here", entry)).toBe(false);
    expect(glossaryTargetPresent("Running k3s here", entry)).toBe(true);
  });

  it("does not match the target as a substring of another word", () => {
    const entry: GlossaryEntry = {
      source: "age",
      target: "age",
      mode: "preserve",
      caseSensitive: true,
    };
    expect(glossaryTargetPresent("The approach section", entry)).toBe(false);
  });
});
