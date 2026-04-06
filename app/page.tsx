"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ─────────────── CONSTANTS ─────────────── */

const DEVICES = [
  { name: "iPhone 17 Pro", img: "/devices/iphone17pro.jpg", tag: "Free" },
  { name: "iPhone Air", img: "/devices/iphoneair.jpg", tag: "Pro" },
  { name: "iPad Pro", img: "/devices/ipad.jpg", tag: "Pro" },
  { name: "iMac", img: "/devices/imac.jpg", tag: "Pro" },
  { name: "Apple Watch Ultra", img: "/devices/applewatch.jpg", tag: "Pro" },
];

const FEATURES = [
  {
    title: "Real-time 3D",
    desc: "Orbit, zoom, and rotate your mockups in real-time. No renders — everything is live.",
    icon: "&#x1F3AE;",
  },
  {
    title: "Screen replacement",
    desc: "Drop any image or video onto the device screen. It maps automatically with proper perspective.",
    icon: "&#x1F4F1;",
  },
  {
    title: "One-click export",
    desc: "Export stunning 4K PNGs, transparent backgrounds, or looping videos. Ready for your portfolio.",
    icon: "&#x1F4F7;",
  },
  {
    title: "Built for Framer",
    desc: "Works natively inside the Framer editor. No context switching, no external apps.",
    icon: "&#x26A1;",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    features: [
      "3 exports/month",
      "iPhone 17 Pro",
      "720p resolution",
      "Watermark",
      "3 camera presets",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "9",
    period: "/month",
    features: [
      "50 exports/month",
      "All devices",
      "4K resolution",
      "No watermark",
      "Free orbit camera",
      "All environments",
      "Animations",
      "Video export",
    ],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Ultra",
    price: "29",
    period: "/month",
    features: [
      "Unlimited exports",
      "All devices",
      "4K resolution",
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

/* ─────────────── HELPERS ─────────────── */

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────── PAGE ─────────────── */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Animated counter
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = 12847;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      {/* ═══════ NAV ═══════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/white.png"
              alt="Mockup for Framer"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold tracking-tight">
              Mockup
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#devices" className="hover:text-white transition-colors">
              Devices
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>
          <a
            href="https://www.framer.com/marketplace/plugins/mockup-for-framer/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-4 rounded-full bg-white text-black text-xs font-semibold flex items-center hover:bg-white/90 transition-colors"
          >
            Install in Framer
          </a>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <div ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px] pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/60"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Now available on Framer Marketplace
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
          >
            <span className="gradient-text">3D Mockups</span>
            <br />
            <span className="text-white/40">inside Framer.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg sm:text-xl text-white/40 max-w-lg mx-auto mb-10 leading-relaxed"
          >
            Create stunning interactive device mockups in seconds.
            Real-time 3D. Screen replacement. One-click export.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://www.framer.com/marketplace/plugins/mockup-for-framer/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-12 px-8 rounded-full bg-white text-black font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Install Free
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="#demo"
              className="h-12 px-8 rounded-full border border-white/10 text-white/60 font-medium text-sm flex items-center gap-2 hover:border-white/20 hover:text-white/80 transition-all"
            >
              Watch demo
            </a>
          </motion.div>

          {/* Hero mockup preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 relative mx-auto max-w-3xl"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] glow">
              <div className="aspect-video bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center relative">
                {/* Fake plugin UI */}
                <div className="absolute inset-0 flex">
                  {/* Sidebar */}
                  <div className="w-16 bg-white/[0.02] border-r border-white/[0.06] flex flex-col items-center gap-3 pt-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06]"
                      />
                    ))}
                  </div>
                  {/* Main area with device */}
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="float">
                      <Image
                        src="/devices/iphone17pro.jpg"
                        alt="iPhone 17 Pro mockup"
                        width={220}
                        height={220}
                        className="drop-shadow-2xl"
                      />
                    </div>
                    {/* Subtle grid */}
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />
                  </div>
                </div>
                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/60 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-between px-4">
                  <div className="flex gap-2">
                    {["Export", "Save", "Env"].map((label) => (
                      <div
                        key={label}
                        className="h-7 px-3 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] text-white/40 flex items-center"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-white/20">iPhone 17 Pro</div>
                </div>
              </div>
            </div>
            {/* Reflection */}
            <div className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-b from-blue-500/5 to-transparent blur-2xl" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1.5 rounded-full bg-white/40"
            />
          </div>
        </motion.div>
      </div>

      {/* ═══════ SOCIAL PROOF ═══════ */}
      <Section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text-blue">
              {count.toLocaleString()}+
            </div>
            <div className="text-sm text-white/30 mt-1">Mockups created</div>
          </div>
          <div className="w-px h-10 bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">5</div>
            <div className="text-sm text-white/30 mt-1">Apple devices</div>
          </div>
          <div className="w-px h-10 bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">4K</div>
            <div className="text-sm text-white/30 mt-1">Max resolution</div>
          </div>
          <div className="w-px h-10 bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text-blue">&lt;2s</div>
            <div className="text-sm text-white/30 mt-1">Export time</div>
          </div>
        </div>
      </Section>

      {/* ═══════ FEATURES ═══════ */}
      <Section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-400/80 tracking-wider uppercase mb-3">
              Features
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">
              Everything you need.
            </h2>
            <p className="text-white/30 mt-4 max-w-md mx-auto">
              Professional-grade 3D mockups without leaving Framer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500"
              >
                <div
                  className="text-3xl mb-4"
                  dangerouslySetInnerHTML={{ __html: f.icon }}
                />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {f.desc}
                </p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ DEVICES ═══════ */}
      <Section id="devices" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-purple-400/80 tracking-wider uppercase mb-3">
              Device Library
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">
              Every Apple device.
            </h2>
            <p className="text-white/30 mt-4 max-w-md mx-auto">
              High-fidelity 3D models with accurate materials and proportions.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {DEVICES.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]"
              >
                <Image
                  src={d.img}
                  alt={d.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-xs font-semibold">{d.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      d.tag === "Free"
                        ? "text-green-400/70"
                        : "text-blue-400/70"
                    }`}
                  >
                    {d.tag}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ DEMO VIDEO SECTION ═══════ */}
      <Section id="demo" className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-400/80 tracking-wider uppercase mb-3">
            See it in action
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text mb-12">
            From design to mockup in seconds.
          </h2>
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] glow aspect-video bg-zinc-900 flex items-center justify-center">
            <div className="text-white/20 text-sm">Demo video placeholder</div>
            {/* Replace with actual video embed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <svg
                  className="w-6 h-6 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ PRICING ═══════ */}
      <Section id="pricing" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-green-400/80 tracking-wider uppercase mb-3">
              Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">
              Start free, scale up.
            </h2>
            <p className="text-white/30 mt-4 max-w-md mx-auto">
              No credit card required. Upgrade when you need more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 hover:border-white/[0.15] ${
                  plan.highlight
                    ? "border-blue-500/30 bg-blue-500/[0.03]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-semibold text-purple-300">
                    {plan.badge}
                  </div>
                )}
                <div className="text-sm font-semibold text-white/60 mb-4">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-white/30">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-white/50"
                    >
                      <svg
                        className="w-4 h-4 text-green-400/70 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://www.framer.com/marketplace/plugins/mockup-for-framer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${
                    plan.highlight
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/[0.06] text-white/70 hover:bg-white/[0.1] border border-white/[0.08]"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ CTA ═══════ */}
      <Section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[150px] pointer-events-none" />
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight gradient-text relative z-10">
            Ready to create?
          </h2>
          <p className="text-white/30 mt-4 mb-10 max-w-md mx-auto relative z-10">
            Install the plugin and start making beautiful 3D mockups in seconds.
          </p>
          <a
            href="https://www.framer.com/marketplace/plugins/mockup-for-framer/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-2 h-14 px-10 rounded-full bg-white text-black font-semibold text-base hover:scale-105 transition-transform"
          >
            Install in Framer — Free
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/white.png"
                alt="Mockup"
                width={20}
                height={20}
                className="rounded"
              />
              <span className="text-xs text-white/30">
                Mockup for Framer
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/20">
              <a href="#features" className="hover:text-white/50 transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-white/50 transition-colors">
                Pricing
              </a>
              <a
                href="https://github.com/umutsevinc/Framer-Mockup"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/50 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="text-[11px] text-white/15">
            Built with &#10084;&#65039; by{" "}
            <a
              href="https://memselon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white/50 transition-colors"
            >
              Memselon
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
