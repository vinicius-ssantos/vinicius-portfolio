"use client";

import { Mail, Download, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile, stack, t as tp, type Lang } from "@/content";
import type { Translation } from "@/lib/translations";

export function Hero({
  t,
  lang,
  onContactOpen,
}: {
  t: Translation;
  lang: Lang;
  onContactOpen: () => void;
}) {
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
            <Button asChild size="default" className="btn-arrow btn-press">
              <a href={`/${lang}#projects`}>
                {t.hero.seeProjects}
                <ArrowRight className="arrow-nudge ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onContactOpen}
              className="btn-press"
            >
              <Mail className="mr-2 h-4 w-4" />
              {t.hero.getInTouch}
            </Button>
            <Button asChild variant="ghost" size="default" className="btn-press">
              <a href={profile.links.cv} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                {t.hero.downloadCV}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
