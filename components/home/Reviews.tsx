import { REVIEWS } from "./data";

export default function Reviews() {
  return (
    <section id="reviews" className="py-12 lg:py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-12 lg:mb-16">
          <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#2D6A4F]">
            Social Proof
          </span>
          <h2
            className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.6rem)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            10,000+ Families Choose Fresh Direct
          </h2>
          <div className="flex justify-center gap-1 mt-4 text-[1.3rem]">
            {"⭐⭐⭐⭐⭐"}
          </div>
          <p className="text-[#8FAF9A] text-[0.88rem] mt-3">
            4.9 / 5 average from 3,200+ reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              id={`review-${review.id}`}
              className="bg-[#FAFFF8] rounded-[24px] p-8 border border-[#D0EDD8] flex flex-col gap-5 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(45,106,79,0.12)]"
            >
              {/* Quote mark */}
              <span
                className="absolute top-5 right-6 text-[4rem] text-[#D0EDD8] leading-none select-none pointer-events-none"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="text-base">{"⭐".repeat(review.rating)}</div>

              {/* Review text */}
              <p className="text-[0.92rem] text-[#4A6355] leading-[1.75] m-0 relative z-[1]">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Product reference */}
              <div className="bg-[#D8F3DC] rounded-xl px-4 py-2.5">
                <p className="text-[0.78rem] text-[#2D6A4F] font-semibold m-0">
                  🌿 {review.product}
                </p>
              </div>

              {/* Reviewer */}
              <div className="flex items-center gap-3.5 mt-auto">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-[44px] h-[44px] rounded-full object-cover border-[3px] border-[#D8F3DC]"
                />
                <div>
                  <p className="font-bold text-[0.88rem] text-[#1A2E22] m-0">
                    {review.name}
                  </p>
                  <p className="text-[0.78rem] text-[#8FAF9A] m-0 mt-0.5">
                    📍 {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
