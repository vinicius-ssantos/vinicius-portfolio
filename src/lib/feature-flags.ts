/**
 * Build-time feature flags.
 *
 * `NEXT_PUBLIC_*` values are inlined by the bundler, so each flag reads its
 * variable through a literal `process.env.X` default parameter — that keeps
 * the reference statically analyzable while still letting tests inject a
 * value directly. Same shape as `shouldEnableSpeedInsights`.
 */

const TOPOLOGY_3D_PROJECT_SLUGS = new Set(["personal-platform-infra"]);

/**
 * Global kill switch for the limited Three.js topology rollout (#48).
 *
 * Only an exact "true" enables the capability. Eligibility is checked
 * separately so adding a case study never opts a project into WebGL by
 * accident.
 */
export function isTopology3DEnabled(value = process.env.NEXT_PUBLIC_ENABLE_3D_TOPOLOGY): boolean {
  return value === "true";
}

/**
 * Three.js is limited to explicitly selected project-detail pages.
 * Hero, home, cards, mobile and every non-allowlisted dossier retain the
 * accessible 2.5D/HTML path even when the global flag is enabled.
 */
export function isTopology3DProjectEnabled(
  slug: string,
  value = process.env.NEXT_PUBLIC_ENABLE_3D_TOPOLOGY,
): boolean {
  return isTopology3DEnabled(value) && TOPOLOGY_3D_PROJECT_SLUGS.has(slug);
}
