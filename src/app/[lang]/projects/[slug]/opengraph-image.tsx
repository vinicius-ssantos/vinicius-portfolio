import { ImageResponse } from "next/og";
import { profile, t as tp, getProjectBySlug } from "@/content";
import { translations, type Lang } from "@/lib/translations";
import { isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = Promise<{ lang: string; slug: string }>;

export default async function OGImage({ params }: { params: Params }) {
  const { lang: rawLang, slug } = await params;
  const lang = isLocale(rawLang) ? (rawLang as Lang) : "pt";
  const t = translations[lang];
  const project = getProjectBySlug(slug);

  const name = project?.name ?? "Project";
  const tagline = project ? tp(project.tagline, lang) : "";
  const stack = project?.stack.slice(0, 6) ?? [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        backgroundColor: "#0f0e0d",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", color: "#34d399", fontSize: "22px" }}>
        {t.projectDetail.eyebrow}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", color: "#34d399", fontSize: "44px", fontWeight: 700 }}>
          {name}
        </div>
        <div style={{ display: "flex", color: "#a1a1aa", fontSize: "26px", maxWidth: "900px" }}>
          {tagline}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {stack.map((s) => (
          <div
            key={s}
            style={{
              display: "flex",
              padding: "6px 16px",
              borderRadius: "6px",
              backgroundColor: "rgba(255,255,255,0.06)",
              color: "#d4d4d8",
              fontSize: "16px",
            }}
          >
            {s}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "24px",
          color: "#71717a",
          fontSize: "18px",
        }}
      >
        {profile.handle} · {profile.links.github}
      </div>
    </div>,
    { ...size },
  );
}
