import en from "../../messages/en.json";
import pt from "../../messages/pt.json";
import type { Locale } from "./i18n";

/**
 * Synchronous, provider-independent message lookup — for the small set of
 * special Next.js boundary files (loading.tsx, error.tsx, not-found.tsx)
 * that don't receive route `params` and may render before/outside
 * NextIntlClientProvider mounts (e.g. a 404 on a path with no valid
 * locale segment at all). Everywhere else, use useTranslations/getTranslations.
 */
export const messages: Record<Locale, typeof en> = { en, pt };
