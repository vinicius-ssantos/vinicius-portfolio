export type GlossaryMode = "preserve" | "preferred" | "forbidden" | "contextual";

export type GlossaryEntry = {
  source: string;
  target: string;
  mode: GlossaryMode;
  caseSensitive?: boolean;
  notes?: string;
};

export type Glossary = {
  modes?: Record<string, string>;
  entries: GlossaryEntry[];
};

export type GlossaryViolation = { entry: GlossaryEntry; reason: string };
export type GlossaryMatch = { entry: GlossaryEntry };
export type GlossaryCheckResult = { violations: GlossaryViolation[]; info: GlossaryMatch[] };
export type ProtectedSpans = { urls: string[]; emails: string[]; codeSpans: string[] };

export function loadGlossary(path?: string): Glossary;
export function flattenMessages(
  obj: Record<string, unknown>,
  prefix?: string,
): Record<string, unknown>;
export function getNested(obj: Record<string, unknown>, dottedKey: string): unknown;
export function setNested(obj: Record<string, unknown>, dottedKey: string, value: unknown): void;
export function extractPlaceholders(text: string): string[];
export function extractProtectedSpans(text: string): ProtectedSpans;
export function checkGlossary(text: string, glossary: Glossary): GlossaryCheckResult;
export function glossaryTargetPresent(text: string, entry: GlossaryEntry): boolean;
