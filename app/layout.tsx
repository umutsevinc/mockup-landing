import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// M14 — serif accent for italicized words in display headings (ElevenLabs-style)
const newsreader = Newsreader({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

// M14 — mono for eyebrows, ASCII art, technical labels
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://framermockup.memselon.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Memselon Mockup — Real-time 3D Mockups for Framer",
  description:
    "The first real-time 3D mockup studio for Framer. Embed interactive 3D mockups live in your site — no PNG exports needed. iPhone 17, iPhone Air, iPad, iMac, Apple Watch.",
  keywords: [
    "framer plugin",
    "3d mockup",
    "real-time 3d",
    "framer mockup",
    "device mockup",
    "framer studio",
    "memselon",
    "react three fiber",
    "webgl mockup",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Memselon Mockup — Real 3D. Real-time. In Framer.",
    description:
      "Stop exporting PNGs. Ship real 3D mockups live in your Framer site.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memselon Mockup — Real 3D. Real-time. In Framer.",
    description: "The first real-time 3D mockup studio for Framer.",
    site: "@memselon",
    creator: "@memselon",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased dark`}>
      <body className="noise min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
