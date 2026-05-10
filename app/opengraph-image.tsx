import { ImageResponse } from "next/og";

export const alt = "Memselon Mockup — Real 3D. Real-time. In Framer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 90px",
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(127,119,221,0.35) 0%, transparent 55%), radial-gradient(ellipse at 20% 90%, rgba(29,158,117,0.18) 0%, transparent 55%), #050509",
          color: "#F5F5F7",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#7F77DD",
            marginBottom: 36,
          }}
        >
          Real 3D. Real-time. In Framer.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 980,
          }}
        >
          The first real-time 3D mockup studio for Framer.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#8E8E93",
            marginTop: 36,
          }}
        >
          memselon.com
        </div>
      </div>
    ),
    { ...size }
  );
}
