import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runReview } from "../i18n-review.mjs";
import { computeHash, loadManifest, saveManifest } from "../i18n-manifest.mjs";

let dir: string;
let ptPath: string;
let enPath: string;
let manifestPath: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "i18n-review-test-"));
  ptPath = join(dir, "pt.json");
  enPath = join(dir, "en.json");
  manifestPath = join(dir, "manifest.json");
  writeFileSync(ptPath, JSON.stringify({ hero: { title: "Olá mundo" } }), "utf8");
  writeFileSync(enPath, JSON.stringify({ hero: { title: "Hello world" } }), "utf8");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("runReview", () => {
  it("requires at least one --key", () => {
    const error = vi.fn();
    const code = runReview({ keys: [], ptPath, enPath, manifestPath, error });
    expect(code).toBe(1);
    expect(error).toHaveBeenCalled();
  });

  it("marks a key reviewed with hashes matching the current source and target", () => {
    const code = runReview({ keys: ["hero.title"], ptPath, enPath, manifestPath, log: vi.fn() });
    expect(code).toBe(0);
    const manifest = loadManifest(manifestPath);
    expect(manifest["hero.title"]).toMatchObject({
      status: "reviewed",
      sourceHash: computeHash("Olá mundo"),
      targetHash: computeHash("Hello world"),
    });
  });

  it("fails and marks nothing when the key doesn't exist in pt.json", () => {
    const error = vi.fn();
    const code = runReview({ keys: ["nope.missing"], ptPath, enPath, manifestPath, error });
    expect(code).toBe(1);
    expect(loadManifest(manifestPath)).toEqual({});
  });

  it("fails when the key has no translated value in en.json yet", () => {
    writeFileSync(enPath, JSON.stringify({}), "utf8");
    const error = vi.fn();
    const code = runReview({ keys: ["hero.title"], ptPath, enPath, manifestPath, error });
    expect(code).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("i18n:review could not mark"));
  });

  it("preserves the existing provider field when re-reviewing an already-tracked key", () => {
    saveManifest(
      {
        "hero.title": {
          sourceHash: computeHash("old"),
          targetHash: computeHash("old"),
          status: "machine",
          provider: "deepl",
          updatedAt: "2020-01-01",
        },
      },
      manifestPath,
    );
    runReview({ keys: ["hero.title"], ptPath, enPath, manifestPath, log: vi.fn() });
    const manifest = loadManifest(manifestPath);
    expect(manifest["hero.title"]).toMatchObject({ status: "reviewed", provider: "deepl" });
  });
});
