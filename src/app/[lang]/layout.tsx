import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { profile, stack, type LocalizedText } from "@/content";
import { translations, type Lang } from "@/lib/translations";
import { isLocale } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinicius-portfolio-source.vercel.app";

const pick = (text: LocalizedText, lang: Lang) => text[lang];

export async function generateStaticParams() {
  return (["pt", "en"] as const).map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : "pt";

  const title = pick(profile.role, lang)
    ? {
        pt: `${profile.shortName} — Engenheiro de Software Backend @ UOL`,
        en: `${profile.shortName} — Backend Software Engineer @ UOL`,
      }[lang]
    : `${profile.shortName}`;
  const description = pick(profile.pitch, lang);
  const keywords = [
    "Backend Engineer",
    "Engenheiro de Software Backend",
    "Java",
    "Spring",
    "Kotlin",
    "Kubernetes",
    "Docker",
    "Authentication",
    "Account Protection",
    "Microservices",
    "UOL",
    "São Paulo",
    "Brazil",
    profile.shortName,
  ];
  const canonicalPath = lang === "pt" ? "/pt" : "/en";

  const metadataBase = new URL(SITE_URL);

  const alternatesLanguages: Record<string, string> = {
    "pt-BR": `${SITE_URL}/pt`,
    "en-US": `${SITE_URL}/en`,
    "x-default": `${SITE_URL}/pt`,
  };

  return {
    metadataBase,
    title,
    description,
    keywords,
    authors: [{ name: profile.name }],
    creator: profile.name,
    publisher: profile.name,
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: ["/favicon.svg"],
      apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "profile",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      url: `${SITE_URL}${canonicalPath}`,
      title,
      description,
      siteName: `${profile.shortName} — Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: profile.handle ? `@${profile.handle}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages: alternatesLanguages,
    },
    category: "technology",
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e0d" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : "pt";
  const t = translations[lang];

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-primary"
        >
          {t.a11y.skipToContent}
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(lang)) }}
        />

        <Analytics />
      </body>
    </html>
  );
}

function buildJsonLd(lang: Lang) {
  const stackKeywords = [
    ...Object.values(stack.professional).flat(),
    ...Object.values(stack.personal).flat(),
  ];

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: pick(profile.role, lang),
    worksFor: { "@type": "Organization", name: "UOL" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    email: `mailto:${profile.email}`,
    url: `${SITE_URL}/${lang}`,
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: stackKeywords,
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "FATEC Ferraz de Vasconcelos" },
      { "@type": "CollegeOrUniversity", name: "Faculdade Impacta" },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.shortName} — Portfolio`,
    url: SITE_URL,
    inLanguage: lang === "pt" ? "pt-BR" : "en-US",
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      identifier: profile.handle,
    },
    url: `${SITE_URL}/${lang}`,
  };

  return [person, website, profilePage];
}
