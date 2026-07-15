/**
 * Content domain types — no React dependency, safe to import from
 * server components, route handlers, and tests alike.
 */
import type { Lang } from "@/lib/translations";

export type { Lang };
export type LocalizedText = { pt: string; en: string };

/**
 * Maturity of a project. Omit entirely for a finished, polished project —
 * the UI only renders a status badge for "development"/"beta" so existing
 * complete projects don't get visual clutter from a "stable" tag no one
 * needs to see.
 */
export type ProjectStatus = "development" | "beta" | "stable";

export type ProjectMetric = { label: LocalizedText; value: string };

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
  status?: ProjectStatus;
  /**
   * Explicit visibility switch — defaults to visible (true) when omitted.
   * Set to `false` while a project is still short of the minimum bar for
   * public display (defined problem, consistent README, initial
   * architecture, public activity, clear next milestone). See
   * `getVisibleProjects` in `./projects/index.ts`.
   */
  visible?: boolean;
  // Optional external evidence — only render what's actually provided.
  links?: {
    demo?: string;
    docs?: string;
    openApi?: string;
    video?: string;
  };
  // Architecture/decision bullets for the project detail page. Distinct
  // from `caseStudy` below, which is the richer home-page deep dive.
  architectureNotes?: LocalizedText[];
  // Numbers that are actually verifiable (e.g. from a public dashboard,
  // CI badge, or repo insight) — never invented for narrative effect.
  metrics?: ProjectMetric[];
  testingStrategy?: LocalizedText;
  observability?: LocalizedText;
  limitations?: LocalizedText[];
  nextSteps?: LocalizedText[];
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
