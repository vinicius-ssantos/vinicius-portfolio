/**
 * Best-effort in-memory rate limiter.
 *
 * This only protects a single warm serverless instance — it resets on cold
 * start and isn't shared across concurrent instances, so it's not a hard
 * guarantee. It's a supplementary layer behind the honeypot and
 * minimum-fill-time checks, which don't depend on cross-invocation state
 * at all. A distributed store (Upstash/Vercel KV) would close the gap if
 * abuse volume ever justifies the added infra.
 */
const hits = new Map<string, number[]>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

/**
 * Vercel sets x-forwarded-for to a comma-separated chain (client, then any
 * intermediate proxies) — the first entry is the original client. Falls
 * back to x-real-ip, then a constant so requests without either header
 * still share one bucket instead of bypassing the limit entirely.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return headers.get("x-real-ip") ?? "unknown";
}
