import { getLangAndTranslations } from "@/lib/get-lang";
import { PortfolioShell } from "@/components/sections/portfolio-shell";
import {
  StatsBar,
  Experience,
  Stack,
  FeaturedProjects,
  CaseStudy,
  EducationSection,
  About,
} from "@/components/sections/server-sections";

/**
 * Server Component — reads lang from cookie via cookies(),
 * passes lang + t (translations) as props to all sections.
 *
 * Only the PortfolioShell (which holds the contact modal state)
 * and the small client components inside it (ThemeToggle, LanguageToggle,
 * ContactModal) are client-side.
 *
 * All visible text is now server-rendered — better SEO and LCP.
 */
export default async function Home() {
  const { lang, t } = await getLangAndTranslations();

  return (
    <PortfolioShell t={t} lang={lang}>
      <StatsBar lang={lang} />
      <Experience t={t} lang={lang} />
      <Stack t={t} />
      <FeaturedProjects t={t} lang={lang} />
      <CaseStudy t={t} lang={lang} />
      <EducationSection t={t} lang={lang} />
      <About t={t} lang={lang} />
    </PortfolioShell>
  );
}
