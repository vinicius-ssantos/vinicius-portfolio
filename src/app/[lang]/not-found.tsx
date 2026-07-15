"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { translations, type Lang } from "@/lib/translations";

// Locale-scoped 404 — rendered when a /[lang]/... route misses.
//
// `not-found.tsx` is a special Next.js boundary file that does NOT receive
// `params`, so we read the locale from <html lang="..."> (set by layout.tsx)
// or from the locale cookie as a fallback.
function pickLocaleFromDocument(): Lang {
  if (typeof document === "undefined") return "pt";
  const fromHtml = document.documentElement.lang;
  if (fromHtml === "en" || fromHtml === "pt") return fromHtml;
  const fromCookie = document.cookie.match(/(?:^|;\s*)portfolio-lang=(pt|en)/);
  return fromCookie ? (fromCookie[1] as Lang) : "pt";
}

export default function NotFound() {
  const lang = pickLocaleFromDocument();
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
