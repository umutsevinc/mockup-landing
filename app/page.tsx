"use client";

import { motion } from "framer-motion";
import FounderCountCTA from "./components/FounderCountCTA";
import { RenaissanceHow } from "./components/RenaissanceHow";
import { MarcLouFooter } from "./components/MarcLouFooter";
import { UnifiedNav, MockupMark } from "./components/UnifiedNav";
import { GsapImage } from "./components/GsapImage";
import { GlassButton } from "./components/GlassButton";

const ACCENT = "#FF4B1F";
const INK = "#0a0a0a";
const PAPER = "#fafaf7";
const MUTED = "#6E6E73";

// Reveal-on-scroll wrapper
function R({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Section eyebrow "01  LABEL"
function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <p style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontWeight: 500, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: INK, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ color: ACCENT, fontVariantNumeric: "tabular-nums" }}>{num}</span>
      <span>{label}</span>
    </p>
  );
}

export default function Home() {
  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <UnifiedNav
        icon={<MockupMark />}
        brandPrefix="Memselon"
        brandSuffix=" Mockup"
        links={[
          { href: "#looks",   text: "How it looks" },
          { href: "#how",     text: "How it works" },
          { href: "#pricing", text: "Pricing" },
          { href: "#faq",     text: "FAQ" },
        ]}
        cta={{ label: "Install", href: "#pricing" }}
      />
      <MockupHero />
      <BigStats />
      <ButWhy />
      <HowItLooks />
      <Compared />
      <RenaissanceHow
        num="04"
        label="HOW IT WORKS"
        bgImage="/ren/selfie.png"
        title={<>Install once. Drag a screen.<br />Ship the same hour.</>}
        sub="30-second install in Framer. Real 3D device on your canvas. No PSD, no export."
        steps={[
          { pre: "01 · INSTALL", glyph: "+",   title: "Install in Framer.",   body: "One click from the marketplace. Auth in 5 seconds." },
          { pre: "02 · DRAG",    glyph: "↓",   title: "Drag a screenshot.",   body: "Any PNG, any aspect ratio. Drop it onto the device." },
          { pre: "03 · TWEAK",   glyph: "◐",   title: "Tweak the scene.",     body: "Tilt, perspective, shadow. Three sliders, that's it." },
          { pre: "04 · EMBED",   glyph: "</>", title: "Embed in your site.",  body: "Real 3D animated mockup. Hosted on memselon. Free bandwidth." },
        ]}
      />
      <Pricing />
      <Voices />
      <FAQ />
      <About />
      <MarcLouFooter
        wordmark="Mockup."
        brandName="Memselon Mockup"
        brandIcon="▢"
        tagline="Real 3D. Real-time. In Framer. Drop a device, set the screen, ship."
        productLinks={[
          { label: "How it works", href: "#how" },
          { label: "Pricing",      href: "#pricing" },
          { label: "Devices",      href: "#looks" },
          { label: "FAQ",          href: "#faq" },
        ]}
        memselonLinks={[
          { label: "memselon.com",    href: "https://memselon.com" },
          { label: "ScanGap",         href: "https://scangap.memselon.com" },
          { label: "Heroes",          href: "https://heroes.memselon.com" },
          { label: "Framer Marketplace", href: "https://www.framer.com/marketplace/plugins/mockup-for-framer/" },
        ]}
        legalLinks={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms",   href: "/terms" },
        ]}
      />
    </div>
  );
}

