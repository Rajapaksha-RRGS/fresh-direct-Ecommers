const OLD_WAY_ITEMS = [
  "Farmer → Collector → Wholesale → Distributor → Supermarket → You",
  "5–7 days old produce by the time it reaches you",
  "Pesticides & wax coatings to extend shelf life",
  "Farmer earns only 20% of what you pay",
];

const FRESH_DIRECT_ITEMS = [
  "Farmer → You (Direct!). Two steps, maximum freshness.",
  "Harvested today, delivered to your door within 24 hours",
  "100% chemical-free, naturally grown produce",
  "Farmer earns up to 80% of what you pay — fair & transparent",
];

export default function ProblemSolution() {
  return (
    <section id="problem-solution" className="py-16 lg:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-12 lg:mb-24">
          <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#2D6A4F]">
            The Problem
          </span>
          <h2
            className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.8rem)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Your Supermarket Produce Traveled{" "}
            <br className="hidden sm:block" />
            Further Than You Did Last Month
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-stretch">
          {/* Old Way */}
          <div className="bg-[#FFF5F5] border-2 border-[#FFD0D0] rounded-[24px] p-8 lg:p-12">
            <h3 className="font-extrabold text-[#C53030] text-[1.1rem] mb-8 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FED7D7] flex items-center justify-center text-sm flex-shrink-0">
                ❌
              </span>
              Traditional Supermarket
            </h3>
            <div className="space-y-4">
              {OLD_WAY_ITEMS.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <span className="text-[#FC8181] flex-shrink-0 mt-1 text-[0.9rem]">
                    ✗
                  </span>
                  <p className="text-[0.9rem] text-[#744210] m-0 leading-[1.7]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* VS divider */}
          <div className="flex md:flex-col items-center gap-2 justify-center py-4 md:py-0">
            <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-[#D0EDD8] to-transparent" />
            <div className="md:hidden h-px w-16 bg-gradient-to-r from-transparent via-[#D0EDD8] to-transparent" />
            <span
              className="font-extrabold text-[1.1rem] text-[#8FAF9A] px-4 py-2.5 border-2 border-[#D0EDD8] rounded-full bg-white whitespace-nowrap"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              VS
            </span>
            <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-[#D0EDD8] to-transparent" />
            <div className="md:hidden h-px w-16 bg-gradient-to-r from-transparent via-[#D0EDD8] to-transparent" />
          </div>

          {/* Fresh Direct Way */}
          <div className="bg-[#F0FBF1] border-2 border-[#D0EDD8] rounded-[24px] p-8 lg:p-12">
            <h3 className="font-extrabold text-[#2D6A4F] text-[1.1rem] mb-8 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#D8F3DC] flex items-center justify-center text-sm flex-shrink-0">
                ✅
              </span>
              Fresh Direct Way
            </h3>
            <div className="space-y-4">
              {FRESH_DIRECT_ITEMS.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <span className="text-[#2D6A4F] flex-shrink-0 mt-1 text-[0.9rem]">
                    ✓
                  </span>
                  <p className="text-[0.9rem] text-[#4A6355] m-0 leading-[1.7]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
