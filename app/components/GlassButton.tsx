"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";

type Variant = "ink" | "accent" | "paper" | "ghost";

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: Variant;
  size?: "lg" | "md";
  trailing?: string;
  className?: string;
};

/**
 * Apple-style skeumorphic Liquid Glass button.
 * Multi-layer shadows + inset highlights + gradient + GSAP micro-bounce
 * on press. Use for all CTAs to keep a consistent feel.
 */
export function GlassButton({
  href,
  onClick,
  children,
  variant = "ink",
  size = "lg",
  trailing = "→",
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const conf = size === "lg"
    ? { padX: "28px", padY: "16px", fs: 16, gap: 12, arrow: 24, radius: 999 }
    : { padX: "20px", padY: "11px", fs: 14, gap: 8, arrow: 20, radius: 999 };

  // Palette per variant
  const v = {
    ink: {
      bg: "linear-gradient(180deg, #2a2a2e 0%, #0a0a0c 100%)",
      text: "#fafaf7",
      arrowBg: "rgba(255,255,255,0.14)",
      shadow:
        "0 16px 30px -10px rgba(0,0,0,0.45), 0 4px 8px -4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.45)",
      border: "1px solid rgba(0,0,0,0.4)",
    },
    accent: {
      bg: "linear-gradient(180deg, #ff7050 0%, #cc2b06 100%)",
      text: "#fafaf7",
      arrowBg: "rgba(255,255,255,0.22)",
      shadow:
        "0 16px 32px -8px rgba(255,75,31,0.50), 0 4px 8px -4px rgba(204,43,6,0.30), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(120,20,0,0.5)",
      border: "1px solid rgba(160,30,0,0.3)",
    },
    paper: {
      bg: "linear-gradient(180deg, #ffffff 0%, #f0eee9 100%)",
      text: "#0a0a0a",
      arrowBg: "rgba(10,10,10,0.06)",
      shadow:
        "0 14px 26px -10px rgba(0,0,0,0.16), 0 2px 6px -2px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.08)",
      border: "1px solid rgba(0,0,0,0.10)",
    },
    ghost: {
      bg: "transparent",
      text: "#0a0a0a",
      arrowBg: "rgba(10,10,10,0.06)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
      border: "1.5px solid rgba(10,10,10,0.18)",
    },
  }[variant];

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: conf.gap,
    padding: `${conf.padY} ${conf.padX}`,
    background: v.bg,
    color: v.text,
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 600,
    fontSize: conf.fs,
    letterSpacing: "-0.005em",
    borderRadius: conf.radius,
    border: v.border,
    textDecoration: "none",
    cursor: "pointer",
    willChange: "transform",
    boxShadow: v.shadow,
    transition: "box-shadow 280ms ease",
  };

  function hoverIn() {
    if (!ref.current) return;
    gsap.to(ref.current, { y: -2, duration: 0.32, ease: "power3.out" });
  }
  function hoverOut() {
    if (!ref.current) return;
    gsap.to(ref.current, { y: 0, duration: 0.32, ease: "power3.out" });
  }
  function press() {
    if (!ref.current) return;
    gsap.to(ref.current, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" });
  }

  const inner = (
    <>
      <span>{children}</span>
      {trailing && (
        <span
          style={{
            width: conf.arrow,
            height: conf.arrow,
            borderRadius: 999,
            background: v.arrowBg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: conf.fs - 2,
            color: "inherit",
          }}
        >
          {trailing}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={baseStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        onMouseDown={press}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={className}
      style={baseStyle}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      onMouseDown={press}
    >
      {inner}
    </button>
  );
}
