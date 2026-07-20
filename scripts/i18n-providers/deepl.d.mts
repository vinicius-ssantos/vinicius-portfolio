export type DeepLEndpoint = "free" | "pro";

export type DeepLProviderOptions = {
  apiKey: string;
  endpoint: DeepLEndpoint;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxRetries?: number;
  sleepImpl?: (ms: number) => Promise<void>;
};

export type TranslateBatchOptions = {
  sourceLang: string;
  targetLang: string;
  glossaryId?: string;
  context?: string;
};

export type EnsureGlossaryOptions = {
  sourceLang: string;
  targetLang: string;
  entries: [string, string][];
  contentHash: string;
};

export type DeepLProvider = {
  translateBatch(texts: string[], opts: TranslateBatchOptions): Promise<string[]>;
  ensureGlossary(opts: EnsureGlossaryOptions): Promise<string>;
};

export function createDeepLProvider(opts: DeepLProviderOptions): DeepLProvider;

export class DeepLError extends Error {
  reason: string;
  status?: number;
  constructor(reason: string, status?: number);
}
