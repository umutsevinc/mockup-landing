"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";

const HeroDevice = dynamic(() => import("./components/HeroDevice"), {
  ssr: false,
  loading: () => (
    <div className="hero-playground flex items-center justify-center">
      <div style={{ width: 28, height: 28, border: "2px solid rgba(255,255,255,0.06)", borderTopColor: "rgba(127,119,221,0.5)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

/* ── Fade-in section ── */
function F({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════ PAGE ═══════════════════════════════ */

export default function Home() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="flex flex-col" style={{ background: "var(--bg-primary)" }}>

      {/* ══════ NAV ══════ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(20px) saturate(150%)", background: "rgba(5,5,9,0.7)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo/white.png" alt="Framer Mockup" width={22} height={22} style={{ borderRadius: 6 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Framer Mockup</span>
          </div>
          <div className="hidden md:flex" style={{ gap: 28, fontSize: 14, color: "var(--text-secondary)" }}>
            {["Features", "Pricing"].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}>{l}</a>)}
          </div>
          <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ height: 36, padding: "0 18px", borderRadius: 9999, background: "var(--cta-gradient)", color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(127,119,221,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
            Get the plugin
          </a>
        </div>
      </nav>

      {/* ══════ S1 — HERO ══════ */}
      <section style={{ minHeight: "100vh", maxWidth: 1200, margin: "0 auto", padding: "100px 24px 60px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 flex-1">

          {/* Left text — 45% */}
          <div className="md:w-[45%] flex flex-col justify-center text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <div className="pill w-fit mx-auto md:mx-0 mb-6">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-teal)", display: "inline-block" }} />
                Try it live — no signup needed
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
              Your designs<br />deserve depth.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--text-secondary)", maxWidth: 420, margin: "16px auto 32px", lineHeight: 1.5 }} className="md:mx-0">
              Drop your screenshot on a real 3D iPhone.<br />
              Rotate. Animate. Export in 4K.<br />
              All inside Framer.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ height: 48, padding: "0 28px", borderRadius: 12, background: "var(--cta-gradient)", color: "#fff", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(127,119,221,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                Get the plugin — it{"'"}s free
              </a>
              <a href="#how" style={{ height: 48, padding: "0 28px", borderRadius: 12, border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: 15, fontWeight: 500, display: "inline-flex", alignItems: "center", textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                Watch 30s demo
              </a>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} style={{ fontSize: 14, color: "var(--text-tertiary)", marginTop: 24 }}>
              Used by <strong style={{ color: "var(--text-secondary)" }}>200+</strong> Framer designers
            </motion.p>
          </div>

          {/* Right playground — 55% */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="md:w-[55%] w-full">
            <HeroDevice />
          </motion.div>
        </div>
      </section>

      {/* ══════ S2 — PAIN POINTS ══════ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <F className="text-center mb-12">
          <h2>Still exporting flat screenshots?</h2>
        </F>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: "Mockup sites are generic", desc: "Same angles, same devices, same look. Your portfolio blends in.", icon: "M4 4h16v16H4z" },
            { title: "3D tools are overkill", desc: "Blender, Cinema 4D, After Effects — months of learning for one mockup.", icon: "M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" },
            { title: "External tools break your flow", desc: "Export → upload → download → re-import. Why leave your editor?", icon: "M17 1l4 4-4 4M7 23l-4-4 4-4M14 4H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H10" },
          ].map((c, i) => (
            <F key={c.title} delay={i * 0.1}>
              <div className="card" style={{ padding: 32 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16, opacity: 0.7 }}><path d={c.icon} /></svg>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{c.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            </F>
          ))}
        </div>
      </section>

      {/* ══════ S3 — HOW IT WORKS ══════ */}
      <section id="how" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <F className="text-center mb-16">
          <h2>3D mockups in 3 clicks</h2>
        </F>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: "01", title: "Pick your device", desc: "iPhone 17 Pro, iPhone Air, iPad Pro, iMac, Apple Watch Ultra.", color: "var(--accent-purple)" },
            { n: "02", title: "Drop your design", desc: "Drag any screenshot or Framer export. Image, video, or Lottie.", color: "var(--accent-teal)" },
            { n: "03", title: "Export in 4K", desc: "One click. 4K PNG, transparent background, no watermark.", color: "var(--accent-purple)" },
          ].map((s, i) => (
            <F key={s.n} delay={i * 0.12}>
              <div className="card" style={{ padding: "40px 32px", position: "relative", overflow: "hidden" }}>
                <div className="step-number">{s.n}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, marginBottom: 20 }} />
                  <h3 style={{ fontSize: 20, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            </F>
          ))}
        </div>
      </section>

      {/* ══════ S4 — FEATURE BENTO ══════ */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <F className="text-center mb-16">
          <h2>Everything you need. Nothing you don{"'"}t.</h2>
        </F>

        {/* Row 1: large + medium */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
          <F className="md:col-span-3">
            <div className="card card-glow" style={{ padding: 40, minHeight: 280 }}>
              <div style={{ fontSize: 13, color: "var(--accent-purple)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Core</div>
              <h3 style={{ fontSize: 24, marginBottom: 10 }}>Real 3D, real-time</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, maxWidth: 480 }}>
                frameloop={"'"}demand{"'"} — 0% CPU when idle, 60fps when you interact. GPU-accelerated WebGL with on-demand rendering.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
                {["60 FPS", "On-demand render", "GPU accelerated", "< 2MB"].map(t => (
                  <span key={t} style={{ fontSize: 11, color: "var(--text-tertiary)", padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </F>
          <F delay={0.08} className="md:col-span-2">
            <div className="card" style={{ padding: 40, minHeight: 280 }}>
              <div style={{ fontSize: 13, color: "var(--accent-teal)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Devices</div>
              <h3 style={{ fontSize: 24, marginBottom: 10 }}>5 Apple devices</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>iPhone 17 Pro, iPhone Air, iPad Pro, iMac, Apple Watch Ultra</p>
              <div className="grid grid-cols-5 gap-2 mt-6">
                {DEVICES.map(d => (
                  <div key={d.name} style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-subtle)", position: "relative" }}>
                    <Image src={d.img} alt={d.name} fill style={{ objectFit: "cover", opacity: 0.7 }} />
                  </div>
                ))}
              </div>
            </div>
          </F>
        </div>

        {/* Row 2: 3 small */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          {[
            { title: "Free orbit", desc: "360 rotation with zoom", accent: "var(--accent-purple)" },
            { title: "Video export", desc: "Looping MP4 & WebM", accent: "var(--accent-teal)" },
            { title: "Animations", desc: "Auto-rotate, follow, float", accent: "var(--accent-purple)" },
          ].map((f, i) => (
            <F key={f.title} delay={i * 0.06}>
              <div className="card" style={{ padding: "28px 24px", textAlign: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: f.accent, margin: "0 auto 14px" }} />
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{f.desc}</p>
              </div>
            </F>
          ))}
        </div>

        {/* Row 3: wide stats */}
        <F>
          <div className="card card-glow" style={{ padding: "40px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 48 }}>
            {[
              { val: "0ms", label: "Idle render" },
              { val: "< 2MB", label: "Plugin size" },
              { val: "4K", label: "Max export" },
              { val: "5", label: "Apple devices" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </F>
      </section>

      {/* ══════ S5 — PRICING ══════ */}
      <section id="pricing" style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
        <F className="text-center mb-4">
          <h2>Simple, transparent pricing.</h2>
        </F>
        <F className="text-center mb-12" delay={0.05}>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>All plans include unlimited real-time preview.</p>
          <div style={{ display: "inline-flex", borderRadius: 10, border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
            <button onClick={() => setYearly(false)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: !yearly ? "var(--accent-purple-glow)" : "transparent", color: !yearly ? "var(--text-primary)" : "var(--text-secondary)", transition: "all 0.2s" }}>Monthly</button>
            <button onClick={() => setYearly(true)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: yearly ? "var(--accent-purple-glow)" : "transparent", color: yearly ? "var(--text-primary)" : "var(--text-secondary)", transition: "all 0.2s" }}>Yearly <span style={{ fontSize: 11, color: "var(--accent-teal)" }}>-27%</span></button>
          </div>
        </F>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((p, i) => (
            <F key={p.name} delay={i * 0.08}>
              <div className={`card ${p.hl ? "card-glow" : ""}`} style={{ padding: 32, display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
                {p.badge && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "3px 12px", borderRadius: 9999, background: "rgba(127,119,221,0.15)", border: "1px solid rgba(127,119,221,0.25)", fontSize: 10, fontWeight: 700, color: "var(--accent-purple)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.badge}</div>}
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 44, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>{yearly ? p.yprice : p.price}</span>
                  <span style={{ fontSize: 14, color: "var(--text-tertiary)" }}>{p.per}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 24 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(29,158,117,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ width: "100%", height: 44, borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.2s", ...(p.hl ? { background: "var(--cta-gradient)", color: "#fff" } : { background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }) }}>
                  {p.cta}
                </a>
              </div>
            </F>
          ))}
        </div>
      </section>

      {/* ══════ S6 — TESTIMONIALS ══════ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <F className="text-center mb-12">
          <h2>Designers love it.</h2>
        </F>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <F key={t.name} delay={i * 0.08}>
              <div className="card" style={{ padding: 28 }}>
                <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>{`"${t.quote}"`}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{t.handle}</div>
                  </div>
                </div>
              </div>
            </F>
          ))}
        </div>
      </section>

      {/* ══════ S7 — CTA FINAL ══════ */}
      <section style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(127,119,221,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <F className="text-center relative z-10">
          <h2 style={{ maxWidth: 600, margin: "0 auto" }}>Your mockups deserve better.</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, margin: "16px auto 32px", maxWidth: 480 }}>
            Start creating studio-grade 3D mockups. Free.
          </p>
          <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ height: 52, padding: "0 32px", borderRadius: 14, background: "var(--cta-gradient)", color: "#fff", fontSize: 16, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(127,119,221,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
            Get started — it{"'"}s free
          </a>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 16 }}>
            No credit card required &bull; 3 free credits/month &bull; Cancel anytime
          </p>
        </F>
      </section>

      {/* ══════ S8 — FOOTER ══════ */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Image src="/logo/white.png" alt="Framer Mockup" width={18} height={18} style={{ borderRadius: 4 }} />
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Framer Mockup</span>
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 12, color: "var(--text-tertiary)" }}>
              {["Features", "Pricing"].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(72,72,74,0.5)" }}>
            Made with &#10084;&#65039; by <a href="https://memselon.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>Memselon</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Data ── */
const DEVICES = [
  { name: "iPhone 17 Pro", img: "/devices/iphone17pro.jpg" },
  { name: "iPhone Air", img: "/devices/iphoneair.jpg" },
  { name: "iPad Pro", img: "/devices/ipad.jpg" },
  { name: "iMac", img: "/devices/imac.jpg" },
  { name: "Apple Watch", img: "/devices/applewatch.jpg" },
];

const PLANS = [
  { name: "Free", price: "0", yprice: "0", per: "forever", hl: false, cta: "Get started", features: ["3 exports / month", "iPhone 17 Pro", "720p resolution", "Watermark"] },
  { name: "Pro", price: "9", yprice: "6", per: "/ mo", hl: true, badge: "Most popular", cta: "Upgrade to Pro", features: ["50 exports / month", "All 5 devices", "4K resolution", "No watermark", "Orbit camera", "Animations & video", "All environments"] },
  { name: "Ultra", price: "29", yprice: "21", per: "/ mo", hl: false, cta: "Go Ultra", features: ["Unlimited exports", "Everything in Pro", "Transparent backgrounds", "Multi-device scenes", "Batch export", "Lottie screens", "Priority support"] },
];

const TESTIMONIALS = [
  { name: "Sarah K.", handle: "@sarahdesigns", quote: "I used to spend 30 minutes per mockup in Figma. Now it takes 10 seconds. Literally changed my workflow." },
  { name: "Marc D.", handle: "@marcdvlp", quote: "The 3D orbit is insane. My portfolio went from flat to studio-quality overnight. Clients notice." },
  { name: "Emma L.", handle: "@emmalcreates", quote: "Finally a mockup tool that doesn't pull me out of Framer. Upload, rotate, export. That simple." },
  { name: "Alex T.", handle: "@alextdesign", quote: "The screen replacement is buttery smooth. Drop an image and it just works. No fiddling with UV maps." },
  { name: "Yuki M.", handle: "@yukiframes", quote: "Auto-rotate + 4K export = my Dribbble shots went from 50 likes to 500. Not kidding." },
];
