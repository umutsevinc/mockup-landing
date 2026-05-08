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

/* ── Animated wrapper with scale ── */
function A({ children, className = "", delay = 0, scale = true }: { children: React.ReactNode; className?: string; delay?: number; scale?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: scale ? 0.97 : 1 }}
      animate={v ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════ PAGE ═══════════════════════════════ */

export default function Home() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="flex flex-col">

      {/* ══ NAV ══ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(20px) saturate(150%)", background: "rgba(5,5,9,0.7)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo/white.png" alt="Framer Mockup" width={22} height={22} style={{ borderRadius: 6 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Framer Mockup</span>
          </div>
          <div className="hidden md:flex" style={{ gap: 28, fontSize: 14, color: "var(--text-secondary)" }}>
            {["Features", "Pricing"].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ textDecoration: "none", color: "inherit" }}>{l}</a>)}
          </div>
          <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ height: 36, padding: "0 18px", borderRadius: 9999, background: "var(--cta-gradient)", color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", textDecoration: "none" }}>
            Get the plugin
          </a>
        </div>
      </nav>

      {/* ══ S1 — HERO (dark) ══ */}
      <section style={{ background: "var(--bg-primary)", minHeight: "100vh", maxWidth: 1200, margin: "0 auto", padding: "96px 24px 40px", display: "flex", flexDirection: "column" }}>
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 flex-1">
          <div className="md:w-[45%] flex flex-col justify-center text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <div className="pill w-fit mx-auto md:mx-0 mb-5">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-teal)", display: "inline-block" }} />
                Try it live — no signup needed
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              Your designs<br />deserve depth.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }} style={{ fontSize: "clamp(16px, 1.8vw, 20px)", color: "var(--text-secondary)", maxWidth: 400, margin: "12px auto 28px", lineHeight: 1.5 }} className="md:mx-0">
              Drop your screenshot on a real 3D iPhone. Rotate. Animate. Export in 4K. All inside Framer.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ height: 46, padding: "0 24px", borderRadius: 12, background: "var(--cta-gradient)", color: "#fff", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                Get the plugin — it{"'"}s free
              </a>
              <a href="#how" style={{ height: 46, padding: "0 24px", borderRadius: 12, border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                Watch demo
              </a>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 20 }}>
              Used by <strong style={{ color: "var(--text-secondary)" }}>200+</strong> Framer designers
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="md:w-[55%] w-full">
            <HeroDevice />
          </motion.div>
        </div>
      </section>

      {/* ══ S2 — PAIN POINTS (light) ══ */}
      <section className="section-light" style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <A className="text-center mb-8"><h2 style={{ color: "#1D1D1F" }}>Still exporting flat screenshots?</h2></A>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "Mockup sites are generic", desc: "Same angles, same devices, same look. Your portfolio blends in." },
              { title: "3D tools are overkill", desc: "Blender, Cinema 4D, After Effects — months of learning for one mockup." },
              { title: "External tools break your flow", desc: "Export, upload, download, re-import. Why leave your editor?" },
            ].map((c, i) => (
              <A key={c.title} delay={i * 0.08}>
                <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: 28 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1D1D1F", marginBottom: 6 }}>{c.title}</h3>
                  <p style={{ color: "#6E6E73", fontSize: 14, lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S3 — HOW IT WORKS (light) ══ */}
      <section id="how" style={{ background: "#FAFAFA", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <A className="text-center mb-10"><h2 style={{ color: "#1D1D1F" }}>3D mockups in 3 clicks</h2></A>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { n: "01", title: "Pick your device", desc: "iPhone 17 Pro, iPhone Air, iPad Pro, iMac, Apple Watch Ultra.", color: "#7F77DD" },
              { n: "02", title: "Drop your design", desc: "Drag any screenshot or Framer export. Image, video, or Lottie.", color: "#1D9E75" },
              { n: "03", title: "Export in 4K", desc: "One click. 4K PNG, transparent background, no watermark.", color: "#7F77DD" },
            ].map((s, i) => (
              <A key={s.n} delay={i * 0.1}>
                <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -16, left: -8, fontSize: 120, fontWeight: 800, color: "rgba(0,0,0,0.03)", lineHeight: 1, pointerEvents: "none" }}>{s.n}</div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, marginBottom: 16 }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1D1D1F", marginBottom: 6 }}>{s.title}</h3>
                    <p style={{ color: "#6E6E73", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S4 — FEATURE BENTO (dark) ══ */}
      <section id="features" style={{ background: "var(--bg-primary)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <A className="text-center mb-10"><h2>Everything you need.</h2></A>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
            <A className="md:col-span-3">
              <div className="card card-glow" style={{ padding: "32px 28px", minHeight: 240 }}>
                <div style={{ fontSize: 11, color: "var(--accent-purple)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Core</div>
                <h3 style={{ fontSize: 22, marginBottom: 8 }}>Real 3D, real-time</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, maxWidth: 440 }}>0% CPU idle, 60fps on interact. GPU-accelerated WebGL with on-demand rendering.</p>
                <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
                  {["60 FPS", "On-demand", "GPU", "< 2MB"].map(t => (
                    <span key={t} style={{ fontSize: 10, color: "var(--text-tertiary)", padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            </A>
            <A delay={0.06} className="md:col-span-2">
              <div className="card" style={{ padding: "32px 28px", minHeight: 240 }}>
                <div style={{ fontSize: 11, color: "var(--accent-teal)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Devices</div>
                <h3 style={{ fontSize: 22, marginBottom: 8 }}>5 Apple devices</h3>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {DEVICES.map(d => (
                    <div key={d.name} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border-subtle)", position: "relative" }}>
                      <Image src={d.img} alt={d.name} fill style={{ objectFit: "cover", opacity: 0.7 }} />
                    </div>
                  ))}
                </div>
              </div>
            </A>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {[
              { title: "Free orbit", desc: "360 rotation + zoom", accent: "var(--accent-purple)" },
              { title: "Video export", desc: "MP4 & WebM loops", accent: "var(--accent-teal)" },
              { title: "Animations", desc: "Rotate, follow, float", accent: "var(--accent-purple)" },
            ].map((f, i) => (
              <A key={f.title} delay={i * 0.05}>
                <div className="card" style={{ padding: "22px 20px", textAlign: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.accent, margin: "0 auto 10px" }} />
                  <h3 style={{ fontSize: 15, marginBottom: 2 }}>{f.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{f.desc}</p>
                </div>
              </A>
            ))}
          </div>
          <A>
            <div className="card card-glow" style={{ padding: "28px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40 }}>
              {[{ val: "0ms", label: "Idle render" }, { val: "< 2MB", label: "Plugin size" }, { val: "4K", label: "Max export" }, { val: "5", label: "Devices" }].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </A>
        </div>
      </section>

      {/* ══ S5 — PRICING (light) ══ */}
      <section id="pricing" className="section-light" style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <A className="text-center mb-3"><h2 style={{ color: "#1D1D1F" }}>Simple, transparent pricing.</h2></A>
          <A className="text-center mb-8" delay={0.05}>
            <p style={{ color: "#6E6E73", marginBottom: 16, fontSize: 15 }}>All plans include unlimited real-time preview.</p>
            <div style={{ display: "inline-flex", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden", background: "#fff" }}>
              <button onClick={() => setYearly(false)} style={{ padding: "7px 18px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: !yearly ? "#1D1D1F" : "transparent", color: !yearly ? "#fff" : "#6E6E73", transition: "all 0.2s", borderRadius: !yearly ? 8 : 0 }}>Monthly</button>
              <button onClick={() => setYearly(true)} style={{ padding: "7px 18px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: yearly ? "#1D1D1F" : "transparent", color: yearly ? "#fff" : "#6E6E73", transition: "all 0.2s", borderRadius: yearly ? 8 : 0 }}>Yearly <span style={{ fontSize: 11, color: "#1D9E75" }}>-27%</span></button>
            </div>
          </A>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PLANS.map((p, i) => (
              <A key={p.name} delay={i * 0.06}>
                <div style={{ background: "#fff", border: p.hl ? "2px solid #7F77DD" : "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", height: "100%", position: "relative", boxShadow: p.hl ? "0 8px 30px rgba(127,119,221,0.1)" : "none" }}>
                  {p.badge && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "3px 12px", borderRadius: 9999, background: "#7F77DD", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.badge}</div>}
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F", marginBottom: 12 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontSize: 40, fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.04em" }}>{yearly ? p.yprice : p.price}</span>
                    <span style={{ fontSize: 14, color: "#6E6E73" }}>{p.per}</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, flex: 1, marginBottom: 20 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6E6E73" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ width: "100%", height: 42, borderRadius: 10, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.2s", ...(p.hl ? { background: "var(--cta-gradient)", color: "#fff" } : { background: "#F5F5F7", color: "#1D1D1F", border: "1px solid rgba(0,0,0,0.08)" }) }}>
                    {p.cta}
                  </a>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S6 — TESTIMONIALS (dark) ══ */}
      <section style={{ background: "var(--bg-primary)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <A className="text-center mb-8"><h2>Designers love it.</h2></A>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <A key={t.name} delay={i * 0.06}>
                <div className="card" style={{ padding: 24 }}>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 14, fontStyle: "italic" }}>{`"${t.quote}"`}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text-secondary)" }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{t.handle}</div>
                    </div>
                  </div>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S7 — CTA (dark) ══ */}
      <section style={{ background: "var(--bg-primary)", padding: "64px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(127,119,221,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <A className="text-center relative z-10">
          <h2 style={{ maxWidth: 500, margin: "0 auto" }}>Your mockups deserve better.</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, margin: "12px auto 28px", maxWidth: 420 }}>Start creating studio-grade 3D mockups. Free.</p>
          <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" target="_blank" rel="noopener noreferrer" style={{ height: 48, padding: "0 28px", borderRadius: 12, background: "var(--cta-gradient)", color: "#fff", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            Get started — it{"'"}s free
          </a>
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 14 }}>No credit card &bull; 3 free credits/month &bull; Cancel anytime</p>
        </A>
      </section>

      {/* ══ S8 — FOOTER ══ */}
      <footer style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-subtle)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Image src="/logo/white.png" alt="Framer Mockup" width={16} height={16} style={{ borderRadius: 4 }} />
              <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Framer Mockup</span>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 11, color: "var(--text-tertiary)" }}>
              {["Features", "Pricing"].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
            </div>
          </div>
          <div style={{ fontSize: 10, color: "rgba(72,72,74,0.4)" }}>
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
  { name: "Ultra", price: "29", yprice: "21", per: "/ mo", hl: false, cta: "Go Ultra", features: ["Unlimited exports", "Everything in Pro", "Transparent BG", "Multi-device scenes", "Batch export", "Lottie screens", "Priority support"] },
];

const TESTIMONIALS = [
  { name: "Sarah K.", handle: "@sarahdesigns", quote: "I used to spend 30 minutes per mockup. Now it takes 10 seconds. Changed my workflow." },
  { name: "Marc D.", handle: "@marcdvlp", quote: "The 3D orbit is insane. My portfolio went from flat to studio-quality overnight." },
  { name: "Emma L.", handle: "@emmalcreates", quote: "Finally a mockup tool that doesn't pull me out of Framer. Upload, rotate, export." },
];
