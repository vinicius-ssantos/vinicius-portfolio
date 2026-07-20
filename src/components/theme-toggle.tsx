"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

/**
 * Theme toggle that respects next-themes' recommended hydration pattern.
 * Uses suppressHydrationWarning on the button to avoid mismatches.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = theme === "system" ? resolvedTheme : theme;
  const isDark = current === "dark";
  const t = useTranslations("themeToggle");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      suppressHydrationWarning
      className="group inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {/* Render both icons; CSS controls visibility via dark: variant.
          The 'rotate' transition smooths the swap between Moon and Sun. */}
      <Sun className="hidden h-4 w-4 transition-transform duration-500 group-hover:rotate-45 dark:block" />
      <Moon className="block h-4 w-4 transition-transform duration-500 group-hover:-rotate-12 dark:hidden" />
    </button>
  );
}
