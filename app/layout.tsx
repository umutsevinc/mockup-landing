import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mockup for Framer — 3D Device Mockups in Seconds",
  description:
    "Create stunning 3D interactive mockups of Apple devices directly inside Framer. iPhone, iPad, iMac, Apple Watch — all in real-time 3D.",
  keywords: [
    "framer plugin",
    "3d mockup",
    "device mockup",
    "iphone mockup",
    "apple mockup",
    "framer",
    "3d",
    "interactive",
  ],
  openGraph: {
    title: "Mockup for Framer",
    description: "3D interactive device mockups inside Framer",
    type: "website",
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
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="noise min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
