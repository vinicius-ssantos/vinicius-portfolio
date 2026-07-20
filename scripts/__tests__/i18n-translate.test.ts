import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runTranslate } from "../i18n-translate.mjs";
import { computeHash, loadManifest, saveManifest } from "../i18n-manifest.mjs";

let dir: string;
let ptPath: string;
let enPath: string;
let manifestPath: string;

function writeCatalogs(pt: Record<string, unknown>, en: Record<string, unknown> = {}) {
  writeFileSync(ptPath, JSON.stringify(pt, null, 2), "utf8");
  writeFileSync(enPath, JSON.stringify(en, null, 2), "utf8");
}

function fakeProvider(translateImpl: (texts: string[]) => string[] | Promise<string[]>) {
  return {
    ensureGlossary: vi.fn().mockResolvedValue("glossary-id"),
    translateBatch: vi.fn(async (texts: string[]) => translateImpl(texts)),
  };
}

function silentLoggers() {
  return { log: vi.fn(), warn: vi.fn(), error: vi.fn() };
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "i18n-translate-test-"));
  ptPath = join(dir, "pt.json");
  enPath = join(dir, "en.json");
  manifestPath = join(dir, "manifest.json");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("runTranslate", () => {
  it("rejects a non-'en' locale without touching files or the network", async () => {
    writeCatalogs({ hero: { title: "Olá" } });
    const provider = fakeProvider((texts) => texts.map((t) => `EN:${t}`));
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "fr",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
    expect(provider.translateBatch).not.toHaveBeenCalled();
  });

  it("--dry-run reports counts without calling the provider or writing files", async () => {
    writeCatalogs({ hero: { title: "Olá mundo" } });
    const provider = fakeProvider((texts) => texts.map((t) => `EN:${t}`));
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: true,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    expect(provider.translateBatch).not.toHaveBeenCalled();
    expect(existsSync(manifestPath)).toBe(false);
    expect(loggers.log).toHaveBeenCalledWith(expect.stringContaining("hero.title"));
  });

  it("fails when a real run has no API key configured", async () => {
    writeCatalogs({ hero: { title: "Olá" } });
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider: undefined,
      apiKeyPresent: false,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
  });

  it("translates new keys, writes en.json, and records a machine manifest entry", async () => {
    writeCatalogs({ hero: { title: "Olá mundo" } });
    const provider = fakeProvider((texts) => texts.map(() => "Hello world"));
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    const en = JSON.parse(readFileSync(enPath, "utf8"));
    expect(en.hero.title).toBe("Hello world");
    const manifest = loadManifest(manifestPath);
    expect(manifest["hero.title"]).toMatchObject({ status: "machine", provider: "deepl" });
    expect(manifest["hero.title"]!.sourceHash).toBe(computeHash("Olá mundo"));
  });

  it("is idempotent: a second run with no source changes is a no-op with no diff", async () => {
    writeCatalogs({ hero: { title: "Olá mundo" } });
    const provider = fakeProvider((texts) => texts.map(() => "Hello world"));
    const loggers = silentLoggers();

    await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    const enAfterFirstRun = readFileSync(enPath, "utf8");
    const manifestAfterFirstRun = readFileSync(manifestPath, "utf8");

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    expect(provider.translateBatch).toHaveBeenCalledTimes(1); // only the first run
    expect(readFileSync(enPath, "utf8")).toBe(enAfterFirstRun);
    expect(readFileSync(manifestPath, "utf8")).toBe(manifestAfterFirstRun);
  });

  it("never overwrites a reviewed translation whose source is unchanged", async () => {
    writeCatalogs(
      { hero: { title: "Olá mundo" } },
      { hero: { title: "Hello, world (human-reviewed)" } },
    );
    saveManifest(
      {
        "hero.title": {
          sourceHash: computeHash("Olá mundo"),
          targetHash: computeHash("Hello, world (human-reviewed)"),
          status: "reviewed",
          provider: "deepl",
          updatedAt: "2026-01-01",
        },
      },
      manifestPath,
    );
    const provider = fakeProvider((texts) => texts.map(() => "Machine translation would go here"));
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    expect(provider.translateBatch).not.toHaveBeenCalled();
    const en = JSON.parse(readFileSync(enPath, "utf8"));
    expect(en.hero.title).toBe("Hello, world (human-reviewed)");
  });

  it("leaves a stale reviewed translation untouched unless --force-reviewed is set, and warns", async () => {
    writeCatalogs(
      { hero: { title: "Olá mundo, agora diferente" } },
      { hero: { title: "Old reviewed English" } },
    );
    saveManifest(
      {
        "hero.title": {
          sourceHash: computeHash("Olá mundo"),
          targetHash: computeHash("Old reviewed English"),
          status: "reviewed",
          provider: "deepl",
          updatedAt: "2026-01-01",
        },
      },
      manifestPath,
    );
    const provider = fakeProvider((texts) => texts.map(() => "New machine translation"));
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    expect(provider.translateBatch).not.toHaveBeenCalled();
    expect(loggers.warn).toHaveBeenCalledWith(expect.stringContaining("stale"));
    const en = JSON.parse(readFileSync(enPath, "utf8"));
    expect(en.hero.title).toBe("Old reviewed English");
  });

  it("regenerates a stale reviewed translation when --force-reviewed is set", async () => {
    writeCatalogs(
      { hero: { title: "Olá mundo, agora diferente" } },
      { hero: { title: "Old reviewed English" } },
    );
    saveManifest(
      {
        "hero.title": {
          sourceHash: computeHash("Olá mundo"),
          targetHash: computeHash("Old reviewed English"),
          status: "reviewed",
          provider: "deepl",
          updatedAt: "2026-01-01",
        },
      },
      manifestPath,
    );
    const provider = fakeProvider((texts) => texts.map(() => "New machine translation"));
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: true,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    expect(provider.translateBatch).toHaveBeenCalledTimes(1);
    const en = JSON.parse(readFileSync(enPath, "utf8"));
    expect(en.hero.title).toBe("New machine translation");
    const manifest = loadManifest(manifestPath);
    expect(manifest["hero.title"]!.status).toBe("machine");
  });

  it("rejects a translation with a removed or renamed ICU placeholder, without writing files", async () => {
    writeCatalogs({ greeting: { hi: "Olá {name}" } });
    const provider = fakeProvider(() => ["Hello there"]); // dropped {name}
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
    expect(existsSync(manifestPath)).toBe(false);
    const en = JSON.parse(readFileSync(enPath, "utf8"));
    expect(en.greeting).toBeUndefined();
    expect(loggers.error).toHaveBeenCalledWith(expect.stringContaining("placeholder mismatch"));
  });

  it("rejects a translation that alters a URL, email, or code span", async () => {
    writeCatalogs({ footer: { link: "Veja https://example.com/docs para mais." } });
    const provider = fakeProvider(() => ["See https://example.com/CHANGED for more."]);
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
    expect(loggers.error).toHaveBeenCalledWith(expect.stringContaining("url"));
  });

  it("rejects a translation that alters a glossary preserve-term", async () => {
    writeCatalogs({ stack: { item: "Rodamos em k3s na VPS." } });
    const provider = fakeProvider(() => ["We run on K3S on the VPS."]); // wrong case for a case-sensitive preserve term
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
    expect(loggers.error).toHaveBeenCalledWith(expect.stringContaining("k3s"));
  });

  it("accepts a translation that doesn't use a glossary 'preferred' term — that's informational, never blocking", async () => {
    writeCatalogs({ about: { note: "Foco em observabilidade." } });
    // "observability" is a `preferred` glossary entry; DeepL choosing "monitoring" instead must not block.
    const provider = fakeProvider(() => ["Focus on monitoring."]);
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    const en = JSON.parse(readFileSync(enPath, "utf8"));
    expect(en.about.note).toBe("Focus on monitoring.");
  });

  it("rejects an empty translation", async () => {
    writeCatalogs({ hero: { title: "Olá mundo" } });
    const provider = fakeProvider(() => [""]);
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
    expect(loggers.error).toHaveBeenCalledWith(expect.stringContaining("empty translation"));
  });

  it("fails on a partial provider response instead of writing mismatched keys", async () => {
    writeCatalogs({ hero: { title: "Olá", subtitle: "Mundo" } });
    const provider = fakeProvider(() => ["Only one translation"]); // 2 requested, 1 returned
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
    expect(existsSync(manifestPath)).toBe(false);
    expect(loggers.error).toHaveBeenCalledWith(expect.stringContaining("partial response"));
  });

  it("surfaces a provider failure (e.g. exhausted retries) as a clean non-zero exit", async () => {
    writeCatalogs({ hero: { title: "Olá" } });
    const provider = {
      ensureGlossary: vi.fn().mockResolvedValue("glossary-id"),
      translateBatch: vi
        .fn()
        .mockRejectedValue(Object.assign(new Error("boom"), { reason: "rate-limited" })),
    };
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(1);
    expect(existsSync(manifestPath)).toBe(false);
  });

  it("still translates when the glossary provider setup fails, just without a glossary id", async () => {
    writeCatalogs({ hero: { title: "Olá" } });
    const provider = {
      ensureGlossary: vi
        .fn()
        .mockRejectedValue(Object.assign(new Error("boom"), { reason: "provider-unavailable" })),
      translateBatch: vi.fn(async (texts: string[]) => texts.map(() => "Hello")),
    };
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    expect(loggers.warn).toHaveBeenCalledWith(expect.stringContaining("glossary"));
  });

  it("reports removed keys still tracked in the manifest without failing the run", async () => {
    writeCatalogs({});
    saveManifest(
      {
        "gone.key": {
          sourceHash: "sha256:old",
          targetHash: "sha256:old",
          status: "machine",
          provider: "deepl",
          updatedAt: "2026-01-01",
        },
      },
      manifestPath,
    );
    const provider = fakeProvider((texts) => texts.map(() => "x"));
    const loggers = silentLoggers();

    const code = await runTranslate({
      locale: "en",
      dryRun: false,
      forceReviewed: false,
      provider,
      apiKeyPresent: true,
      ptPath,
      enPath,
      manifestPath,
      ...loggers,
    });

    expect(code).toBe(0);
    expect(loggers.warn).toHaveBeenCalledWith(expect.stringContaining("gone.key"));
  });
});
