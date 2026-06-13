"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { children: ReactNode; delay?: number; className?: string };

/**
 * Lightweight scroll-reveal — adds `.in` once the element intersects the
 * viewport (paired with the `.reveal-up` rule in globals.css).
 * Plays once, then disconnects. Honors `prefers-reduced-motion`.
 */
export function RevealAuto({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("in"), delay);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`reveal-up ${className}`}>
      {children}
    </div>
  );
}
