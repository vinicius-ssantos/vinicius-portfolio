import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  Mail,
  Server,
  FileCode2,
  Globe,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Boxes,
  Shield,
  Database,
  GitCommitVertical,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  profile,
  stack,
  projects,
  experience,
  education,
  t as tp,
  type Lang,
  type Project,
  type LocalizedText,
} from "@/lib/portfolio-data";
import { getGitHubStats, formatStat, type ContributionDay, type LanguageStat } from "@/lib/github";
import { RevealPhone } from "@/components/reveal-phone";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { StatCounter } from "@/components/animations/stat-counter";
import type { translations } from "@/lib/translations";

type T = typeof translations.en;

const stackIcons: Record<string, typeof Server> = {
  Backend: Server,
  Quality: Shield,
  Data: Database,
  DevOps: Boxes,
  Infrastructure: Server,
  Methods: GitCommitVertical,
  Languages: Terminal,
};

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StatsBar                                                            */
/* ------------------------------------------------------------------ */

function intensityClass(count: number): string {
  if (count === 0) return "bg-secondary";
  if (count <= 2) return "bg-primary/20";
  if (count <= 5) return "bg-primary/40";
  if (count <= 9) return "bg-primary/65";
  return "bg-primary";
}

function ContributionHeatmap({
  weeks,
  total,
  t,
}: {
  weeks: ContributionDay[][];
  total: number;
  t: T;
}) {
  if (weeks.length === 0) return null;
  const days = weeks.flat();

  return (
    <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6">
      <div className="rounded-lg border border-border/60 bg-background/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs text-foreground">
            <span className="font-bold text-primary">{formatStat(total)}</span>{" "}
            <span className="text-muted-foreground">{t.stats.heatmapTitle}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{t.stats.heatmapLess}</span>
            <span className="h-2.5 w-2.5 rounded-[2px] bg-secondary" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary/20" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary/40" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary/65" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-primary" />
            <span className="text-[10px] text-muted-foreground">{t.stats.heatmapMore}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateRows: "repeat(7, 1fr)",
              gridAutoFlow: "column",
              width: "max-content",
            }}
            role="img"
            aria-label={`${formatStat(total)} ${t.stats.heatmapTitle}`}
          >
            {days.map((day, i) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} contributions`}
                className={`heatmap-cell h-[11px] w-[11px] rounded-[2px] ${intensityClass(day.count)}`}
                style={{ "--cell-delay": `${Math.min(i * 4, 800)}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function StatsBar({ t, lang }: { t: T; lang: Lang }) {
  const gh = await getGitHubStats();
  const isLive = process.env.GITHUB_TOKEN !== undefined;

  // Each stat carries its label + a numeric value for the animated counter.
  // The label value stays as a fallback string (used when JS is disabled).
  const stats: { label: LocalizedText; numeric: number; fallback: string }[] = [
    {
      label: profile.stats[0].label,
      numeric: parseInt(profile.stats[0].value, 10) || 0,
      fallback: profile.stats[0].value,
    },
    {
      label: profile.stats[1].label,
      numeric: gh.publicRepos,
      fallback: formatStat(gh.publicRepos),
    },
    {
      label: profile.stats[2].label,
      numeric: gh.contributions,
      fallback: formatStat(gh.contributions),
    },
  ];

  return (
    <section className="border-y border-border/60 bg-secondary/20">
      <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-border/60 px-4 sm:px-6">
        {stats.map((s, i) => (
          <div key={tp(s.label, lang)} className="relative px-3 py-6 text-center sm:px-6">
            {isLive && i > 0 && (
              <span
                className="absolute right-2 top-2 inline-flex h-1.5 w-1.5 rounded-full bg-primary sm:right-4 sm:top-4"
                title="Live data"
                aria-label="Live data"
              />
            )}
            <div className="font-mono text-2xl font-bold tabular-nums sm:text-3xl">
              <StatCounter value={s.numeric} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{tp(s.label, lang)}</div>
          </div>
        ))}
      </div>
      {isLive && <ContributionHeatmap weeks={gh.weeks} total={gh.contributions} t={t} />}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export function Experience({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.experience.eyebrow}
        title={t.experience.title}
        description={t.experience.description}
      />
      <RevealOnScroll stagger className="mt-10 space-y-4">
        {experience.map((exp, idx) => (
          <div
            key={`${exp.company}-${exp.period}`}
            style={{ "--stagger-index": idx } as React.CSSProperties}
          >
            <ExperienceCard exp={exp} t={t} lang={lang} />
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}

function ExperienceCard({ exp, t, lang }: { exp: (typeof experience)[number]; t: T; lang: Lang }) {
  return (
    <Card className="card-lift border-border/60 bg-card/50 hover:border-primary/40">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg font-semibold text-primary">
              {tp(exp.role, lang)}
            </CardTitle>
            {exp.current && (
              <Badge
                variant="outline"
                className="border-primary/40 text-primary font-mono text-[10px] uppercase"
              >
                {t.experience.current}
              </Badge>
            )}
          </div>
          <span className="font-mono text-xs text-muted-foreground">{exp.period}</span>
        </div>
        <CardDescription className="text-sm font-medium text-foreground/70">
          {exp.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground/90">{tp(exp.summary, lang)}</p>
        <ul className="space-y-2">
          {exp.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <CheckCircle2
                className="check-pop mt-0.5 h-4 w-4 flex-shrink-0 text-primary/70"
                style={{ "--check-delay": `${i * 100}ms` } as React.CSSProperties}
              />
              <span>{tp(b, lang)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {exp.stack.map((s) => (
            <Badge key={s} variant="secondary" className="font-mono text-[10px] font-normal">
              {s}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Languages bar (live from GitHub)                                    */
/* ------------------------------------------------------------------ */

function LanguagesBar({ languages, t }: { languages: LanguageStat[]; t: T }) {
  if (languages.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
          {t.stack.languagesLabel}
        </h3>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t.stack.languagesLive}
        </span>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-border/60">
        {languages.map((lang, i) => (
          <div
            key={lang.name}
            className="lang-bar-segment"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
              animationDelay: `${i * 80}ms`,
            }}
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
            <span className="font-mono text-xs text-muted-foreground">
              {lang.name} <span className="text-foreground/60">{lang.percentage.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */

function StackGrid({ entries, lang }: { entries: [string, string[]][]; lang: Lang }) {
  return (
    <RevealOnScroll stagger className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([category, items], idx) => {
        const Icon = stackIcons[category] ?? Terminal;
        return (
          <div key={category} style={{ "--stagger-index": idx } as React.CSSProperties}>
            <Card className="card-lift h-full border-border/60 bg-card/50 hover:border-primary/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                    {category}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => {
                    const label = typeof item === "string" ? item : tp(item, lang);
                    return (
                      <Badge
                        key={label}
                        variant="secondary"
                        className="font-mono text-xs font-normal"
                      >
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </RevealOnScroll>
  );
}

export async function Stack({ t, lang }: { t: T; lang: Lang }) {
  const gh = await getGitHubStats();
  const professionalEntries = Object.entries(stack.professional);
  const personalEntries = Object.entries(stack.personal);
  return (
    <section id="stack" className="border-y border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={t.stack.eyebrow}
          title={t.stack.title}
          description={t.stack.description}
        />
        <div className="mt-8">
          <LanguagesBar languages={gh.languages} t={t} />
        </div>

        <h3 className="mt-10 font-mono text-xs uppercase tracking-wider text-primary">
          {t.stack.professionalTitle}
        </h3>
        <StackGrid entries={professionalEntries} lang={lang} />

        <h3 className="mt-10 font-mono text-xs uppercase tracking-wider text-primary">
          {t.stack.personalTitle}
        </h3>
        <StackGrid entries={personalEntries} lang={lang} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured Projects                                                   */
/* ------------------------------------------------------------------ */

export function FeaturedProjects({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
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
  project: (typeof projects)[number];
  priority?: boolean;
  t: T;
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
        <Link
          href={detailHref}
          className="relative block aspect-[16/10] overflow-hidden border-b border-border/60 bg-secondary/30"
          aria-label={`${t.projects.viewDetails}: ${project.name}`}
        >
          <Image
            src={project.image}
            alt={`${project.name} — README preview`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-top opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[1.02]"
            priority={priority}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {t.projects.viewRepository}
            </div>
          </div>
        </Link>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">{project.updatedAt}</span>
          {priority && (
            <Badge
              variant="outline"
              className="border-primary/40 text-primary font-mono text-[10px] uppercase"
            >
              {t.projects.mostRecent}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2 font-mono text-lg leading-tight text-primary">
          <Link href={detailHref} className="hover:underline">
            {project.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {tp(project.tagline, lang)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {tp(project.description, lang)}
        </p>
        <div className="mt-auto">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((s) => (
              <Badge key={s} variant="secondary" className="font-mono text-[10px] font-normal">
                {s}
              </Badge>
            ))}
            {project.stack.length > 5 && (
              <Badge
                variant="outline"
                className="font-mono text-[10px] font-normal text-muted-foreground"
              >
                +{project.stack.length - 5}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={detailHref}
              className="btn-arrow inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t.projects.viewDetails}
              <ArrowUpRight className="arrow-nudge h-3.5 w-3.5" />
            </Link>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Case Study                                                          */
/* ------------------------------------------------------------------ */

export function CaseStudy({ t, lang }: { t: T; lang: Lang }) {
  const cs = projects.find((p) => p.featured) ?? projects[0];
  if (!cs) {
    throw new Error("CaseStudy requires at least one project in `projects`.");
  }
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
        <RevealOnScroll className="mt-10">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {t.caseStudy.role}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {t.caseStudy.updated} {cs.updatedAt}
                </Badge>
                <a
                  href={cs.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {t.caseStudy.openRepo}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
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
                        style={{ "--check-delay": `${i * 100}ms` } as React.CSSProperties}
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
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {cs.highlights.map((h) => (
                    <div
                      key={tp(h, lang)}
                      className="flex gap-3 rounded-md border border-border/60 bg-secondary/30 p-3"
                    >
                      <FileCode2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-sm leading-relaxed text-foreground/90">
                        {tp(h, lang)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t.caseStudy.stack}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cs.stack.map((s) => (
                    <Badge key={s} variant="secondary" className="font-mono text-xs font-normal">
                      {s}
                    </Badge>
                  ))}
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
      </div>
    </section>
  );
}

function ArchitectureDiagram({
  t,
  data,
  lang,
}: {
  t: T;
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
          {lang === "pt" ? "fluxo de tráfego" : "traffic flow"}
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
                    style={{ animationDelay: `${i * 0.3}s` } as React.CSSProperties}
                  />
                )}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export function EducationSection({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section id="education" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.education.eyebrow}
        title={t.education.title}
        description={t.education.description}
      />
      <RevealOnScroll stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {education.map((e, idx) => (
          <div
            key={`${e.institution}-${tp(e.degree, lang)}`}
            style={{ "--stagger-index": idx } as React.CSSProperties}
          >
            <Card className="card-lift h-full border-border/60 bg-card/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {tp(e.period, lang)}
                  </span>
                </div>
                <CardTitle className="mt-2 text-base">{tp(e.degree, lang)}</CardTitle>
                <CardDescription>{e.institution}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function About({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section id="about" className="border-t border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} description="" />
        <RevealOnScroll className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/50 lg:col-span-2">
            <CardContent className="space-y-6 pt-6 text-base leading-relaxed text-foreground/90">
              <p>{tp(profile.longPitch, lang)}</p>
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
                  {t.about.careerPath}
                </h3>
                <p>{tp(profile.careerPath, lang)}</p>
              </div>
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
                  {t.about.howIThink}
                </h3>
                <p>{tp(profile.philosophy, lang)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-lift border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t.about.currently}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Briefcase className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{t.about.currentlyItems.role}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{tp(profile.location, lang)}</span>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  {stack.Languages.map((l) => (typeof l === "string" ? l : l[lang])).join(" · ")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="break-all">{profile.email}</span>
              </div>
              <RevealPhone showLabel={t.about.showPhone} hideLabel={t.about.hidePhone} />
              <div className="flex items-start gap-2">
                <Server className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{t.about.currentlyItems.runningCluster}</span>
              </div>
              <div className="mt-4 border-t border-border/60 pt-3">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-primary">
                  {t.about.currentlyLearning}
                </div>
                <ul className="space-y-2">
                  {profile.currentlyLearning.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FileCode2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
                      <div>
                        <div className="font-medium text-foreground">{tp(item.topic, lang)}</div>
                        <div className="text-xs text-muted-foreground">{tp(item.detail, lang)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </RevealOnScroll>
      </div>
    </section>
  );
}
