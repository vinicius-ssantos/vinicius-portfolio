export const DEFAULT_MANIFEST_PATH: string;

export type ManifestStatus = "machine" | "reviewed";

export type ManifestEntry = {
  sourceHash: string;
  targetHash: string;
  status: ManifestStatus;
  provider: string;
  updatedAt: string;
};

export type Manifest = Record<string, ManifestEntry>;

export type EntryStatus = "new" | "changed" | "unchanged" | "reviewed" | "stale";

export type ClassifiedEntry = {
  status: EntryStatus;
  sourceHash: string;
  previous: ManifestEntry | null;
};

export type ClassifyResult = {
  entries: Record<string, ClassifiedEntry>;
  removed: string[];
};

export function computeHash(text: string): string;
export function loadManifest(path?: string): Manifest;
export function saveManifest(manifest: Manifest, path?: string): void;
export function classifyEntries(
  sourceFlat: Record<string, unknown>,
  manifest: Manifest,
): ClassifyResult;
export function selectTranslatable(
  entries: Record<string, ClassifiedEntry>,
  opts?: { forceReviewed?: boolean },
): string[];
