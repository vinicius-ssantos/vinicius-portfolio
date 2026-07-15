import { describe, it, expect } from "vitest";
import {
  isLocale,
  parseLocale,
  getLocalePath,
  swapLocaleInPath,
  detectLocaleFromPathname,
  acceptLanguageLocale,
  formatMonthYear,
  defaultLocale,
} from "@/lib/i18n";

describe("i18n", () => {
  describe("isLocale / parseLocale", () => {
    it("accepts pt and en", () => {
      expect(isLocale("pt")).toBe(true);
      expect(isLocale("en")).toBe(true);
    });

    it("rejects anything else", () => {
      expect(isLocale("es")).toBe(false);
      expect(isLocale(undefined)).toBe(false);
      expect(isLocale(null)).toBe(false);
    });

    it("parseLocale falls back to defaultLocale", () => {
      expect(parseLocale("en")).toBe("en");
      expect(parseLocale("es")).toBe(defaultLocale);
      expect(parseLocale(undefined)).toBe(defaultLocale);
    });
  });

  describe("getLocalePath", () => {
    it("prefixes the locale onto a bare path", () => {
      expect(getLocalePath("/projects/foo", "en")).toBe("/en/projects/foo");
    });

    it("handles the root path", () => {
      expect(getLocalePath("/", "pt")).toBe("/pt");
    });
  });

  describe("swapLocaleInPath", () => {
    it("replaces an existing locale segment", () => {
      expect(swapLocaleInPath("/pt/projects/foo", "en")).toBe("/en/projects/foo");
    });

    it("prepends the locale when the path has none", () => {
      expect(swapLocaleInPath("/projects/foo", "en")).toBe("/en/projects/foo");
    });
  });

  describe("detectLocaleFromPathname", () => {
    it("reads the locale from the first path segment", () => {
      expect(detectLocaleFromPathname("/en/projects/foo")).toBe("en");
      expect(detectLocaleFromPathname("/pt")).toBe("pt");
    });

    it("falls back to defaultLocale for unknown or missing segments", () => {
      expect(detectLocaleFromPathname("/es/foo")).toBe(defaultLocale);
      expect(detectLocaleFromPathname(null)).toBe(defaultLocale);
      expect(detectLocaleFromPathname(undefined)).toBe(defaultLocale);
      expect(detectLocaleFromPathname("")).toBe(defaultLocale);
    });
  });

  describe("acceptLanguageLocale", () => {
    it("picks the highest-q supported tag", () => {
      expect(acceptLanguageLocale("en-US,en;q=0.9,pt-BR;q=0.8")).toBe("en");
      expect(acceptLanguageLocale("pt-BR,en-US;q=0.8")).toBe("pt");
    });

    it("falls back to defaultLocale when nothing matches", () => {
      expect(acceptLanguageLocale("es-ES,es;q=0.9")).toBe(defaultLocale);
      expect(acceptLanguageLocale("")).toBe(defaultLocale);
    });
  });

  describe("formatMonthYear", () => {
    it("formats an ISO date per locale", () => {
      expect(formatMonthYear("2024-08-01", "en")).toMatch(/2024/);
      expect(formatMonthYear("2024-08-01", "pt")).toMatch(/2024/);
    });
  });
});
