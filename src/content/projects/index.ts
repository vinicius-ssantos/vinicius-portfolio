import type { Project } from "../types";
import { personalPlatformInfra } from "./personal-platform-infra";
import { springcloud } from "./springcloud";
import { apiRestAplicativoCars } from "./api-rest-aplicativo-cars";

// Reverse chronological order (most recently updated first).
export const projects: Project[] = [personalPlatformInfra, springcloud, apiRestAplicativoCars];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProject(): Project {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  if (!featured) {
    throw new Error("No projects defined in src/content/projects");
  }
  return featured;
}

/** Pure so it's testable without depending on the real `projects` array. */
export function isProjectVisible(project: Project): boolean {
  return project.visible !== false;
}

export function getVisibleProjects(): Project[] {
  return projects.filter(isProjectVisible);
}
