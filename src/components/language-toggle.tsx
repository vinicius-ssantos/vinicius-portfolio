"use client";

import { useLanguage } from "@/lib/language-context";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para Português"}
      title={lang === "pt" ? "Switch to English" : "Mudar para Português"}
      className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Languages className="h-3.5 w-3.5" />
      <span className="uppercase tracking-wider">{lang}</span>
    </button>
  );
}
