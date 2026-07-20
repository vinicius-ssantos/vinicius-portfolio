import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * No next-intl middleware is registered (src/proxy.ts owns locale
 * detection/redirection already) — so `requestLocale` only resolves when a
 * page/layout under [lang] calls `setRequestLocale(lang)` before any
 * getTranslations/useTranslations call in that render. Falls back to
 * defaultLocale deterministically if that never happens (e.g. a route
 * outside [lang], or a locale segment that failed validation upstream).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && routing.locales.includes(requested as (typeof routing.locales)[number])
      ? requested
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
