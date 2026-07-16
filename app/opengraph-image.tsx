import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "The first real-time 3D mockup studio for Framer — Mockiosa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG card : catchline seule dans la typo du site (Inter Bold ≈ SF Pro,
 * tracking serré) + iPhone 17 Pro Cosmic Orange détouré (PNG alpha)
 * posé sur le fond noir à droite, plein bord en bas. Pas de box.
 */
export default async function Image() {
  const [iphone, interBold] = await Promise.all([
    readFile(join(process.cwd(), "app/og-iphone.png")),
    readFile(join(process.cwd(), "app/Inter-Bold.woff")),
  ]);
  const iphoneSrc = `data:image/png;base64,${iphone.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#000000",
          color: "#F5F5F7",
          fontFamily: "Inter",
          padding: "0 0 0 80px",
        }}
      >
        {/* Catchline — typo du site, deux tons comme le hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-0.045em",
            width: 600,
          }}
        >
          {/* Lockup Mockiosa — plume + wordmark, comme le header du site */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <path d="M16 8 2 22" />
              <path d="M17.5 15H9" />
            </svg>
            <div style={{ display: "flex", fontSize: 32, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              Mockiosa
            </div>
          </div>
          <div style={{ display: "flex", color: "#FFFFFF" }}>The first real-time</div>
          <div style={{ display: "flex", color: "#FFFFFF" }}>3D mockup studio</div>
          <div style={{ display: "flex", color: "#9A9A9E" }}>for Framer.</div>
        </div>

        {/* iPhone Cosmic Orange détouré — coupé au bord bas comme le render Apple */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iphoneSrc}
          alt=""
          width={1240}
          height={698}
          style={{
            position: "absolute",
            left: 289,
            top: 3,
            width: 1240,
            height: 698,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: interBold, weight: 700, style: "normal" }],
    }
  );
}
