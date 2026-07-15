import { NextResponse } from "next/server";
import { Resend } from "resend";
import { profile } from "@/content";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_TIME_MS = 1_500;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

export async function POST(request: Request) {
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

  const clientIp = getClientIp(request.headers);
  if (isRateLimited(clientIp)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  try {
    const body = await request.json();

    // Honeypot: a real visitor never fills this (it's aria-hidden and
    // visually off-screen). A non-empty value means an automated filler
    // touched every input — reject without hitting Resend, but still
    // return a generic success-shaped error so the bot gets no signal
    // about which check tripped.
    const honeypot = String(body.website ?? "").trim();
    if (honeypot) {
      return NextResponse.json({ error: "Something went wrong." }, { status: 400 });
    }

    // Minimum fill time: the client stamps when the form became visible;
    // a submission faster than a human could plausibly type is rejected.
    const renderedAt = Number(body.renderedAt);
    if (!Number.isFinite(renderedAt) || Date.now() - renderedAt < MIN_FILL_TIME_MS) {
      return NextResponse.json({ error: "Something went wrong." }, { status: 400 });
    }

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
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio contact — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
