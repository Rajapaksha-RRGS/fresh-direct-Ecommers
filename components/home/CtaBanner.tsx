import Link from "next/link";

export default function CtaBanner() {
  return (
    <section
      id="cta-banner"
      className="py-8 lg:py-10 px-6 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-center relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[280px] h-[280px] rounded-full bg-[#52B788]/10 pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full bg-[#FFB703]/10 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-[1] px-6">
        <h2
          className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-6 leading-[1.2]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Ready to Taste the Difference?
        </h2>
        <p className="text-white/75 text-[1.05rem] mb-12 leading-[1.75]">
          Join 10,000+ Sri Lankan families already enjoying farm-fresh
          produce.
          <br />
          Your first box ships free!
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            id="final-register-cta"
            className="no-underline bg-[#FFB703] text-[#1A2E22] font-extrabold text-[1.05rem] px-10 py-4 rounded-full shadow-[0_8px_30px_rgba(255,183,3,0.35)] hover:bg-[#E09F00] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,183,3,0.45)] transition-all duration-200"
          >
            Get Started Free 🚀
          </Link>
          <Link
            href="/products"
            id="final-browse-cta"
            className="no-underline bg-transparent text-white font-bold text-[1.05rem] px-10 py-4 rounded-full border-2 border-white/40 hover:bg-white/10 hover:border-white/60 transition-all duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}
