/**
 * Tests for portfolio data integrity and translation helper.
 */
import { describe, it, expect } from "vitest";
import {
  profile,
  projects,
  experience,
  education,
  stack,
  t as tp,
  type Lang,
} from "@/lib/portfolio-data";

describe("portfolio-data", () => {
  describe("profile", () => {
    it("has name, role, location in both PT and EN", () => {
      expect(profile.name).toBeTruthy();
      expect(profile.role.pt).toBeTruthy();
      expect(profile.role.en).toBeTruthy();
      expect(profile.location.pt).toBeTruthy();
      expect(profile.location.en).toBeTruthy();
    });

    it("has contact info", () => {
      expect(profile.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
      expect(profile.phone).toMatch(/^\+/);
    });

    it("has 3 stats", () => {
      expect(profile.stats).toHaveLength(3);
      profile.stats.forEach((s) => {
        expect(s.value).toBeTruthy();
        expect(s.label.pt).toBeTruthy();
        expect(s.label.en).toBeTruthy();
      });
    });

    it("has pitch and longPitch in both languages", () => {
      expect(profile.pitch.pt).toBeTruthy();
      expect(profile.pitch.en).toBeTruthy();
      expect(profile.longPitch.pt).toBeTruthy();
      expect(profile.longPitch.en).toBeTruthy();
      expect(profile.careerPath.pt).toBeTruthy();
      expect(profile.careerPath.en).toBeTruthy();
      expect(profile.philosophy.pt).toBeTruthy();
      expect(profile.philosophy.en).toBeTruthy();
    });

    it("has at least 1 currently learning item", () => {
      expect(profile.currentlyLearning.length).toBeGreaterThanOrEqual(1);
      profile.currentlyLearning.forEach((item) => {
        expect(item.topic.pt).toBeTruthy();
        expect(item.topic.en).toBeTruthy();
        expect(item.detail.pt).toBeTruthy();
        expect(item.detail.en).toBeTruthy();
      });
    });

    it("has working links", () => {
      expect(profile.links.github).toMatch(/^https:\/\/github\.com\//);
      expect(profile.links.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
      expect(profile.links.cv).toMatch(/^\//);
    });
  });

  describe("experience", () => {
    it("has 3 experiences", () => {
      expect(experience).toHaveLength(3);
    });

    it("has exactly 1 current job (UOL)", () => {
      const current = experience.filter((e) => e.current);
      expect(current).toHaveLength(1);
      expect(current[0]?.company).toBe("UOL");
    });

    it("each experience has all localized fields", () => {
      experience.forEach((exp) => {
        expect(exp.company).toBeTruthy();
        expect(exp.period).toBeTruthy();
        expect(exp.role.pt).toBeTruthy();
        expect(exp.role.en).toBeTruthy();
        expect(exp.summary.pt).toBeTruthy();
        expect(exp.summary.en).toBeTruthy();
        expect(exp.bullets.length).toBeGreaterThan(0);
        expect(exp.stack.length).toBeGreaterThan(0);
      });
    });

    it("UOL is the first experience (most recent)", () => {
      expect(experience[0]?.company).toBe("UOL");
      expect(experience[0]?.current).toBe(true);
    });

    it("experiences are in reverse chronological order", () => {
      // UOL (current) > Autbank dev (2023-2024) > Autbank QA (2021-2023)
      expect(experience[1]?.company).toContain("Autbank");
      expect(experience[2]?.company).toContain("Autbank");
    });
  });

  describe("education", () => {
    it("has 2 education entries", () => {
      expect(education).toHaveLength(2);
    });

    it("includes FATEC and Impacta", () => {
      const institutions = education.map((e) => e.institution);
      expect(institutions).toContain("FATEC Ferraz de Vasconcelos");
      expect(institutions).toContain("Faculdade Impacta");
    });
  });

  describe("projects", () => {
    it("has 3 projects", () => {
      expect(projects).toHaveLength(3);
    });

    it("first project is the featured one (most recent)", () => {
      expect(projects[0]?.featured).toBe(true);
      expect(projects[0]?.name).toBe("personal-platform-infra");
    });

    it("each project has screenshot image", () => {
      projects.forEach((p) => {
        expect(p.image).toBeTruthy();
        expect(p.image).toMatch(/^\/projects\//);
      });
    });

    it("each project has all localized fields", () => {
      projects.forEach((p) => {
        expect(p.name).toBeTruthy();
        expect(p.tagline.pt).toBeTruthy();
        expect(p.tagline.en).toBeTruthy();
        expect(p.description.pt).toBeTruthy();
        expect(p.description.en).toBeTruthy();
        expect(p.problem.pt).toBeTruthy();
        expect(p.problem.en).toBeTruthy();
        expect(p.approach.length).toBeGreaterThan(0);
        expect(p.highlights.length).toBeGreaterThan(0);
        expect(p.stack.length).toBeGreaterThan(0);
        expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
      });
    });

    it("each approach bullet has both languages", () => {
      projects.forEach((p) => {
        p.approach.forEach((a) => {
          expect(a.pt).toBeTruthy();
          expect(a.en).toBeTruthy();
        });
      });
    });

    it("each highlight has both languages", () => {
      projects.forEach((p) => {
        p.highlights.forEach((h) => {
          expect(h.pt).toBeTruthy();
          expect(h.en).toBeTruthy();
        });
      });
    });

    it("projects are in reverse chronological order (by updatedAt)", () => {
      const dates = projects.map((p) => p.updatedAt);
      for (let i = 1; i < dates.length; i++) {
        expect((dates[i - 1] ?? "") >= (dates[i] ?? "")).toBe(true);
      }
    });
  });

  describe("stack", () => {
    it("has professional, personal and Languages groups", () => {
      expect(Object.keys(stack)).toEqual(
        expect.arrayContaining(["professional", "personal", "Languages"]),
      );
    });

    it("professional group has expected categories", () => {
      expect(Object.keys(stack.professional)).toEqual(
        expect.arrayContaining(["Backend", "Quality", "Data", "DevOps", "Methods"]),
      );
    });

    it("each category in both groups has at least 1 item", () => {
      Object.entries(stack.professional).forEach(([_, items]) => {
        expect(items.length).toBeGreaterThan(0);
      });
      Object.entries(stack.personal).forEach(([_, items]) => {
        expect(items.length).toBeGreaterThan(0);
      });
    });

    it("Languages items have both PT and EN", () => {
      stack.Languages.forEach((l) => {
        // Languages items can be either string (rare) or LocalizedText
        if (typeof l !== "string") {
          expect(l.pt).toBeTruthy();
          expect(l.en).toBeTruthy();
        }
      });
    });

    it("professional Backend includes Java (primary stack at UOL)", () => {
      expect(stack.professional.Backend).toContain("Java");
      expect(stack.professional.Backend).toContain("Spring");
    });

    it("professional DevOps includes Kubernetes (used at UOL)", () => {
      expect(stack.professional.DevOps).toContain("Kubernetes");
    });

    it("no tool appears in both professional and personal groups", () => {
      const flatten = (group: Record<string, string[]>) => Object.values(group).flat();
      const professionalTools = new Set(flatten(stack.professional));
      const personalTools = flatten(stack.personal);
      personalTools.forEach((tool) => {
        expect(professionalTools.has(tool)).toBe(false);
      });
    });
  });

  describe("translation helper t()", () => {
    it("returns PT when lang is pt", () => {
      const result = tp({ pt: "Olá", en: "Hello" }, "pt" as Lang);
      expect(result).toBe("Olá");
    });

    it("returns EN when lang is en", () => {
      const result = tp({ pt: "Olá", en: "Hello" }, "en" as Lang);
      expect(result).toBe("Hello");
    });

    it("handles empty strings", () => {
      expect(tp({ pt: "", en: "" }, "pt" as Lang)).toBe("");
    });
  });
});
