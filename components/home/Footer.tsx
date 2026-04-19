import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS, SOCIAL_LINKS } from "./data";

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="bg-[#0F2B1D] mt-16 border-t border-gray-100/10 px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full py-12 lg:py-18">
        {/* ── Footer top grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.5fr_1fr_1fr_1fr] gap-x-12 gap-y-14 mb-16">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <span className="text-2xl">🌿</span>
              <span
                className="text-[1.4rem] font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Fresh<span className="text-[#FFB703]">Direct</span>
              </span>
            </div>
            <p className="text-[0.9rem] leading-[1.8] text-white/60 max-w-[300px] mb-8">
              Connecting Sri Lankan farmers directly with families who care
              about what they eat. Harvested today, on your table tomorrow.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="no-underline w-10 h-10 rounded-full bg-white/[0.07] border border-white/[0.1] flex items-center justify-center text-white/50 text-sm hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F] transition-all duration-200"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-bold text-[0.85rem] uppercase tracking-[0.12em] mb-6">
                {col.heading}
              </h4>
              <ul className="list-none flex flex-col gap-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="no-underline text-[0.88rem] text-white/50 hover:text-[#FFB703] hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter bar ──────────────────────────────────────────────── */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 md:p-12 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4
                className="text-white font-bold text-[1.15rem] mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Stay Fresh 🌱
              </h4>
              <p className="text-white/50 text-[0.88rem] m-0">
                Weekly picks, seasonal recipes, and exclusive farmer stories
                delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="bg-white/[0.08] border border-white/[0.12] text-white placeholder:text-white/30 rounded-full px-6 py-3 text-[0.88rem] outline-none focus:border-[#FFB703]/50 focus:bg-white/[0.1] transition-all duration-200 w-full md:w-[280px]"
              />
              <button
                type="button"
                className="bg-[#FFB703] text-[#1A2E22] font-bold text-[0.88rem] px-7 py-3 rounded-full whitespace-nowrap hover:bg-[#E09F00] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,183,3,0.3)] transition-all duration-200 cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer bottom bar ───────────────────────────────────────────── */}
        <div className="border-t border-white/[0.08] pt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[0.82rem] text-white/40 m-0">
            © 2026 Fresh Direct. Made with 💚 in Sri Lanka
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item}
                href="#"
                className="no-underline text-[0.82rem] text-white/40 hover:text-white/70 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
