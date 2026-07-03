import { cookies } from "next/headers";
import type { Lang } from "./translations";
import { translations } from "./translations";

/**
 * Server-side helper to read the visitor's language from the cookie.
 * Used by app/page.tsx (Server Component) to pass lang + t as props
 * to Server Component sections.
 *
 * Default: pt (user is Brazilian, primary audience).
 */
export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("portfolio-lang")?.value;
  return lang === "en" ? "en" : "pt";
}

export async function getLangAndTranslations() {
  const lang = await getLang();
  return { lang, t: translations[lang] };
}
