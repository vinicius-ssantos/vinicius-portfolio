import { defineRouting } from "next-intl/routing";

/**
 * next-intl's own locale list — kept as the canonical source instead of
 * re-deriving from src/lib/i18n.ts, since next-intl's server/client APIs
 * (getTranslations, useTranslations, NextIntlClientProvider) read from this
 * routing config directly. src/lib/i18n.ts re-exports `locales`/`defaultLocale`
 * from here so there's still exactly one place that lists "pt"/"en".
 *
 * `localePrefix: "always"` matches the app's existing behavior — every route
 * is under /pt or /en, there's no unprefixed default locale. Actual URL
 * routing/redirection stays in src/proxy.ts (cookie + Accept-Language
 * detection predates this file and is preserved as-is); this config exists
 * so next-intl's request/message APIs work, not to drive middleware.
 */
export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "always",
});
