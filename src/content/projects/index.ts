import type { Lang } from "@/lib/i18n";
import type { Project } from "../types";
import { sentinelLedgerMeta, getSentinelLedger } from "./sentinel-ledger";
import { personalPlatformInfraMeta, getPersonalPlatformInfra } from "./personal-platform-infra";
import { springcloudMeta, getSpringcloud } from "./springcloud";
import { apiRestAplicativoCarsMeta, getApiRestAplicativoCars } from "./api-rest-aplicativo-cars";

// Reverse chronological order (most recently updated first).
const projectMetas = [
  sentinelLedgerMeta,
  personalPlatformInfraMeta,
  springcloudMeta,
  apiRestAplicativoCarsMeta,
];

const projectGetters: Record<string, (lang: Lang) => Project> = {
  "sentinel-ledger": getSentinelLedger,
  "personal-platform-infra": getPersonalPlatformInfra,
  springcloud: getSpringcloud,
  "api-rest-aplicativo-cars": getApiRestAplicativoCars,
};

export function getProjects(lang: Lang): Project[] {
  return projectMetas.map((meta) => projectGetters[meta.slug]!(lang));
}

export function getProjectBySlug(slug: string, lang: Lang): Project | undefined {
  const getter = projectGetters[slug];
  return getter ? getter(lang) : undefined;
}

export function getFeaturedProject(lang: Lang): Project {
  const featuredMeta = projectMetas.find((p) => p.featured) ?? projectMetas[0];
  if (!featuredMeta) {
    throw new Error("No projects defined in src/content/projects");
  }
  return projectGetters[featuredMeta.slug]!(lang);
}

/** Pure so it's testable without depending on the real project list. */
export function isProjectVisible(
  project: { visible?: boolean } & Record<string, unknown>,
): boolean {
  return project.visible !== false;
}

export function getVisibleProjects(lang: Lang): Project[] {
  return getProjects(lang).filter(isProjectVisible);
}

export function getVisibleProjectSlugs(): string[] {
  return projectMetas.filter(isProjectVisible).map((p) => p.slug);
}

/** Neutral project metadata for every visible project — no locale needed. */
export function getVisibleProjectMetas() {
  return projectMetas.filter(isProjectVisible);
}

/** Neutral metadata for every project, visible or not — no locale needed. */
export function getAllProjectMetas() {
  return projectMetas;
}
