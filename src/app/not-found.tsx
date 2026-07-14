"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translations";
import type { Lang } from "@/lib/translations";

export default function NotFound() {
  const pathname = usePathname();
  const lang: Lang = pathname.startsWith("/en") ? "en" : "pt";
  const t = translations[lang];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          {t.notFound.eyebrow}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t.notFound.title}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t.notFound.description}
        </p>
        <div className="pt-2">
          <Button asChild size="default">
            <Link href={`/${lang}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.notFound.back}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
