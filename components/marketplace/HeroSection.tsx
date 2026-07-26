import Link from "next/link";
import Image from "next/image"; // Next.js Image component එක

export default function HeroSection() {
  return (
    <section className="hero-fullscreen bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7] flex items-center py-8 lg:py-12 px-6 relative overflow-hidden">
      {/* Background Decorative Blur Circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#52B788]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto w-full">
        {/* Left Side: Text & Actions */}
        <div className="lg:col-span-7">
          {/* Top Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#B7E4C7] shadow-sm mb-6">
            <span className="text-lg">🌱</span>
            <span className="text-xs md:text-sm font-semibold text-[#2D6A4F] tracking-wide uppercase">
              Directly From Local Sri Lankan Farmers
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1B4332] leading-tight mb-4">
            Fresh, Chemical-Free Produce <br className="hidden sm:inline" />
            <span className="text-[#2D6A4F]">Delivered To Your Doorstep.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
            Support local farming communities while enjoying 100% farm-fresh, organic vegetables, fruits, and grains at fair prices.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#products-section"
                className="no-underline bg-[#2D6A4F] text-white font-semibold text-sm md:text-base px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(45,106,79,0.30)] hover:bg-[#1B4332] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                Explore Products 🛒
              </Link>
            <Link
              href="/farmers"
              className="no-underline bg-white/90 text-[#2D6A4F] font-semibold text-sm md:text-base px-6 py-3 rounded-full border border-[#B7E4C7] hover:bg-[#F0FBF1] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              Meet Our Farmers 🧑‍🌾
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Image (Picture) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white/80">
            {/* 💡 public/images/hero-basket.jpg වගේ photo එකක path එක මෙතනට දෙන්න */}
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Fresh Organic Vegetables Basket"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}