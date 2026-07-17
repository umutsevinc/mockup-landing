import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Terms of Service — Mockiosa",
  description: "Terms of service for Mockiosa, the real-time 3D mockup studio for Framer.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col" style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px) saturate(150%)", background: "rgba(5,5,9,0.7)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 24px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/logo/white.png" alt="Mockiosa" width={22} height={22} style={{ borderRadius: 6 }} />
            <span className="font-playfair" style={{ fontSize: 14, color: "var(--text-primary)" }}>Mockiosa</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>← Back to home</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 64px", color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7 }}>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 12 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 40 }}>Effective date: May 10, 2026</p>

        <Section title="1. Agreement">
          <p>By using Mockiosa (the &ldquo;Service&rdquo;) — including the Framer plugin, the web app, and any related services — you agree to these Terms of Service. If you don&apos;t agree, please don&apos;t use the Service.</p>
          <p>The Service is operated by Umut Sevinc, registered as a sole proprietor in France.</p>
        </Section>

        <Section title="2. Plans and billing">
          <ul style={ulStyle}>
            <li><strong style={strongStyle}>7-day Ultra trial</strong>: full Ultra access for 7 days when you install the plugin. No credit card required.</li>
            <li><strong style={strongStyle}>Paid plans</strong> (Ground, Float, Orbit): billed in USD, monthly, via Stripe. Stripe may display local currency based on your billing country.</li>
            <li><strong style={strongStyle}>Founder Lifetime</strong>: one-time payment for lifetime access to Ultra features and all future major features. Limited to 50 spots.</li>
          </ul>
          <p>You can upgrade or downgrade at any time. Upgrades are billed prorated. Downgrades take effect at the end of the current billing period.</p>
        </Section>

        <Section title="3. Refunds">
          <p>We offer a <strong style={strongStyle}>7-day no-questions-asked refund</strong> on subscription plans. Email <a href="mailto:contact@memselon.com" style={linkStyle}>contact@memselon.com</a> within 7 days of your initial charge.</p>
          <p>Founder Lifetime is <strong style={strongStyle}>final sale</strong> — no refund — since it provides lifetime access at a one-time discount.</p>
        </Section>

        <Section title="4. License">
          <p>You retain full ownership of any content (designs, screenshots, videos, exported assets) you create with the Service. We grant you a non-exclusive, worldwide license to use the Service for personal and commercial projects.</p>
          <p>You may use exported mockups and embedded 3D components in client work, including for paid client projects, on all paid plans.</p>
        </Section>

        <Section title="5. Acceptable use">
          <p>You agree not to:</p>
          <ul style={ulStyle}>
            <li>Reverse-engineer, decompile, or attempt to extract the source code of the Service.</li>
            <li>Resell, sublicense, or redistribute the Service or its assets without explicit permission (white-label is granted only on Studio and Founder Lifetime plans).</li>
            <li>Use the Service for unlawful, harmful, or infringing content.</li>
          </ul>
        </Section>

        <Section title="6. Service availability">
          <p>We aim for high availability but do not guarantee uninterrupted service. Scheduled maintenance and unforeseen outages may occur. We are not liable for losses caused by downtime.</p>
        </Section>

        <Section title="7. Termination">
          <p>You may cancel your subscription at any time from your account settings. We may suspend or terminate accounts that violate these Terms.</p>
        </Section>

        <Section title="8. Liability">
          <p>The Service is provided &ldquo;as is&rdquo;. To the maximum extent permitted by law, our total liability is limited to the amount you paid in the previous 12 months.</p>
        </Section>

        <Section title="9. Governing law">
          <p>These Terms are governed by French law. Disputes are subject to the competent courts of France.</p>
        </Section>

        <Section title="10. Contact">
          <p>Questions? Write to <a href="mailto:contact@memselon.com" style={linkStyle}>contact@memselon.com</a>.</p>
        </Section>
      </main>
    </div>
  );
}

const linkStyle: React.CSSProperties = { color: "var(--accent-purple)", textDecoration: "none" };
const strongStyle: React.CSSProperties = { color: "var(--text-primary)", fontWeight: 600 };
const ulStyle: React.CSSProperties = { paddingLeft: 20, margin: "12px 0", display: "flex", flexDirection: "column", gap: 8 };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}
