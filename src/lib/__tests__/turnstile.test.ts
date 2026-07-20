import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "@/lib/turnstile";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubEnv("TURNSTILE_EXPECTED_HOSTNAME", "example.com");
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

describe("verifyTurnstileToken", () => {
  it("rejects a missing token without calling siteverify", async () => {
    const result = await verifyTurnstileToken(undefined, "1.2.3.4");

    expect(result).toEqual({ ok: false, reason: "missing-token" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a blank token without calling siteverify", async () => {
    const result = await verifyTurnstileToken("   ", "1.2.3.4");

    expect(result).toEqual({ ok: false, reason: "missing-token" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports siteverify-unreachable when the secret key isn't configured, without calling siteverify", async () => {
    vi.unstubAllEnvs();
    const result = await verifyTurnstileToken("a-token", "1.2.3.4");

    expect(result).toEqual({ ok: false, reason: "siteverify-unreachable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts a valid token matching the expected hostname", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, hostname: "example.com" }));

    const result = await verifyTurnstileToken("a-token", "1.2.3.4");

    expect(result).toEqual({ ok: true });
  });

  it("skips the hostname check when TURNSTILE_EXPECTED_HOSTNAME isn't set", async () => {
    vi.stubEnv("TURNSTILE_EXPECTED_HOSTNAME", "");
    fetchMock.mockResolvedValue(jsonResponse({ success: true, hostname: "anything.example" }));

    const result = await verifyTurnstileToken("a-token", "1.2.3.4");

    expect(result).toEqual({ ok: true });
  });

  it("rejects a hostname mismatch even when the token itself is valid", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, hostname: "attacker.example" }));

    const result = await verifyTurnstileToken("a-token", "1.2.3.4");

    expect(result).toEqual({ ok: false, reason: "hostname-mismatch" });
  });

  it("rejects an invalid, expired, or reused token", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: false, "error-codes": ["timeout-or-duplicate"] }),
    );

    const result = await verifyTurnstileToken("a-token", "1.2.3.4");

    expect(result).toEqual({ ok: false, reason: "invalid-token" });
  });

  it("reports siteverify-unreachable on a non-OK HTTP response", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, false));

    const result = await verifyTurnstileToken("a-token", "1.2.3.4");

    expect(result).toEqual({ ok: false, reason: "siteverify-unreachable" });
  });

  it("reports siteverify-unreachable on a network error", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    const result = await verifyTurnstileToken("a-token", "1.2.3.4");

    expect(result).toEqual({ ok: false, reason: "siteverify-unreachable" });
  });

  it("reports siteverify-unreachable on timeout", async () => {
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    vi.useFakeTimers();

    const pending = verifyTurnstileToken("a-token", "1.2.3.4");
    await vi.advanceTimersByTimeAsync(6_000);
    const result = await pending;

    expect(result).toEqual({ ok: false, reason: "siteverify-unreachable" });
    vi.useRealTimers();
  });

  it("sends the remote IP to siteverify when known", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, hostname: "example.com" }));

    await verifyTurnstileToken("a-token", "5.6.7.8");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = (init.body as URLSearchParams).toString();
    expect(sentBody).toContain("remoteip=5.6.7.8");
  });

  it("omits remoteip when the client IP is unknown", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, hostname: "example.com" }));

    await verifyTurnstileToken("a-token", "unknown");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sentBody = (init.body as URLSearchParams).toString();
    expect(sentBody).not.toContain("remoteip");
  });
});
