"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ── Reveal wrapper ── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Bento card ── */
function BentoCard({
  children,
  className = "",
  span = "",
  glow = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  span?: string;
  glow?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-2xl border border-white/[0.06] bg-[#0a0a0b] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-1 ${span} ${className}`}
      style={
        glow
          ? {
              boxShadow:
                "0 0 60px rgba(59,130,246,0.06), 0 0 120px rgba(139,92,246,0.03)",
            }
          : undefined
      }
    >
      {/* hover glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-blue-500/[0.04] to-purple-500/[0.04]" />
      {children}
    </motion.div>
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 2000;
    const step = target / (dur / 16);
    let cur = 0;
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setVal(target);
        clearInterval(id);
      } else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── SVG icons (inline, no emoji) ── */
const icons = {
  cube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  screen: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  download: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  zap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  camera: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  layers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
};

/* ── Data ── */
const DEVICES = [
  { name: "iPhone 17 Pro", img: "/devices/iphone17pro.jpg", tag: "Free" },
  { name: "iPhone Air", img: "/devices/iphoneair.jpg", tag: "Pro" },
  { name: "iPad Pro", img: "/devices/ipad.jpg", tag: "Pro" },
  { name: "iMac", img: "/devices/imac.jpg", tag: "Pro" },
  { name: "Apple Watch", img: "/devices/applewatch.jpg", tag: "Pro" },
];

const PLANS = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    features: ["3 exports / month", "iPhone 17 Pro", "720p", "Watermark"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "9",
    period: "/ mo",
    features: [
      "50 exports / month",
      "All devices",
      "4K resolution",
      "No watermark",
      "Orbit camera",
      "Video export",
      "Animations",
    ],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Ultra",
    price: "29",
    period: "/ mo",
    features: [
      "Unlimited exports",
      "Everything in Pro",
      "Transparent BG",
      "Multi-device scenes",
      "Batch export",
      "Lottie screens",
      "Priority support",
    ],
    cta: "Go Ultra",
    highlight: false,
    badge: "Most powerful",
  },
];

/* ═══════════════════════════════════════ PAGE ═══════════════════════════════════════ */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);

  return (
    <div className="flex flex-col bg-[#050505]">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#050505]/70 border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[56px] px-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo/white.png" alt="Mockup" width={24} height={24} className="rounded-md" />
            <span className="text-[13px] font-semibold tracking-[-0.02em] text-[#ededef]">Mockup</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px] text-[#8b8b8d]">
            <a href="#features" className="hover:text-[#ededef] transition-colors duration-300">Features</a>
            <a href="#devices" className="hover:text-[#ededef] transition-colors duration-300">Devices</a>
            <a href="#pricing" className="hover:text-[#ededef] transition-colors duration-300">Pricing</a>
          </div>
          <a
            href="https://www.framer.com/marketplace/plugins/mockup-for-framer/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-4 rounded-full bg-white text-[#050505] text-[12px] font-semibold flex items-center hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)] transition-all duration-300"
          >
            Install in Framer
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.06] blur-[120px] pointer-events-none animate-[blobFloat_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.04] blur-[120px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite_reverse]" />

        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[12px] text-[#8b8b8d] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Available on Framer Marketplace
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold tracking-[-0.03em] leading-[1.02] mb-5">
            <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">3D Mockups</span>
            <br />
            <span className="text-[#555557]">inside Framer.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }} className="text-[clamp(1rem,2vw,1.2rem)] text-[#8b8b8d] max-w-lg mx-auto mb-10 leading-relaxed">
            Create stunning interactive device mockups in seconds. Real-time 3D. Screen replacement. One-click export.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" className="group h-12 px-8 rounded-full bg-white text-[#050505] font-semibold text-sm flex items-center gap-2 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:scale-[1.03] transition-all duration-300">
              Install Free
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a href="#features" className="h-12 px-8 rounded-full border border-white/[0.08] text-[#8b8b8d] font-medium text-sm flex items-center hover:border-white/[0.15] hover:text-[#ededef] transition-all duration-300">
              Explore features
            </a>
          </motion.div>

          {/* Hero visual */}
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mt-16 relative mx-auto max-w-3xl">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.08), 0 30px 60px rgba(0,0,0,0.5)" }}>
              <div className="aspect-video bg-[#0a0a0b] flex items-center justify-center relative">
                <div className="absolute inset-0 flex">
                  <div className="w-14 bg-white/[0.015] border-r border-white/[0.06] flex flex-col items-center gap-2.5 pt-3">
                    {[1,2,3,4,5].map(i=><div key={i} className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05]" />)}
                  </div>
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="animate-[float_6s_ease-in-out_infinite]">
                      <Image src="/devices/iphone17pro.jpg" alt="iPhone 17 Pro" width={200} height={200} className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-11 bg-[#050505]/80 backdrop-blur-2xl border-t border-white/[0.06] flex items-center justify-between px-4">
                  <div className="flex gap-1.5">
                    {["Export","Save","Env"].map(l=><div key={l} className="h-6 px-2.5 rounded-md bg-white/[0.05] text-[10px] text-[#555557] flex items-center font-medium">{l}</div>)}
                  </div>
                  <div className="text-[10px] text-[#555557] font-medium">iPhone 17 Pro</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 rounded-full border border-white/[0.15] flex justify-center pt-1.5">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </div>

      {/* ═══ STATS — bento row ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: 12847, suffix: "+", label: "Mockups created", color: "text-blue-400" },
            { val: 5, suffix: "", label: "Apple devices", color: "text-[#ededef]" },
            { val: 4, suffix: "K", label: "Max resolution", color: "text-[#ededef]" },
            { val: 2, suffix: "s", label: "Export time", color: "text-green-400" },
          ].map((s, i) => (
            <BentoCard key={s.label} delay={i * 0.08} className="p-6 text-center">
              <div className={`text-3xl md:text-4xl font-bold tracking-[-0.03em] ${s.color}`}>
                {s.label === "Export time" ? "<" : ""}<Counter target={s.val} suffix={s.suffix} />
              </div>
              <div className="text-[13px] text-[#555557] mt-1.5">{s.label}</div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES — bento grid ═══ */}
      <section id="features" className="py-20 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[13px] font-semibold text-blue-400/80 tracking-[0.08em] uppercase mb-3">Features</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Everything you need.</h2>
            <p className="text-[#8b8b8d] mt-3 max-w-md mx-auto text-[15px]">Professional-grade 3D mockups without leaving Framer.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wide card — Real-time 3D */}
            <BentoCard span="md:col-span-2" glow delay={0} className="p-10 min-h-[280px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5">{icons.cube}</div>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Real-time 3D rendering</h3>
                <p className="text-[14px] text-[#8b8b8d] leading-relaxed max-w-md">Orbit, zoom, and rotate your mockups live. No static renders — everything responds instantly to your input.</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                {["60 FPS","WebGL 2.0","GPU accelerated"].map(t=><span key={t} className="text-[11px] text-[#555557] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">{t}</span>)}
              </div>
            </BentoCard>

            {/* Tall card — Screen replacement */}
            <BentoCard span="md:row-span-2" delay={0.1} className="p-10 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5">{icons.screen}</div>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Screen replacement</h3>
                <p className="text-[14px] text-[#8b8b8d] leading-relaxed">Drop any image or video onto the device screen. It maps automatically with proper perspective and lighting.</p>
              </div>
              <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] text-[#555557] mb-2 font-medium">Supported formats</div>
                <div className="flex flex-wrap gap-1.5">
                  {["PNG","JPG","WebP","MP4","WebM","Lottie"].map(f=><span key={f} className="text-[10px] text-[#8b8b8d] px-2 py-0.5 rounded bg-white/[0.04]">{f}</span>)}
                </div>
              </div>
            </BentoCard>

            {/* One-click export */}
            <BentoCard delay={0.15} className="p-10 min-h-[240px]">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 mb-5">{icons.download}</div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#ededef] mb-2">One-click export</h3>
              <p className="text-[14px] text-[#8b8b8d] leading-relaxed">Export stunning 4K PNGs, transparent backgrounds, or looping videos. Portfolio-ready in one click.</p>
            </BentoCard>

            {/* Built for Framer */}
            <BentoCard delay={0.2} className="p-10 min-h-[240px]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">{icons.zap}</div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Built for Framer</h3>
              <p className="text-[14px] text-[#8b8b8d] leading-relaxed">Works natively inside the Framer editor. No context switching, no external tools. Just open and create.</p>
            </BentoCard>
          </div>

          {/* Second bento row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <BentoCard delay={0.1} className="p-10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5">{icons.camera}</div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Camera presets & free orbit</h3>
              <p className="text-[14px] text-[#8b8b8d] leading-relaxed">Choose from curated camera angles or orbit freely around your device. Lock the perfect angle for consistent exports.</p>
            </BentoCard>
            <BentoCard delay={0.15} className="p-10">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-5">{icons.layers}</div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Environments & lighting</h3>
              <p className="text-[14px] text-[#8b8b8d] leading-relaxed">Switch between studio environments, adjust light intensity, and pick the perfect backdrop for your mockup.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ═══ DEVICES ═══ */}
      <section id="devices" className="py-20 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[13px] font-semibold text-purple-400/80 tracking-[0.08em] uppercase mb-3">Device library</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Every Apple device.</h2>
            <p className="text-[#8b8b8d] mt-3 max-w-md mx-auto text-[15px]">High-fidelity 3D models with accurate materials and proportions.</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {DEVICES.map((d, i) => (
              <BentoCard key={d.name} delay={i * 0.06} className="aspect-square">
                <Image src={d.img} alt={d.name} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <div className="text-[12px] font-semibold text-[#ededef]">{d.name}</div>
                  <div className={`text-[10px] mt-0.5 font-medium ${d.tag === "Free" ? "text-green-400/80" : "text-blue-400/60"}`}>{d.tag}</div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-20 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[13px] font-semibold text-green-400/80 tracking-[0.08em] uppercase mb-3">Pricing</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Start free, scale up.</h2>
            <p className="text-[#8b8b8d] mt-3 max-w-md mx-auto text-[15px]">No credit card required. Upgrade when you need more.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, i) => (
              <BentoCard key={plan.name} delay={i * 0.08} glow={plan.highlight} className={`p-8 flex flex-col ${plan.highlight ? "border-blue-500/20" : ""}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[10px] font-semibold text-purple-300 tracking-wide">{plan.badge}</div>
                )}
                <div className="text-[13px] font-semibold text-[#8b8b8d] mb-4">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold tracking-[-0.03em] text-[#ededef]">{plan.price}</span>
                  <span className="text-[13px] text-[#555557]">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f=>(
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#8b8b8d]">
                      <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" className={`block w-full h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center transition-all duration-300 ${plan.highlight ? "bg-white text-[#050505] hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)]" : "bg-white/[0.05] text-[#8b8b8d] hover:bg-white/[0.08] border border-white/[0.06]"}`}>
                  {plan.cta}
                </a>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
          <Reveal>
            <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent relative z-10">Ready to create?</h2>
            <p className="text-[#8b8b8d] mt-4 mb-10 max-w-md mx-auto text-[15px] relative z-10">Install the plugin and start making beautiful 3D mockups in seconds.</p>
            <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-2 h-14 px-10 rounded-full bg-white text-[#050505] font-semibold text-[15px] hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:scale-[1.03] transition-all duration-300">
              Install in Framer — Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-5">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo/white.png" alt="Mockup" width={18} height={18} className="rounded" />
              <span className="text-[12px] text-[#555557]">Mockup for Framer</span>
            </div>
            <div className="flex items-center gap-6 text-[12px] text-[#555557]">
              <a href="#features" className="hover:text-[#8b8b8d] transition-colors">Features</a>
              <a href="#pricing" className="hover:text-[#8b8b8d] transition-colors">Pricing</a>
              <a href="https://github.com/umutsevinc/Framer-Mockup" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b8b8d] transition-colors">GitHub</a>
            </div>
          </div>
          <div className="text-[11px] text-[#555557]/60">
            Built with &#10084;&#65039; by{" "}
            <a href="https://memselon.com" target="_blank" rel="noopener noreferrer" className="text-[#8b8b8d]/50 hover:text-[#8b8b8d] transition-colors">Memselon</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
