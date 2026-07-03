import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
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

// Static metadata with dynamic og:locale based on request headers
// We use generateMetadata + headers() (safe in Next.js 16 production builds)
export async function generateMetadata(): Promise<Metadata> {
  let isPt = true;
  try {
    const h = await headers();
    const cookieHeader = h.get("cookie") || "";
    const langMatch = cookieHeader.match(/(?:^|;\s*)portfolio-lang=(pt|en)/);
    if (langMatch) {
      isPt = langMatch[1] === "pt";
    } else {
      const acceptLang = (h.get("accept-language") || "").toLowerCase();
      if (acceptLang && !acceptLang.startsWith("pt")) {
        isPt = false;
      }
    }
  } catch {
    // headers() not available during static generation — keep pt default
  }

  const title = "Vinicius Santos — Backend Software Engineer @ UOL";
  const description =
    "Backend Software Engineer at UOL working on authentication, authorization and account-protection flows. 5+ years across Java, Spring, Kubernetes and distributed systems. Based in São Paulo, Brazil.";

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
          {children}
          <Toaster />
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
