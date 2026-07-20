/**
 * Runs the same glossary rules scripts/i18n-quality.mjs applies to
 * messages/*.json against the domain content in src/content/*.ts —
 * that content is TypeScript, not JSON, so it needs a real module loader
 * (this vitest file) rather than the plain-Node CLI script.
 */
import { describe, expect, it } from "vitest";
import { checkGlossary, glossaryTargetPresent, loadGlossary } from "../../../scripts/i18n-lib.mjs";
import { getProfile, getExperience, getEducation, getProjects } from "@/content";

const glossary = loadGlossary();

/** Every translatable string produced by the content layer, per locale. */
function collectStrings(lang: "pt" | "en"): Record<string, string> {
  const out: Record<string, string> = {};
  const profile = getProfile(lang);
  out["profile.role"] = profile.role;
  out["profile.location"] = profile.location;
  out["profile.pitch"] = profile.pitch;
  out["profile.longPitch"] = profile.longPitch;
  out["profile.careerPath"] = profile.careerPath;
  out["profile.philosophy"] = profile.philosophy;
  profile.currentlyLearning.forEach((item, i) => {
    out[`profile.currentlyLearning.${i}.topic`] = item.topic;
    out[`profile.currentlyLearning.${i}.detail`] = item.detail;
  });

  getExperience(lang).forEach((exp) => {
    out[`experience.${exp.id}.role`] = exp.role;
    out[`experience.${exp.id}.summary`] = exp.summary;
    exp.bullets.forEach((b, i) => (out[`experience.${exp.id}.bullets.${i}`] = b));
  });

  getEducation(lang).forEach((e) => {
    out[`education.${e.id}.degree`] = e.degree;
  });

  getProjects(lang).forEach((p) => {
    out[`projects.${p.slug}.tagline`] = p.tagline;
    out[`projects.${p.slug}.description`] = p.description;
    out[`projects.${p.slug}.problem`] = p.problem;
    out[`projects.${p.slug}.role`] = p.role;
    p.approach.forEach((a, i) => (out[`projects.${p.slug}.approach.${i}`] = a));
    p.highlights.forEach((h, i) => (out[`projects.${p.slug}.highlights.${i}`] = h));
    if (p.caseStudy) {
      out[`projects.${p.slug}.caseStudy.lessonsLearned`] = p.caseStudy.lessonsLearned;
    }
  });

  return out;
}

describe("domain content vs. i18n glossary", () => {
  it("has no forbidden terms in PT or EN content", () => {
    const violations: string[] = [];
    for (const lang of ["pt", "en"] as const) {
      const strings = collectStrings(lang);
      for (const [key, text] of Object.entries(strings)) {
        const { violations: v } = checkGlossary(text, glossary);
        for (const violation of v) violations.push(`[${lang}] ${key}: ${violation.reason}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("preserves every `preserve`-mode glossary term found in PT verbatim in the matching EN string", () => {
    const ptStrings = collectStrings("pt");
    const enStrings = collectStrings("en");
    const failures: string[] = [];

    for (const [key, ptText] of Object.entries(ptStrings)) {
      const enText = enStrings[key];
      if (enText === undefined) continue; // structural parity is a separate concern
      const { info } = checkGlossary(ptText, glossary);
      for (const { entry } of info) {
        if (entry.mode === "preserve" && !glossaryTargetPresent(enText, entry)) {
          failures.push(
            `${key}: "${entry.source}" not preserved verbatim in en ("${entry.target}")`,
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
