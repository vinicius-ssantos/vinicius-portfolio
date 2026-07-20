export type RunReviewOptions = {
  keys: string[];
  ptPath?: string;
  enPath?: string;
  manifestPath?: string;
  log?: (...args: unknown[]) => void;
  error?: (...args: unknown[]) => void;
};

export function runReview(opts: RunReviewOptions): number;
