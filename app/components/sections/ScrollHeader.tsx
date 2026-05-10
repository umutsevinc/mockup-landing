"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ScrollHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5, 5, 7, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px) saturate(150%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px) saturate(150%)" : "none",
        borderBottom: scrolled ? "1px solid var(--ds-border-subtle)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Image src="/logo/white.png" alt="Memselon Mockup" width={22} height={22} className="rounded-md" />
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--ds-text-primary)" }}>
            Memselon Mockup
          </span>
        </Link>

        <nav
          className="hidden md:flex gap-7 text-[14px]"
          style={{ color: "var(--ds-text-secondary)" }}
        >
          <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
        </nav>

        <a
          href="https://www.framer.com/marketplace/plugins/mockup-for-framer/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-4 rounded-full bg-white text-black text-[13px] font-semibold inline-flex items-center gap-1.5 transition-transform hover:scale-[1.02] no-underline"
        >
          Try free
          <ArrowRight />
        </a>
      </div>
    </header>
  );
}

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
