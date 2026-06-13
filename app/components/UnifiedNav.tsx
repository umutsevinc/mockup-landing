"use client";

import { useEffect, useState, type ReactNode } from "react";

type Link = { href: string; text: string };

type Props = {
  /** Brand mark icon — a small SVG, glyph, or React element rendered at ~20px. */
  icon: ReactNode;
  /** First half of the wordmark, rendered in ink. */
  brandPrefix: string;
  /** Second half of the wordmark, rendered in accent color. Optional. */
  brandSuffix?: string;
  links: Link[];
  /** CTA pill visible only when nav has shrunk. */
  cta: { label: string; href: string };
  /** Override ink color (default = var(--color-ink) or #0a0a0a). */
  ink?: string;
  /** Override accent (default = #FF4B1F). */
  accent?: string;
  /** Override paper (default = #fafaf7). */
  paper?: string;
  /** Override muted color used for link rest state. */
  muted?: string;
  /** Override the line color used for the shrunk-state border. */
  line?: string;
};

/**
 * Unified floating navigation — Marc Lou × Contralabs.
 * Full-bleed at the top, morphs into a centered Liquid-Glass pill on scroll.
 * Same behavior across every Memselon landing; brand + CTA passed as props.
 */
export function UnifiedNav({
  icon,
  brandPrefix,
  brandSuffix,
  links,
  cta,
  ink = "#0a0a0a",
  accent = "#FF4B1F",
  paper = "#fafaf7",
  muted = "#6b6b6b",
  line = "#e5e5e0",
}: Props) {
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShrunk(window.scrollY > 80));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: shrunk ? 14 : 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        transition: "top 400ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <nav
        style={{
          pointerEvents: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: shrunk ? 16 : 32,
          padding: shrunk ? "10px 14px 10px 18px" : "16px 24px",
          borderRadius: shrunk ? 999 : 0,
          border: shrunk ? `1px solid ${line}` : "1px solid transparent",
          background: shrunk ? "rgba(255, 255, 255, 0.72)" : "transparent",
          backdropFilter: shrunk ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: shrunk ? "saturate(180%) blur(20px)" : "none",
          boxShadow: shrunk
            ? "0 14px 40px -20px rgba(10,10,10,0.18), inset 0 1px 0 rgba(255,255,255,0.7)"
            : "none",
          transition:
            "padding 400ms cubic-bezier(0.16,1,0.3,1), border-radius 400ms cubic-bezier(0.16,1,0.3,1), background 400ms ease, gap 400ms ease, box-shadow 400ms ease, border-color 400ms ease",
          width: shrunk ? "auto" : "min(1024px, 100%)",
          marginInline: shrunk ? 0 : 16,
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: ink,
            textDecoration: "none",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: shrunk ? 18 : 20,
              height: shrunk ? 18 : 20,
              transition: "width 280ms ease, height 280ms ease",
            }}
          >
            {icon}
          </span>
          <span>
            {brandPrefix}
            {brandSuffix && <span style={{ color: accent }}>{brandSuffix}</span>}
          </span>
        </a>

        <div
          style={{
            display: "flex",
            gap: shrunk ? 14 : 24,
            fontSize: 14,
            color: muted,
            opacity: shrunk ? 0 : 1,
            maxWidth: shrunk ? 0 : 600,
            overflow: "hidden",
            transition:
              "opacity 250ms ease, max-width 400ms cubic-bezier(0.16,1,0.3,1), gap 400ms ease",
            pointerEvents: shrunk ? "none" : "auto",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {l.text}
            </a>
          ))}
        </div>

        <a
          href={cta.href}
          style={{
            display: shrunk ? "inline-flex" : "none",
            alignItems: "center",
            background: ink,
            color: paper,
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 500,
            gap: 6,
            textDecoration: "none",
          }}
        >
          {cta.label}
          <span style={{ opacity: 0.6 }}>→</span>
        </a>
      </nav>
    </div>
  );
}

/* ─── Per-landing brand icons (small SVG glyphs to keep design coherent) ─── */

export function ScangapMark({ stroke = "#0a0a0a" }: { stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke={stroke} strokeWidth={1.6}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.4" fill={stroke} />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" />
    </svg>
  );
}
export function HeroesMark({ stroke = "#0a0a0a" }: { stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke={stroke} strokeWidth={1.6}>
      <path d="M12 3 L21 8 L21 16 L12 21 L3 16 L3 8 Z" strokeLinejoin="round" />
      <path d="M12 3 L12 21 M3 8 L21 8 M3 16 L21 16" strokeLinejoin="round" strokeOpacity={0.45} />
    </svg>
  );
}
export function MockupMark({ stroke = "#0a0a0a" }: { stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke={stroke} strokeWidth={1.6}>
      <rect x="7" y="3" width="10" height="18" rx="2.4" />
      <circle cx="12" cy="18" r="0.8" fill={stroke} />
      <path d="M10 3 L14 3" strokeLinecap="round" />
    </svg>
  );
}
