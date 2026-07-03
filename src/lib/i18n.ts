import type { Lang } from "./translations";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const LOCALE_COOKIE = "portfolio-lang";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "pt" || value === "en";
}

export function parseLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getLocalePath(path: string, lang: Lang): string {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  return `/${lang}${trimmed ? `/${trimmed}` : ""}`;
}

export function swapLocaleInPath(pathname: string, nextLang: Lang): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = nextLang;
  } else {
    segments.unshift(nextLang);
  }
  return `/${segments.join("/")}`;
}

export function acceptLanguageLocale(header: string): Locale {
  const lower = header.toLowerCase();
  if (lower.startsWith("en") || lower.includes(",en")) return "en";
  return defaultLocale;
}
