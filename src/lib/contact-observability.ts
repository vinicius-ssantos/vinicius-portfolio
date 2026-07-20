import { track } from "@vercel/analytics/server";

/**
 * Server-side outcome categories for the contact route — never a name,
 * email, message, token, or IP. Lets the funnel distinguish *why* a
 * submission didn't reach Resend without logging anything identifying.
 */
export type ContactOutcome =
  | "honeypot"
  | "too_fast"
  | "rate_limited"
  | "rate_limit_datastore_error"
  | "turnstile_invalid"
  | "validation_failed"
  | "resend_failed"
  | "sent";

export async function recordContactOutcome(outcome: ContactOutcome): Promise<void> {
  // Mirrors trackEvent's guard in src/lib/analytics.ts: no-op outside a
  // deployed environment so local dev and the test suite never attempt it.
  if (process.env.NODE_ENV !== "production") return;
  try {
    await track(`contact_${outcome}`);
  } catch {
    // Observability must never take the contact form down.
  }
}
