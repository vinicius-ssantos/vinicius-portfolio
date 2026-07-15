import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/site-chrome";
import { StatsBar } from "@/components/sections/stats";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { FeaturedProjects } from "@/components/sections/projects";
import { CaseStudy } from "@/components/sections/case-study";
import { EducationSection } from "@/components/sections/education";
import { About } from "@/components/sections/about";
import { translations, type Lang } from "@/lib/translations";
import { isLocale } from "@/lib/i18n";

type Params = Promise<{ lang: string }>;

export function generateStaticParams() {
  return (["pt", "en"] as const).map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: Params }) {
  const { lang: rawLang } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang as Lang;
  const t = translations[lang];

  return (
    <SiteChrome t={t} lang={lang} withHero>
      <StatsBar t={t} lang={lang} />
      <Experience t={t} lang={lang} />
      <Stack t={t} lang={lang} />
      <FeaturedProjects t={t} lang={lang} />
      <CaseStudy t={t} lang={lang} />
      <EducationSection t={t} lang={lang} />
      <About t={t} lang={lang} />
    </SiteChrome>
  );
}
