import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://vinicius-portfolio-source.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vinicius Santos — Backend Software Engineer @ UOL",
  description:
    "Backend Software Engineer at UOL working on authentication, authorization and account-protection flows. 5+ years across Java, Spring, Kubernetes and distributed systems. Based in São Paulo, Brazil.",
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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: undefined,
  openGraph: {
    type: "profile",
    locale: "pt_BR",
    url: SITE_URL,
    title: "Vinicius Santos — Backend Software Engineer @ UOL",
    description:
      "Backend Engineer working on authentication, authorization and account-protection flows at UOL. 5+ years across Java, Spring, Kubernetes and distributed systems.",
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
    title: "Vinicius Santos — Backend Software Engineer @ UOL",
    description:
      "Backend Engineer working on authentication, authorization and account-protection flows at UOL. 5+ years across Java, Spring, Kubernetes and distributed systems.",
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
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0f0e0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
