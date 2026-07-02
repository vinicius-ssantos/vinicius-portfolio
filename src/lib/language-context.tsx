"use client";

import { createContext, useContext, useCallback, ReactNode, useSyncExternalStore } from "react";
import { translations, type Lang } from "./translations";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "portfolio-lang";

// External store for language — avoids setState-in-effect lint error
// and is the React 19-recommended pattern for "subscribe to external source"
let currentLang: Lang = "pt";
const listeners = new Set<() => void>();

function getSnapshot(): Lang {
  return currentLang;
}

function getServerSnapshot(): Lang {
  return "pt";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setLangInternal(newLang: Lang) {
  if (newLang === currentLang) return;
  currentLang = newLang;
  // Notify all subscribers
  listeners.forEach((l) => l());
}

function detectInitialLang(): Lang {
  // SSR safe: default to pt during server render
  if (typeof window === "undefined") return "pt";

  // 1. Check explicit user preference in localStorage
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "pt" || stored === "en") return stored;

  // 2. Check cookie (set by middleware based on Accept-Language)
  const match = document.cookie.match(/(?:^|;\s*)portfolio-lang=(pt|en)/);
  if (match) return match[1] as Lang;

  // 3. Detect from browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("pt")) return "pt";
  if (browserLang.startsWith("en")) return "en";

  // 4. Default to pt (user is Brazilian, primary audience)
  return "pt";
}

// Initialize on client-side only (one-time, before React renders)
if (typeof window !== "undefined") {
  const detected = detectInitialLang();
  currentLang = detected;
  // Set <html lang="..."> for accessibility/SEO
  document.documentElement.lang = detected;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore: React 19 recommended pattern
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((newLang: Lang) => {
    setLangInternal(newLang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, newLang);
      // Also set cookie so middleware respects choice on next visit
      document.cookie = `portfolio-lang=${newLang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      // Update <html lang="..."> for accessibility/SEO
      document.documentElement.lang = newLang;
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(currentLang === "pt" ? "en" : "pt");
  }, [setLang]);

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggleLang,
    t: translations[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

