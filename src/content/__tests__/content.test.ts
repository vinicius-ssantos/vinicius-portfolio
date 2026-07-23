/**
 * Tests for portfolio content data integrity across both locales.
 */
import { describe, it, expect } from "vitest";
import {
  profile,
  getProfile,
  getExperience,
  getEducation,
  stack,
  getSpokenLanguages,
  type Project,
  getProjects,
  getFeaturedProject,
  getProjectBySlug,
  getVisibleProjects,
  isProjectVisible,
} from "@/content";

const LANGS = ["pt", "en"] as const;

describe("content", () => {
  describe("profile", () => {
    it("has contact info (neutral, locale-independent)", () => {
      expect(profile.name).toBeTruthy();
      expect(profile.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
      expect(profile.phone).toMatch(/^\+/);
    });

    it("has working links", () => {
      expect(profile.links.github).toMatch(/^https:\/\/github\.com\//);
      expect(profile.links.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
      expect(profile.links.cv).toMatch(/^\//);
    });

    for (const lang of LANGS) {
      it(`[${lang}] has role, location, pitch, longPitch, careerPath, philosophy`, () => {
        const p = getProfile(lang);
        expect(p.role).toBeTruthy();
        expect(p.location).toBeTruthy();
        expect(p.pitch).toBeTruthy();
        expect(p.longPitch).toBeTruthy();
        expect(p.careerPath).toBeTruthy();
        expect(p.philosophy).toBeTruthy();
      });

      it(`[${lang}] has 3 stats with label and value`, () => {
        const p = getProfile(lang);
        expect(p.stats).toHaveLength(3);
        p.stats.forEach((s) => {
          expect(s.value).toBeTruthy();
          expect(s.label).toBeTruthy();
        });
      });

      it(`[${lang}] has at least 1 currently-learning item`, () => {
        const p = getProfile(lang);
        expect(p.currentlyLearning.length).toBeGreaterThanOrEqual(1);
        p.currentlyLearning.forEach((item) => {
          expect(item.topic).toBeTruthy();
          expect(item.detail).toBeTruthy();
        });
      });
    }
  });

  describe("experience", () => {
    it("has 3 experiences", () => {
      expect(getExperience("en")).toHaveLength(3);
    });

    it("has exactly 1 current job (UOL)", () => {
      const current = getExperience("en").filter((e) => e.current);
      expect(current).toHaveLength(1);
      expect(current[0]?.company).toBe("UOL");
    });

    for (const lang of LANGS) {
      it(`[${lang}] each experience has role, summary, bullets, stack`, () => {
        getExperience(lang).forEach((exp) => {
          expect(exp.company).toBeTruthy();
          expect(exp.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          if (!exp.current) {
            expect(exp.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          }
          expect(exp.role).toBeTruthy();
          expect(exp.summary).toBeTruthy();
          expect(exp.bullets.length).toBeGreaterThan(0);
          expect(exp.stack.length).toBeGreaterThan(0);
        });
      });
    }

    it("experience date ranges are internally consistent", () => {
      getExperience("en").forEach((exp) => {
        if (exp.endDate) {
          expect(new Date(exp.startDate).getTime()).toBeLessThan(new Date(exp.endDate).getTime());
        }
      });
    });

    it("UOL is the first experience (most recent)", () => {
      const experience = getExperience("en");
      expect(experience[0]?.company).toBe("UOL");
      expect(experience[0]?.current).toBe(true);
    });

    it("experiences are in reverse chronological order", () => {
      // UOL (current) > Autbank dev (2023-2024) > Autbank QA (2021-2023)
      const experience = getExperience("en");
      expect(experience[1]?.company).toContain("Autbank");
      expect(experience[2]?.company).toContain("Autbank");
    });
  });

  describe("education", () => {
    it("has 2 education entries", () => {
      expect(getEducation("en")).toHaveLength(2);
    });

    it("includes FATEC and Impacta", () => {
      const institutions = getEducation("en").map((e) => e.institution);
      expect(institutions).toContain("FATEC Ferraz de Vasconcelos");
      expect(institutions).toContain("Faculdade Impacta");
    });

    for (const lang of LANGS) {
      it(`[${lang}] each entry has period and degree`, () => {
        getEducation(lang).forEach((e) => {
          expect(e.period).toBeTruthy();
          expect(e.degree).toBeTruthy();
        });
      });
    }
  });

  describe("projects", () => {
    it("has 4 projects", () => {
      expect(getProjects("en")).toHaveLength(4);
    });

    it("first project is the most recently updated one", () => {
      const projects = getProjects("en");
      expect(projects[0]?.name).toBe("Sentinel Ledger");
      expect(projects[0]?.updatedAt).toBe("2026-07-23");
    });

    it("each project has a screenshot image", () => {
      getProjects("en").forEach((p) => {
        expect(p.image).toBeTruthy();
        expect(p.image).toMatch(/^\/projects\//);
      });
    });

    for (const lang of LANGS) {
      it(`[${lang}] each project has tagline, description, problem, approach, highlights`, () => {
        getProjects(lang).forEach((p) => {
          expect(p.name).toBeTruthy();
          expect(p.tagline).toBeTruthy();
          expect(p.description).toBeTruthy();
          expect(p.problem).toBeTruthy();
          expect(p.approach.length).toBeGreaterThan(0);
          expect(p.highlights.length).toBeGreaterThan(0);
          expect(p.stack.length).toBeGreaterThan(0);
          expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
        });
      });

      it(`[${lang}] publishes Sentinel Ledger with explicit non-production limits`, () => {
        const project = getProjectBySlug("sentinel-ledger", lang);
        expect(project?.status).toBe("development");
        expect(project?.visible).toBe(true);
        expect(project?.repoUrl).toBe("https://github.com/vinicius-ssantos/sentinel-ledger");
        expect(project?.limitations?.join(" ")).toMatch(
          lang === "pt" ? /não processa pagamentos reais/i : /does not process real payments/i,
        );
      });
    }

    it("projects are in reverse chronological order (by updatedAt)", () => {
      const dates = getProjects("en").map((p) => p.updatedAt);
      for (let i = 1; i < dates.length; i++) {
        expect((dates[i - 1] ?? "") >= (dates[i] ?? "")).toBe(true);
      }
    });
  });

  describe("selectors", () => {
    it("getProjectBySlug returns the matching project", () => {
      expect(getProjectBySlug("springcloud", "en")?.name).toBe("SpringCloud");
    });

    it("getProjectBySlug returns undefined for an unknown slug", () => {
      expect(getProjectBySlug("does-not-exist", "en")).toBeUndefined();
    });

    it("getFeaturedProject keeps personal-platform-infra as the featured project", () => {
      const featured = getFeaturedProject("en");
      expect(featured.featured).toBe(true);
      expect(featured.slug).toBe("personal-platform-infra");
    });

    it("getVisibleProjects returns every real project (none are hidden)", () => {
      expect(getVisibleProjects("en")).toEqual(getProjects("en"));
    });
  });

  describe("isProjectVisible", () => {
    const base: Project = {
      slug: "fixture",
      name: "fixture",
      tagline: "x",
      description: "x",
      problem: "x",
      approach: ["x"],
      stack: ["x"],
      role: "x",
      highlights: ["x"],
      repoUrl: "https://github.com/x/x",
      updatedAt: "2026-01-01",
    };

    it("is visible when `visible` is omitted (default)", () => {
      expect(isProjectVisible(base)).toBe(true);
    });

    it("is visible when `visible: true`", () => {
      expect(isProjectVisible({ ...base, visible: true })).toBe(true);
    });

    it("is hidden when `visible: false` (e.g. an in-development project)", () => {
      expect(isProjectVisible({ ...base, status: "development", visible: false })).toBe(false);
    });
  });

  describe("stack", () => {
    it("has professional and personal groups", () => {
      expect(Object.keys(stack)).toEqual(expect.arrayContaining(["professional", "personal"]));
    });

    it("professional group has expected categories", () => {
      expect(Object.keys(stack.professional)).toEqual(
        expect.arrayContaining(["Backend", "Quality", "Data", "DevOps", "Methods"]),
      );
    });

    it("each category in both groups has at least 1 item", () => {
      Object.values(stack.professional).forEach((items) => {
        expect(items.length).toBeGreaterThan(0);
      });
      Object.values(stack.personal).forEach((items) => {
        expect(items.length).toBeGreaterThan(0);
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

    for (const lang of LANGS) {
      it(`[${lang}] getSpokenLanguages returns non-empty entries`, () => {
        const spoken = getSpokenLanguages(lang);
        expect(spoken.length).toBeGreaterThan(0);
        spoken.forEach((s) => expect(s).toBeTruthy());
      });
    }
  });
});
