import type { DeepLProvider } from "./i18n-providers/deepl.mjs";

export type RunTranslateOptions = {
  locale: string;
  dryRun: boolean;
  forceReviewed: boolean;
  provider?: DeepLProvider;
  apiKeyPresent: boolean;
  ptPath?: string;
  enPath?: string;
  manifestPath?: string;
  log?: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
  error?: (...args: unknown[]) => void;
};

export function runTranslate(opts: RunTranslateOptions): Promise<number>;
