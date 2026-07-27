import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowUpRight, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPrimaryProjects, getPreviousProjects, type Lang, type Project } from "@/content";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { TrackedLink } from "@/components/tracked-nav-link";
import { TrackedExternalLink } from "@/components/tracked-link";
import { getProjectRepositorySnapshots, parseGitHubRepoUrl, repoKey } from "@/lib/github-repos";
import { SectionHeading } from "./section-heading";
import { ProjectStackBadges } from "./project-stack-badges";

type TFunc = Awaited<ReturnType<typeof getTranslations>>;
type RepositorySnapshots = Awaited<ReturnType<typeof getProjectRepositorySnapshots>>;

export async function FeaturedProjects({ lang }: { lang: Lang }) {
  const t = await getTranslations();
  const primaryProjects = getPrimaryProjects(lang);
  const previousProjects = getPreviousProjects(lang);
  const projects = [...primaryProjects, ...previousProjects];

  // Single batched GraphQL call for every card's repo — see github-repos.ts.
  const repoRefs = projects
    .map((p) => parseGitHubRepoUrl(p.repoUrl))
    .filter((r): r is { owner: string; name: string } => r !== null);
  const snapshots = await getProjectRepositorySnapshots(repoRefs);

  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t("projects.eyebrow")}
        title={t("projects.title")}
        description={t("projects.description")}
      />

      <ProjectGroup
        id="primary-projects"
        title={t("projects.primaryTitle")}
        description={t("projects.primaryDescription")}
        projects={primaryProjects}
        snapshots={snapshots}
        t={t}
        lang={lang}
      />

      <ProjectGroup
        id="previous-projects"
        title={t("projects.previousTitle")}
        description={t("projects.previousDescription")}
        projects={previousProjects}
        snapshots={snapshots}
        t={t}
        lang={lang}
        separated
      />
    </section>
  );
}

function ProjectGroup({
  id,
  title,
  description,
  projects,
  snapshots,
  t,
  lang,
  separated = false,
}: {
  id: string;
  title: string;
  description: string;
  projects: Project[];
  snapshots: RepositorySnapshots;
  t: TFunc;
  lang: Lang;
  separated?: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <div
      aria-labelledby={id}
      className={separated ? "mt-14 border-t border-border/60 pt-10" : "mt-10"}
    >
      <div className="mb-5 max-w-2xl">
        <h3
          id={id}
          className="font-mono text-sm font-semibold uppercase tracking-wider text-primary"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <RevealOnScroll stagger className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {projects.map((project, index) => {
          const ref = parseGitHubRepoUrl(project.repoUrl);
          const latestReleaseTag = ref ? snapshots[repoKey(ref)]?.latestRelease?.tag : undefined;
          return (
            <div key={project.slug} style={{ "--stagger-index": index } as React.CSSProperties}>
              <ProjectCard
                project={project}
                primaryCase={project.featured === true}
                t={t}
                lang={lang}
                latestReleaseTag={latestReleaseTag}
              />
            </div>
          );
        })}
      </RevealOnScroll>
    </div>
  );
}

function ProjectCard({
  project,
  primaryCase,
  t,
  lang,
  latestReleaseTag,
}: {
  project: Project;
  primaryCase: boolean;
  t: TFunc;
  lang: Lang;
  latestReleaseTag?: string;
}) {
  const detailHref = `/${lang}/projects/${project.slug}`;
  return (
    <Card className="card-lift group relative flex h-full flex-col overflow-hidden border-border/60 bg-card/50 hover:border-primary/40 hover:bg-card">
      {project.image && (
        <TrackedLink
          href={detailHref}
          event="project_dossier_open"
          properties={{ slug: project.slug }}
          className="relative block aspect-[16/10] overflow-hidden border-b border-border/60 bg-secondary/30"
          aria-label={`${t("projects.viewDetails")}: ${project.name}`}
        >
          <Image
            src={project.image}
            alt={`${project.name} — project screenshot`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top opacity-80 transition-all duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
            priority={primaryCase}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {t("projects.viewDetails")}
            </div>
          </div>
        </TrackedLink>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">{project.updatedAt}</span>
          <div className="flex items-center gap-1.5">
            {project.status && project.status !== "stable" && (
              <Badge className="font-mono text-[10px] uppercase">
                {t(`projectDetail.status.${project.status}`)}
              </Badge>
            )}
            {primaryCase && (
              <Badge
                variant="outline"
                className="border-primary/40 font-mono text-[10px] uppercase text-primary"
              >
                {t("projects.primaryCase")}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-2 font-mono text-lg leading-tight text-primary">
          <TrackedLink
            href={detailHref}
            event="project_dossier_open"
            properties={{ slug: project.slug }}
            className="hover:underline"
          >
            {project.name}
          </TrackedLink>
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {project.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mt-auto">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <ProjectStackBadges stack={project.stack} limit={5} size="xs" />
            {latestReleaseTag && (
              <Badge
                variant="outline"
                className="gap-1 font-mono text-[10px] text-muted-foreground"
              >
                <Tag className="h-2.5 w-2.5" aria-hidden />
                {latestReleaseTag}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <TrackedLink
              href={detailHref}
              event="project_dossier_open"
              properties={{ slug: project.slug }}
              className="btn-arrow inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("projects.viewDetails")}
              <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" />
            </TrackedLink>
            <TrackedExternalLink
              href={project.repoUrl}
              event="project_repo_open"
              properties={{ slug: project.slug }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
              <ArrowUpRight className="h-3 w-3" />
            </TrackedExternalLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
