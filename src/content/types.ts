/**
 * Content domain types — no React dependency, safe to import from
 * server components, route handlers, and tests alike.
 */
import type { Lang } from "@/lib/translations";

export type { Lang };
export type LocalizedText = { pt: string; en: string };

export type Project = {
  slug: string;
  name: string;
  tagline: LocalizedText;
  description: LocalizedText;
  problem: LocalizedText;
  approach: LocalizedText[];
  stack: string[];
  role: LocalizedText;
  highlights: LocalizedText[];
  repoUrl: string;
  liveUrl?: string;
  image?: string;
  updatedAt: string;
  featured?: boolean;
  // Optional deep-dive case study content — only the featured project
  // populates this today, but the structure allows any project to become
  // a case study without touching the CaseStudy component.
  caseStudy?: {
    lessonsLearned: LocalizedText;
    architectureLabel: LocalizedText;
    localNodes: LocalizedText[];
    vpsNodes: LocalizedText[];
    flowText: LocalizedText;
  };
};

export type Experience = {
  /** ISO date ("YYYY-MM-DD") — format for display with `formatMonthYear` from `@/lib/i18n`. */
  startDate: string;
  /** ISO date; omit when `current` is true. */
  endDate?: string;
  company: string;
  role: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedText[];
  stack: string[];
  current?: boolean;
};

export type Education = {
  period: LocalizedText;
  institution: string;
  degree: LocalizedText;
};

export type StatItem = { label: LocalizedText; value: string };

/** Returns whole years between `startDate` (ISO date string) and "now". */
export function yearsSince(startDate: string): string {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "—";
  const diffMs = Date.now() - start.getTime();
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  return String(Math.max(0, years));
}

/** Picks the localized string for `lang` out of a `{ pt, en }` pair. */
export function t(text: LocalizedText, lang: Lang): string {
  return text[lang];
}
