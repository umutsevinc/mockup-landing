import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy — Memselon Mockup",
  description: "How Memselon Mockup collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col" style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px) saturate(150%)", background: "rgba(5,5,9,0.7)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 24px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/logo/white.png" alt="Memselon Mockup" width={22} height={22} style={{ borderRadius: 6 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Memselon Mockup</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>← Back to home</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 64px", color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7 }}>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 40 }}>Effective date: May 10, 2026</p>

        <Section title="1. Who we are">
          <p>Memselon Mockup is a Framer plugin and web service operated by Umut Sevinc, currently registered as a sole proprietor in Strasbourg, France (with planned migration to a private limited company in Estonia). You can reach us at <a href="mailto:contact@memselon.com" style={linkStyle}>contact@memselon.com</a>.</p>
        </Section>

        <Section title="2. What data we collect">
          <p>We collect only the data necessary to operate the service:</p>
          <ul style={ulStyle}>
            <li><strong style={strongStyle}>Account data</strong>: email address, authentication identifiers (via Supabase Auth).</li>
            <li><strong style={strongStyle}>Plugin data</strong>: 3D scenes, designs, screenshots, and uploaded videos you create — stored in your account.</li>
            <li><strong style={strongStyle}>Billing data</strong>: handled by Stripe (we never see your card details). We store the Stripe customer ID and subscription status.</li>
            <li><strong style={strongStyle}>Usage analytics</strong>: anonymized page views and event counts (no personal tracking, no cookies for advertising).</li>
          </ul>
        </Section>

        <Section title="3. Where your data lives">
          <p>All your scenes, designs, and uploads are stored on <strong style={strongStyle}>Supabase EU servers</strong> (Frankfurt region). Static assets are served via Cloudflare CDN. Payment processing is handled by Stripe.</p>
        </Section>

        <Section title="4. How we use your data">
          <ul style={ulStyle}>
            <li>To provide and maintain the plugin and web service.</li>
            <li>To process payments and manage your subscription.</li>
            <li>To send transactional emails (account, billing, security).</li>
            <li>To improve the product based on aggregated usage patterns.</li>
          </ul>
          <p>We never sell your data. We never share it with third parties for marketing.</p>
        </Section>

        <Section title="5. Your rights (GDPR)">
          <p>You can request access to, correction of, or deletion of your personal data at any time by emailing <a href="mailto:contact@memselon.com" style={linkStyle}>contact@memselon.com</a>. We respond within 30 days.</p>
        </Section>

        <Section title="6. Cookies">
          <p>We use only essential cookies required for authentication and session management. No third-party tracking cookies.</p>
        </Section>

        <Section title="7. Changes to this policy">
          <p>We may update this policy as the product evolves. Material changes will be communicated by email to active subscribers.</p>
        </Section>

        <Section title="8. Contact">
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
