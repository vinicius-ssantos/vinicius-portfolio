import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.fn().mockResolvedValue({ data: { id: "test" }, error: null });

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

// Each test uses a distinct x-forwarded-for IP so the shared in-memory
// rate limiter (module-level state) doesn't leak between test cases.
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
    ...overrides,
  };
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMock.mockClear();
    vi.stubEnv("RESEND_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 503 and never calls Resend when RESEND_API_KEY is missing", async () => {
    vi.unstubAllEnvs();
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));

    expect(res.status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
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

  it("rejects a filled honeypot without calling Resend", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload({ website: "http://spam.example" })));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a submission that arrives faster than a human could fill the form", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload({ renderedAt: Date.now() })));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects missing required fields", async () => {
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

  it("sends the email and returns ok for a valid submission", async () => {
    const { POST } = await import("../route");

    const res = await POST(makeRequest(validPayload()));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("returns 429 after exceeding the rate limit from the same IP", async () => {
    const { POST } = await import("../route");
    const ip = nextIp();

    let lastRes;
    for (let i = 0; i < 6; i++) {
      lastRes = await POST(makeRequest(validPayload(), { ip }));
    }

    expect(lastRes?.status).toBe(429);
  });
});
