"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translations";
import type { Lang } from "@/lib/translations";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const lang: Lang = pathname.startsWith("/en") ? "en" : "pt";
  const t = translations[lang];

  useEffect(() => {
    console.error("Portfolio error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          {t.errorPage.eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.errorPage.title}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{t.errorPage.description}</p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            {t.errorPage.errorId}: {error.digest}
          </p>
        )}
        <div className="pt-2">
          <Button onClick={reset} size="default">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t.errorPage.tryAgain}
          </Button>
        </div>
      </div>
    </main>
  );
}
