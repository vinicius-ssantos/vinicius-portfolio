import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, FileCode2, Github } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteChrome } from "@/components/site-chrome";
import { projects, profile, t as tp, getProjectBySlug } from "@/content";
import { translations, type Lang } from "@/lib/translations";
import { isLocale } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinicius-portfolio-source.vercel.app";

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  const out: { lang: string; slug: string }[] = [];
  for (const lang of ["pt", "en"] as const) {
    for (const p of projects) {
      out.push({ lang, slug: p.slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  if (!isLocale(rawLang)) return {};
  const lang = rawLang as Lang;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.name} — ${profile.shortName}`;
  const description = tp(project.tagline, lang);
  const path = `/${lang}/projects/${slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      url: `${SITE_URL}${path}`,
      title,
      description,
      siteName: `${profile.shortName} — Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.image ? [project.image] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        "pt-BR": `${SITE_URL}/pt/projects/${slug}`,
        "en-US": `${SITE_URL}/en/projects/${slug}`,
        "x-default": `${SITE_URL}/pt/projects/${slug}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { lang: rawLang, slug } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang as Lang;
  const t = translations[lang];
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: tp(project.description, lang),
    url: `${SITE_URL}/${lang}/projects/${project.slug}`,
    codeRepository: project.repoUrl,
    author: {
      "@type": "Person",
      name: profile.name,
      url: `${SITE_URL}/${lang}`,
    },
    keywords: project.stack.join(", "),
    dateModified: project.updatedAt,
    inLanguage: lang === "pt" ? "pt-BR" : "en-US",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "pt" ? "Início" : "Home",
        item: `${SITE_URL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: project.name,
        item: `${SITE_URL}/${lang}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <SiteChrome t={t} lang={lang}>
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
          {t.projectDetail.backToPortfolio}
        </Link>

        <header className="mt-6">
          <div className="font-mono text-xs uppercase tracking-wider text-primary">
            {t.projectDetail.eyebrow}
          </div>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {tp(project.tagline, lang)}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {t.projectDetail.updatedLabel}: {project.updatedAt}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {tp(project.role, lang)}
            </Badge>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
              <Github className="h-4 w-4" />
              {t.projectDetail.openRepo}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
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
          <Section label={t.projectDetail.taglineLabel}>
            <p className="leading-relaxed text-foreground/90">{tp(project.description, lang)}</p>
          </Section>

          <Section label={t.projectDetail.problemLabel}>
            <p className="leading-relaxed text-foreground/90">{tp(project.problem, lang)}</p>
          </Section>

          <Section label={t.projectDetail.approachLabel}>
            <ul className="space-y-2.5">
              {project.approach.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-foreground/90">{tp(a, lang)}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section label={t.projectDetail.outcomesLabel}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <div
                  key={tp(h, lang)}
                  className="flex gap-3 rounded-md border border-border/60 bg-secondary/30 p-3"
                >
                  <FileCode2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-foreground/90">{tp(h, lang)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section label={t.projectDetail.stackLabel}>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <Badge key={s} variant="secondary" className="font-mono text-xs font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </Section>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <Button asChild>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {t.projectDetail.openRepo}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
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
