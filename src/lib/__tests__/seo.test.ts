import { describe, it, expect } from "vitest";
import {
  ogLocale,
  htmlLang,
  buildLocaleAlternates,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  buildProfilePageJsonLd,
  buildProjectJsonLd,
  buildBreadcrumbJsonLd,
  buildProjectMetadata,
} from "@/lib/seo";
import { getFeaturedProject } from "@/content";

describe("seo", () => {
  describe("ogLocale / htmlLang", () => {
    it("maps pt/en to their locale tags", () => {
      expect(ogLocale("pt")).toBe("pt_BR");
      expect(ogLocale("en")).toBe("en_US");
      expect(htmlLang("pt")).toBe("pt-BR");
      expect(htmlLang("en")).toBe("en-US");
    });
  });

  describe("buildLocaleAlternates", () => {
    it("builds pt/en/x-default for a given path", () => {
      const alternates = buildLocaleAlternates("/projects/foo");
      expect(alternates["pt-BR"]).toMatch(/\/pt\/projects\/foo$/);
      expect(alternates["en-US"]).toMatch(/\/en\/projects\/foo$/);
      expect(alternates["x-default"]).toBe(alternates["pt-BR"]);
    });

    it("handles the empty path (home)", () => {
      const alternates = buildLocaleAlternates("");
      expect(alternates["pt-BR"]).toMatch(/\/pt$/);
      expect(alternates["en-US"]).toMatch(/\/en$/);
    });
  });

  describe("JSON-LD builders", () => {
    it("buildPersonJsonLd includes name and both social links", () => {
      const person = buildPersonJsonLd("en");
      expect(person["@type"]).toBe("Person");
      expect(person.sameAs.length).toBe(2);
    });

    it("buildWebsiteJsonLd sets inLanguage per locale", () => {
      expect(buildWebsiteJsonLd("pt").inLanguage).toBe("pt-BR");
      expect(buildWebsiteJsonLd("en").inLanguage).toBe("en-US");
    });

    it("buildProfilePageJsonLd points at the locale home", () => {
      expect(buildProfilePageJsonLd("en").url).toMatch(/\/en$/);
    });

    it("buildProjectJsonLd carries the project's repo and dates", () => {
      const project = getFeaturedProject("en");
      const jsonLd = buildProjectJsonLd(project, "en");
      expect(jsonLd.codeRepository).toBe(project.repoUrl);
      expect(jsonLd.dateModified).toBe(project.updatedAt);
    });

    it("buildBreadcrumbJsonLd numbers items starting at 1", () => {
      const breadcrumb = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://example.com" },
        { name: "Project", url: "https://example.com/p" },
      ]);
      expect(breadcrumb.itemListElement[0]?.position).toBe(1);
      expect(breadcrumb.itemListElement[1]?.position).toBe(2);
    });
  });

  describe("buildProjectMetadata", () => {
    it("builds consistent canonical/alternates/openGraph for a project", () => {
      const project = getFeaturedProject("pt");
      const metadata = buildProjectMetadata(project, "pt");
      expect(metadata.alternates.canonical).toBe(metadata.openGraph.url);
      expect(metadata.title).toContain(project.name);
    });
  });
});
