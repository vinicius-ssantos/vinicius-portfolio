import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f0e0d",
        borderRadius: "36px",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#34d399",
          fontSize: "84px",
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        VS
      </div>
    </div>,
    { ...size },
  );
}
