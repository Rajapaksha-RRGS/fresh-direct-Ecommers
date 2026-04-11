"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Farmers", href: "/farmers" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 h-16 left-0 right-0 z-1000 transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-white/[0.97] backdrop-blur-xl shadow-[0_2px_20px_rgba(45,106,79,0.10)] py-3"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container-wide h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="no-underline flex items-center gap-2.5 group"
          >
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

          {/* Desktop Nav */}
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

          {/* CTA Buttons + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="no-underline text-[#2D6A4F] font-semibold text-[0.95rem] px-7 py-3.5 rounded-lg hover:bg-[#F0FBF1] hover:text-[#1B4332] transition-all duration-200 hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/products"
              id="nav-shop-cta"
              className="no-underline bg-[#09790a] text-[#1A2E22] font-bold text-[0.95rem] px-11 py-4 rounded-full shadow-[0_8px_30px_rgba(255,183,3,0.35)] hover:bg-[#E09F00] hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(255,183,3,0.45)] transition-all duration-200 hidden sm:inline-block"
            >
              Shop Fresh 🛒
            </Link>

            {/* Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-[6px] items-center justify-center w-11 h-11 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0FBF1] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <span
                className={`block w-6 h-[2.5px] bg-[#2D6A4F] rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`}
              />
              <span
                className={`block w-6 h-[2.5px] bg-[#2D6A4F] rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block w-6 h-[2.5px] bg-[#2D6A4F] rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[999] transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[1001] transition-transform duration-300 ease-in-out shadow-[-8px_0_30px_rgba(0,0,0,0.1)] md:hidden flex flex-col ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#D0EDD8]">
          <span
            className="text-[1.2rem] font-bold text-[#2D6A4F]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Fresh<span className="text-[#FFB703]">Direct</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F0FBF1] border-none flex items-center justify-center cursor-pointer text-[#2D6A4F] font-bold text-lg hover:bg-[#D8F3DC] transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="no-underline text-[#1A2E22] font-medium text-[1rem] px-4 py-3 rounded-xl hover:bg-[#F0FBF1] hover:text-[#2D6A4F] transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-[#D0EDD8] flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="no-underline text-center text-[#2D6A4F] font-semibold text-[0.95rem] py-3 rounded-xl border-2 border-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="no-underline text-center bg-[#FFB703] text-[#1A2E22] font-bold text-[0.95rem] py-3 rounded-xl shadow-[0_8px_30px_rgba(255,183,3,0.35)] hover:bg-[#E09F00] transition-all duration-200"
          >
            Shop Fresh 🛒
          </Link>
        </div>
      </div>
    </>
  );
}