/* ─────────── HERO — Memselon brand, Figma-matching ─────────── */
function MockupHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: PAPER, color: INK, paddingTop: 140, paddingBottom: 80, minHeight: "100vh" }}>
      {/* Dot filigrane bg */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(10,10,10,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "center" }} className="md-grid-hero">
        <div>
          <R>
            <p style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontWeight: 500, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "6px 12px", borderRadius: 999, background: "rgba(255,75,31,0.10)", border: "1px solid rgba(255,75,31,0.25)", color: ACCENT }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: ACCENT }} />
              FRAMER PARTNER · LIVE PLUG-IN
            </p>
          </R>
          <R delay={0.08}>
            <h1 style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.04em", textWrap: "balance" }}>
              Real 3D mockups.<br />
              <span style={{ fontStyle: "italic", color: ACCENT }}>No more exported PNGs.</span>
            </h1>
          </R>
          <R delay={0.18}>
            <p style={{ marginTop: 28, maxWidth: "48ch", fontSize: 19, lineHeight: 1.55, color: MUTED }}>
              The Framer plug-in that drops a real-time 3D device on your canvas. Tilt, shadow,
              animate — ship the same hour. <strong style={{ color: INK }}>Starter $19/mo · Lifetime $249.</strong>
            </p>
          </R>
          <R delay={0.28}>
            <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
              <GlassButton href="#pricing" variant="ink" size="lg">Install the plug-in</GlassButton>
              <GlassButton href="#looks" variant="paper" size="lg">See it in action</GlassButton>
            </div>
          </R>
          <R delay={0.4}>
            <div style={{ marginTop: 28, display: "flex", gap: 24, flexWrap: "wrap", fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: MUTED }}>
              <span>· No free plan</span>
              <span>· 7-day refund</span>
              <span>· Stripe Tax included</span>
            </div>
          </R>
        </div>

        {/* Right: phone mockup with chiaroscuro Renaissance backdrop */}
        <R delay={0.2}>
          <div style={{ width: "100%", maxWidth: 460, marginLeft: "auto" }}>
            <GsapImage
              src="/ren/selfie.png"
              alt="Renaissance woman with smartphone — Memselon Mockup"
              blend="soft"
              burstSide="left"
              aspect="4 / 5"
              rounded="rounded-[28px]"
              bottomLabel="REAL 3D · REAL-TIME · IN FRAMER"
              className="bg-[#0a0a0a] shadow-[0_60px_100px_-50px_rgba(10,10,10,0.55)]"
            />
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─────────── BIG STATS ─────────── */
function BigStats() {
  const stats = [
    { v: "60s", l: "DROP TO SHIP" },
    { v: "4K",  l: "CAPTURE" },
    { v: "M1+", l: "WORKS ON" },
    { v: "5",   l: "DEVICES LIVE" },
  ];
  return (
    <section style={{ background: INK, color: PAPER, padding: "56px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="md-grid-stats">
        {stats.map((s, i) => (
          <R key={s.v} delay={i * 0.08}>
            <div>
              <div style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {s.v}
              </div>
              <div style={{ marginTop: 10, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 11, letterSpacing: 2, color: "rgba(250,250,247,0.55)" }}>
                {s.l}
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─────────── 01 BUT WHY ─────────── */
function ButWhy() {
  return (
    <section style={{ position: "relative", overflow: "hidden", borderTop: "1px solid rgba(0,0,0,0.08)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(10,10,10,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.6, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center", minHeight: "80vh" }} className="md-grid-why">
        <R>
          <Eyebrow num="01" label="BUT WHY" />
          <h2 style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.04em", textWrap: "balance" }}>
            Your client doesn&apos;t want to see a PSD.<br />
            <span style={{ color: ACCENT }}>Drop a real 3D mockup straight into Framer.</span>
          </h2>
          <p style={{ marginTop: 28, maxWidth: "44ch", fontSize: 19, lineHeight: 1.55, color: MUTED }}>
            Plug-in installed in 30 seconds. 12 devices, ready scenes.<br />
            Real 3D — not an overlay PNG.
          </p>
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <a href="#pricing" style={{ background: INK, color: PAPER, padding: "14px 28px", borderRadius: 999, fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12, transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 280ms ease" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 24px 36px -18px rgba(0,0,0,0.35)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              Install the plugin
              <span style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>→</span>
            </a>
            <span style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 13, color: MUTED }}>· $19 / MO</span>
          </div>
        </R>
        <R delay={0.2}>
          <div style={{ aspectRatio: "4 / 5", width: "100%", maxWidth: 460, marginLeft: "auto", borderRadius: 22, overflow: "hidden", position: "relative", boxShadow: "0 40px 80px -40px rgba(10,10,10,0.5)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ren/selfie.png"
              alt="Renaissance woman holding a smartphone — Memselon Mockup"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.05)" }}
            />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.20) 0%, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.55) 100%)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>
              FIG. 01 · MOCKUP · BUILT IN PARIS
            </div>
            <div style={{ position: "absolute", top: 16, right: 16, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 14, color: ACCENT }}>
              ▒ ▓ █
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─────────── 02 HOW IT LOOKS — Framer plug-in mock ─────────── */
function HowItLooks() {
  return (
    <section id="looks" style={{ background: PAPER, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <Eyebrow num="02" label="HOW IT LOOKS" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Inside the Framer plug-in.
          </h2>
          <p style={{ fontSize: 18, color: MUTED, maxWidth: "55ch" }}>
            Drop a device. Set the screen. Animate. Ship.<br />Real 3D — not an overlay PNG.
          </p>
        </R>

        {/* Plug-in window mock */}
        <R delay={0.1}>
          <div style={{ marginTop: 48, background: "#101012", borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 80px -40px rgba(10,10,10,0.45)" }}>
            {/* Top bar */}
            <div style={{ background: "#16161a", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <span key={c} style={{ width: 12, height: 12, borderRadius: 999, background: c }} />
                ))}
              </div>
              <div style={{ color: "rgba(250,250,247,0.85)", fontSize: 12, fontWeight: 500 }}>
                Mirror Studio · Hero v2.framer
              </div>
              <div style={{ width: 60 }} />
            </div>
            {/* Body 3-column */}
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 240px", minHeight: 520 }} className="md-plugin-grid">
              {/* Layers panel */}
              <div style={{ background: "#131319", padding: 16, borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: 1.5, color: "rgba(250,250,247,0.45)", marginBottom: 14 }}>LAYERS</div>
                {[
                  { ic: "▸", n: "Home page", lvl: 0, sel: false },
                  { ic: "▾", n: "Hero", lvl: 0, sel: false },
                  { ic: "T", n: "Title", lvl: 1, sel: false },
                  { ic: "T", n: "Sub-headline", lvl: 1, sel: false },
                  { ic: "◯", n: "CTA button", lvl: 1, sel: false },
                  { ic: "◐", n: "iPhone Mockup 3D", lvl: 1, sel: true },
                  { ic: "▢", n: "screen", lvl: 2, sel: false },
                  { ic: "▸", n: "Pricing", lvl: 0, sel: false },
                  { ic: "▸", n: "Footer", lvl: 0, sel: false },
                ].map((it, i) => (
                  <div key={i} style={{ position: "relative", padding: "6px 0", paddingLeft: it.lvl * 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: it.sel ? ACCENT : "rgba(250,250,247,0.82)" }}>
                    {it.sel && <span style={{ position: "absolute", inset: "-2px -8px", borderRadius: 6, background: "rgba(255,75,31,0.18)" }} />}
                    <span style={{ position: "relative", zIndex: 1, opacity: 0.6 }}>{it.ic}</span>
                    <span style={{ position: "relative", zIndex: 1, fontWeight: it.sel ? 600 : 400 }}>{it.n}</span>
                  </div>
                ))}
              </div>
              {/* Canvas */}
              <div style={{ position: "relative", background: "#f7f6f3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(10,10,10,0.10) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                {/* Phone */}
                <div style={{ position: "relative", width: 220, height: 440, borderRadius: 38, background: "#1a1a1f", border: "1px solid #2a2a30", padding: 7, boxShadow: "0 40px 60px -30px rgba(0,0,0,0.5)" }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: 32, background: "#f4f4ee", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 36, gap: 10 }}>
                    <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 80, height: 22, borderRadius: 11, background: "#070708" }} />
                    <div style={{ height: 14, width: "70%", borderRadius: 4, background: INK }} />
                    <div style={{ height: 12, width: "55%", borderRadius: 4, background: "rgba(10,10,10,0.4)" }} />
                    <div style={{ height: 110, width: "82%", borderRadius: 14, background: ACCENT, marginTop: 14 }} />
                    <div style={{ height: 12, width: "65%", borderRadius: 4, background: "rgba(10,10,10,0.3)", marginTop: 12 }} />
                    <div style={{ height: 38, width: "82%", borderRadius: 20, background: INK, marginTop: "auto", marginBottom: 20 }} />
                  </div>
                </div>
                {/* Selection */}
                <div aria-hidden style={{ position: "absolute", left: "calc(50% - 116px)", top: "calc(50% - 224px)", width: 228, height: 448, border: `1.5px solid ${ACCENT}`, borderRadius: 38, pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: "calc(50% - 116px)", top: "calc(50% - 248px)", background: ACCENT, color: PAPER, padding: "4px 10px", borderRadius: 4, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 11, letterSpacing: 0.6 }}>
                  iPhone Mockup 3D
                </div>
              </div>
              {/* Plug-in panel */}
              <div style={{ background: "#131319", borderLeft: "1px solid rgba(255,255,255,0.05)", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 5, background: ACCENT }} />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Memselon Mockup</span>
                  <span style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, opacity: 0.5, marginLeft: "auto" }}>v1.0</span>
                </div>
                <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: 1.5, color: "rgba(250,250,247,0.45)", marginBottom: 12 }}>DEVICE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
                  {[{ n: "iPhone 16", sel: true }, { n: "iPad Pro" }, { n: "MacBook" }, { n: "Watch" }].map((d) => (
                    <div key={d.n} style={{ position: "relative", padding: "10px 12px", borderRadius: 10, background: d.sel ? "rgba(255,75,31,0.16)" : "rgba(255,255,255,0.04)", border: `1px solid ${d.sel ? "rgba(255,75,31,0.6)" : "rgba(255,255,255,0.06)"}`, fontSize: 11, color: d.sel ? ACCENT : "rgba(250,250,247,0.85)" }}>
                      <span style={{ display: "block", width: 16, height: 22, borderRadius: 3, background: d.sel ? ACCENT : "rgba(250,250,247,0.5)", marginBottom: 6 }} />
                      <span style={{ fontWeight: d.sel ? 600 : 400 }}>{d.n}</span>
                    </div>
                  ))}
                </div>
                {["TILT", "PERSPECTIVE", "SHADOW"].map((lab, i) => {
                  const pct = [0.62, 0.4, 0.78][i];
                  return (
                    <div key={lab} style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: 1.5, color: "rgba(250,250,247,0.45)", marginBottom: 8 }}>{lab}</div>
                      <div style={{ position: "relative", height: 14 }}>
                        <div style={{ position: "absolute", inset: "5px 0", borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
                        <div style={{ position: "absolute", inset: "5px auto 5px 0", width: `${pct * 100}%`, borderRadius: 2, background: ACCENT }} />
                        <div style={{ position: "absolute", left: `calc(${pct * 100}% - 7px)`, top: 0, width: 14, height: 14, borderRadius: 999, background: PAPER, border: `2px solid ${ACCENT}` }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                  <button style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: ACCENT, color: PAPER, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 12, fontWeight: 600, letterSpacing: 1.4, cursor: "pointer" }}>
                    APPLY → COMMAND-RETURN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─────────── 03 COMPARED — competitors table ─────────── */
function Compared() {
  const brands = [
    { name: "Memselon Mockup", short: "Memselon", logoBg: ACCENT, letter: "☁", ours: true },
    { name: "Rotato", short: "Rotato", logoBg: "#000", letter: "R" },
    { name: "Previewed", short: "Previewed", logoBg: "#f54871", letter: "P" },
    { name: "Mockuuups Studio", short: "Mockuuups", logoBg: "#0a73f7", letter: "M" },
    { name: "MockRocket", short: "MockRocket", logoBg: "#ff6600", letter: "🚀" },
  ];
  const features = [
    { label: "Real-time 3D in your live Framer site", vals: [true, false, false, false, false] },
    { label: "No PNG / MP4 export required", vals: [true, false, false, false, false] },
    { label: "Adaptive DPR + on-demand rendering", vals: [true, "—", false, false, false] },
    { label: "Customer 3D scene saved on cloud", vals: [true, "—", "—", false, false] },
    { label: "Embedded animations: tilt · float · auto-rotate", vals: [true, true, true, "—", "—"] },
    { label: "Pricing model", vals: ["$19→$249", "$24/mo", "$15/mo", "$19/mo", "$9/mo"], text: true },
  ];
  return (
    <section style={{ background: PAPER, padding: "100px 24px", position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(10,10,10,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <R>
          <Eyebrow num="03" label="COMPARED" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 16 }}>
            They export a PNG.<br />We render in your browser.
          </h2>
          <p style={{ fontSize: 18, color: MUTED, maxWidth: "60ch" }}>
            Most mockup tools spit out a static file. Memselon Mockup is the only one that embeds a real 3D scene directly inside your live Framer site.
          </p>
        </R>
        <R delay={0.1}>
          <div style={{ marginTop: 48, overflow: "hidden", borderRadius: 16, background: "#fff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 24px 60px -30px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {brands.map((b, i) => (
                <div key={b.name} style={{ position: "relative", padding: "24px 20px", textAlign: "center", background: b.ours ? "rgba(255,75,31,0.05)" : "transparent" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: b.logoBg, color: PAPER, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                    {b.letter}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{b.ours ? b.name : b.short}</div>
                  {b.ours && (
                    <span style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", background: ACCENT, color: PAPER, borderRadius: 999, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 9, letterSpacing: 1.2 }}>OURS</span>
                  )}
                </div>
              ))}
            </div>
            {features.map((f, r) => (
              <div key={f.label} style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", borderTop: r > 0 ? "1px solid rgba(0,0,0,0.04)" : "none", padding: "14px 20px", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: INK }}>{f.label}</div>
                {f.vals.slice(1).map((v, k) => (
                  <div key={k} style={{ textAlign: "center", fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 13 }}>
                    {f.text ? <span style={{ color: INK, fontWeight: 500 }}>{String(v)}</span> :
                      v === true ? <span style={{ display: "inline-block", width: 22, height: 22, borderRadius: 999, background: ACCENT, color: PAPER, lineHeight: "22px", fontWeight: 700 }}>✓</span> :
                      v === false ? <span style={{ color: "rgba(10,10,10,0.22)", fontWeight: 700, fontSize: 18 }}>×</span> :
                      <span style={{ color: "rgba(10,10,10,0.35)" }}>—</span>}
                  </div>
                ))}
                <div style={{ textAlign: "center", background: r === 0 ? "rgba(255,75,31,0.04)" : "transparent" }}>
                  {/* placeholder for ours column already taken into vals[0] not shown */}
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 11, color: "rgba(10,10,10,0.5)" }}>
            Sources: public pricing pages — Jun 2026. ✓ confirmed · × not available · — manual workaround required.
          </p>
        </R>
      </div>
    </section>
  );
}

/* ─────────── 05 PRICING — 4 tiers USD ─────────── */
function Pricing() {
  const tiers = [
    { name: "Starter", price: "$19", per: "/mo", features: ["3 devices", "20 captures / month 1080p", "cursor + auto-rotate + float", "No watermark"], cta: "Get Starter", primary: false },
    { name: "Pro",     price: "$39", per: "/mo", features: ["All 5 devices", "Unlimited 4K captures", "All animations", "Priority support 24h"], cta: "Get Pro", primary: true,  badge: "MOST POPULAR" },
    { name: "Studio",  price: "$99", per: "/mo", features: ["Everything in Pro", "White-label embed", "10 Framer projects", "1-on-1 onboarding", "Private Discord"], cta: "Get Studio", primary: false },
    { name: "Lifetime",price: "$249",per: "one-time", features: ["All Pro features forever", "All future devices included", "Founder badge", "DM line to Umut", "100 spots only"], cta: "Get Lifetime", primary: false, accent: true },
  ];
  return (
    <section id="pricing" style={{ background: INK, color: PAPER, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <p style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontWeight: 500, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", display: "inline-flex", gap: 10, marginBottom: 16 }}>
            <span style={{ color: ACCENT }}>05</span><span>PRICING</span>
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Pay once. Or pay monthly.<br />Never pay nothing.
          </h2>
          <p style={{ marginTop: 16, fontSize: 18, color: "rgba(250,250,247,0.65)", maxWidth: "55ch" }}>
            No free tier. No upsells. Stripe Tax handles VAT automatically.
          </p>
        </R>
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="md-pricing-grid">
          {tiers.map((t, i) => (
            <R key={t.name} delay={i * 0.06}>
              <article style={{ position: "relative", padding: 24, borderRadius: 16, background: t.accent ? ACCENT : t.primary ? "#fafaf7" : "rgba(255,255,255,0.04)", color: t.accent ? PAPER : t.primary ? INK : PAPER, border: t.primary ? "none" : `1px solid ${t.accent ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`, height: "100%" }}>
                {t.badge && (
                  <span style={{ position: "absolute", top: -10, right: 16, padding: "4px 10px", background: INK, color: ACCENT, borderRadius: 999, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 9, letterSpacing: 1.4, fontWeight: 600 }}>
                    {t.badge}
                  </span>
                )}
                <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1.4, opacity: 0.7, textTransform: "uppercase" }}>{t.name}</div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.04em" }}>{t.price}</span>
                  <span style={{ opacity: 0.6, fontSize: 14 }}>{t.per}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {t.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, opacity: 0.92 }}>
                      <span style={{ marginTop: 6, width: 4, height: 4, borderRadius: 999, background: t.accent || t.primary ? "currentColor" : ACCENT, flexShrink: 0 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 4 }}>
                  <GlassButton
                    href="#"
                    variant={t.accent ? "paper" : t.primary ? "accent" : "ink"}
                    size="md"
                    className="!w-full"
                  >
                    {t.cta}
                  </GlassButton>
                </div>
              </article>
            </R>
          ))}
        </div>
        <R delay={0.2}>
          <p style={{ marginTop: 32, textAlign: "center", fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 12, color: "rgba(250,250,247,0.5)", letterSpacing: 1.5 }}>
            7-day refund · Stripe Tax included · Cancel anytime
          </p>
        </R>
      </div>
    </section>
  );
}

/* ─────────── 06 VOICES ─────────── */
function Voices() {
  const cards = [
    { initials: "JR", name: "Jules R.", role: "MIRROR STUDIO · BCN",    quote: "My landing pages went from flat to film-set. Same afternoon." },
    { initials: "LC", name: "Léa C.",   role: "ATELIER LUNE · LYON",    quote: "The iPad mockup is what made our hero copy land. Real depth." },
    { initials: "TM", name: "Théo M.",  role: "NOTBOOK.APP · AMS",      quote: "Installed in 30s. Real 3D MacBook on prod by lunch." },
  ];
  return (
    <section style={{ background: PAPER, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R><Eyebrow num="06" label="VOICES FROM THE BUILD" /></R>
        <R delay={0.05}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Three Framer sites. One real Tuesday.
          </h2>
          <p style={{ fontSize: 17, color: MUTED, maxWidth: "55ch" }}>
            Real designers who plugged Memselon Mockup into a live Framer site this quarter.
          </p>
        </R>
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="md-voices-grid">
          {cards.map((c, i) => (
            <R key={c.name} delay={i * 0.08}>
              <article style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: 24, boxShadow: "0 8px 24px -10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, k) => <span key={k} style={{ color: ACCENT }}>★</span>)}
                  </div>
                  <span style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, fontWeight: 500, letterSpacing: 1.4, color: ACCENT, padding: "4px 10px", borderRadius: 999, background: "rgba(255,75,31,0.10)", border: "1px solid rgba(255,75,31,0.30)" }}>✓ VERIFIED</span>
                </div>
                <p style={{ marginTop: 20, fontSize: 17, fontWeight: 500, lineHeight: 1.4, color: INK }}>“{c.quote}”</p>
                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
                  <div aria-hidden style={{ width: 44, height: 44, borderRadius: 999, background: INK, color: PAPER, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 13, fontWeight: 600 }}>{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{c.name}</div>
                    <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 11, color: MUTED, letterSpacing: 1.2 }}>{c.role}</div>
                  </div>
                </div>
              </article>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── 07 QUESTIONS — Honest answers FAQ ─────────── */
function FAQ() {
  const faqs = [
    { q: "Does it work outside Framer?", a: "Today only inside Framer — that's the wedge. A vanilla React / Webflow embed is on the Q3 roadmap." },
    { q: "Is the WebGL heavy?", a: "GPU-accelerated R3F + adaptive DPR caps at 60fps. On mobile we drop to a single LOD and 1× pixel ratio so battery stays sane." },
    { q: "Can I customize colors / speed?", a: "Live in the modal. Color wheel, dark/light, perspective, tilt, shadow. No rebuild." },
    { q: "What about MP4 export?", a: "PNG-only at launch. MP4 export ships Q3 2026 for Pro and Studio tiers, on top of Cloudflare Stream." },
  ];
  return (
    <section id="faq" style={{ background: PAPER, padding: "100px 24px", position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(10,10,10,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.6, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <R><Eyebrow num="07" label="QUESTIONS" /></R>
        <R delay={0.05}>
          <h2 style={{ fontSize: "clamp(2.4rem, 4.5vw, 5rem)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.04em" }}>
            Honest answers.<br />No cookies.
          </h2>
        </R>
        <div style={{ marginTop: 56, borderTop: "1px solid rgba(10,10,10,0.10)" }}>
          {faqs.map((f, i) => (
            <R key={f.q} delay={i * 0.04}>
              <div style={{ padding: "26px 0", borderBottom: "1px solid rgba(10,10,10,0.10)", display: "grid", gridTemplateColumns: "32px 1fr", gap: 16 }}>
                <span style={{ color: ACCENT, fontWeight: 600, fontSize: 22, lineHeight: 1 }}>+</span>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 600, color: INK }}>{f.q}</div>
                  <p style={{ marginTop: 10, fontSize: 15, color: "rgba(10,10,10,0.62)", lineHeight: 1.5, maxWidth: "70ch" }}>{f.a}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
        {/* Renaissance group photo */}
        <R delay={0.2}>
          <div style={{ marginTop: 48, position: "relative", borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 80px -40px rgba(10,10,10,0.4)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ren/tablet.png" alt="" style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 380, filter: "saturate(1.05)" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.20) 0%, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.65) 100%)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 24, color: PAPER, fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 11, letterSpacing: 2 }}>
              —— BUILT BY SOMEONE WHO SHIPS · NOT A COMMITTEE ——
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─────────── 08 ABOUT — founder block ─────────── */
function About() {
  return (
    <section id="about" style={{ background: INK, color: PAPER, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <R>
          <p style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontWeight: 500, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", display: "inline-flex", gap: 10, marginBottom: 16 }}>
            <span style={{ color: ACCENT }}>08</span><span>ABOUT THE BUILDER</span>
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Built by someone <span style={{ color: ACCENT }}>who ships Framer SaaS.</span>
          </h2>
        </R>
        <R delay={0.1}>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, alignItems: "start" }} className="md-about-grid">
            <div style={{ width: 200 }}>
              <GsapImage
                src="/ren/selfie.png"
                alt="Renaissance portrait — Umut · Memselon Mockup"
                blend="soft"
                burstSide="left"
                aspect="1 / 1"
                rounded="rounded-2xl"
                bottomLabel="FIG. 08 · UMUT"
                className="bg-[#1a1a1f]"
              />
            </div>
            <div>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(250,250,247,0.88)" }}>
                I&apos;m Umut. I run Memselon ☁ — Framer Partner Expert in Paris. Memselon Mockup is the result of 8 months of building real 3D rendering inside Framer plug-ins, with Stripe billing and Supabase auth shipped from day one.
              </p>
              <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: "rgba(250,250,247,0.62)" }}>
                The 5-tier model is Marc Lou-pure: <strong style={{ color: PAPER }}>Starter $19</strong> unlocks no-watermark, Studio $99 adds custom branding + multi-project auth, Founder lifetime $249 (100 spots).
              </p>
              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "120px 1fr", gap: "10px 16px", fontSize: 13 }}>
                <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: 1.4, color: "rgba(250,250,247,0.5)" }}>NOW</div>
                <div>Memselon ☁ · Framer Partner Expert · 5-tier SaaS shipped</div>
                <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: 1.4, color: "rgba(250,250,247,0.5)" }}>STACK</div>
                <div>Framer Plugin API · Three.js · Supabase · Stripe + Tax · webhook live</div>
                <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: 1.4, color: "rgba(250,250,247,0.5)" }}>PRICING</div>
                <div>Starter $19 · Pro $39 · Studio $99 · Founder $249 (lifetime)</div>
                <div style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 10, letterSpacing: 1.4, color: "rgba(250,250,247,0.5)" }}>FIND ME</div>
                <div>@memselon on X · framermockup.memselon.com</div>
              </div>
              <div style={{ marginTop: 24 }}>
                <FounderCountCTA />
              </div>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}
