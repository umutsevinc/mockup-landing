"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function A({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={v ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function BehindTheBuild() {
  return (
    <section style={{ background: "var(--bg-primary)", padding: "72px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <A>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-purple)", opacity: 0.9, marginBottom: 16 }}>
            Behind the build
          </div>
        </A>
        <A delay={0.05}>
          <h2 style={{ marginBottom: 24 }}>Built by a Framer Partner Expert.</h2>
        </A>
        <A delay={0.1} className="flex flex-col items-center">
          <div
            aria-hidden="true"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7F77DD 0%, #1D9E75 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 20,
              boxShadow: "0 8px 30px rgba(127,119,221,0.25)",
            }}
          >
            U
          </div>
        </A>
        <A delay={0.15}>
          <p style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.7, maxWidth: 620, margin: "0 auto 28px" }}>
            Hey, I&apos;m Umut — design engineer based in Strasbourg, building cinematic web experiences for clients like Jetfly Aviation and BBA Studio. After hours of exporting PNGs from Rotato and re-importing them every time a screenshot changed, I asked: why is there no native 3D in Framer? So I built Memselon Mockup. Real 3D. Real-time. No exports.
          </p>
        </A>
        <A delay={0.25}>
          <a
            href="https://x.com/memselon"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 42,
              padding: "0 20px",
              borderRadius: 10,
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow the build on X
          </a>
        </A>
      </div>
    </section>
  );
}
