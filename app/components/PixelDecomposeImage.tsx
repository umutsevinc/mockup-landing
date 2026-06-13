"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  /** Cell size in px — also defines particle size */
  cell?: number;
  /** Number of particle columns to scatter on hover */
  density?: number;
  /** Hex of the accent color */
  accent?: string;
  /** Always-on (no need to hover) */
  always?: boolean;
  /** Side from which the pixels emerge: "right" (default) | "left" | "top" | "bottom" */
  side?: "right" | "left" | "top" | "bottom";
  rounded?: string; // tailwind class, e.g. "rounded-2xl"
};

/**
 * Image with a grid-aligned pixel-decompose effect on hover.
 * Particles render in absolutely-positioned divs on a strict CELL grid,
 * triggered by a `data-active="true"` attribute the wrapper toggles
 * on mouse enter / touch. Pure CSS transitions — no animation loop.
 */
export function PixelDecomposeImage({
  src,
  alt = "",
  className = "",
  cell = 10,
  density = 80,
  accent = "#FF4B1F",
  always = false,
  side = "right",
  rounded = "rounded-2xl",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number; tx: number; ty: number }[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDims({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!dims.w || !dims.h) return;
    const { w, h } = dims;
    // Build a deterministic grid of particles concentrated on one edge.
    const out: { x: number; y: number; size: number; delay: number; tx: number; ty: number }[] = [];
    for (let i = 0; i < density; i++) {
      let gx = 0, gy = 0, tx = 0, ty = 0;
      const r = Math.random();
      if (side === "right") {
        gx = Math.floor((w * (0.55 + Math.random() * 0.4)) / cell) * cell;
        gy = Math.floor((Math.random() * h) / cell) * cell;
        tx = 40 + Math.random() * 60;
        ty = (Math.random() - 0.5) * 30;
      } else if (side === "left") {
        gx = Math.floor((w * (0.05 + Math.random() * 0.35)) / cell) * cell;
        gy = Math.floor((Math.random() * h) / cell) * cell;
        tx = -(40 + Math.random() * 60);
        ty = (Math.random() - 0.5) * 30;
      } else if (side === "top") {
        gx = Math.floor((Math.random() * w) / cell) * cell;
        gy = Math.floor((h * (0.05 + Math.random() * 0.35)) / cell) * cell;
        ty = -(40 + Math.random() * 60);
        tx = (Math.random() - 0.5) * 30;
      } else {
        gx = Math.floor((Math.random() * w) / cell) * cell;
        gy = Math.floor((h * (0.55 + Math.random() * 0.4)) / cell) * cell;
        ty = 40 + Math.random() * 60;
        tx = (Math.random() - 0.5) * 30;
      }
      out.push({
        x: gx,
        y: gy,
        size: r < 0.2 ? cell * 2 : cell,
        delay: Math.floor(Math.random() * 240),
        tx,
        ty,
      });
    }
    setParticles(out);
  }, [dims.w, dims.h, density, cell, side]);

  return (
    <div
      ref={ref}
      data-active={always ? "true" : undefined}
      className={`group/pxl relative overflow-hidden ${rounded} ${className}`}
      onMouseEnter={(e) => e.currentTarget.setAttribute("data-active", "true")}
      onMouseLeave={(e) => !always && e.currentTarget.removeAttribute("data-active")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover/pxl:scale-[1.02]"
      />
      {/* Particle overlay */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="pxl-particle"
            style={
              {
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: accent,
                transitionDelay: `${p.delay}ms`,
                ["--tx" as never]: `${p.tx}px`,
                ["--ty" as never]: `${p.ty}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
