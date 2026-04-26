import { STATS } from "./data";

export default function TrustBar() {
  return (
    <section
      id="trust-bar"
      className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] py-8 lg:py-10 px-6 relative overflow-hidden"
    >
      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-[1]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="group">
              <div className="text-[2.5rem] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                {s.icon}
              </div>
              <div
                className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-[#FFB703] leading-none"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {s.value}
              </div>
              <div className="text-[0.9rem] text-white/70 mt-2 font-medium tracking-[0.02em]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
