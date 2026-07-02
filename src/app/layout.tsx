import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinicius Santos — Backend Software Engineer",
  description:
    "Backend Software Engineer from São Paulo, Brazil, focused on building reliable APIs, integrations and backend services. Kotlin, Spring, Java, k8s, Docker.",
  keywords: [
    "Backend Engineer",
    "Software Engineer",
    "Kotlin",
    "Spring Boot",
    "Java",
    "Microservices",
    "Kubernetes",
    "Docker",
    "São Paulo",
    "Brazil",
    "Vinicius Santos",
  ],
  authors: [{ name: "Vinicius de Oliveira Santos" }],
  openGraph: {
    title: "Vinicius Santos — Backend Software Engineer",
    description:
      "Backend Software Engineer from São Paulo, Brazil. Kotlin, Spring, Java, k8s, Docker. Reliable APIs and distributed systems.",
    url: "https://github.com/vinicius-ssantos",
    siteName: "Vinicius Santos",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinicius Santos — Backend Software Engineer",
    description:
      "Backend Software Engineer from São Paulo, Brazil. Reliable APIs and distributed systems.",
  },
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
      </body>
    </html>
  );
}
