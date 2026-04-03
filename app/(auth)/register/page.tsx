"use client";

// ─── Register Page — Customer & Farmer registration ───────────────────────────
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "farmer" ? "FARMER" : "CUSTOMER";

  const [role, setRole] = useState<"CUSTOMER" | "FARMER">(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created! Signing you in\u2026");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setSuccess("");
        setError("Account created but sign-in failed. Please go to login.");
        return;
      }

      window.location.href = role === "FARMER" ? "/farmer/dashboard" : "/products";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex relative bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7]">
      <div className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full bg-[rgba(45,106,79,0.07)]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[rgba(255,183,3,0.08)]" />

      {(["🌿", "🍃", "🌱", "🍂"] as const).map((leaf, i) => (
        <span key={i} className="pointer-events-none absolute select-none opacity-20"
          style={{ fontSize: `${1.2 + i * 0.4}rem`, top: `${10 + i * 20}%`, left: `${3 + i * 3}%`,
            animation: `floatLeaf ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.7}s` }}>
          {leaf}
        </span>
      ))}

      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-12 py-8 relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#52B788]">
        <div className="pointer-events-none absolute -top-14 -right-14 w-64 h-64 rounded-full bg-[rgba(255,183,3,0.12)]" />
        <div className="text-center mb-10 relative z-10">
          <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-[20px] border border-white/20 bg-white/15 flex items-center justify-center text-[2.2rem]">🌿</div>
          <h1 className="font-serif text-[2.2rem] font-extrabold text-white leading-tight">Fresh<span className="text-[#FFB703]">Direct</span></h1>
          <p className="text-white/70 text-sm mt-1">Farm-to-Table Marketplace</p>
        </div>
        <div className="flex flex-col gap-5 relative z-10 max-w-xs w-full">
          {(role === "FARMER"
            ? [
                { icon: "🌾", title: "Sell Directly", desc: "No middlemen — keep more of your earnings" },
                { icon: "📱", title: "Easy Management", desc: "Manage products and orders from your phone" },
                { icon: "💳", title: "Fast Payments", desc: "Get paid directly via LANKAQR or bank transfer" },
              ]
            : [
                { icon: "⚡", title: "Harvested Today", desc: "Fresh produce delivered within 24 hours" },
                { icon: "👨‍🌾", title: "500+ Verified Farmers", desc: "Direct from local Sri Lankan farms" },
                { icon: "🌿", title: "Chemical-Free Guarantee", desc: "100% natural, organic certified produce" },
              ]
          ).map((item) => (
            <div key={item.title} className="flex gap-4 items-start">
              <div className="w-11 h-11 shrink-0 rounded-[12px] border border-white/15 bg-white/12 flex items-center justify-center text-[1.3rem]">{item.icon}</div>
              <div>
                <p className="text-white font-bold text-[0.95rem]">{item.title}</p>
                <p className="text-white/60 text-[0.82rem] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 overflow-y-auto">
        <div className="mb-4 text-center lg:hidden">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(45,106,79,0.12)] border border-[#D0EDD8]">
            <span className="text-[1.4rem]">🌿</span>
            <span className="font-serif text-[1.3rem] font-extrabold text-[#2D6A4F]">Fresh<span className="text-[#FFB703]">Direct</span></span>
          </div>
        </div>

        <div className="w-full max-w-[440px] bg-white/92 backdrop-blur-xl rounded-[28px] p-7 shadow-[0_20px_60px_rgba(45,106,79,0.15),0_4px_20px_rgba(45,106,79,0.08)] border border-[rgba(208,237,216,0.6)]">
          <div className="text-center mb-5">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-[1.5rem] bg-gradient-to-br from-[#2D6A4F] to-[#52B788] shadow-[0_8px_24px_rgba(45,106,79,0.3)]">🌱</div>
            <h2 className="font-serif text-[1.6rem] font-extrabold text-[#1B4332] leading-tight">Create Account</h2>
            <p className="text-[#4A6355] text-[0.85rem] mt-1">Join the Fresh Direct community</p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-2 p-1 rounded-xl bg-[#F0FBF1] border border-[#D0EDD8] mb-5">
            {(["CUSTOMER", "FARMER"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-[0.85rem] font-bold transition-all duration-200 ${role === r ? "bg-[#2D6A4F] text-white shadow-[0_4px_12px_rgba(45,106,79,0.3)]" : "text-[#4A6355] hover:text-[#2D6A4F]"}`}>
                {r === "CUSTOMER" ? "🛒 Customer" : "🌾 Farmer"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <span>⚠️</span><p className="text-red-600 text-[0.82rem]">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
              <span>✅</span><p className="text-green-700 text-[0.82rem]">{success}</p>
            </div>
          )}

          {/* Google */}
          <button type="button" onClick={handleGoogleSignIn} disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-[0.8rem] px-6 bg-white border-2 border-[#D0EDD8] rounded-[14px] text-[0.9rem] font-bold text-[#1A2E22] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all hover:border-[#2D6A4F] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed">
            {isGoogleLoading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-[#D0EDD8] border-t-[#2D6A4F] animate-spin" /><span className="text-[#4A6355]">Connecting…</span></>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-[#E8F5E9]" />
            <span className="text-[0.75rem] text-[#8FAF9A] font-medium">or fill in your details</span>
            <div className="flex-1 h-px bg-[#E8F5E9]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Name */}
            <div>
              <label className="block text-[0.8rem] font-semibold text-[#1B4332] mb-1">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">👤</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required
                  className="w-full pl-10 pr-4 py-[0.72rem] border-2 border-[#D0EDD8] rounded-xl text-[0.88rem] text-[#1A2E22] bg-white outline-none transition-colors focus:border-[#2D6A4F]" />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-[0.8rem] font-semibold text-[#1B4332] mb-1">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">✉️</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                  className="w-full pl-10 pr-4 py-[0.72rem] border-2 border-[#D0EDD8] rounded-xl text-[0.88rem] text-[#1A2E22] bg-white outline-none transition-colors focus:border-[#2D6A4F]" />
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-[0.8rem] font-semibold text-[#1B4332] mb-1">Phone Number</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">📱</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 123 4567"
                  className="w-full pl-10 pr-4 py-[0.72rem] border-2 border-[#D0EDD8] rounded-xl text-[0.88rem] text-[#1A2E22] bg-white outline-none transition-colors focus:border-[#2D6A4F]" />
              </div>
            </div>
            {/* Password */}
            <div>
              <label className="block text-[0.8rem] font-semibold text-[#1B4332] mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔒</span>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" required minLength={8}
                  className="w-full pl-10 pr-11 py-[0.72rem] border-2 border-[#D0EDD8] rounded-xl text-[0.88rem] text-[#1A2E22] bg-white outline-none transition-colors focus:border-[#2D6A4F]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.82rem] text-[#8FAF9A] bg-transparent border-none cursor-pointer">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-[0.8rem] font-semibold text-[#1B4332] mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔒</span>
                <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password" required
                  className="w-full pl-10 pr-4 py-[0.72rem] border-2 border-[#D0EDD8] rounded-xl text-[0.88rem] text-[#1A2E22] bg-white outline-none transition-colors focus:border-[#2D6A4F]" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-[0.8rem] flex items-center justify-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#52B788] text-white font-bold text-[0.92rem] rounded-[14px] border-none shadow-[0_6px_24px_rgba(45,106,79,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(45,106,79,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 mt-1">
              {isSubmitting ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />Creating account…</>
              ) : `Create ${role === "FARMER" ? "Farmer " : ""}Account 🌿`}
            </button>
          </form>

          <p className="text-center text-[0.82rem] text-[#4A6355] mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2D6A4F] font-bold hover:underline">Sign In →</Link>
          </p>
        </div>

        <p className="mt-4 text-[0.72rem] text-[#8FAF9A] text-center max-w-[360px]">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-[#2D6A4F] hover:underline">Terms of Service</Link>{" "}and{" "}
          <Link href="#" className="text-[#2D6A4F] hover:underline">Privacy Policy</Link>
        </p>
        <Link href="/" className="mt-2 inline-flex items-center gap-1 text-[0.8rem] text-[#4A6355] font-medium hover:text-[#2D6A4F] transition-colors">
          ← Back to FreshDirect
        </Link>
      </div>

      <style>{`
        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-14px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
