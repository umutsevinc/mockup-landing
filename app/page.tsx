"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const HeroDevice = dynamic(() => import("./components/HeroDevice"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-blue-400/60 animate-spin" />
    </div>
  ),
});

/* ── Reveal ── */
function R({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Data ── */
const DEVICES = [
  { name: "iPhone 17 Pro", img: "/devices/iphone17pro.jpg", free: true },
  { name: "iPhone Air", img: "/devices/iphoneair.jpg", free: false },
  { name: "iPad Pro", img: "/devices/ipad.jpg", free: false },
  { name: "iMac", img: "/devices/imac.jpg", free: false },
  { name: "Apple Watch", img: "/devices/applewatch.jpg", free: false },
];

const PLANS = [
  { name: "Free", price: "0", per: "forever", hl: false, features: ["3 exports / month", "iPhone 17 Pro", "720p resolution", "Watermark"], cta: "Get started" },
  { name: "Pro", price: "9", per: "/ mo", hl: true, features: ["50 exports / month", "All 5 devices", "4K resolution", "No watermark", "Orbit camera", "Animations & video", "All environments"], cta: "Upgrade to Pro" },
  { name: "Ultra", price: "29", per: "/ mo", hl: false, badge: "Most powerful", features: ["Unlimited exports", "Everything in Pro", "Transparent backgrounds", "Multi-device scenes", "Batch export", "Lottie screens", "Priority support"], cta: "Go Ultra" },
];

/* ── Icons (SVG stroke) ── */
const I = {
  cube: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  screen: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  dl: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  zap: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  cam: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  sun: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  check: <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>,
  arrow: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>,
};

/* ═══════════════════ PAGE ═══════════════════ */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col bg-[#050505]">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-[#050505]/70 border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo/white.png" alt="Framer Mockup" width={22} height={22} className="rounded-md" />
            <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#ededef]">Framer Mockup</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px] text-[#8b8b8d]">
            {["Features", "Devices", "Pricing"].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors duration-200">{l}</a>)}
          </div>
          <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" className="h-[34px] px-4 rounded-full bg-white text-[#050505] text-[12px] font-semibold flex items-center hover:shadow-[0_4px_20px_rgba(255,255,255,0.12)] transition-all duration-300">
            Install Free
          </a>
        </div>
      </nav>

      {/* ═══ HERO — split layout: text left, 3D right ═══ */}
      <div ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1200px] mx-auto px-6 pt-28 pb-10 min-h-screen flex flex-col md:flex-row items-center gap-4">

          {/* Left: text */}
          <div className="flex-1 flex flex-col justify-center md:pr-8 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-[#8b8b8d] w-fit mx-auto md:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available on Framer
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold tracking-[-0.04em] leading-[1.02] mb-4">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">3D Mockups</span>
              <br />
              <span className="text-[#3b3b3d]">in Framer.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-[15px] text-[#8b8b8d] max-w-md leading-relaxed mb-8 mx-auto md:mx-0">
              Interactive device mockups with screen replacement, orbit camera, and one-click 4K export. All inside Framer.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }} className="flex flex-col sm:flex-row items-center gap-3 mx-auto md:mx-0">
              <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" className="group h-12 px-7 rounded-full bg-white text-[#050505] font-semibold text-[13px] flex items-center gap-2 hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:scale-[1.02] transition-all duration-300">
                Install Free {I.arrow}
              </a>
              <a href="#features" className="h-12 px-7 rounded-full border border-white/[0.08] text-[#8b8b8d] font-medium text-[13px] flex items-center hover:border-white/[0.15] hover:text-white transition-all duration-300">
                See features
              </a>
            </motion.div>

            {/* Mini stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="flex items-center gap-6 mt-10 mx-auto md:mx-0">
              {[{ v: "12K+", l: "mockups" }, { v: "5", l: "devices" }, { v: "4K", l: "export" }].map(s => (
                <div key={s.l} className="text-center md:text-left">
                  <div className="text-[15px] font-bold text-[#ededef]">{s.v}</div>
                  <div className="text-[10px] text-[#555557] uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D device */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="flex-1 w-full h-[450px] md:h-[550px] relative">
            <HeroDevice />
            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#555557] tracking-wider uppercase flex items-center gap-1.5 opacity-60">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 9l7 7 7-7"/></svg>
              Move your cursor to interact
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ BENTO FEATURES ═══ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <R className="text-center mb-16">
            <p className="text-[12px] font-semibold text-blue-400/80 tracking-[0.1em] uppercase mb-3">Features</p>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">Everything you need.</h2>
          </R>

          {/* Row 1: 1 wide + 1 standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <R delay={0} className="md:col-span-2">
              <div className="bento-card bento-glow p-10 h-full min-h-[300px] flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-[14px] bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">{I.cube}</div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Real-time 3D rendering</h3>
                  <p className="text-[14px] text-[#8b8b8d] leading-relaxed max-w-lg">Orbit, zoom, and rotate your mockups live. No static renders. Everything responds instantly — 60 FPS, GPU-accelerated WebGL.</p>
                </div>
                <div className="flex items-center gap-2.5 mt-8">
                  {["60 FPS", "WebGL 2.0", "GPU accelerated"].map(t => <span key={t} className="text-[10px] text-[#555557] px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] font-medium">{t}</span>)}
                </div>
              </div>
            </R>
            <R delay={0.08}>
              <div className="bento-card p-10 h-full min-h-[300px] flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-[14px] bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">{I.screen}</div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Screen replacement</h3>
                  <p className="text-[14px] text-[#8b8b8d] leading-relaxed">Drop any image or video. It maps automatically with perspective and lighting.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-6">
                  {["PNG", "JPG", "MP4", "WebM", "Lottie"].map(f => <span key={f} className="text-[10px] text-[#8b8b8d] px-2 py-0.5 rounded-md bg-white/[0.04] font-medium">{f}</span>)}
                </div>
              </div>
            </R>
          </div>

          {/* Row 2: 3 equal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { icon: I.dl, color: "green", title: "One-click export", desc: "4K PNG, transparent backgrounds, or looping video. Portfolio-ready in one click." },
              { icon: I.cam, color: "cyan", title: "Camera presets", desc: "Curated angles or free orbit. Lock the perfect shot for consistent exports." },
              { icon: I.sun, color: "amber", title: "Environments", desc: "Studio lighting, HDR environments, adjustable intensity. Perfect backdrop every time." },
            ].map((f, i) => (
              <R key={f.title} delay={i * 0.06}>
                <div className="bento-card p-8 h-full min-h-[220px]">
                  <div className={`w-11 h-11 rounded-[14px] bg-${f.color}-500/10 flex items-center justify-center text-${f.color}-400 mb-5`}>{f.icon}</div>
                  <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#ededef] mb-2">{f.title}</h3>
                  <p className="text-[13px] text-[#8b8b8d] leading-relaxed">{f.desc}</p>
                </div>
              </R>
            ))}
          </div>

          {/* Row 3: 1 standard + 1 wide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <R delay={0}>
              <div className="bento-card p-8 h-full min-h-[220px]">
                <div className="w-11 h-11 rounded-[14px] bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">{I.zap}</div>
                <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#ededef] mb-2">Native in Framer</h3>
                <p className="text-[13px] text-[#8b8b8d] leading-relaxed">Opens inside the Framer editor. No tabs, no external apps. Just create.</p>
              </div>
            </R>
            <R delay={0.06} className="md:col-span-2">
              <div className="bento-card p-10 h-full min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-11 h-11 rounded-[14px] bg-rose-500/10 flex items-center justify-center text-rose-400">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#ededef]">Multi-device scenes</h3>
                      <span className="text-[10px] text-purple-400/80 font-semibold tracking-wider uppercase">Ultra</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#8b8b8d] leading-relaxed max-w-lg">Compose multiple Apple devices in a single 3D scene. iPhone + iPad + iMac — all with individual screen content and synchronized camera.</p>
                </div>
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ═══ DEVICES ═══ */}
      <section id="devices" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <R className="text-center mb-14">
            <p className="text-[12px] font-semibold text-purple-400/80 tracking-[0.1em] uppercase mb-3">Device library</p>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">Every Apple device.</h2>
            <p className="text-[14px] text-[#8b8b8d] mt-3">High-fidelity 3D models. Accurate materials and proportions.</p>
          </R>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {DEVICES.map((d, i) => (
              <R key={d.name} delay={i * 0.05}>
                <div className="bento-card aspect-[3/4] relative group">
                  <Image src={d.img} alt={d.name} fill className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-[13px] font-semibold text-[#ededef]">{d.name}</div>
                    <div className={`text-[10px] mt-0.5 font-semibold tracking-wider uppercase ${d.free ? "text-green-400/80" : "text-blue-400/60"}`}>{d.free ? "Free" : "Pro"}</div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <R className="text-center mb-14">
            <p className="text-[12px] font-semibold text-green-400/80 tracking-[0.1em] uppercase mb-3">Pricing</p>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">Start free, scale up.</h2>
            <p className="text-[14px] text-[#8b8b8d] mt-3">No credit card required.</p>
          </R>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((p, i) => (
              <R key={p.name} delay={i * 0.06}>
                <div className={`bento-card p-8 flex flex-col h-full ${p.hl ? "bento-glow" : ""}`}>
                  {p.badge && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[9px] font-bold text-purple-300 tracking-wider uppercase">{p.badge}</div>}
                  <div className="text-[13px] font-semibold text-[#8b8b8d] mb-4">{p.name}</div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-[40px] font-bold tracking-[-0.04em] text-[#ededef]">{p.price}</span>
                    <span className="text-[13px] text-[#555557]">{p.per}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#8b8b8d]">
                        <div className="w-[18px] h-[18px] rounded-full bg-green-500/10 flex items-center justify-center shrink-0">{I.check}</div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" className={`w-full h-11 rounded-[14px] text-[13px] font-semibold flex items-center justify-center transition-all duration-300 ${p.hl ? "bg-white text-[#050505] hover:shadow-[0_8px_25px_rgba(255,255,255,0.12)]" : "bg-white/[0.04] text-[#8b8b8d] hover:bg-white/[0.07] border border-white/[0.06]"}`}>
                    {p.cta}
                  </a>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />
          <R>
            <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold tracking-[-0.03em] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent relative z-10">Ready to create?</h2>
            <p className="text-[#8b8b8d] mt-3 mb-10 text-[15px] relative z-10">Beautiful 3D mockups. Seconds, not hours.</p>
            <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-2 h-14 px-10 rounded-full bg-white text-[#050505] font-semibold text-[14px] hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:scale-[1.02] transition-all duration-300">
              Install in Framer — Free {I.arrow}
            </a>
          </R>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-5">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo/white.png" alt="Framer Mockup" width={18} height={18} className="rounded" />
              <span className="text-[11px] text-[#555557]">Framer Mockup</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] text-[#555557]">
              {["Features", "Devices", "Pricing"].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#8b8b8d] transition-colors">{l}</a>)}
            </div>
          </div>
          <div className="text-[10px] text-[#555557]/50">
            Built with &#10084;&#65039; by <a href="https://memselon.com" target="_blank" rel="noopener noreferrer" className="text-[#8b8b8d]/40 hover:text-[#8b8b8d] transition-colors">Memselon</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
