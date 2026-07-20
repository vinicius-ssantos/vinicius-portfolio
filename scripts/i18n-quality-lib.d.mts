import type { Glossary } from "./i18n-lib.mjs";

export type CheckMessageCatalogsOptions = {
  ptPath?: string;
  enPath?: string;
  glossary?: Glossary;
};

export type CheckMessageCatalogsResult = {
  errors: string[];
  warnings: string[];
  keyCount: number;
};

export function checkMessageCatalogs(
  opts?: CheckMessageCatalogsOptions,
): CheckMessageCatalogsResult;
