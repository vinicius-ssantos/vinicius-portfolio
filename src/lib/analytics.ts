"use client";

import { track } from "@vercel/analytics";

/**
 * Conversion funnel this portfolio tracks (top to bottom, roughly):
 *
 *   view_projects_click   → visitor intends to look at evidence
 *   project_dossier_open  → visitor opens a project's detail page
 *   project_repo_open     → visitor opens a project's GitHub repo
 *   cv_download           → visitor downloads/opens the CV
 *   contact_open          → visitor opens the contact modal
 *   linkedin_click        → visitor opens the LinkedIn profile
 *   contact_form_success  → visitor actually sent a message
 *
 * Reading it: `view_projects_click` vs. `project_dossier_open`/`project_repo_open`
 * counts shows whether the projects section itself converts attention into
 * evidence-reading. `contact_open` vs. `contact_form_success` shows whether
 * people who open the modal actually send something (vs. copying the email
 * and leaving, which isn't tracked — copy-to-clipboard has no event on
 * purpose, see below).
 *
 * Rules for adding a new event:
 * - No event may carry a name, email, phone, message, or any other
 *   personal data — properties are limited to non-identifying context
 *   like a project slug or the current locale.
 * - Fire only on a real user interaction or a confirmed success, never
 *   speculatively or on every render.
 */
export type AnalyticsEvent =
  | "view_projects_click"
  | "cv_download"
  | "project_dossier_open"
  | "project_repo_open"
  | "linkedin_click"
  | "contact_open"
  | "contact_form_success";

type AnalyticsProperties = Partial<Record<"slug" | "lang", string>>;

export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
  // Vercel Analytics itself no-ops outside of a deployed environment, but
  // guarding explicitly keeps local dev and the test suite from ever
  // attempting the call at all.
  if (process.env.NODE_ENV !== "production") return;
  track(event, properties);
}
