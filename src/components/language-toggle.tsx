"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/i18n";
import { swapLocaleInPath, isLocale } from "@/lib/i18n";

function getCookieLang(): Lang {
  if (typeof document === "undefined") return "pt";
  const match = document.cookie.match(/(?:^|;\s*)portfolio-lang=(pt|en)/);
  return match ? (match[1] as Lang) : "pt";
}

function getServerSnapshot(): Lang {
  return "pt";
}

function subscribe() {
  return () => {};
}

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = useSyncExternalStore(subscribe, getCookieLang, getServerSnapshot);

  const toggle = () => {
    const nextLang: Lang = lang === "pt" ? "en" : "pt";
    document.cookie = `portfolio-lang=${nextLang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    document.documentElement.lang = nextLang;
    const next = swapLocaleInPath(pathname, nextLang);
    router.push(next);
  };

  const inferred = isLocale(pathname.split("/")[1]) ? (pathname.split("/")[1] as Lang) : lang;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={inferred === "pt" ? "Switch to English" : "Mudar para Português"}
      title={inferred === "pt" ? "Switch to English" : "Mudar para Português"}
      className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Languages className="h-3.5 w-3.5" />
      <span className="uppercase tracking-wider">{inferred}</span>
    </button>
  );
}
