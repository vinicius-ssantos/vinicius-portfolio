"use client";

import { useTranslations } from "next-intl";
import { Mail, Download, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile, getSpokenLanguages, type Lang } from "@/content";
import { useViewportMotion } from "@/hooks/use-viewport-motion";
import { trackEvent } from "@/lib/analytics";

export function Hero({ lang, onContactOpen }: { lang: Lang; onContactOpen: () => void }) {
  const t = useTranslations("hero");
  const profile = getProfile(lang);
  const spokenLanguages = getSpokenLanguages(lang);
  const { ref, inViewport } = useViewportMotion<HTMLElement>({
    rootMargin: "0px",
    threshold: 0,
  });

  return (
    <section
      ref={ref}
      data-motion-in-viewport={inViewport ? "true" : "false"}
      className="relative overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground animate-badge-glow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {t("badge")}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-[0.24em]">
              {profile.name
                .trim()
                .split(/\s+/)
                .map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="hero-word"
                    style={{ "--word-index": i } as React.CSSProperties}
                  >
                    {word}
                  </span>
                ))}
            </span>
          </h1>

          <p className="mt-3 font-mono text-base text-primary sm:text-lg">
            {profile.role} · {profile.location}
          </p>

          <p className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            {spokenLanguages.join("  ·  ")}
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {profile.pitch}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="default" className="btn-arrow btn-press">
              <a
                href={`/${lang}#projects`}
                onClick={() => trackEvent("view_projects_click", { lang })}
              >
                {t("seeProjects")}
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
              {t("getInTouch")}
            </Button>
            <Button asChild variant="ghost" size="default" className="btn-press">
              <a
                href={profile.links.cv}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cv_download", { lang })}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("downloadCV")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
