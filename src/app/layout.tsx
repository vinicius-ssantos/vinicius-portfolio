import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language-context";
import { profile } from "@/lib/portfolio-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://vinicius-portfolio-source.vercel.app";

// Force dynamic rendering since generateMetadata reads cookies()
export const dynamic = "force-dynamic";

// JSON-LD Person schema for SEO / rich results
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Backend Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "UOL",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: SITE_URL,
  sameAs: [
    profile.links.github,
    profile.links.linkedin,
  ],
  knowsAbout: [
    "Java",
    "Kotlin",
    "Spring Framework",
    "Microservices",
    "Kubernetes",
    "Docker",
    "Authentication",
    "Authorization",
    "Account Protection",
    "Distributed Systems",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "FATEC Ferraz de Vasconcelos",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Faculdade Impacta",
    },
  ],
};

// Generate metadata dynamically based on the visitor's language cookie
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("portfolio-lang")?.value;
  const isPt = lang !== "en"; // default to pt

  const title = isPt
    ? "Vinicius Santos — Engenheiro de Software Backend @ UOL"
    : "Vinicius Santos — Backend Software Engineer @ UOL";

  const description = isPt
    ? "Engenheiro de Software Backend na UOL trabalhando em fluxos de autenticação, autorização e proteção de conta. 5+ anos com Java, Spring, Kubernetes e sistemas distribuídos. Baseado em São Paulo, Brasil."
    : "Backend Software Engineer at UOL working on authentication, authorization and account-protection flows. 5+ years across Java, Spring, Kubernetes and distributed systems. Based in São Paulo, Brazil.";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "Backend Engineer",
      "Software Engineer",
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
      "Vinicius Santos",
    ],
    authors: [{ name: "Vinicius de Oliveira Santos" }],
    creator: "Vinicius de Oliveira Santos",
    publisher: "Vinicius de Oliveira Santos",
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: ["/favicon.svg"],
      apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      type: "profile",
      locale: isPt ? "pt_BR" : "en_US",
      url: SITE_URL,
      title,
      description,
      siteName: "Vinicius Santos — Portfolio",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Vinicius Santos — Backend Software Engineer portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
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
      canonical: SITE_URL,
      // hreflang: declare PT and EN versions for Google
      languages: {
        "pt-BR": SITE_URL,
        "en-US": SITE_URL,
        xDefault: SITE_URL,
      },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Skip link for keyboard users (WCAG 2.1) */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-primary"
        >
          Skip to content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>

        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        <Analytics />
      </body>
    </html>
  );
}
