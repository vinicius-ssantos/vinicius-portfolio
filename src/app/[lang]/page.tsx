import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SiteChrome } from "@/components/site-chrome";
import { StatsBar } from "@/components/sections/stats";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { FeaturedProjects } from "@/components/sections/projects";
import { CaseStudy } from "@/components/sections/case-study";
import { EducationSection } from "@/components/sections/education";
import { About } from "@/components/sections/about";
import type { Lang } from "@/content";
import { isLocale } from "@/lib/i18n";

type Params = Promise<{ lang: string }>;

export function generateStaticParams() {
  return (["pt", "en"] as const).map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: Params }) {
  const { lang: rawLang } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang as Lang;
  setRequestLocale(lang);

  return (
    <SiteChrome lang={lang} withHero>
      <StatsBar lang={lang} />
      <Experience lang={lang} />
      <Stack />
      <FeaturedProjects lang={lang} />
      <CaseStudy lang={lang} />
      <EducationSection lang={lang} />
      <About lang={lang} />
    </SiteChrome>
  );
}
