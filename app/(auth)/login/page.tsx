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
    <div className="h-screen flex bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7] relative overflow-hidden">
      {/* ── Decorative background shapes ──────────────────────────────────── */}
      <div className="absolute -top-[120px] -right-[120px] w-[500px] h-[500px] rounded-full bg-[rgba(45,106,79,0.07)] pointer-events-none" />
      <div className="absolute -bottom-[80px] -left-[80px] w-[350px] h-[350px] rounded-full bg-[rgba(255,183,3,0.08)] pointer-events-none" />

      {/* Floating leaves */}
      {["🌿", "🍃", "🌱", "🍂"].map((leaf, i) => (
        <span
          key={i}
          className="absolute select-none pointer-events-none animate-float-leaf"
          style={{
            fontSize: `${1.2 + i * 0.4}rem`,
            opacity: 0.18,
            top: `${10 + i * 20}%`,
            left: `${3 + i * 3}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {leaf}
        </span>
      ))}

      {/* ── Left Brand Panel (desktop only) ───────────────────────────────── */}
      <div
        id="brand-panel"
        className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#52B788] relative overflow-hidden"
      >
        <div className="absolute -top-[60px] -right-[60px] w-[280px] h-[280px] rounded-full bg-[rgba(255,183,3,0.12)] pointer-events-none" />
        <div className="absolute bottom-[5%] -left-[40px] w-[200px] h-[200px] rounded-full bg-[rgba(255,255,255,0.05)] pointer-events-none" />

        {/* Logo */}
        <div className="text-center mb-12 relative z-[1]">
          <div className="w-[72px] h-[72px] bg-white/15 rounded-[20px] flex items-center justify-center text-[2.2rem] mx-auto mb-4 border border-white/20">
            🌿
          </div>
          <h1
            className="text-[2.2rem] font-extrabold text-white m-0 mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Fresh<span className="text-[#FFB703]">Direct</span>
          </h1>
          <p className="text-white/70 text-[0.9rem] m-0">
            Farm-to-Table Marketplace
          </p>
        </div>

        {/* Value props */}
        <div className="flex flex-col gap-5 relative z-[1] max-w-[320px] w-full">
          {[
            {
              icon: "⚡",
              title: "Harvested Today",
              desc: "Fresh produce delivered within 24 hours",
            },
            {
              icon: "👨‍🌾",
              title: "500+ Verified Farmers",
              desc: "Direct from local Sri Lankan farms",
            },
            {
              icon: "🌿",
              title: "Chemical-Free Guarantee",
              desc: "100% natural, organic certified produce",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-xl bg-white/12 flex items-center justify-center text-[1.3rem] flex-shrink-0 border border-white/15">
                {item.icon}
              </div>
              <div>
                <p className="text-white font-bold text-[0.95rem] m-0 mb-px">
                  {item.title}
                </p>
                <p className="text-white/60 text-[0.82rem] m-0 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
      </div>

      {/* ── Right Panel — Login Form ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-4 overflow-y-auto min-h-0">
        {/* Card */}
        <div className="w-full max-w-[420px] max-h-[88vh] overflow-y-auto bg-white/92 backdrop-blur-[20px] rounded-[28px] p-8 shadow-[0_20px_60px_rgba(45,106,79,0.15),0_4px_20px_rgba(45,106,79,0.08)] border border-[rgba(208,237,216,0.6)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#2D6A4F] to-[#52B788] rounded-2xl flex items-center justify-center text-[1.6rem] mx-auto mb-5 shadow-[0_8px_24px_rgba(45,106,79,0.3)]">
              🌿
            </div>
            <h2
              className="text-[1.75rem] font-extrabold text-[#1B4332] m-0 mb-1.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Welcome Back
            </h2>
            <p className="text-[#4A6355] text-[0.9rem] m-0 leading-relaxed">
              Sign in to access fresh produce & connect
              <br />
              with local farmers
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-[#FFF5F5] border border-[#FFD0D0] rounded-xl p-3.5 mb-5 flex items-center gap-2">
              <span>⚠️</span>
              <p className="text-[#C53030] text-[0.85rem] m-0">{error}</p>
            </div>
          )}

          {/* ── Google Button (lib/auth.ts → Google provider) ─────────────── */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-[#D0EDD8] rounded-2xl text-[0.95rem] font-bold text-[#1A2E22] transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
              isGoogleLoading
                ? "bg-[#F5F5F5] cursor-not-allowed"
                : "bg-white cursor-pointer hover:border-[#2D6A4F] hover:shadow-[0_4px_16px_rgba(45,106,79,0.15)] hover:-translate-y-px"
            }`}
          >
            {isGoogleLoading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-[#D0EDD8] border-t-[#2D6A4F] animate-spin-slow" />
                <span className="text-[#4A6355]">
                  Signing in with Google...
                </span>
              </>
            ) : (
              <>
                {/* Google SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#E8F5E9]" />
            <span className="text-[0.78rem] text-[#8FAF9A] font-medium">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-[#E8F5E9]" />
          </div>

          {/* ── Email + Password (lib/auth.ts → Credentials provider) ─────── */}
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="text-[0.82rem] font-semibold text-[#1B4332] block mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                  ✉️
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3.5 py-3 border-2 border-[#D0EDD8] rounded-xl text-[0.9rem] text-[#1A2E22] bg-white outline-none transition-colors duration-200 focus:border-[#2D6A4F]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="login-password"
                  className="text-[0.82rem] font-semibold text-[#1B4332]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[0.78rem] text-[#2D6A4F] no-underline font-semibold hover:text-[#1B4332]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                  🔒
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-3 border-2 border-[#D0EDD8] rounded-xl text-[0.9rem] text-[#1A2E22] bg-white outline-none transition-colors duration-200 focus:border-[#2D6A4F]"
                />
                {/* Show/Hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[0.85rem] text-[#8FAF9A] hover:text-[#4A6355]"
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
              className={`w-full py-3.5 text-white border-none rounded-2xl font-bold text-[0.95rem] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(45,106,79,0.3)] ${
                isEmailLoading
                  ? "bg-[#52B788] cursor-not-allowed"
                  : "bg-gradient-to-br from-[#2D6A4F] to-[#52B788] cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(45,106,79,0.4)]"
              }`}
            >
              {isEmailLoading ? (
                <>
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-white/40 border-t-white animate-spin-slow" />
                  Signing in...
                </>
              ) : (
                "Sign In 🌿"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[0.85rem] text-[#4A6355] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              id="goto-register"
              className="text-[#2D6A4F] font-bold no-underline hover:text-[#1B4332]"
            >
              Create Account →
            </Link>
          </p>

          {/* Farmer CTA */}
          <div className="mt-5 p-4 bg-gradient-to-br from-[#F0FBF1] to-[#D8F3DC] rounded-2xl border border-[#D0EDD8] text-center">
            <p className="text-[0.82rem] text-[#1B4332] m-0 mb-2 font-semibold">
              🌾 Are you a farmer?
            </p>
            <Link
              href="/register/farmer?role=farmer"
              id="farmer-register-link"
              className="text-[0.82rem] text-[#2D6A4F] font-bold no-underline hover:text-[#1B4332]"
            >
              Join as a Farmer →
            </Link>
          </div>
          {/* Terms + Back — inside card so they scroll with it */}
          <p className="mt-5 text-[0.72rem] text-[#8FAF9A] text-center leading-relaxed">
            By signing in, you agree to our{" "}
            <Link
              href="#"
              className="text-[#2D6A4F] no-underline hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-[#2D6A4F] no-underline hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
          <div className="flex justify-center mt-3">
            <Link
              href="/"
              id="back-to-home"
              className="inline-flex items-center gap-1.5 text-[0.82rem] text-[#4A6355] no-underline font-medium hover:text-[#1B4332] transition-colors"
            >
              ← Back to FreshDirect
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
