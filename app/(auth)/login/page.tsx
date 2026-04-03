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

  // ─── Google OAuth ──────────────────────────────────────────────────────────
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

  // ─── Email / Password ──────────────────────────────────────────────────────
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
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsEmailLoading(false);
        return;
      }

      window.location.href = "/products";
    } catch {
      setError("Sign-in failed. Please try again.");
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex relative bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7]">

      {/* ── Decorative blobs ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full bg-[rgba(45,106,79,0.07)]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[rgba(255,183,3,0.08)]" />

      {/* Floating leaves */}
      {(["🌿", "🍃", "🌱", "🍂"] as const).map((leaf, i) => (
        <span
          key={i}
          className="pointer-events-none absolute select-none opacity-20"
          style={{
            fontSize: `${1.2 + i * 0.4}rem`,
            top: `${10 + i * 20}%`,
            left: `${3 + i * 3}%`,
            animation: `floatLeaf ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {leaf}
        </span>
      ))}

      {/* ── Left Brand Panel (lg+) ─────────────────────────────────────────── */}
      <div
        id="brand-panel"
        className="hidden lg:flex flex-1 flex-col justify-center items-center px-12 py-8 relative overflow-hidden
                   bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#52B788]"
      >
        {/* inner blobs */}
        <div className="pointer-events-none absolute -top-14 -right-14 w-64 h-64 rounded-full bg-[rgba(255,183,3,0.12)]" />
        <div className="pointer-events-none absolute bottom-[5%] -left-10 w-48 h-48 rounded-full bg-[rgba(255,255,255,0.05)]" />

        {/* Logo */}
        <div className="text-center mb-10 relative z-10">
          <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-[20px] border border-white/20
                          bg-white/15 flex items-center justify-center text-[2.2rem]">
            🌿
          </div>
          <h1 className="font-serif text-[2.2rem] font-extrabold text-white leading-tight">
            Fresh<span className="text-[#FFB703]">Direct</span>
          </h1>
          <p className="text-white/70 text-sm mt-1">Farm-to-Table Marketplace</p>
        </div>

        {/* Value props */}
        <div className="flex flex-col gap-5 relative z-10 max-w-xs w-full">
          {[
            { icon: "⚡", title: "Harvested Today", desc: "Fresh produce delivered within 24 hours" },
            { icon: "👨‍🌾", title: "500+ Verified Farmers", desc: "Direct from local Sri Lankan farms" },
            { icon: "🌿", title: "Chemical-Free Guarantee", desc: "100% natural, organic certified produce" },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 items-start">
              <div className="w-11 h-11 shrink-0 rounded-[12px] border border-white/15
                              bg-white/12 flex items-center justify-center text-[1.3rem]">
                {item.icon}
              </div>
              <div>
                <p className="text-white font-bold text-[0.95rem]">{item.title}</p>
                <p className="text-white/60 text-[0.82rem] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-8 p-5 rounded-2xl border border-white/12 bg-white/08 relative z-10 max-w-xs w-full">
          <p className="text-white/85 text-[0.85rem] leading-relaxed italic mb-3">
            &ldquo;The spinach was still dewy when it arrived. I could taste the freshness!&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[rgba(255,183,3,0.3)] flex items-center justify-center text-base">
              👩
            </div>
            <div>
              <p className="text-white font-semibold text-[0.8rem]">Sachini Fernando</p>
              <p className="text-white/50 text-[0.72rem]">Colombo 7 · Verified Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-6 overflow-y-auto">

        {/* Mobile logo */}
        <div className="mb-6 text-center lg:hidden">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full
                          shadow-[0_4px_20px_rgba(45,106,79,0.12)] border border-[#D0EDD8]">
            <span className="text-[1.4rem]">🌿</span>
            <span className="font-serif text-[1.3rem] font-extrabold text-[#2D6A4F]">
              Fresh<span className="text-[#FFB703]">Direct</span>
            </span>
          </div>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-[420px] bg-white/92 backdrop-blur-xl rounded-[28px] p-8
                        shadow-[0_20px_60px_rgba(45,106,79,0.15),0_4px_20px_rgba(45,106,79,0.08)]
                        border border-[rgba(208,237,216,0.6)]">

          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-[1.6rem]
                            bg-gradient-to-br from-[#2D6A4F] to-[#52B788]
                            shadow-[0_8px_24px_rgba(45,106,79,0.3)]">
              🌿
            </div>
            <h2 className="font-serif text-[1.75rem] font-extrabold text-[#1B4332] leading-tight">
              Welcome Back
            </h2>
            <p className="text-[#4A6355] text-[0.9rem] mt-1 leading-relaxed">
              Sign in to access fresh produce &amp; connect<br />with local farmers
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl
                            bg-red-50 border border-red-200">
              <span>⚠️</span>
              <p className="text-red-600 text-[0.85rem]">{error}</p>
            </div>
          )}

          {/* Google Button */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-[0.875rem] px-6
                       bg-white border-2 border-[#D0EDD8] rounded-[14px]
                       text-[0.95rem] font-bold text-[#1A2E22]
                       shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                       transition-all duration-200 ease-out
                       hover:border-[#2D6A4F] hover:shadow-[0_4px_16px_rgba(45,106,79,0.15)] hover:-translate-y-px
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-[#D0EDD8] border-t-[#2D6A4F] animate-spin" />
                <span className="text-[#4A6355]">Signing in with Google...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#E8F5E9]" />
            <span className="text-[0.78rem] text-[#8FAF9A] font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-[#E8F5E9]" />
          </div>

          {/* Email + Password Form */}
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-[0.82rem] font-semibold text-[#1B4332] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-[0.8rem] border-2 border-[#D0EDD8] rounded-xl
                             text-[0.9rem] text-[#1A2E22] bg-white outline-none
                             transition-colors duration-200
                             focus:border-[#2D6A4F]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="text-[0.82rem] font-semibold text-[#1B4332]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[0.78rem] text-[#2D6A4F] font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-[0.8rem] border-2 border-[#D0EDD8] rounded-xl
                             text-[0.9rem] text-[#1A2E22] bg-white outline-none
                             transition-colors duration-200
                             focus:border-[#2D6A4F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.85rem] text-[#8FAF9A]
                             bg-transparent border-none cursor-pointer"
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
              className="w-full py-[0.875rem] flex items-center justify-center gap-2
                         bg-gradient-to-r from-[#2D6A4F] to-[#52B788]
                         text-white font-bold text-[0.95rem] rounded-[14px] border-none
                         shadow-[0_6px_24px_rgba(45,106,79,0.3)]
                         transition-all duration-200 ease-out
                         hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(45,106,79,0.4)]
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {isEmailLoading ? (
                <>
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : "Sign In 🌿"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-[0.85rem] text-[#4A6355] mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/register" id="goto-register" className="text-[#2D6A4F] font-bold hover:underline">
              Create Account →
            </Link>
          </p>

          {/* Farmer CTA */}
          <div className="mt-4 p-4 rounded-[14px] border border-[#D0EDD8]
                          bg-gradient-to-r from-[#F0FBF1] to-[#D8F3DC] text-center">
            <p className="text-[0.82rem] text-[#1B4332] font-semibold mb-1">🌾 Are you a farmer?</p>
            <Link href="/register?role=farmer" id="farmer-register-link"
                  className="text-[0.82rem] text-[#2D6A4F] font-bold hover:underline">
              Join as a Farmer →
            </Link>
          </div>
        </div>

        {/* Terms + Back */}
        <p className="mt-5 text-[0.75rem] text-[#8FAF9A] text-center max-w-[360px]">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-[#2D6A4F] hover:underline">Terms of Service</Link>{" "}and{" "}
          <Link href="#" className="text-[#2D6A4F] hover:underline">Privacy Policy</Link>
        </p>
        <Link href="/" id="back-to-home"
              className="mt-3 inline-flex items-center gap-1 text-[0.82rem] text-[#4A6355] font-medium hover:text-[#2D6A4F] transition-colors">
          ← Back to FreshDirect
        </Link>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-14px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
