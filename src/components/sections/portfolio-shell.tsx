"use client";

import { useState } from "react";
import { ContactModal } from "@/components/contact-modal";
import { SiteHeader, Hero, SiteFooter } from "@/components/sections/client-sections";
import type { translations } from "@/lib/translations";
import type { Lang } from "@/lib/portfolio-data";

type T = typeof translations.en;

/**
 * Client shell that wraps the page content.
 * Holds the contact modal state (the only piece of client state in the whole page).
 * Server-rendered sections are passed as `children`.
 */
export function PortfolioShell({
  t,
  lang,
  children,
}: {
  t: T;
  lang: Lang;
  children: React.ReactNode;
}) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader t={t} />
      <main id="main" className="flex-1">
        <Hero t={t} lang={lang} onContactOpen={() => setContactOpen(true)} />
        {children}
      </main>
      <SiteFooter t={t} onContactOpen={() => setContactOpen(true)} />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} t={t} />
    </div>
  );
}

