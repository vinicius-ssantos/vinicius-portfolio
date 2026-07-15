// Single source of truth for the production URL — every route that needs
// canonical links, sitemaps, or absolute OG/JSON-LD URLs reads from here
// instead of redefining `process.env.NEXT_PUBLIC_SITE_URL ?? "..."` locally.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinicius-portfolio-source.vercel.app";

export const siteConfig = {
  url: SITE_URL,
  name: "Vinicius Santos — Portfolio",
};

/** Joins `path` onto `SITE_URL`, normalizing the leading slash. */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
