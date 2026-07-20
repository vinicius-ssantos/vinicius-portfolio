import { describe, expect, it, vi } from "vitest";
import { createDeepLProvider, DeepLError } from "../i18n-providers/deepl.mjs";

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
    json: async () => body,
  };
}

function noopSleep() {
  return () => Promise.resolve();
}

describe("createDeepLProvider", () => {
  it("throws synchronously when apiKey is missing", () => {
    expect(() => createDeepLProvider({ apiKey: "", endpoint: "free" })).toThrow();
  });

  it("throws synchronously when endpoint isn't 'free' or 'pro'", () => {
    // @ts-expect-error — deliberately invalid endpoint for this test
    expect(() => createDeepLProvider({ apiKey: "k", endpoint: "starter" })).toThrow();
  });

  it("translateBatch returns [] without calling fetch for an empty batch", async () => {
    const fetchImpl = vi.fn();
    const provider = createDeepLProvider({ apiKey: "k", endpoint: "free", fetchImpl });
    const result = await provider.translateBatch([], { sourceLang: "PT", targetLang: "EN-US" });
    expect(result).toEqual([]);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("translateBatch posts to the free endpoint with the auth header and returns translated text", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(200, { translations: [{ text: "Hello" }, { text: "World" }] }),
      );
    const provider = createDeepLProvider({ apiKey: "secret-key", endpoint: "free", fetchImpl });

    const result = await provider.translateBatch(["Olá", "Mundo"], {
      sourceLang: "PT",
      targetLang: "EN-US",
    });

    expect(result).toEqual(["Hello", "World"]);
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe("https://api-free.deepl.com/v2/translate");
    expect(init.headers.Authorization).toBe("DeepL-Auth-Key secret-key");
    expect(JSON.parse(init.body)).toMatchObject({
      text: ["Olá", "Mundo"],
      source_lang: "PT",
      target_lang: "EN-US",
    });
  });

  it("uses the pro endpoint when configured", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { translations: [{ text: "Hi" }] }));
    const provider = createDeepLProvider({ apiKey: "k", endpoint: "pro", fetchImpl });
    await provider.translateBatch(["Oi"], { sourceLang: "PT", targetLang: "EN-US" });
    expect(fetchImpl.mock.calls[0]![0]).toBe("https://api.deepl.com/v2/translate");
  });

  it("retries on 429 and succeeds once the retry-after window passes", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(429, {}, { "retry-after": "1" }))
      .mockResolvedValueOnce(jsonResponse(200, { translations: [{ text: "Hello" }] }));
    const sleepImpl = vi.fn(noopSleep());
    const provider = createDeepLProvider({ apiKey: "k", endpoint: "free", fetchImpl, sleepImpl });

    const result = await provider.translateBatch(["Olá"], {
      sourceLang: "PT",
      targetLang: "EN-US",
    });

    expect(result).toEqual(["Hello"]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(sleepImpl).toHaveBeenCalledWith(1000);
  });

  it("gives up after exhausting retries on repeated 429s", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(429, {}, {}));
    const provider = createDeepLProvider({
      apiKey: "k",
      endpoint: "free",
      fetchImpl,
      sleepImpl: noopSleep(),
      maxRetries: 2,
    });

    await expect(
      provider.translateBatch(["Olá"], { sourceLang: "PT", targetLang: "EN-US" }),
    ).rejects.toThrow(DeepLError);
    expect(fetchImpl).toHaveBeenCalledTimes(3); // initial attempt + 2 retries
  });

  it("retries transient 5xx errors with backoff", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(503, {}))
      .mockResolvedValueOnce(jsonResponse(200, { translations: [{ text: "Hello" }] }));
    const provider = createDeepLProvider({
      apiKey: "k",
      endpoint: "free",
      fetchImpl,
      sleepImpl: noopSleep(),
    });

    const result = await provider.translateBatch(["Olá"], {
      sourceLang: "PT",
      targetLang: "EN-US",
    });
    expect(result).toEqual(["Hello"]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("does not retry a 400 validation error", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(400, { message: "bad request" }));
    const provider = createDeepLProvider({
      apiKey: "k",
      endpoint: "free",
      fetchImpl,
      sleepImpl: noopSleep(),
    });

    await expect(
      provider.translateBatch(["Olá"], { sourceLang: "PT", targetLang: "EN-US" }),
    ).rejects.toThrow(DeepLError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("treats an aborted (timeout) request as retryable, then surfaces a timeout error if it never recovers", async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValue(Object.assign(new Error("aborted"), { name: "AbortError" }));
    const provider = createDeepLProvider({
      apiKey: "k",
      endpoint: "free",
      fetchImpl,
      sleepImpl: noopSleep(),
      maxRetries: 1,
    });

    await expect(
      provider.translateBatch(["Olá"], { sourceLang: "PT", targetLang: "EN-US" }),
    ).rejects.toMatchObject({
      reason: "timeout",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("never logs the API key or Authorization header", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(400, { message: "bad request", key: "super-secret" }));
    const provider = createDeepLProvider({
      apiKey: "super-secret",
      endpoint: "free",
      fetchImpl,
      sleepImpl: noopSleep(),
    });

    await provider
      .translateBatch(["Olá"], { sourceLang: "PT", targetLang: "EN-US" })
      .catch(() => {});

    const allLoggedText = [...consoleSpy.mock.calls, ...errorSpy.mock.calls].flat().join(" ");
    expect(allLoggedText).not.toContain("super-secret");
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe("ensureGlossary", () => {
    it("reuses an existing glossary with a matching content-hashed name", async () => {
      const fetchImpl = vi.fn().mockResolvedValue(
        jsonResponse(200, {
          glossaries: [{ glossary_id: "existing-id", name: "portfolio-i18n-PT-EN-abc123" }],
        }),
      );
      const provider = createDeepLProvider({ apiKey: "k", endpoint: "free", fetchImpl });

      const id = await provider.ensureGlossary({
        sourceLang: "PT",
        targetLang: "EN-US",
        entries: [["k3s", "k3s"]],
        contentHash: "abc123",
      });

      expect(id).toBe("existing-id");
      expect(fetchImpl).toHaveBeenCalledTimes(1); // list only, no create
    });

    it("creates a new glossary and prunes stale ones for the same language pair when content changed", async () => {
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(
          jsonResponse(200, {
            glossaries: [{ glossary_id: "old-id", name: "portfolio-i18n-PT-EN-oldhash" }],
          }),
        )
        .mockResolvedValueOnce(
          jsonResponse(200, { glossary_id: "new-id", name: "portfolio-i18n-PT-EN-newhash" }),
        )
        .mockResolvedValueOnce(jsonResponse(204, null));
      const provider = createDeepLProvider({ apiKey: "k", endpoint: "free", fetchImpl });

      const id = await provider.ensureGlossary({
        sourceLang: "PT",
        targetLang: "EN-US",
        entries: [["k3s", "k3s"]],
        contentHash: "newhash",
      });

      expect(id).toBe("new-id");
      expect(fetchImpl).toHaveBeenCalledTimes(3); // list, create, delete stale
      const deleteCall = fetchImpl.mock.calls[2]!;
      expect(deleteCall[0]).toBe("https://api-free.deepl.com/v2/glossaries/old-id");
      expect(deleteCall[1].method).toBe("DELETE");
    });
  });
});
