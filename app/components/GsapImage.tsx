"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  src: string;
  alt?: string;
  className?: string;
  /** soft = light radial mask to blend with paper bg, full = no mask */
  blend?: "soft" | "full" | "none";
  /** Direction of pixel burst on hover */
  burstSide?: "right" | "left" | "top" | "bottom";
  /** Frame aspect ratio (CSS aspect-ratio value) */
  aspect?: string;
  rounded?: string;
  /** Caption rendered top-right (mono small) */
  cornerMark?: string;
  /** Caption rendered bottom-left (mono small) */
  bottomLabel?: string;
};

/**
 * GSAP-driven image card with chiaroscuro overlay, pixel-burst hover, and
 * radial mask so the Renaissance backdrops blend with the page paper.
 * The image is paired with a grid of orange pixels that animate outward
 * on hover (timeline scrubbed by GSAP, NOT CSS — buttery 120fps).
 */
export function GsapImage({
  src,
  alt = "",
  className = "",
  blend = "soft",
  burstSide = "right",
  aspect = "4 / 5",
  rounded = "rounded-3xl",
  cornerMark = "▒ ▓ █",
  bottomLabel,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const burstRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ctx = gsap.context(() => {
      // Scroll-in reveal
      gsap.from(wrap, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  // Build burst particles (grid-aligned 12px)
  const cell = 12;
  const cols = 14;
  const rows = 10;
  const particles: { x: number; y: number; tx: number; ty: number; sz: number; delay: number }[] = [];
  for (let i = 0; i < 70; i++) {
    let x = 0, y = 0, tx = 0, ty = 0;
    if (burstSide === "right") {
      x = Math.floor(Math.random() * cols) * cell + cell * 8;
      y = Math.floor(Math.random() * rows) * cell + cell * 2;
      tx = 30 + Math.random() * 80;
      ty = (Math.random() - 0.5) * 40;
    } else if (burstSide === "left") {
      x = Math.floor(Math.random() * 6) * cell;
      y = Math.floor(Math.random() * rows) * cell + cell * 2;
      tx = -(30 + Math.random() * 80);
      ty = (Math.random() - 0.5) * 40;
    } else if (burstSide === "top") {
      x = Math.floor(Math.random() * cols) * cell;
      y = Math.floor(Math.random() * 4) * cell;
      ty = -(30 + Math.random() * 80);
      tx = (Math.random() - 0.5) * 40;
    } else {
      x = Math.floor(Math.random() * cols) * cell;
      y = Math.floor(Math.random() * 4) * cell + cell * 10;
      ty = 30 + Math.random() * 80;
      tx = (Math.random() - 0.5) * 40;
    }
    particles.push({
      x, y, tx, ty,
      sz: Math.random() < 0.15 ? cell * 2 : cell,
      delay: Math.random() * 0.25,
    });
  }

  const handleEnter = () => {
    const img = imgRef.current;
    if (img) gsap.to(img, { scale: 1.05, duration: 0.9, ease: "power2.out" });
    gsap.fromTo(
      burstRefs.current,
      { x: 0, y: 0, opacity: 0, scale: 0.4 },
      {
        x: (i) => particles[i]?.tx ?? 0,
        y: (i) => particles[i]?.ty ?? 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: { each: 0.005, from: "random" },
      }
    );
  };
  const handleLeave = () => {
    const img = imgRef.current;
    if (img) gsap.to(img, { scale: 1, duration: 0.8, ease: "power2.out" });
    gsap.to(burstRefs.current, {
      x: 0, y: 0, opacity: 0, scale: 0.4,
      duration: 0.6,
      ease: "power2.in",
    });
  };

  const mask =
    blend === "soft"
      ? "radial-gradient(ellipse 90% 95% at 50% 45%, black 50%, transparent 90%)"
      : "none";

  return (
    <div
      ref={wrapRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      className={`group/img relative overflow-hidden ${rounded} ${className}`}
      style={{ aspectRatio: aspect, willChange: "transform" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: "saturate(1.06) contrast(1.04)",
          WebkitMaskImage: mask,
          maskImage: mask,
          willChange: "transform",
        }}
      />
      {/* Chiaroscuro overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.10) 0%, rgba(10,10,10,0.04) 40%, rgba(10,10,10,0.55) 100%)",
        }}
      />
      {/* Pixel burst overlay */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) burstRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.sz,
              height: p.sz,
              background: "#FF4B1F",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
      {/* Corner marks */}
      {cornerMark && (
        <div className="pointer-events-none absolute right-4 top-4 font-mono text-sm text-[#FF4B1F]">
          {cornerMark}
        </div>
      )}
      {bottomLabel && (
        <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
          {bottomLabel}
        </div>
      )}
    </div>
  );
}
