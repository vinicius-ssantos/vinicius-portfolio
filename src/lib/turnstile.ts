const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SITEVERIFY_TIMEOUT_MS = 5_000;

export type TurnstileOutcome =
  | { ok: true }
  | {
      ok: false;
      reason: "missing-token" | "hostname-mismatch" | "invalid-token" | "siteverify-unreachable";
    };

/**
 * Validates a Turnstile token against Cloudflare's siteverify endpoint.
 * Never trusts the client-side presence of a token — this is the only check
 * that counts. `hostname-mismatch` is reported as its own reason so callers
 * can tell configuration drift apart from an actually-invalid token, without
 * exposing that distinction to the end user.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp: string,
): Promise<TurnstileOutcome> {
  const trimmed = token?.trim();
  if (!trimmed) return { ok: false, reason: "missing-token" };

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return { ok: false, reason: "siteverify-unreachable" };

  const body = new URLSearchParams({ secret: secretKey, response: trimmed });
  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SITEVERIFY_TIMEOUT_MS);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    if (!res.ok) return { ok: false, reason: "siteverify-unreachable" };

    const data = (await res.json()) as {
      success: boolean;
      hostname?: string;
      ["error-codes"]?: string[];
    };
    if (!data.success) return { ok: false, reason: "invalid-token" };

    const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME;
    if (expectedHostname && data.hostname !== expectedHostname) {
      return { ok: false, reason: "hostname-mismatch" };
    }

    return { ok: true };
  } catch {
    // Network error or abort — treated the same as an unreachable siteverify
    // endpoint so the caller can apply one consistent failure policy.
    return { ok: false, reason: "siteverify-unreachable" };
  } finally {
    clearTimeout(timeout);
  }
}
