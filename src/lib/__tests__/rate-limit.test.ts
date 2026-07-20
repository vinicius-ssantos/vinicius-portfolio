import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const limitMock = vi.fn();

vi.mock("@upstash/redis", () => ({
  Redis: class {},
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    class {
      limit = limitMock;
    },
    { slidingWindow: vi.fn(() => "sliding-window-config") },
  ),
}));

async function freshRateLimit() {
  const mod = await import("@/lib/rate-limit");
  mod.resetRatelimitForTests();
  return mod;
}

beforeEach(() => {
  vi.resetModules();
  limitMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("checkRateLimit", () => {
  it("fails open with datastore-error when Upstash env vars aren't configured, without calling Upstash", async () => {
    const { checkRateLimit } = await freshRateLimit();

    const result = await checkRateLimit("1.2.3.4");

    expect(result).toEqual({ status: "datastore-error" });
    expect(limitMock).not.toHaveBeenCalled();
  });

  it("returns ok when under the limit", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "test-token");
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
    const { checkRateLimit } = await freshRateLimit();

    const result = await checkRateLimit("1.2.3.4");

    expect(result).toEqual({ status: "ok" });
  });

  it("returns limited with a Retry-After-friendly second count when over the limit", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "test-token");
    const reset = Date.now() + 12_345;
    limitMock.mockResolvedValue({ success: false, reset });
    const { checkRateLimit } = await freshRateLimit();

    const result = await checkRateLimit("1.2.3.4");

    expect(result.status).toBe("limited");
    if (result.status === "limited") {
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
      expect(result.retryAfterSeconds).toBeLessThanOrEqual(13);
    }
  });

  it("fails open with datastore-error when Upstash itself throws", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "test-token");
    limitMock.mockRejectedValue(new Error("upstash unreachable"));
    const { checkRateLimit } = await freshRateLimit();

    const result = await checkRateLimit("1.2.3.4");

    expect(result).toEqual({ status: "datastore-error" });
  });

  it("never sends the raw identifier to the limiter — only a hash", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "test-token");
    vi.stubEnv("RATE_LIMIT_HASH_SECRET", "pepper");
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
    const { checkRateLimit } = await freshRateLimit();

    await checkRateLimit("203.0.113.42");

    const [key] = limitMock.mock.calls[0] as [string];
    expect(key).not.toContain("203.0.113.42");
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it("hashes the same identifier to the same key (so the limit is actually per-client)", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "test-token");
    vi.stubEnv("RATE_LIMIT_HASH_SECRET", "pepper");
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
    const { checkRateLimit } = await freshRateLimit();

    await checkRateLimit("203.0.113.42");
    await checkRateLimit("203.0.113.42");

    const [firstKey] = limitMock.mock.calls[0] as [string];
    const [secondKey] = limitMock.mock.calls[1] as [string];
    expect(firstKey).toBe(secondKey);
  });
});

describe("getClientIp", () => {
  it("uses the first entry of x-forwarded-for", async () => {
    const { getClientIp } = await freshRateLimit();

    const ip = getClientIp(new Headers({ "x-forwarded-for": "203.0.113.1, 10.0.0.1" }));

    expect(ip).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", async () => {
    const { getClientIp } = await freshRateLimit();

    const ip = getClientIp(new Headers({ "x-real-ip": "203.0.113.2" }));

    expect(ip).toBe("203.0.113.2");
  });

  it("falls back to a constant when neither header is present", async () => {
    const { getClientIp } = await freshRateLimit();

    const ip = getClientIp(new Headers());

    expect(ip).toBe("unknown");
  });
});
