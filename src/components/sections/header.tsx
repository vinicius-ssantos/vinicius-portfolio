"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { profile, type Lang } from "@/content";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { trackEvent } from "@/lib/analytics";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { NAV_SECTION_IDS } from "@/lib/nav-sections";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = useTranslations("nav");
  const activeSection = useScrollSpy(NAV_SECTION_IDS);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            VS
          </span>
          <span className="hidden sm:inline">{profile.handle}</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href={`/${lang}#experience`}
            data-active={activeSection === "experience"}
            aria-current={activeSection === "experience" ? "location" : undefined}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t("experience")}
          </Link>
          <Link
            href={`/${lang}#stack`}
            data-active={activeSection === "stack"}
            aria-current={activeSection === "stack" ? "location" : undefined}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t("stack")}
          </Link>
          <Link
            href={`/${lang}#projects`}
            data-active={activeSection === "projects"}
            aria-current={activeSection === "projects" ? "location" : undefined}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t("projects")}
          </Link>
          <Link
            href={`/${lang}#case-study`}
            data-active={activeSection === "case-study"}
            aria-current={activeSection === "case-study" ? "location" : undefined}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground lg:inline"
          >
            {t("caseStudy")}
          </Link>
          <Link
            href={`/${lang}#about`}
            data-active={activeSection === "about"}
            aria-current={activeSection === "about" ? "location" : undefined}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground lg:inline"
          >
            {t("about")}
          </Link>

          <div className="ml-1 flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            onClick={() => trackEvent("linkedin_click")}
            className="hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            <Linkedin className="h-4 w-4" />
          </a>

          <MobileMenu lang={lang} activeSection={activeSection} />
        </nav>
      </div>
    </header>
  );
}
