import type { Locale } from "./i18n";
import type { Project } from "@/content/types";
import { profile, getProfile, stack } from "@/content";
import { absoluteUrl } from "./site-config";

export function ogLocale(lang: Locale): "pt_BR" | "en_US" {
  return lang === "pt" ? "pt_BR" : "en_US";
}

export function htmlLang(lang: Locale): "pt-BR" | "en-US" {
  return lang === "pt" ? "pt-BR" : "en-US";
}

/**
 * Builds the `alternates.languages` map for a route. `path` is the part
 * after the locale segment — "" for home, "/projects/slug" for a project.
 */
export function buildLocaleAlternates(path: string): Record<string, string> {
  return {
    "pt-BR": absoluteUrl(`/pt${path}`),
    "en-US": absoluteUrl(`/en${path}`),
    "x-default": absoluteUrl(`/pt${path}`),
  };
}

export function buildPersonJsonLd(lang: Locale) {
  const profile = getProfile(lang);
  const stackKeywords = [
    ...Object.values(stack.professional).flat(),
    ...Object.values(stack.personal).flat(),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    worksFor: { "@type": "Organization", name: "UOL" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    email: `mailto:${profile.email}`,
    url: absoluteUrl(`/${lang}`),
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: stackKeywords,
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "FATEC Ferraz de Vasconcelos" },
      { "@type": "CollegeOrUniversity", name: "Faculdade Impacta" },
    ],
  };
}

export function buildWebsiteJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.shortName} — Portfolio`,
    url: absoluteUrl("/"),
    inLanguage: htmlLang(lang),
  };
}

export function buildProfilePageJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      identifier: profile.handle,
    },
    url: absoluteUrl(`/${lang}`),
  };
}

export function buildProjectJsonLd(project: Project, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    url: absoluteUrl(`/${lang}/projects/${project.slug}`),
    codeRepository: project.repoUrl,
    author: {
      "@type": "Person",
      name: profile.name,
      url: absoluteUrl(`/${lang}`),
    },
    keywords: project.stack.join(", "),
    dateModified: project.updatedAt,
    inLanguage: htmlLang(lang),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Shared metadata builder for a project detail page (`/[lang]/projects/[slug]`). */
export function buildProjectMetadata(project: Project, lang: Locale) {
  const title = `${project.name} — ${profile.shortName}`;
  const description = project.tagline;
  const path = `/projects/${project.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "article" as const,
      locale: ogLocale(lang),
      url: absoluteUrl(`/${lang}${path}`),
      title,
      description,
      siteName: `${profile.shortName} — Portfolio`,
    },
    // No explicit `images` here — Next.js's opengraph-image.tsx file
    // convention auto-populates both og:image and twitter:image, so
    // Twitter/X and every OG consumer (LinkedIn, Slack, Discord, ...)
    // share the exact same generated image instead of diverging.
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
    alternates: {
      canonical: absoluteUrl(`/${lang}${path}`),
      languages: buildLocaleAlternates(path),
    },
  };
}
