import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVisibleProjects, type Lang, type Project } from "@/content";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { TrackedLink } from "@/components/tracked-nav-link";
import { TrackedExternalLink } from "@/components/tracked-link";
import { SectionHeading } from "./section-heading";
import { ProjectStackBadges } from "./project-stack-badges";

type TFunc = Awaited<ReturnType<typeof getTranslations>>;

export async function FeaturedProjects({ lang }: { lang: Lang }) {
  const t = await getTranslations();
  const projects = getVisibleProjects(lang);

  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t("projects.eyebrow")}
        title={t("projects.title")}
        description={t("projects.description")}
      />
      <RevealOnScroll stagger className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {projects.map((p, idx) => (
          <div key={p.slug} style={{ "--stagger-index": idx } as React.CSSProperties}>
            <ProjectCard project={p} priority={idx === 0} t={t} lang={lang} />
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}

function ProjectCard({
  project,
  priority,
  t,
  lang,
}: {
  project: Project;
  priority?: boolean;
  t: TFunc;
  lang: Lang;
}) {
  const detailHref = `/${lang}/projects/${project.slug}`;
  return (
    <Card
      className={`card-lift group relative flex flex-col overflow-hidden border-border/60 bg-card/50 hover:border-primary/40 hover:bg-card ${
        priority ? "lg:col-span-1" : ""
      }`}
    >
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
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-top opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[1.02]"
            priority={priority}
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
            {priority && (
              <Badge
                variant="outline"
                className="border-primary/40 text-primary font-mono text-[10px] uppercase"
              >
                {t("projects.mostRecent")}
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
          <div className="mb-2">
            <ProjectStackBadges stack={project.stack} limit={5} size="xs" />
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
