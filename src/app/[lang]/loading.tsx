"use client";

/**
 * Loading UI shown by Next.js App Router when the /[lang] segment is
 * suspending (e.g. on first navigation, during streaming). Provides a
 * subtle fade-in so route changes don't feel jarring.
 *
 * `loading.tsx` doesn't receive route `params`, so locale is read from the
 * URL via `usePathname` — same strategy as error.tsx/not-found.tsx.
 */
import { usePathname } from "next/navigation";
import { translations } from "@/lib/translations";
import { detectLocaleFromPathname } from "@/lib/i18n";

export default function Loading() {
  const pathname = usePathname();
  const lang = detectLocaleFromPathname(pathname);
  const t = translations[lang];

  return (
    <div
      className="page-transition flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-secondary" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t.a11y.loading}
        </span>
      </div>
    </div>
  );
}
