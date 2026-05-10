"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroDevice = dynamic(() => import("../HeroDevice"), {
  ssr: false,
  loading: () => (
    <div className="hero-playground flex items-center justify-center">
      <div
        style={{
          width: 28,
          height: 28,
          border: "2px solid rgba(255,255,255,0.06)",
          borderTopColor: "rgba(139,92,246,0.5)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

const EASE_CINEMATIC: [number, number, number, number] = [0.32, 0.72, 0, 1];

const H1_LINES = ["The first", "real-time 3D", "mockup studio."];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--ds-bg-primary)" }}
    >
      {/* Background gradients — full bleed, behind content */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{ background: "var(--ds-gradient-hero-purple)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{ background: "var(--ds-gradient-hero-teal)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-36 md:pb-24 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Text column — order-2 mobile (after mockup), order-1 desktop (left) */}
          <div className="md:col-span-5 order-2 md:order-1 text-center md:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
              className="font-mono text-[12px] md:text-[13px] uppercase mb-7"
              style={{
                letterSpacing: "0.18em",
                color: "var(--ds-text-tertiary)",
              }}
            >
              Real 3D <span style={{ opacity: 0.5 }}>·</span> Real-time <span style={{ opacity: 0.5 }}>·</span> In Framer
            </motion.div>

            {/* H1 — stagger per line */}
            <h1
              className="font-display font-medium"
              style={{
                fontSize: "clamp(44px, 7.5vw, 88px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                color: "var(--ds-text-primary)",
              }}
            >
              {H1_LINES.map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: EASE_CINEMATIC }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE_CINEMATIC }}
              className="mt-7 mx-auto md:mx-0"
              style={{
                fontSize: "clamp(16px, 1.6vw, 18px)",
                lineHeight: 1.6,
                color: "var(--ds-text-secondary)",
                maxWidth: 480,
              }}
            >
              Stop exporting PNGs from Rotato. Memselon Mockup ships real 3D — live, scrollable, interactive — straight into your Framer site.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: EASE_CINEMATIC }}
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <a
                href="https://www.framer.com/marketplace/plugins/mockup-for-framer/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black text-[15px] font-semibold rounded-full transition-transform hover:scale-[1.02] no-underline"
                style={{ boxShadow: "var(--ds-glow-brand)" }}
              >
                Try free
                <ArrowRight />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium rounded-full transition-colors no-underline"
                style={{
                  color: "var(--ds-text-secondary)",
                  border: "1px solid var(--ds-border-medium)",
                }}
              >
                See it live
              </a>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: EASE_CINEMATIC }}
              className="mt-10 text-[13px] md:text-[14px]"
              style={{ color: "var(--ds-text-muted)" }}
            >
              Built by a certified Framer Partner Expert <span style={{ opacity: 0.5 }}>·</span> Crafted by a human <span style={{ opacity: 0.85 }}>☁️</span>
            </motion.p>
          </div>

          {/* 3D mockup column — order-1 mobile (top), order-2 desktop (right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE_CINEMATIC }}
            className="md:col-span-7 order-1 md:order-2 w-full"
          >
            <HeroDevice />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-0.5"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
