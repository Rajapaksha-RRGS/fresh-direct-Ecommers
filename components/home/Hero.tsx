import Link from "next/link";
import { DECORATIVE_LEAVES, TRUST_SIGNALS } from "./data";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7] flex items-center py-12 lg:py-20 px-6 relative overflow-hidden"
    >
      {/* Decorative floating leaves */}
      {DECORATIVE_LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="animate-float-leaf absolute select-none pointer-events-none"
          style={{
            fontSize: `${1.5 + i * 0.5}rem`,
            opacity: 0.2,
            top: `${15 + i * 18}%`,
            right: `${5 + i * 4}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          {leaf}
        </span>
      ))}

      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(255,183,3,0.06), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text content */}
          <div className="animate-fade-in-up">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-[#D0EDD8] rounded-full px-5 py-2 mb-8 shadow-[0_4px_24px_rgba(45,106,79,0.08)]">
              <span className="animate-pulse-dot w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block" />
              <span className="text-[0.82rem] font-semibold text-[#2D6A4F] tracking-[0.01em]">
                Live Marketplace — 1,240 products fresh today
              </span>
            </div>

            <h1
              className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold leading-[1.12] text-[#1B4332] mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Harvested Today,
              <br />
              <span className="text-[#FFB703] relative">
                On Your Table
                <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-[#FFB703]/30" />
              </span>{" "}
              Tomorrow
            </h1>

            <p className="text-[1.1rem] text-[#4A6355] leading-[1.85] max-w-[500px] mb-12">
              Connect directly with{" "}
              <strong className="text-[#2D6A4F]">
                500+ verified Sri Lankan farmers
              </strong>
              . Skip the middleman — get chemical-free, garden-fresh produce
              at fair prices, delivered in 24 hours.
            </p>

            {/* CTAs */}
            <div className="flex gap-6 flex-wrap mb-12">
              <Link
                href="/products"
                id="hero-shop-cta"
                className="no-underline bg-[#FFB703] text-[#1A2E22] font-extrabold text-base px-9 py-4 rounded-full shadow-[0_8px_30px_rgba(255,183,3,0.35)] inline-flex items-center gap-2.5 hover:bg-[#E09F00] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,183,3,0.45)] transition-all duration-200 active:translate-y-0"
              >
                Shop Fresh Now 🛒
              </Link>
              <Link
                href="/farmers"
                id="hero-farmers-cta"
                className="no-underline bg-transparent text-[#2D6A4F] font-bold text-base px-8 py-4 rounded-full border-2 border-[#2D6A4F] inline-flex items-center gap-2 hover:bg-[#2D6A4F] hover:text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                Meet Our Farmers 👨‍🌾
              </Link>
            </div>

            {/* Mini trust signals */}
            <div className="flex gap-8 flex-wrap">
              {TRUST_SIGNALS.map((item) => (
                <span
                  key={item}
                  className="text-[0.85rem] text-[#4A6355] font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Hero visual card */}
          <div className="animate-fade-in-up delay-300 relative">
            <div className="rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(45,106,79,0.22)] aspect-[4/3] relative">
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&h=525&fit=crop"
                alt="Fresh vegetables from Sri Lankan farm"
                className="w-full h-full object-cover"
              />
              {/* Floating price card */}
              <div className="absolute bottom-6 left-6 bg-white/85 backdrop-blur-[16px] border border-[#D0EDD8]/50 rounded-[20px] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3.5">
                <span className="text-[2rem]">🥬</span>
                <div>
                  <p className="font-extrabold text-[0.95rem] text-[#1A2E22] m-0">
                    Baby Leeks
                  </p>
                  <p className="text-[0.75rem] text-[#8FAF9A] m-0 mt-0.5">
                    🕐 Harvested 2h ago
                  </p>
                  <p className="font-extrabold text-[1.05rem] text-[#2D6A4F] m-0 mt-1">
                    Rs. 180{" "}
                    <span className="text-[0.75rem] text-[#8FAF9A] font-normal">
                      / bunch
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Floating stats pill */}
            <div className="absolute -top-3 -right-3 bg-[#FFB703] rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_rgba(255,183,3,0.35)] text-center">
              <p
                className="font-extrabold text-2xl text-[#1A2E22] m-0"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                500+
              </p>
              <p className="text-[0.72rem] font-bold text-[#1A2E22]/80 m-0 mt-0.5">
                Verified Farmers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
