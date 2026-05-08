"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://slfsatozvrdsbozzqgcx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZnNhdG96dnJkc2JvenpxZ2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjk5NzEsImV4cCI6MjA3NDgwNTk3MX0.ESYlRVDcZgZR-slcrwL8sAf3WyfFiCw5gQMItNFkVf8"
);

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://mockup-landing-rho.vercel.app/reset-password",
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary, #050509)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--bg-card, #0F0F14)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: 32,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <Image src="/logo/white.png" alt="Framer Mockup" width={24} height={24} style={{ borderRadius: 6 }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: "#F5F5F7" }}>Framer Mockup</span>
        </div>

        {sent ? (
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#F5F5F7", marginBottom: 8 }}>
              Check your email
            </div>
            <p style={{ fontSize: 14, color: "#8E8E93", lineHeight: 1.6 }}>
              We sent a password reset link to <strong style={{ color: "#F5F5F7" }}>{email}</strong>.
              Click the link in the email to reset your password.
            </p>
            <a
              href="/"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 24,
                fontSize: 13,
                color: "#7F77DD",
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#F5F5F7", marginBottom: 4 }}>
              Reset password
            </div>
            <p style={{ fontSize: 13, color: "#8E8E93", marginBottom: 24 }}>
              Enter your email and we{"'"}ll send you a reset link.
            </p>

            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#8E8E93", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#F5F5F7",
                fontSize: 14,
                outline: "none",
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #7F77DD, #534AB7)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <a href="/" style={{ fontSize: 12, color: "#48484A", textDecoration: "none" }}>
                Back to home
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
