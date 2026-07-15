import type { MetadataRoute } from "next";
import { projects } from "@/content";
import { absoluteUrl } from "@/lib/site-config";
import { buildLocaleAlternates } from "@/lib/seo";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  // No `lastModified` on entries below — there's no tracked "last changed"
  // date for the home page or the static CV file, and stamping `new Date()`
  // on every sitemap generation would falsely claim they change constantly.
  // Project entries use their real, manually-maintained `updatedAt`.
  const homeEntries: MetadataRoute.Sitemap = locales.map((lang) => ({
    url: absoluteUrl(`/${lang}`),
    changeFrequency: "monthly",
    priority: 1.0,
    alternates: { languages: buildLocaleAlternates("") },
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) =>
    locales.map((lang) => ({
      url: absoluteUrl(`/${lang}/projects/${project.slug}`),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      alternates: { languages: buildLocaleAlternates(`/projects/${project.slug}`) },
      images: project.image ? [absoluteUrl(project.image)] : undefined,
    })),
  );

  return [
    ...homeEntries,
    ...projectEntries,
    {
      url: absoluteUrl("/cv-vinicius-santos.pdf"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
