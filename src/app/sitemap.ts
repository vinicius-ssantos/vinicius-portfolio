import type { MetadataRoute } from "next";
import { projects } from "@/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinicius-portfolio-source.vercel.app";

const LOCALES = ["pt", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeEntries: MetadataRoute.Sitemap = LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 1.0,
    alternates: {
      languages: {
        "pt-BR": `${SITE_URL}/pt`,
        "en-US": `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/pt`,
      },
    },
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt/projects/${project.slug}`,
          "en-US": `${SITE_URL}/en/projects/${project.slug}`,
          "x-default": `${SITE_URL}/pt/projects/${project.slug}`,
        },
      },
      images: project.image ? [`${SITE_URL}${project.image}`] : undefined,
    })),
  );

  return [
    ...homeEntries,
    ...projectEntries,
    {
      url: `${SITE_URL}/cv-vinicius-santos.pdf`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
