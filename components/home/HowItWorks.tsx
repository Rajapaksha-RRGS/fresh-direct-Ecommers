import { STEPS } from "./data";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 lg:py-20 px-6 bg-[#FAFFF8]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-12 lg:mb-16">
          <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#FFB703]">
            Simple Process
          </span>
          <h2
            className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.6rem)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            From Field to Fork in 3 Simple Steps
          </h2>
          <p className="text-[0.95rem] text-[#4A6355] leading-[1.7] mt-4 max-w-[520px] mx-auto">
            We&apos;ve made it effortless to get the freshest produce
            straight from the farm to your kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-[2px] bg-gradient-to-r from-[#D0EDD8] via-[#52B788] to-[#D0EDD8] z-0 opacity-60" />

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              id={`step-${i + 1}`}
              className="bg-white rounded-3xl p-8 lg:p-10 text-center shadow-[0_4px_24px_rgba(45,106,79,0.06)] border border-[#D0EDD8] relative z-[1] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(45,106,79,0.14)]"
            >
              {/* Step icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#52B788] text-white font-extrabold text-[1.1rem] mb-6 relative shadow-[0_6px_20px_rgba(45,106,79,0.25)]">
                <span className="text-[1.8rem]">{step.icon}</span>
                <span className="absolute -top-2 -right-2 bg-[#FFB703] text-[#1A2E22] text-[0.65rem] font-extrabold w-[24px] h-[24px] rounded-full flex items-center justify-center shadow-sm">
                  {step.num}
                </span>
              </div>
              <h3
                className="text-[1.25rem] font-bold text-[#1A2E22] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {step.title}
              </h3>
              <p className="text-[0.9rem] text-[#4A6355] leading-[1.75] m-0">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
