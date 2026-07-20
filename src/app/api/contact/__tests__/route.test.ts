import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.fn().mockResolvedValue({ data: { id: "test" }, error: null });
const verifyTurnstileTokenMock = vi.fn();
const checkRateLimitMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstileToken: verifyTurnstileTokenMock,
}));

vi.mock("@/lib/rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rate-limit")>();
  return { ...actual, checkRateLimit: checkRateLimitMock };
});

// Each test uses a distinct x-forwarded-for IP purely for request-shape
// realism — checkRateLimit itself is mocked per test, so no shared state
// leaks between cases.
let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `10.0.0.${ipCounter}`;
}

function makeRequest(
  body: Record<string, unknown>,
  options: { contentType?: string; contentLength?: string; ip?: string } = {},
) {
  const json = JSON.stringify(body);
  const headers = new Headers({
    "content-type": options.contentType ?? "application/json",
    "x-forwarded-for": options.ip ?? nextIp(),
  });
  if (options.contentLength !== undefined) {
    headers.set("content-length", options.contentLength);
  } else {
    headers.set("content-length", String(Buffer.byteLength(json)));
  }
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body: json,
  });
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jane Doe",
    email: "jane@example.com",
    message: "Hello there, this is a real message.",
    website: "",
    renderedAt: Date.now() - 5_000,
    turnstileToken: "a-valid-token",
    ...overrides,
  };
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMock.mockClear();
    verifyTurnstileTokenMock.mockReset().mockResolvedValue({ ok: true });
    checkRateLimitMock.mockReset().mockResolvedValue({ status: "ok" });
    vi.stubEnv("RESEND_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 503 and never calls Resend, Turnstile, or the rate limiter when RESEND_API_KEY is missing", async () => {
    vi.unstubAllEnvs();
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
    expect(verifyTurnstileTokenMock).not.toHaveBeenCalled();
    expect(checkRateLimitMock).not.toHaveBeenCalled();
  });

  it("returns 415 for a non-JSON content type", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload(), { contentType: "text/plain" }));

    expect(res.status).toBe(415);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 413 when content-length exceeds the body size limit", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload(), { contentLength: "999999" }));

    expect(res.status).toBe(413);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a filled honeypot without calling the rate limiter, Turnstile, or Resend", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload({ website: "http://spam.example" })));

    expect(res.status).toBe(400);
    expect(checkRateLimitMock).not.toHaveBeenCalled();
    expect(verifyTurnstileTokenMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a submission that arrives faster than a human could fill the form, without calling the rate limiter, Turnstile, or Resend", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload({ renderedAt: Date.now() })));

    expect(res.status).toBe(400);
    expect(checkRateLimitMock).not.toHaveBeenCalled();
    expect(verifyTurnstileTokenMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 429 with Retry-After when the distributed rate limit is exceeded, without calling Turnstile or Resend", async () => {
    checkRateLimitMock.mockResolvedValue({ status: "limited", retryAfterSeconds: 42 });
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("42");
    expect(verifyTurnstileTokenMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails open (still processes the request) when the rate-limit datastore itself errors", async () => {
    checkRateLimitMock.mockResolvedValue({ status: "datastore-error" });
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("rejects a missing, invalid, expired, or reused Turnstile token without calling Resend", async () => {
    verifyTurnstileTokenMock.mockResolvedValue({ ok: false, reason: "invalid-token" });
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a hostname mismatch from Turnstile without calling Resend", async () => {
    verifyTurnstileTokenMock.mockResolvedValue({ ok: false, reason: "hostname-mismatch" });
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects when Turnstile siteverify is unreachable, without calling Resend", async () => {
    verifyTurnstileTokenMock.mockResolvedValue({ ok: false, reason: "siteverify-unreachable" });
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("passes the client IP through to Turnstile verification", async () => {
    const { POST } = await import("../route");

    await POST(makeRequest(validPayload(), { ip: "198.51.100.7" }));

    expect(verifyTurnstileTokenMock).toHaveBeenCalledWith("a-valid-token", "198.51.100.7");
  });

  it("rejects missing required fields after Turnstile passes", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload({ message: "" })));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload({ email: "not-an-email" })));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends the email and returns ok for a valid submission (rate limit ok, Turnstile valid)", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("returns a generic error and never calls Resend a second time when Resend itself fails", async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(500);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
