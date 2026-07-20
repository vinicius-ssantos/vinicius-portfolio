"use client";

/**
 * Loading UI for project detail pages. Same fade+spinner and locale
 * detection as /[lang]/loading.tsx.
 */
import { usePathname } from "next/navigation";
import { messages } from "@/lib/messages";
import { detectLocaleFromPathname } from "@/lib/i18n";

export default function Loading() {
  const pathname = usePathname();
  const lang = detectLocaleFromPathname(pathname);
  const t = messages[lang];

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
