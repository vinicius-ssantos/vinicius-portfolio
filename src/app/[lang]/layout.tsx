import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { profile, t as tp } from "@/content";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/i18n";
import { SITE_URL, absoluteUrl } from "@/lib/site-config";
import {
  ogLocale,
  buildLocaleAlternates,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  buildProfilePageJsonLd,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return (["pt", "en"] as const).map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : "pt";

  const title = {
    pt: `${profile.shortName} — Engenheiro de Software Backend @ UOL`,
    en: `${profile.shortName} — Backend Software Engineer @ UOL`,
  }[lang];
  const description = tp(profile.pitch, lang);
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

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    authors: [{ name: profile.name }],
    creator: profile.name,
    publisher: profile.name,
    // Manually declaring `icons` opts out of Next's file-convention
    // auto-injection entirely, so the generated apple-icon route
    // (src/app/apple-icon.tsx) has to be listed here explicitly too.
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: ["/favicon.svg"],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "profile",
      locale: ogLocale(lang),
      url: absoluteUrl(`/${lang}`),
      title,
      description,
      siteName: `${profile.shortName} — Portfolio`,
    },
    // No `creator` handle — profile.handle is the GitHub username, not a
    // verified X/Twitter account, and fabricating one would be misleading.
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
      canonical: absoluteUrl(`/${lang}`),
      languages: buildLocaleAlternates(""),
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

  const jsonLd = [buildPersonJsonLd(lang), buildWebsiteJsonLd(lang), buildProfilePageJsonLd(lang)];

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Analytics />
      </body>
    </html>
  );
}
