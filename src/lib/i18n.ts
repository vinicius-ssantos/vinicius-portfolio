// Single source of truth for the "locale"/"lang" concept used across
// routing (this file), content (`src/content`), and UI translations
// (`src/lib/translations.ts`, which re-exports this as `Lang`).
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

export function getLocalePath(path: string, lang: Locale): string {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  return `/${lang}${trimmed ? `/${trimmed}` : ""}`;
}

/**
 * Reads the locale out of a pathname's first segment (e.g. "/en/projects" -> "en").
 * Used by client boundary files (error/not-found/loading) that don't receive
 * route `params`, so every one of them detects locale the same way.
 */
export function detectLocaleFromPathname(pathname: string | null | undefined): Locale {
  const segment = pathname?.split("/").filter(Boolean)[0];
  return parseLocale(segment);
}

const monthYearFormatters: Record<Locale, Intl.DateTimeFormat> = {
  pt: new Intl.DateTimeFormat("pt-BR", { year: "numeric", month: "short" }),
  en: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }),
};

/** Formats an ISO date ("2024-08-01") as a short month + year for `locale`. */
export function formatMonthYear(iso: string, locale: Locale): string {
  return monthYearFormatters[locale].format(new Date(`${iso}T00:00:00`));
}

export function swapLocaleInPath(pathname: string, nextLang: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = nextLang;
  } else {
    segments.unshift(nextLang);
  }
  return `/${segments.join("/")}`;
}

/**
 * Parse an Accept-Language header and return the best supported locale.
 *
 * Respects q-values per RFC 7231 §5.3.5: tags are sorted by preference
 * (default q=1.0 when omitted) and the highest-q tag that matches a
 * supported locale wins. Falls back to `defaultLocale` if nothing matches.
 *
 * Examples:
 *   "en-US,en;q=0.9,pt-BR;q=0.8"  → "en"
 *   "es-ES,es;q=0.9"              → "pt"  (es not supported, default wins)
 *   "pt-BR,en-US;q=0.8"           → "pt"
 *   ""                            → "pt"
 */
export function acceptLanguageLocale(header: string): Locale {
  if (!header) return defaultLocale;

  const parsed = header
    .split(",")
    .map((entry) => {
      const [tag = "", ...params] = entry.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.split("=")[1] ?? "") : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag.length > 0 && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of parsed) {
    // Exact match first.
    if (tag === "en" || tag === "pt") return tag;
    // Then by primary-language prefix.
    const primary = tag.split("-")[0];
    if (primary === "en") return "en";
    if (primary === "pt") return "pt";
  }

  return defaultLocale;
}
