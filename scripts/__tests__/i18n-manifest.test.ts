import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  computeHash,
  loadManifest,
  saveManifest,
  classifyEntries,
  selectTranslatable,
  type Manifest,
} from "../i18n-manifest.mjs";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "i18n-manifest-test-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("computeHash", () => {
  it("is deterministic for the same input", () => {
    expect(computeHash("hello")).toBe(computeHash("hello"));
  });

  it("differs for different input", () => {
    expect(computeHash("hello")).not.toBe(computeHash("hello!"));
  });
});

describe("loadManifest / saveManifest", () => {
  it("returns {} when the manifest file doesn't exist yet", () => {
    expect(loadManifest(join(dir, "missing.json"))).toEqual({});
  });

  it("round-trips through save and load", () => {
    const path = join(dir, "manifest.json");
    const manifest: Manifest = {
      "a.b": {
        sourceHash: "sha256:1",
        targetHash: "sha256:2",
        status: "machine",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
    };
    saveManifest(manifest, path);
    expect(loadManifest(path)).toEqual(manifest);
  });

  it("produces no diff when saved twice with identical content (idempotent serialization)", () => {
    const path = join(dir, "manifest.json");
    const manifest: Manifest = {
      z: {
        sourceHash: "sha256:1",
        targetHash: "sha256:2",
        status: "machine",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
      a: {
        sourceHash: "sha256:3",
        targetHash: "sha256:4",
        status: "reviewed",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
    };
    saveManifest(manifest, path);
    const first = loadManifest(path);
    saveManifest(first, path);
    const second = loadManifest(path);
    expect(second).toEqual(first);
    // Sorted key order is part of the determinism guarantee.
    expect(Object.keys(second)).toEqual(["a", "z"]);
  });
});

describe("classifyEntries", () => {
  it("classifies a key with no manifest entry as new", () => {
    const { entries } = classifyEntries({ greeting: "Olá" }, {});
    expect(entries.greeting!.status).toBe("new");
  });

  it("classifies a key whose hash matches an unreviewed manifest entry as unchanged", () => {
    const sourceHash = computeHash("Olá");
    const manifest: Manifest = {
      greeting: {
        sourceHash,
        targetHash: "sha256:x",
        status: "machine",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
    };
    const { entries } = classifyEntries({ greeting: "Olá" }, manifest);
    expect(entries.greeting!.status).toBe("unchanged");
  });

  it("classifies a key whose source text changed (still machine-translated) as changed", () => {
    const manifest: Manifest = {
      greeting: {
        sourceHash: computeHash("Olá"),
        targetHash: "sha256:x",
        status: "machine",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
    };
    const { entries } = classifyEntries({ greeting: "Olá, mundo" }, manifest);
    expect(entries.greeting!.status).toBe("changed");
  });

  it("classifies a reviewed key with a matching source hash as reviewed", () => {
    const manifest: Manifest = {
      greeting: {
        sourceHash: computeHash("Olá"),
        targetHash: "sha256:x",
        status: "reviewed",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
    };
    const { entries } = classifyEntries({ greeting: "Olá" }, manifest);
    expect(entries.greeting!.status).toBe("reviewed");
  });

  it("classifies a reviewed key whose source changed as stale, never silently as changed", () => {
    const manifest: Manifest = {
      greeting: {
        sourceHash: computeHash("Olá"),
        targetHash: "sha256:x",
        status: "reviewed",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
    };
    const { entries } = classifyEntries({ greeting: "Olá, mundo" }, manifest);
    expect(entries.greeting!.status).toBe("stale");
  });

  it("reports a manifest key absent from the current source as removed", () => {
    const manifest: Manifest = {
      "old.key": {
        sourceHash: "sha256:1",
        targetHash: "sha256:2",
        status: "machine",
        provider: "deepl",
        updatedAt: "2026-01-01",
      },
    };
    const { removed } = classifyEntries({}, manifest);
    expect(removed).toEqual(["old.key"]);
  });
});

describe("selectTranslatable", () => {
  it("includes new and changed, excludes unchanged/reviewed/stale by default", () => {
    const entries = {
      a: { status: "new", sourceHash: "h", previous: null },
      b: { status: "changed", sourceHash: "h", previous: null },
      c: { status: "unchanged", sourceHash: "h", previous: null },
      d: { status: "reviewed", sourceHash: "h", previous: null },
      e: { status: "stale", sourceHash: "h", previous: null },
    } as const;
    expect(selectTranslatable(entries)).toEqual(["a", "b"]);
  });

  it("also includes stale when forceReviewed is set", () => {
    const entries = {
      e: { status: "stale", sourceHash: "h", previous: null },
    } as const;
    expect(selectTranslatable(entries, { forceReviewed: true })).toEqual(["e"]);
  });
});
