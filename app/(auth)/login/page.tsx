"use client";

// ─── Login Page — uses lib/auth.ts (Google + Credentials via next-auth/react) ─
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ─── Google OAuth (Google provider from lib/auth.ts) ──────────────────────
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError("");
      await signIn("google", { callbackUrl: "/products" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // ─── Email / Password (Credentials provider from lib/auth.ts) ────────────
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      setIsEmailLoading(true);
      setError("");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,   // handle redirect manually
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsEmailLoading(false);
        return;
      }

      // Redirect on success
      window.location.href = "/products";
    } catch {
      setError("Sign-in failed. Please try again.");
      setIsEmailLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(160deg, #F0FBF1 0%, #D8F3DC 45%, #B7E4C7 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* ── Decorative background shapes ──────────────────────────────────── */}
      <div style={{
        position: "absolute", top: "-120px", right: "-120px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "rgba(45,106,79,0.07)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", left: "-80px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "rgba(255,183,3,0.08)", pointerEvents: "none",
      }} />

      {/* Floating leaves */}
      {["🌿", "🍃", "🌱", "🍂"].map((leaf, i) => (
        <span key={i} style={{
          position: "absolute", fontSize: `${1.2 + i * 0.4}rem`, opacity: 0.18,
          top: `${10 + i * 20}%`, left: `${3 + i * 3}%`,
          userSelect: "none",
          animation: `floatLeaf ${3 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.7}s`,
        }}>{leaf}</span>
      ))}

      {/* ── Left Brand Panel (desktop only) ───────────────────────────────── */}
      <div id="brand-panel" style={{
        flex: 1, display: "none",
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "3rem",
        background: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 60%, #52B788 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,183,3,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative", zIndex: 1 }}>
          <div style={{ width: "72px", height: "72px", background: "rgba(255,255,255,0.15)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", margin: "0 auto 1rem", border: "1px solid rgba(255,255,255,0.2)" }}>🌿</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.2rem", fontWeight: 800, color: "white", margin: "0 0 0.25rem" }}>
            Fresh<span style={{ color: "#FFB703" }}>Direct</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", margin: 0 }}>Farm-to-Table Marketplace</p>
        </div>

        {/* Value props */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative", zIndex: 1, maxWidth: "320px" }}>
          {[
            { icon: "⚡", title: "Harvested Today", desc: "Fresh produce delivered within 24 hours" },
            { icon: "👨‍🌾", title: "500+ Verified Farmers", desc: "Direct from local Sri Lankan farms" },
            { icon: "🌿", title: "Chemical-Free Guarantee", desc: "100% natural, organic certified produce" },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)" }}>{item.icon}</div>
              <div>
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 2px" }}>{item.title}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ marginTop: "3rem", padding: "1.25rem", background: "rgba(255,255,255,0.08)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.12)", position: "relative", zIndex: 1, maxWidth: "320px", width: "100%" }}>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", lineHeight: 1.6, margin: "0 0 0.75rem", fontStyle: "italic" }}>
            &ldquo;The spinach was still dewy when it arrived. I could taste the freshness!&rdquo;
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,183,3,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>👩</div>
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: "0.8rem", margin: 0 }}>Sachini Fernando</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", margin: 0 }}>Colombo 7 · Verified Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem 1.5rem", minHeight: "100vh" }}>

        {/* Mobile Logo */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "white", padding: "0.75rem 1.5rem", borderRadius: "50px", boxShadow: "0 4px 20px rgba(45,106,79,0.12)", border: "1px solid #D0EDD8" }}>
            <span style={{ fontSize: "1.4rem" }}>🌿</span>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", fontWeight: 800, color: "#2D6A4F" }}>
              Fresh<span style={{ color: "#FFB703" }}>Direct</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderRadius: "28px", padding: "2.5rem", boxShadow: "0 20px 60px rgba(45,106,79,0.15), 0 4px 20px rgba(45,106,79,0.08)", border: "1px solid rgba(208,237,216,0.6)" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #2D6A4F, #52B788)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", margin: "0 auto 1.25rem", boxShadow: "0 8px 24px rgba(45,106,79,0.3)" }}>🌿</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 800, color: "#1B4332", margin: "0 0 0.4rem" }}>Welcome Back</h2>
            <p style={{ color: "#4A6355", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
              Sign in to access fresh produce &amp; connect<br />with local farmers
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ background: "#FFF5F5", border: "1px solid #FFD0D0", borderRadius: "12px", padding: "0.9rem 1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>⚠️</span>
              <p style={{ color: "#C53030", fontSize: "0.85rem", margin: 0 }}>{error}</p>
            </div>
          )}

          {/* ── Google Button (lib/auth.ts → Google provider) ─────────────── */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              padding: "0.9rem 1.5rem",
              background: isGoogleLoading ? "#F5F5F5" : "white",
              border: "2px solid #D0EDD8", borderRadius: "14px",
              cursor: isGoogleLoading ? "not-allowed" : "pointer",
              fontSize: "0.95rem", fontWeight: 700, color: "#1A2E22",
              transition: "all 0.25s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              if (!isGoogleLoading) {
                e.currentTarget.style.borderColor = "#2D6A4F";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,106,79,0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#D0EDD8";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isGoogleLoading ? (
              <>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #D0EDD8", borderTopColor: "#2D6A4F", animation: "spin 0.7s linear infinite" }} />
                <span style={{ color: "#4A6355" }}>Signing in with Google...</span>
              </>
            ) : (
              <>
                {/* Google SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#E8F5E9" }} />
            <span style={{ fontSize: "0.78rem", color: "#8FAF9A", fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: "1px", background: "#E8F5E9" }} />
          </div>

          {/* ── Email + Password (lib/auth.ts → Credentials provider) ─────── */}
          <form onSubmit={handleEmailSignIn} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1B4332", display: "block", marginBottom: "0.4rem" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none" }}>✉️</span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  style={{
                    width: "100%", padding: "0.8rem 0.9rem 0.8rem 2.6rem",
                    border: "2px solid #D0EDD8", borderRadius: "12px",
                    fontSize: "0.9rem", color: "#1A2E22", background: "white",
                    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D0EDD8")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label htmlFor="login-password" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1B4332" }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "0.78rem", color: "#2D6A4F", textDecoration: "none", fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none" }}>🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%", padding: "0.8rem 2.8rem 0.8rem 2.6rem",
                    border: "2px solid #D0EDD8", borderRadius: "12px",
                    fontSize: "0.9rem", color: "#1A2E22", background: "white",
                    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D0EDD8")}
                />
                {/* Show/Hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "#8FAF9A" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="email-signin-btn"
              type="submit"
              disabled={isEmailLoading}
              style={{
                width: "100%", padding: "0.9rem",
                background: isEmailLoading ? "#52B788" : "linear-gradient(135deg, #2D6A4F, #52B788)",
                color: "white", border: "none", borderRadius: "14px",
                fontWeight: 700, fontSize: "0.95rem",
                cursor: isEmailLoading ? "not-allowed" : "pointer",
                boxShadow: "0 6px 24px rgba(45,106,79,0.3)",
                transition: "all 0.25s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isEmailLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(45,106,79,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(45,106,79,0.3)";
              }}
            >
              {isEmailLoading ? (
                <>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", animation: "spin 0.7s linear infinite" }} />
                  Signing in...
                </>
              ) : "Sign In 🌿"}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#4A6355", marginTop: "1.5rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" id="goto-register" style={{ color: "#2D6A4F", fontWeight: 700, textDecoration: "none" }}>
              Create Account →
            </Link>
          </p>

          {/* Farmer CTA */}
          <div style={{ marginTop: "1.25rem", padding: "1rem", background: "linear-gradient(135deg, #F0FBF1, #D8F3DC)", borderRadius: "14px", border: "1px solid #D0EDD8", textAlign: "center" }}>
            <p style={{ fontSize: "0.82rem", color: "#1B4332", margin: "0 0 0.5rem", fontWeight: 600 }}>🌾 Are you a farmer?</p>
            <Link href="/register?role=farmer" id="farmer-register-link" style={{ fontSize: "0.82rem", color: "#2D6A4F", fontWeight: 700, textDecoration: "none" }}>
              Join as a Farmer →
            </Link>
          </div>
        </div>

        {/* Terms + Back */}
        <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#8FAF9A", textAlign: "center", maxWidth: "360px" }}>
          By signing in, you agree to our{" "}
          <Link href="#" style={{ color: "#2D6A4F", textDecoration: "none" }}>Terms of Service</Link> and{" "}
          <Link href="#" style={{ color: "#2D6A4F", textDecoration: "none" }}>Privacy Policy</Link>
        </p>
        <Link href="/" id="back-to-home" style={{ marginTop: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", color: "#4A6355", textDecoration: "none", fontWeight: 500 }}>
          ← Back to FreshDirect
        </Link>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(5deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 900px) {
          #brand-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
