import { getTranslations } from "next-intl/server";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProject, type Lang } from "@/content";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { TrackedLink } from "@/components/tracked-nav-link";
import { TrackedExternalLink } from "@/components/tracked-link";
import { SectionHeading } from "./section-heading";
import { ProjectHighlights } from "./project-highlights";
import { ProjectStackBadges } from "./project-stack-badges";
import { ArchitectureDiagram } from "./architecture-diagram";

export async function CaseStudy({ lang }: { lang: Lang }) {
  const t = await getTranslations();
  const cs = getFeaturedProject(lang);
  const csData = cs.caseStudy;

  // If the featured project has no deep-dive content, render only the
  // problem/approach/outcomes sections and skip the diagram + lessons.
  return (
    <section id="case-study" className="border-y border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={t("caseStudy.eyebrow")}
          title={`${t("caseStudy.deepDiveTitle")} ${cs.name}`}
          description={cs.tagline}
        />
        <RevealOnScroll motion="diagram" className="mt-10">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {cs.role}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {t("caseStudy.updated")} {cs.updatedAt}
                </Badge>
                <TrackedExternalLink
                  href={cs.repoUrl}
                  event="project_repo_open"
                  properties={{ slug: cs.slug }}
                  className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {t("caseStudy.openRepo")}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </TrackedExternalLink>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t("caseStudy.problem")}
                </h3>
                <p className="mt-2 leading-relaxed text-foreground/90">{cs.problem}</p>
              </div>

              {csData && (
                <ArchitectureDiagram
                  architectureLabel={csData.architectureLabel}
                  architecture={csData.architecture}
                  labels={{
                    local: t("caseStudy.local"),
                    edge: t("caseStudy.edge"),
                    vps: t("caseStudy.vps"),
                    hint: t("caseStudy.selectNodeHint"),
                  }}
                />
              )}

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t("caseStudy.approach")}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {cs.approach.map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <CheckCircle2
                        className="check-pop mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                        style={{ "--check-index": i } as React.CSSProperties}
                      />
                      <span className="text-foreground/90">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t("caseStudy.outcomes")}
                </h3>
                <div className="mt-3">
                  <ProjectHighlights highlights={cs.highlights} />
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t("caseStudy.stack")}
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
              {t("caseStudy.lessonsLearned")}
            </h3>
            <p className="mt-3 leading-relaxed text-foreground/90">{csData.lessonsLearned}</p>
          </div>
        )}

        <div className="mt-8">
          <TrackedLink
            href={`/${lang}/projects/${cs.slug}`}
            event="project_dossier_open"
            properties={{ slug: cs.slug }}
            className="btn-arrow inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t("projects.viewDetails")}
            <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
