"use client";

import { useState } from "react";
import { ContactModal } from "@/components/contact-modal";
import { SiteHeader } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { SiteFooter } from "@/components/sections/footer";
import { ScrollProgress } from "@/components/animations/scroll-progress";
import { trackEvent } from "@/lib/analytics";
import type { Lang } from "@/content";

type SiteChromeProps = {
  lang: Lang;
  withHero?: boolean;
  children: React.ReactNode;
};

export function SiteChrome({ lang, withHero = false, children }: SiteChromeProps) {
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = () => {
    trackEvent("contact_open", { lang });
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollProgress />
      <SiteHeader lang={lang} />
      <main id="main" className="flex-1 page-transition">
        {withHero && <Hero lang={lang} onContactOpen={openContact} />}
        {children}
      </main>
      <SiteFooter onContactOpen={openContact} />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
