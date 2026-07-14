import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type Params = Promise<{ lang: string; paths: string[] }>;

// Catch-all that triggers the locale-scoped not-found.tsx for unknown
// paths under /[lang]/*. Without this, Next.js falls back to the root
// /app/not-found.tsx which is English-only.
//
// Examples that hit this route:
//   /pt/this-does-not-exist     → notFound() → /[lang]/not-found.tsx (PT)
//   /en/foo/bar/baz             → notFound() → /[lang]/not-found.tsx (EN)
//   /pt/projects/unknown-slug   → handled by the [slug] page itself
//
// Locale-scoped 404s now render with the right translations.
export default async function CatchAll({ params }: { params: Params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // Any path that lands here is by definition unknown — trigger 404.
  notFound();
}
