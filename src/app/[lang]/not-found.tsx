"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { translations } from "@/lib/translations";
import { detectLocaleFromPathname } from "@/lib/i18n";

// Locale-scoped 404 — rendered when a /[lang]/... route misses.
//
// `not-found.tsx` is a special Next.js boundary file that does NOT receive
// `params`, but it can still read the locale from the URL via `usePathname`.
export default function NotFound() {
  const pathname = usePathname();
  const lang = detectLocaleFromPathname(pathname);
  const t = translations[lang].notFound;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        <p className="animate-error-shake font-mono text-xs uppercase tracking-wider text-primary">
          {t.eyebrow}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t.title}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{t.description}</p>
        <div className="pt-2">
          <Button asChild size="default">
            <Link href={`/${lang}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
