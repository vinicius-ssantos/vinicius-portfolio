/**
 * Build-time feature flags.
 *
 * `NEXT_PUBLIC_*` values are inlined by the bundler, so each flag reads its
 * variable through a literal `process.env.X` default parameter — that keeps
 * the reference statically analyzable while still letting tests inject a
 * value directly. Same shape as `shouldEnableSpeedInsights`.
 */

/**
 * Gates the experimental Three.js topology (#48 spike).
 *
 * Defaults to OFF: the spike ships behind this flag so the 3D bundle and its
 * runtime cost stay out of the public site until the before/after Web Vitals
 * comparison required by #56 actually has a representative sample — mobile
 * included. Only an explicit "true" enables it; anything else (unset, empty,
 * "false", a typo) stays off, because a flag that fails open would defeat the
 * point of gating it.
 */
export function isTopology3DEnabled(value = process.env.NEXT_PUBLIC_ENABLE_3D_TOPOLOGY): boolean {
  return value === "true";
}
