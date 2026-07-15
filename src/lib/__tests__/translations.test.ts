import { describe, it, expect } from "vitest";
import { translations } from "@/lib/translations";

describe("translations", () => {
  it("en and pt expose the same set of top-level sections", () => {
    expect(Object.keys(translations.en).sort()).toEqual(Object.keys(translations.pt).sort());
  });

  it("experience.description doesn't hardcode a relative year count that will go stale", () => {
    // Regression guard for issue #11: the copy previously said "Five years" /
    // "Cinco anos", which drifted out of sync with the dynamically computed
    // stat as time passed. Calendar years ("since 2021") don't go stale.
    expect(translations.en.experience.description).not.toMatch(/\bfive years\b/i);
    expect(translations.pt.experience.description).not.toMatch(/\bcinco anos\b/i);
  });
});
