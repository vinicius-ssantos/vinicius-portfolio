import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Github } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteChrome } from "@/components/site-chrome";
import { ProjectHighlights } from "@/components/sections/project-highlights";
import { ProjectStackBadges } from "@/components/sections/project-stack-badges";
import { RepositorySnapshot } from "@/components/sections/repository-snapshot";
import { TrackedExternalLink } from "@/components/tracked-link";
import { getAllProjectMetas, getProjectBySlug, type Lang } from "@/content";
import { isLocale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site-config";
import { buildProjectMetadata, buildProjectJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getProjectRepositorySnapshots, parseGitHubRepoUrl, repoKey } from "@/lib/github-repos";

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  const out: { lang: string; slug: string }[] = [];
  for (const lang of ["pt", "en"] as const) {
    for (const p of getAllProjectMetas()) {
      out.push({ lang, slug: p.slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  if (!isLocale(rawLang)) return {};
  const lang = rawLang as Lang;
  const project = getProjectBySlug(slug, lang);
  if (!project) return {};

  return buildProjectMetadata(project, lang);
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { lang: rawLang, slug } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang as Lang;
  setRequestLocale(lang);
  const t = await getTranslations();
  const project = getProjectBySlug(slug, lang);
  if (!project) notFound();

  const repoRef = parseGitHubRepoUrl(project.repoUrl);
  const snapshots = repoRef ? await getProjectRepositorySnapshots([repoRef]) : {};
  const snapshot = repoRef ? snapshots[repoKey(repoRef)] : undefined;
  const showRepoSection = Boolean(
    snapshot &&
    (snapshot.latestRelease ||
      snapshot.license ||
      (snapshot.languages && snapshot.languages.length > 0) ||
      snapshot.pushedAt ||
      snapshot.isArchived),
  );

  const jsonLd = buildProjectJsonLd(project, lang);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: t("nav.home"), url: absoluteUrl(`/${lang}`) },
    { name: project.name, url: absoluteUrl(`/${lang}/projects/${project.slug}`) },
  ]);

  return (
    <SiteChrome lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb]) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={`/${lang}#projects`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("projectDetail.backToPortfolio")}
        </Link>

        <header className="mt-6">
          <div className="font-mono text-xs uppercase tracking-wider text-primary">
            {t("projectDetail.eyebrow")}
          </div>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{project.tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {project.status && project.status !== "stable" && (
              <Badge className="font-mono text-[10px] uppercase">
                {t(`projectDetail.status.${project.status}`)}
              </Badge>
            )}
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {t("projectDetail.updatedLabel")}: {project.updatedAt}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {project.role}
            </Badge>
            <TrackedExternalLink
              href={project.repoUrl}
              event="project_repo_open"
              properties={{ slug: project.slug }}
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
              <Github className="h-4 w-4" />
              {t("projectDetail.openRepo")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </TrackedExternalLink>
          </div>

          {project.links && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("projectDetail.demo")}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
              {project.links.docs && (
                <a
                  href={project.links.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("projectDetail.docs")}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
              {project.links.openApi && (
                <a
                  href={project.links.openApi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("projectDetail.openApi")}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
              {project.links.video && (
                <a
                  href={project.links.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("projectDetail.video")}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </header>

        {project.image && (
          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-lg border border-border/60 bg-secondary/30">
            <Image
              src={project.image}
              alt={`${project.name} — preview`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover object-top"
              priority
            />
          </div>
        )}

        <div className="mt-10 space-y-8">
          <Section label={t("projectDetail.taglineLabel")}>
            <p className="leading-relaxed text-foreground/90">{project.description}</p>
          </Section>

          <Section label={t("projectDetail.problemLabel")}>
            <p className="leading-relaxed text-foreground/90">{project.problem}</p>
          </Section>

          <Section label={t("projectDetail.approachLabel")}>
            <ul className="space-y-2.5">
              {project.approach.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-foreground/90">{a}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section label={t("projectDetail.outcomesLabel")}>
            <ProjectHighlights highlights={project.highlights} />
          </Section>

          <Section label={t("projectDetail.stackLabel")}>
            <ProjectStackBadges stack={project.stack} />
          </Section>

          {showRepoSection && snapshot && (
            <Section label={t("projectDetail.repositoryLabel")}>
              <RepositorySnapshot
                snapshot={snapshot}
                lang={lang}
                labels={{
                  latestRelease: t("projectDetail.latestReleaseLabel"),
                  license: t("projectDetail.licenseLabel"),
                  languages: t("projectDetail.languagesLabel"),
                  lastActivity: t("projectDetail.lastActivityLabel"),
                  archived: t("projectDetail.archivedBadge"),
                  viaGitHub: t("projectDetail.viaGitHub"),
                }}
              />
            </Section>
          )}

          {project.architectureNotes && project.architectureNotes.length > 0 && (
            <Section label={t("projectDetail.architectureLabel")}>
              <ul className="space-y-2.5">
                {project.architectureNotes.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-foreground/90">{a}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {project.metrics && project.metrics.length > 0 && (
            <Section label={t("projectDetail.metricsLabel")}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-md border border-border/60 bg-secondary/30 p-3"
                  >
                    <div className="font-mono text-lg font-bold text-primary">{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {project.testingStrategy && (
            <Section label={t("projectDetail.testingLabel")}>
              <p className="leading-relaxed text-foreground/90">{project.testingStrategy}</p>
            </Section>
          )}

          {project.observability && (
            <Section label={t("projectDetail.observabilityLabel")}>
              <p className="leading-relaxed text-foreground/90">{project.observability}</p>
            </Section>
          )}

          {project.limitations && project.limitations.length > 0 && (
            <Section label={t("projectDetail.limitationsLabel")}>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {project.limitations.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </Section>
          )}

          {project.nextSteps && project.nextSteps.length > 0 && (
            <Section label={t("projectDetail.nextStepsLabel")}>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {project.nextSteps.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <Button asChild>
            <TrackedExternalLink
              href={project.repoUrl}
              event="project_repo_open"
              properties={{ slug: project.slug }}
            >
              <Github className="mr-2 h-4 w-4" />
              {t("projectDetail.openRepo")}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </TrackedExternalLink>
          </Button>
        </div>
      </article>
    </SiteChrome>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </h2>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
