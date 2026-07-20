import { NextResponse } from "next/server";
import { Resend } from "resend";
import { profile } from "@/content";
import { recordContactOutcome } from "@/lib/contact-observability";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_TIME_MS = 1_500;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

// Generic, non-committal responses everywhere a check can fail — the client
// never learns which specific antifraude layer (honeypot, timing, rate
// limit, Turnstile) tripped.
function genericRejection(status: number, extraHeaders?: HeadersInit) {
  return NextResponse.json({ error: "Something went wrong." }, { status, headers: extraHeaders });
}

export async function POST(request: Request) {
  // 1. Method (implicit — only POST is exported), Content-Type, and size.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413 });
  }

  try {
    // 2. Parse and normalize the payload.
    const body = await request.json();

    // 3. Honeypot and minimum-fill-time — reject before touching the rate
    // limiter or Turnstile, so a trivial bot never consumes that quota.
    const honeypot = String(body.website ?? "").trim();
    if (honeypot) {
      await recordContactOutcome("honeypot");
      return genericRejection(400);
    }

    const renderedAt = Number(body.renderedAt);
    if (!Number.isFinite(renderedAt) || Date.now() - renderedAt < MIN_FILL_TIME_MS) {
      await recordContactOutcome("too_fast");
      return genericRejection(400);
    }

    // 4-5. Resolve the client identifier and apply the distributed rate limit.
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = await checkRateLimit(clientIp);
    if (rateLimitResult.status === "limited") {
      await recordContactOutcome("rate_limited");
      return genericRejection(429, { "Retry-After": String(rateLimitResult.retryAfterSeconds) });
    }
    if (rateLimitResult.status === "datastore-error") {
      await recordContactOutcome("rate_limit_datastore_error");
      // Fail open — see the policy note in src/lib/rate-limit.ts.
    }

    // 6. Turnstile — always validated server-side, never trusted from the
    // client's mere presence of a token.
    const turnstileResult = await verifyTurnstileToken(body.turnstileToken, clientIp);
    if (!turnstileResult.ok) {
      await recordContactOutcome("turnstile_invalid");
      return genericRejection(400);
    }

    // 7. Business field validation.
    const name = String(body.name ?? "")
      .trim()
      .slice(0, 100);
    const email = String(body.email ?? "")
      .trim()
      .slice(0, 200);
    const message = String(body.message ?? "")
      .trim()
      .slice(0, 5000);

    if (!name || !email || !message) {
      await recordContactOutcome("validation_failed");
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await recordContactOutcome("validation_failed");
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // 8. Resend.
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio contact — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      await recordContactOutcome("resend_failed");
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }

    // 9. Generic success response.
    await recordContactOutcome("sent");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
