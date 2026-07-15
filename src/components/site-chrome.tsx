"use client";

import { useState } from "react";
import { ContactModal } from "@/components/contact-modal";
import { SiteHeader, Hero, SiteFooter } from "@/components/sections/client-sections";
import { ScrollProgress } from "@/components/animations/scroll-progress";
import type { translations } from "@/lib/translations";
import type { Lang } from "@/lib/portfolio-data";

type T = typeof translations.en;

type SiteChromeProps = {
  t: T;
  lang: Lang;
  withHero?: boolean;
  children: React.ReactNode;
};

export function SiteChrome({ t, lang, withHero = false, children }: SiteChromeProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollProgress />
      <SiteHeader t={t} lang={lang} />
      <main id="main" className="flex-1 page-transition">
        {withHero && <Hero t={t} lang={lang} onContactOpen={() => setContactOpen(true)} />}
        {children}
      </main>
      <SiteFooter t={t} onContactOpen={() => setContactOpen(true)} />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} t={t} />
    </div>
  );
}
