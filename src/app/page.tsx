"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Download,
  Terminal,
  Boxes,
  Server,
  Shield,
  Database,
  Eye,
  CheckCircle2,
  FileCode2,
  Briefcase,
  GraduationCap,
  GitCommitVertical,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  profile,
  stack,
  projects,
  experience,
  education,
  t as tp,
} from "@/lib/portfolio-data";
import { useLanguage } from "@/lib/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

const stackIcons: Record<string, typeof Server> = {
  Backend: Server,
  Quality: Shield,
  Data: Database,
  DevOps: Boxes,
  Infrastructure: Server,
  Methods: GitCommitVertical,
  Languages: Terminal,
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <Experience />
        <Stack />
        <FeaturedProjects />
        <CaseStudy />
        <Education />
        <About />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            VS
          </span>
          <span className="hidden sm:inline">{profile.handle}</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="#experience"
            className="px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.experience}
          </Link>
          <Link
            href="#stack"
            className="px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.stack}
          </Link>
          <Link
            href="#projects"
            className="px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.projects}
          </Link>
          <Link
            href="#case-study"
            className="hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t.nav.caseStudy}
          </Link>
          <Link
            href="#about"
            className="hidden px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {t.nav.about}
          </Link>

          {/* Toggles: language + theme (always visible, including mobile) */}
          <div className="ml-1 flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* GitHub + LinkedIn icons — visible on all breakpoints */}
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const { t, lang } = useLanguage();
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 grid-bg pointer-events-none"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {t.hero.badge}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-3 font-mono text-base text-primary sm:text-lg">
            {tp(profile.role, lang)} · {tp(profile.location, lang)}
          </p>

          {/* Languages line — visible early for international recruiters */}
          <p className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            {stack.Languages.map((l) => (typeof l === "string" ? l : l[lang])).join("  ·  ")}
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {tp(profile.pitch, lang)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Primary CTA: Get in touch */}
            <Button asChild size="default">
              <a href={`mailto:${profile.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                {t.hero.getInTouch}
              </a>
            </Button>
            {/* Secondary: Download CV */}
            <Button asChild variant="outline" size="default">
              <a href={profile.links.cv} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                {t.hero.downloadCV}
              </a>
            </Button>
            {/* Tertiary: See experience */}
            <Button asChild variant="ghost" size="default">
              <a href="#experience">
                {t.hero.seeExperience}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

function StatsBar() {
  const { lang } = useLanguage();
  return (
    <section className="border-y border-border/60 bg-secondary/20">
      <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-border/60 px-4 sm:px-6">
        {profile.stats.map((s) => (
          <div key={tp(s.label, lang)} className="px-3 py-6 text-center sm:px-6">
            <div className="font-mono text-2xl font-bold tabular-nums sm:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {tp(s.label, lang)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

function Experience() {
  const { t } = useLanguage();
  return (
    <section
      id="experience"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <SectionHeading
        eyebrow={t.experience.eyebrow}
        title={t.experience.title}
        description={t.experience.description}
      />

      <div className="mt-10 space-y-4">
        {experience.map((exp) => (
          <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} />
        ))}
      </div>
    </section>
  );
}

function ExperienceCard({ exp }: { exp: (typeof experience)[number] }) {
  const { t, lang } = useLanguage();
  return (
    <Card className="border-border/60 bg-card/50 transition-colors hover:border-primary/40">
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
          <span className="font-mono text-xs text-muted-foreground">
            {exp.period}
          </span>
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
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/70" />
              <span>{tp(b, lang)}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {exp.stack.map((s) => (
            <Badge
              key={s}
              variant="secondary"
              className="font-mono text-[10px] font-normal"
            >
              {s}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */

function Stack() {
  const { t } = useLanguage();
  // Stack categories minus Languages (shown in Hero separately)
  const stackEntries = Object.entries(stack).filter(([cat]) => cat !== "Languages");
  return (
    <section
      id="stack"
      className="border-y border-border/60 bg-secondary/20"
    >
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={t.stack.eyebrow}
          title={t.stack.title}
          description={t.stack.description}
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stackEntries.map(([category, items]) => {
            const Icon = stackIcons[category] ?? Terminal;
            return (
              <Card
                key={category}
                className="border-border/60 bg-card/50 transition-colors hover:border-primary/40"
              >
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
                    {items.map((item) => (
                      <Badge
                        key={typeof item === "string" ? item : item.en}
                        variant="secondary"
                        className="font-mono text-xs font-normal"
                      >
                        {typeof item === "string" ? item : ""}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured Projects                                                   */
/* ------------------------------------------------------------------ */

function FeaturedProjects() {
  const { t } = useLanguage();
  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
      />
      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {projects.map((p, idx) => (
          <ProjectCard key={p.slug} project={p} priority={idx === 0} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  priority,
}: {
  project: (typeof projects)[number];
  priority?: boolean;
}) {
  const { t, lang } = useLanguage();
  return (
    <Card
      className={`group relative flex flex-col border-border/60 bg-card/50 transition-all hover:border-primary/40 hover:bg-card ${
        priority ? "lg:col-span-1" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {project.updatedAt}
          </span>
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
          {project.name}
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
              <Badge
                key={s}
                variant="secondary"
                className="font-mono text-[10px] font-normal"
              >
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

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t.projects.viewRepository}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Case Study (deep dive on personal-platform-infra)                   */
/* ------------------------------------------------------------------ */

function CaseStudy() {
  const cs = projects[0];
  const { t, lang } = useLanguage();
  return (
    <section
      id="case-study"
      className="border-y border-border/60 bg-secondary/20"
    >
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={t.caseStudy.eyebrow}
          title={`${t.caseStudy.deepDiveTitle} ${cs.name}`}
          description={tp(cs.tagline, lang)}
        />

        <Card className="mt-10 border-border/60 bg-card/50">
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
            {/* The problem */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t.caseStudy.problem}
              </h3>
              <p className="mt-2 leading-relaxed text-foreground/90">{tp(cs.problem, lang)}</p>
            </div>

            {/* Architecture diagram (CSS-built) */}
            <ArchitectureDiagram />

            {/* The approach */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t.caseStudy.approach}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {cs.approach.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-foreground/90">{tp(a, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlights */}
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
                    <span className="text-sm leading-relaxed text-foreground/90">{tp(h, lang)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full stack */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t.caseStudy.stack}
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cs.stack.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="font-mono text-xs font-normal"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons learned */}
        <div className="mt-10">
          <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
            {t.caseStudy.lessonsLearned}
          </h3>
          <p className="mt-3 leading-relaxed text-foreground/90">
            {t.caseStudy.lessonsText}
          </p>
        </div>
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  const { t } = useLanguage();
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-background/50">
      <div className="border-b border-border/60 bg-secondary/30 px-4 py-2 font-mono text-xs text-muted-foreground">
        {t.caseStudy.architectureLabel}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Local */}
        <div className="border-b border-border/60 p-4 md:border-b-0 md:border-r">
          <div className="mb-3 font-mono text-xs uppercase tracking-wider text-primary">
            {t.caseStudy.local}
          </div>
          <ul className="space-y-1.5">
            {t.caseStudy.localNodes.map((n) => (
              <li
                key={n}
                className="rounded-md border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-xs"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
        {/* VPS */}
        <div className="p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-wider text-primary">
            {t.caseStudy.vps}
          </div>
          <ul className="space-y-1.5">
            {t.caseStudy.vpsNodes.map((n) => (
              <li
                key={n}
                className="rounded-md border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-xs"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 bg-secondary/30 px-4 py-2 font-mono text-xs text-muted-foreground text-center">
        {t.caseStudy.flowText}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

function Education() {
  const { t, lang } = useLanguage();
  return (
    <section id="education" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.education.eyebrow}
        title={t.education.title}
        description={t.education.description}
      />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {education.map((e) => (
          <Card key={`${e.institution}-${tp(e.degree, lang)}`} className="border-border/60 bg-card/50">
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
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

function About() {
  const { t, lang } = useLanguage();
  return (
    <section
      id="about"
      className="border-t border-border/60 bg-secondary/20"
    >
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          description=""
        />

        {/* Two-column layout: long pitch (left) + Currently card (right) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/50 lg:col-span-2">
            <CardContent className="space-y-6 pt-6 text-base leading-relaxed text-foreground/90">
              {/* Long intro pitch */}
              <p>{tp(profile.longPitch, lang)}</p>

              {/* Career path — split out for scannability */}
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
                  {t.about.careerPath}
                </h3>
                <p>{tp(profile.careerPath, lang)}</p>
              </div>

              {/* Philosophy — the "how I think" anchor */}
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
                  {t.about.howIThink}
                </h3>
                <p>{tp(profile.philosophy, lang)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/50">
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
                <span>{stack.Languages.map((l) => (typeof l === "string" ? l : l[lang])).join(" · ")}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="break-all">{profile.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <Server className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{t.about.currentlyItems.runningCluster}</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCode2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{t.about.currentlyItems.studying}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  const { t } = useLanguage();
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
          <a
            href={`mailto:${profile.email}`}
            aria-label="E-mail"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </a>
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

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function SectionHeading({
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
      <div className="font-mono text-xs uppercase tracking-wider text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
