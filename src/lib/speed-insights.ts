export function shouldEnableSpeedInsights(vercelEnv = process.env.VERCEL_ENV) {
  return vercelEnv === "production";
}
