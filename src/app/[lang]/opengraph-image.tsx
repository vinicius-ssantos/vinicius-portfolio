import { ImageResponse } from "next/og";
import { profile } from "@/lib/portfolio-data";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = Promise<{ lang: string }>;

export default async function OGImage({ params }: { params: Params }) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : "pt";
  const t = translations[lang];
  const role = profile.role[lang];
  const location = profile.location[lang];

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
        backgroundImage:
          "linear-gradient(to right, rgba(120,120,120,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,120,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            backgroundColor: "#34d399",
            color: "#0f0e0d",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          VS
        </div>
        <div style={{ display: "flex", color: "#a1a1aa", fontSize: "20px" }}>{profile.handle}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#34d399",
            fontSize: "20px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#34d399",
            }}
          />
          {t.hero.badge}
        </div>
        <div style={{ display: "flex", color: "#fafafa", fontSize: "56px", fontWeight: 700 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", color: "#34d399", fontSize: "28px" }}>
          {role} · {location}
        </div>
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
        {profile.links.github}
      </div>
    </div>,
    { ...size },
  );
}
