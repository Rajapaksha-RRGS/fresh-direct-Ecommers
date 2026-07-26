"use client";    
import Link from "next/link";
import { useState } from "react";
import UserMenu from "@/components/layout/UserMenu";


interface NavbarProps {
  showSearch?: boolean;
  searchTerm?: string;
  onSearch?: (value: string) => void;
  scrolled?: boolean;
}

export default function Navbar({
  showSearch = false,
  searchTerm = "",
  onSearch,
  scrolled = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/marketplace", label: "Shop" },
    { href: "/farmers", label: "Farmers" },
    
    { href: "/AboutPage", label: "About" },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 h-16 left-0 right-0 z-[1000] transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-white/[0.97] backdrop-blur-xl shadow-[0_2px_20px_rgba(45,106,79,0.10)] py-3"
          : " py-4"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 w-full h-full flex items-center justify-between">
        {/* ── Logo ── */}
        <Link href="/" className="no-underline flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2D6A4F] to-[#52B788] rounded-xl flex items-center justify-center text-xl shadow-[0_4px_12px_rgba(45,106,79,0.25)] group-hover:shadow-[0_6px_20px_rgba(45,106,79,0.35)] transition-shadow duration-300">
            🌿
          </div>
          <span
            className="text-[1.4rem] font-bold text-[#2D6A4F]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Fresh<span className="text-[#FFB703]">Direct</span>
          </span>
        </Link>

        {/* ── Search Bar (Logo එක සහ Nav Links අතරට) ── */}
        {showSearch && (
          <div className="hidden sm:flex flex-1 max-w-xs md:max-w-sm mx-4 relative items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full bg-[#F0FBF1] border border-[#D0EDD8] rounded-full py-2 px-4 text-sm text-[#1A2E22] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
            />
          </div>
        )}

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`no-underline font-medium text-[0.92rem] tracking-[0.01em] transition-colors duration-200 relative group hover:text-[#2D6A4F] ${
                scrolled ? "text-[#1A2E22]" : "text-[#1B4332]"
              }`}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#2D6A4F] rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* ── Right side: UserMenu + Shop CTA + Hamburger ── */}
        <div className="flex items-center gap-3">
          {/* Dynamic auth widget (desktop) */}
          <div className="hidden sm:flex items-center">
            <UserMenu />
          </div>

          {/* Shop Fresh CTA — always visible on desktop */}
          <Link
            href="/marketplace"
            id="nav-shop-cta"
            className="no-underline bg-[#09790a] text-white font-bold text-[0.88rem] px-5 py-2.5 rounded-full shadow-[0_4px_14px_rgba(9,121,10,0.30)] hover:bg-[#1A3020] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(9,121,10,0.35)] transition-all duration-200 hidden sm:inline-flex items-center gap-1.5"
          >
            Shop Fresh 🛒
          </Link>

          {/* Hamburger (mobile) */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-[6px] items-center justify-center w-11 h-11 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0FBF1] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-6 h-[2.5px] bg-[#2D6A4F] rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
            <span className={`block w-6 h-[2.5px] bg-[#2D6A4F] rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-[2.5px] bg-[#2D6A4F] rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}