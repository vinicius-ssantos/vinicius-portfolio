// Single import surface for the portfolio's content domain.
export * from "./types";
export { profile, getProfile } from "./profile";
export { stack, getSpokenLanguages } from "./stack";
export { getExperience } from "./experience";
export { getEducation } from "./education";
export {
  getProjects,
  getProjectBySlug,
  getFeaturedProject,
  getVisibleProjects,
  getVisibleProjectSlugs,
  getVisibleProjectMetas,
  getAllProjectMetas,
  isProjectVisible,
} from "./projects";
