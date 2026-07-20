export type RunStatusOptions = {
  only?: string;
  ptPath?: string;
  log?: (...args: unknown[]) => void;
};

export function runStatus(opts: RunStatusOptions): number;
