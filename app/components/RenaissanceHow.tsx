"use client";

import { useEffect, useRef } from "react";

type Step = {
  pre: string;
  title: string;
  body: string;
  glyph?: string;
};

type Props = {
  num: string;
  label: string;
  title: React.ReactNode;
  sub: string;
  steps: Step[];
  /** Path to a Renaissance image in /public — e.g. "/ren/scholar.png" */
  bgImage: string;
};

/**
 * Marc Lou × Contralabs HOW IT WORKS section.
 * Full-bleed Renaissance portrait backdrop with chiaroscuro overlay,
 * strict-grid pixel-decompose corner accents (rendered client-side),
 * and floating white step cards on top.
 */
export function RenaissanceHow({ num, label, title, sub, steps, bgImage }: Props) {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    const cell = 12;
    const rect = host.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    host.querySelectorAll<HTMLSpanElement>("[data-pxl]").forEach((n) => n.remove());
    const corner = (x0: number, y0: number, x1: number, y1: number) => {
      for (let yy = Math.floor(y0 / cell) * cell; yy < y1; yy += cell) {
        for (let xx = Math.floor(x0 / cell) * cell; xx < x1; xx += cell) {
          const dx = (xx - x0) / Math.max(1, x1 - x0);
          const dy = (yy - y0) / Math.max(1, y1 - y0);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.random() > 0.34 * (1 - dist * 0.7)) continue;
          const s = document.createElement("span");
          s.setAttribute("data-pxl", "1");
          s.style.cssText = `position:absolute;left:${xx}px;top:${yy}px;width:${cell}px;height:${cell}px;background:#FF4B1F;opacity:${0.7 + Math.random() * 0.3};z-index:2`;
          host.appendChild(s);
        }
      }
    };
    corner(0, 40, 240, 240);
    corner(w - 240, h - 260, w, h);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[var(--color-paper,#fafaf7)] py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow mb-4">
            <span className="num">{num}</span>
            <span>{label}</span>
          </p>
          <h2 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-muted,#6b6b6b)]">
            {sub}
          </p>
        </div>

        {/* Canvas with real Renaissance image */}
        <div
          ref={canvasRef}
          className="relative overflow-hidden rounded-3xl shadow-[0_40px_80px_-40px_rgba(10,10,10,0.4)]"
          style={{ minHeight: 720 }}
        >
          {/* Renaissance image background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(1.05)" }}
            aria-hidden
          />
          {/* Chiaroscuro overlay */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.25) 35%, rgba(10,10,10,0.45) 65%, rgba(10,10,10,0.85) 100%)",
            }}
          />

          {/* Top-right ASCII corner */}
          <div className="absolute right-6 top-6 z-10 font-mono text-sm text-[#FF4B1F]">
            ▒ ▓ █
          </div>

          {/* Top-left mono label */}
          <div className="absolute left-8 top-8 z-10 font-mono text-[10px] uppercase tracking-[0.24em] text-white/70">
            FIG. {num} · {label} · MEMSELON
          </div>

          {/* Floating step cards */}
          <div className="relative z-10 grid gap-6 px-6 pb-20 pt-32 md:grid-cols-3 md:gap-7 md:px-12 md:pb-24 md:pt-44">
            {steps.map((s) => (
              <article
                key={s.pre}
                className="card-lift rounded-2xl border border-black/5 bg-white p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)]"
              >
                <div
                  className="mb-5 flex h-32 items-center justify-center rounded-xl"
                  style={{ background: "#f7f6f3" }}
                  aria-hidden
                >
                  <span className="font-mono text-3xl text-[#FF4B1F]">
                    {s.glyph ?? "◇"}
                  </span>
                </div>
                <span className="inline-flex items-center rounded-full border border-[#FF4B1F]/30 bg-[#FF4B1F]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#FF4B1F]">
                  {s.pre}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug text-[#0a0a0a]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#0a0a0a]/65">
                  {s.body}
                </p>
              </article>
            ))}
          </div>

          {/* Bottom ticker strip */}
          <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/10 bg-[#0a0a0a]">
            <div className="marquee-track flex whitespace-nowrap py-3 font-mono text-xs uppercase tracking-[0.2em] text-white/80">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="px-6">
                  ★ {label} · MEMSELON ☁ PORTFOLIO · {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
