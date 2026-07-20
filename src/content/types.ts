/**
 * Content domain types — no React dependency, safe to import from
 * server components, route handlers, and tests alike.
 */
import type { Lang } from "@/lib/i18n";

export type { Lang };

/**
 * Maturity of a project. Omit entirely for a finished, polished project —
 * the UI only renders a status badge for "development"/"beta" so existing
 * complete projects don't get visual clutter from a "stable" tag no one
 * needs to see.
 */
export type ProjectStatus = "development" | "beta" | "stable";

/** Locale-independent project fields — dates, URLs, stack, flags. */
export type ProjectMeta = {
  slug: string;
  name: string;
  stack: string[];
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
};

/** Translatable project fields, resolved for one locale. */
export type ProjectText = {
  tagline: string;
  description: string;
  problem: string;
  approach: string[];
  role: string;
  highlights: string[];
  // Architecture/decision bullets for the project detail page. Distinct
  // from `caseStudy` below, which is the richer home-page deep dive.
  architectureNotes?: string[];
  // Numbers that are actually verifiable (e.g. from a public dashboard,
  // CI badge, or repo insight) — never invented for narrative effect.
  metrics?: { label: string; value: string }[];
  testingStrategy?: string;
  observability?: string;
  limitations?: string[];
  nextSteps?: string[];
  // Optional deep-dive case study content — only the featured project
  // populates this today, but the structure allows any project to become
  // a case study without touching the CaseStudy component.
  caseStudy?: {
    lessonsLearned: string;
    architectureLabel: string;
    localNodes: string[];
    vpsNodes: string[];
    flowText: string;
  };
};

/** A project fully resolved for one locale — what components consume. */
export type Project = ProjectMeta & ProjectText;

export type ExperienceMeta = {
  id: string;
  /** ISO date ("YYYY-MM-DD") — format for display with `formatMonthYear` from `@/lib/i18n`. */
  startDate: string;
  /** ISO date; omit when `current` is true. */
  endDate?: string;
  company: string;
  stack: string[];
  current?: boolean;
};

export type EducationMeta = { id: string; institution: string };

/** Returns whole years between `startDate` (ISO date string) and "now". */
export function yearsSince(startDate: string): string {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "—";
  const diffMs = Date.now() - start.getTime();
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  return String(Math.max(0, years));
}
