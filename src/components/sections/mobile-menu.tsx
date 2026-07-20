"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { profile, type Lang } from "@/content";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { trackEvent } from "@/lib/analytics";
import type { NavSectionId } from "@/lib/nav-sections";

export function MobileMenu({
  lang,
  activeSection = null,
}: {
  lang: Lang;
  activeSection?: NavSectionId | null;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change (e.g. language toggle navigating to /en or /pt).
  // Derived during render (React's documented pattern for resetting state
  // on a prop/value change) rather than in an effect, to avoid the extra
  // render pass a setState-in-effect would cause.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const links: { id: NavSectionId; href: string; label: string }[] = [
    { id: "experience", href: `/${lang}#experience`, label: t("nav.experience") },
    { id: "stack", href: `/${lang}#stack`, label: t("nav.stack") },
    { id: "projects", href: `/${lang}#projects`, label: t("nav.projects") },
    { id: "case-study", href: `/${lang}#case-study`, label: t("nav.caseStudy") },
    { id: "about", href: `/${lang}#about`, label: t("nav.about") },
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={t("a11y.openMenu")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="mobile-menu-overlay"
          className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:hidden"
        />
        <DialogPrimitive.Content
          data-slot="mobile-menu-content"
          className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top sm:hidden"
        >
          <DialogPrimitive.Title className="sr-only">{t("a11y.menuTitle")}</DialogPrimitive.Title>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-semibold">{profile.handle}</span>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label={t("a11y.closeMenu")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </DialogPrimitive.Close>
          </div>

          <nav className="mt-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                data-active={activeSection === l.id}
                aria-current={activeSection === l.id ? "location" : undefined}
                className="nav-link rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-1">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                onClick={() => trackEvent("linkedin_click")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
