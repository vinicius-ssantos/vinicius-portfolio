import { createHmac } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW = "60 s";
const MAX_REQUESTS_PER_WINDOW = 5;

export type RateLimitResult =
  | { status: "ok" }
  | { status: "limited"; retryAfterSeconds: number }
  // The datastore itself is unreachable/misconfigured — distinct from a
  // legitimate "limited" so callers can apply an explicit, observable
  // fail-open policy instead of silently treating an outage as "ok".
  | { status: "datastore-error" };

let ratelimit: Ratelimit | null | undefined;

/**
 * Lazily builds the shared Ratelimit instance. `undefined` means "not
 * checked yet", `null` means "checked, not configured" — distinguishes a
 * genuinely missing config from a fresh module load.
 */
function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    ratelimit = null;
    return ratelimit;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, WINDOW),
    // Prefix separates environments (and any other feature that reuses the
    // same Redis instance) so keys never collide across deploy targets.
    prefix: `ratelimit:${process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development"}:contact`,
  });
  return ratelimit;
}

/**
 * HMACs the client identifier so raw IPs are never stored in Redis. Keyed
 * (not a bare hash) so the IPv4/IPv6 address space can't be brute-forced
 * back from the stored key.
 */
function hashIdentifier(identifier: string): string {
  const secret = process.env.RATE_LIMIT_HASH_SECRET;
  if (!secret) {
    // No pepper configured — still hash (never store the raw value) but
    // callers in production are expected to have RATE_LIMIT_HASH_SECRET set;
    // this path only serves local dev without full env setup.
    return createHmac("sha256", "dev-only-unkeyed").update(identifier).digest("hex");
  }
  return createHmac("sha256", secret).update(identifier).digest("hex");
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getRatelimit();
  if (!limiter) return { status: "datastore-error" };

  const key = hashIdentifier(identifier);

  try {
    const { success, reset } = await limiter.limit(key);
    if (success) return { status: "ok" };
    return {
      status: "limited",
      retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    };
  } catch {
    // Upstash unreachable/erroring — fail open (Turnstile + honeypot + min
    // fill time remain in effect) rather than take the contact form fully
    // offline over a rate-limit-store blip. Distinct return value so the
    // caller can log/observe it instead of conflating it with "ok".
    return { status: "datastore-error" };
  }
}

/**
 * Vercel sets x-forwarded-for to a comma-separated chain (client, then any
 * intermediate proxies) — the first entry is the original client, and this
 * header is trustworthy specifically because Vercel's edge network is what
 * sets/overwrites it before the request reaches the function; it isn't
 * passed through unmodified from the client. Falls back to x-real-ip, then
 * a constant so requests without either header still share one bucket
 * instead of bypassing the limit entirely.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return headers.get("x-real-ip") ?? "unknown";
}

export function resetRatelimitForTests(): void {
  ratelimit = undefined;
}
