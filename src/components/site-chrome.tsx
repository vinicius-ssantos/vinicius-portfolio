"use client";

import { useState } from "react";
import { ContactModal } from "@/components/contact-modal";
import { SiteHeader } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { SiteFooter } from "@/components/sections/footer";
import { ScrollProgress } from "@/components/animations/scroll-progress";
import { trackEvent } from "@/lib/analytics";
import type { translations } from "@/lib/translations";
import type { Lang } from "@/content";

type T = typeof translations.en;

type SiteChromeProps = {
  t: T;
  lang: Lang;
  withHero?: boolean;
  children: React.ReactNode;
};

export function SiteChrome({ t, lang, withHero = false, children }: SiteChromeProps) {
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = () => {
    trackEvent("contact_open", { lang });
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollProgress />
      <SiteHeader t={t} lang={lang} />
      <main id="main" className="flex-1 page-transition">
        {withHero && <Hero t={t} lang={lang} onContactOpen={openContact} />}
        {children}
      </main>
      <SiteFooter t={t} onContactOpen={openContact} />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} t={t} />
    </div>
  );
}
