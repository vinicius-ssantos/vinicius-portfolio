import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProject, t as tp, type Lang, type Project } from "@/content";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { TrackedLink } from "@/components/tracked-nav-link";
import { TrackedExternalLink } from "@/components/tracked-link";
import type { Translation } from "@/lib/translations";
import { SectionHeading } from "./section-heading";
import { ProjectHighlights } from "./project-highlights";
import { ProjectStackBadges } from "./project-stack-badges";

export function CaseStudy({ t, lang }: { t: Translation; lang: Lang }) {
  const cs = getFeaturedProject();
  const csData = cs.caseStudy;

  // If the featured project has no deep-dive content, render only the
  // problem/approach/outcomes sections and skip the diagram + lessons.
  return (
    <section id="case-study" className="border-y border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={t.caseStudy.eyebrow}
          title={`${t.caseStudy.deepDiveTitle} ${cs.name}`}
          description={tp(cs.tagline, lang)}
        />
        <RevealOnScroll motion="diagram" className="mt-10">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {tp(cs.role, lang)}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {t.caseStudy.updated} {cs.updatedAt}
                </Badge>
                <TrackedExternalLink
                  href={cs.repoUrl}
                  event="project_repo_open"
                  properties={{ slug: cs.slug }}
                  className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {t.caseStudy.openRepo}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </TrackedExternalLink>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t.caseStudy.problem}
                </h3>
                <p className="mt-2 leading-relaxed text-foreground/90">{tp(cs.problem, lang)}</p>
              </div>

              {csData && <ArchitectureDiagram t={t} data={csData} lang={lang} />}

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t.caseStudy.approach}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {cs.approach.map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <CheckCircle2
                        className="check-pop mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                        style={{ "--check-index": i } as React.CSSProperties}
                      />
                      <span className="text-foreground/90">{tp(a, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t.caseStudy.outcomes}
                </h3>
                <div className="mt-3">
                  <ProjectHighlights highlights={cs.highlights} lang={lang} />
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t.caseStudy.stack}
                </h3>
                <div className="mt-3">
                  <ProjectStackBadges stack={cs.stack} />
                </div>
              </div>
            </CardContent>
          </Card>
        </RevealOnScroll>

        {csData && (
          <div className="mt-10">
            <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
              {t.caseStudy.lessonsLearned}
            </h3>
            <p className="mt-3 leading-relaxed text-foreground/90">
              {tp(csData.lessonsLearned, lang)}
            </p>
          </div>
        )}

        <div className="mt-8">
          <TrackedLink
            href={`/${lang}/projects/${cs.slug}`}
            event="project_dossier_open"
            properties={{ slug: cs.slug }}
            className="btn-arrow inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t.projects.viewDetails}
            <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

function ArchitectureDiagram({
  t,
  data,
  lang,
}: {
  t: Translation;
  data: NonNullable<Project["caseStudy"]>;
  lang: Lang;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-background/50">
      <div className="border-b border-border/60 bg-secondary/30 px-4 py-2 font-mono text-xs text-muted-foreground">
        {tp(data.architectureLabel, lang)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-border/60 p-4 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            {t.caseStudy.local}
          </div>
          <ul className="space-y-1.5">
            {data.localNodes.map((n, i) => (
              <li
                key={`${tp(n, lang)}-${i}`}
                className="rounded-md border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-xs"
              >
                {tp(n, lang)}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            {t.caseStudy.vps}
          </div>
          <ul className="space-y-1.5">
            {data.vpsNodes.map((n, i) => (
              <li
                key={`${tp(n, lang)}-${i}`}
                className="rounded-md border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-xs"
              >
                {tp(n, lang)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 bg-secondary/30 px-4 py-3">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {t.caseStudy.trafficFlow}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-foreground/90">
          {tp(data.flowText, lang)
            .split("→")
            .map((step) => step.trim())
            .filter(Boolean)
            .map((step, i, arr) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="rounded-md border border-border/60 bg-card/50 px-2 py-1">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight
                    className="h-3 w-3 text-primary animate-flow-arrow"
                    aria-hidden
                    style={{ "--flow-index": i } as React.CSSProperties}
                  />
                )}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
