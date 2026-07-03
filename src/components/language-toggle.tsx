"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/translations";

/**
 * Language toggle.
 *
 * Architecture: the server reads the language from the `portfolio-lang` cookie
 * (see src/lib/get-lang.ts and src/middleware.ts). This client toggle:
 *   1. Reads the current language from the cookie (via document.cookie)
 *   2. On click: sets the new cookie and calls router.refresh() — which
 *      triggers a server re-render with the new cookie value.
 *
 * No React Context needed — server is the source of truth.
 */

function getCookieLang(): Lang {
  if (typeof document === "undefined") return "pt";
  const match = document.cookie.match(/(?:^|;\s*)portfolio-lang=(pt|en)/);
  return match ? (match[1] as Lang) : "pt";
}

function getServerSnapshot(): Lang {
  return "pt";
}

function subscribe() {
  // No external store — language only changes when user clicks
  return () => {};
}

export function LanguageToggle() {
  const router = useRouter();
  const lang = useSyncExternalStore(subscribe, getCookieLang, getServerSnapshot);

  const toggle = () => {
    const newLang: Lang = lang === "pt" ? "en" : "pt";
    // Set cookie (1 year expiry)
    document.cookie = `portfolio-lang=${newLang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    // Update <html lang="..."> for accessibility/SEO
    document.documentElement.lang = newLang;
    // Trigger server re-render — server reads new cookie and re-renders all sections
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para Português"}
      title={lang === "pt" ? "Switch to English" : "Mudar para Português"}
      className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Languages className="h-3.5 w-3.5" />
      <span className="uppercase tracking-wider">{lang}</span>
    </button>
  );
}
