import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Block clickjacking — the portfolio should never be framed.
          { key: "X-Frame-Options", value: "DENY" },
          // Only send the origin (not full URL) to cross-origin destinations.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Lock down browser permissions we don't use.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Strict CSP. 'unsafe-inline' is required for next/font and inline styles,
          // 'unsafe-inline' for scripts is required because next/og + Next internals
          // inject scripts. Vercel Analytics is loaded from va.vercel-scripts.com.
          // Cloudflare Turnstile (contact form challenge, #54) needs its script
          // (script-src), its own embedded frame (frame-src), and the calls it
          // makes internally to run the challenge (connect-src).
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.github.com https://vitals.vercel-insights.com https://challenges.cloudflare.com",
              "frame-src https://challenges.cloudflare.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
          // Stick to HTTPS — subdomains included.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // Static assets can be cached aggressively.
      {
        source: "/favicon.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, immutable" }],
      },
      {
        source: "/projects/(.*).png",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, immutable" }],
      },
    ];
  },
};

export default nextConfig;
