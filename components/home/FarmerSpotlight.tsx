import Link from "next/link";
import { FEATURED_FARMER } from "./data";

export default function FarmerSpotlight() {
  return (
    <section
      id="farmer-spotlight"
      className="py-8 lg:py-10 px-5 bg-gradient-to-b from-[#D8F3DC] to-[#E8F5E9]"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-2 lg:mb-8">
          <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#FFB703]">
            🏆 Farmer Spotlight
          </span>
          <h2
            className="font-serif font-extrabold text-[#1B4332] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.6rem)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Farmer of the Month
          </h2>
          <p className="text-[0.95rem] text-[#4A6355] leading-[1.7] mt-2">
            Meet the dedicated growers behind your food
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch bg-white rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(45,106,79,0.15)]">
          {/* Photo side */}
          <div className="relative min-h-[400px] md:min-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&h=500&fit=crop"
              alt="Farmer Nimal Perera at Green Hills Farm, Nuwara Eliya"
              className="w-full h-full object-cover absolute inset-0"
            />
            {/* Overlay badge */}
            <div className="absolute bottom-6 left-6 bg-[rgba(255,183,3,0.95)] backdrop-blur-sm rounded-2xl px-5 py-3">
              <p className="font-extrabold text-[0.85rem] text-[#1A2E22] m-0">
                🏆 Farmer of the Month
              </p>
              <p className="text-[0.75rem] text-[#1A2E22]/70 m-0 mt-0.5">
                April 2026
              </p>
            </div>
          </div>

          {/* Content side */}
          <div className="p-8 lg:p-2 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className="text-[1.8rem] font-extrabold text-[#1B4332] m-0"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {FEATURED_FARMER.farmerName}
              </h3>
              <span className="bg-[#2D6A4F] text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-[0.75rem] flex-shrink-0">
                ✓
              </span>
            </div>
            <p className="text-[#FFB703] font-bold text-[0.95rem] mb-2 mt-2">
              {FEATURED_FARMER.farmName}
            </p>
            <p className="text-[#8FAF9A] text-[0.85rem] mb-8">
              📍 {FEATURED_FARMER.location}
            </p>

            <p className="text-[#4A6355] leading-[1.85] text-[0.95rem] mb-10 m-0">
              {FEATURED_FARMER.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                {
                  val: `${FEATURED_FARMER.productCount}`,
                  label: "Products",
                },
                { val: `${FEATURED_FARMER.rating}★`, label: "Rating" },
                { val: `${FEATURED_FARMER.reviewCount}`, label: "Reviews" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center py-4 px-3 bg-[#F0FBF1] rounded-xl border border-[#D0EDD8]"
                >
                  <p
                    className="font-extrabold text-[1.3rem] text-[#2D6A4F] m-0"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {s.val}
                  </p>
                  <p className="text-[0.75rem] text-[#8FAF9A] m-0 mt-1.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="flex gap-2 flex-wrap mb-10">
              {FEATURED_FARMER.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-[0.78rem] bg-[#D8F3DC] text-[#2D6A4F] px-3.5 py-1.5 rounded-full font-semibold"
                >
                  {cert}
                </span>
              ))}
            </div>

            <Link
              href={`/farmers/${FEATURED_FARMER.id}`}
              id="view-spotlight-farmer"
              className="no-underline inline-flex items-center gap-2 bg-[#2D6A4F] text-white font-bold text-[0.95rem] px-8 py-3.5 rounded-full hover:bg-[#1B4332] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.3)] transition-all duration-200 self-start"
            >
              Visit Farm Profile →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
