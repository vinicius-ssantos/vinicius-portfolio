"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { profile, type Lang } from "@/content";
import type { Translation } from "@/lib/translations";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { trackEvent } from "@/lib/analytics";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader({ t, lang }: { t: Translation; lang: Lang }) {
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
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t.nav.experience}
          </Link>
          <Link
            href={`/${lang}#stack`}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t.nav.stack}
          </Link>
          <Link
            href={`/${lang}#projects`}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t.nav.projects}
          </Link>
          <Link
            href={`/${lang}#case-study`}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground lg:inline"
          >
            {t.nav.caseStudy}
          </Link>
          <Link
            href={`/${lang}#about`}
            className="nav-link hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground lg:inline"
          >
            {t.nav.about}
          </Link>

          <div className="ml-1 flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle lang={lang} />
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

          <MobileMenu t={t} lang={lang} />
        </nav>
      </div>
    </header>
  );
}
