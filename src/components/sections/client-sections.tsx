"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile, stack, t as tp, type Lang } from "@/lib/portfolio-data";
import type { translations } from "@/lib/translations";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

type T = typeof translations.en;

/* ------------------------------------------------------------------ */
/* Header (client — has language/theme toggles)                        */
/* ------------------------------------------------------------------ */

export function SiteHeader({ t, lang }: { t: T; lang: Lang }) {
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
            className="hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero (client — has contact modal trigger + Globe icon for languages) */
/* ------------------------------------------------------------------ */

import { Globe } from "lucide-react";

export function Hero({ t, lang, onContactOpen }: { t: T; lang: Lang; onContactOpen: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground animate-badge-glow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {t.hero.badge}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {profile.name.split(" ").map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="hero-word"
                style={{ "--word-index": i } as React.CSSProperties}
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          <p className="mt-3 font-mono text-base text-primary sm:text-lg">
            {tp(profile.role, lang)} · {tp(profile.location, lang)}
          </p>

          <p className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            {stack.Languages.map((l) => (typeof l === "string" ? l : l[lang])).join("  ·  ")}
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {tp(profile.pitch, lang)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button type="button" size="default" onClick={onContactOpen} className="btn-press">
              <Mail className="mr-2 h-4 w-4" />
              {t.hero.getInTouch}
            </Button>
            <Button asChild variant="outline" size="default" className="btn-press">
              <a href={profile.links.cv} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                {t.hero.downloadCV}
              </a>
            </Button>
            <Button asChild variant="ghost" size="default" className="btn-arrow btn-press">
              <a href={`/${lang}#experience`}>
                {t.hero.seeExperience}
                <ArrowRight className="arrow-nudge ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer (client — has contact modal trigger)                         */
/* ------------------------------------------------------------------ */

export function SiteFooter({ t, onContactOpen }: { t: T; onContactOpen: () => void }) {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-bold">
            VS
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name}. {t.footer.builtWith}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onContactOpen}
            aria-label="E-mail"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </button>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
