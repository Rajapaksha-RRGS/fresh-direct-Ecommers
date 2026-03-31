"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(45,106,79,0.10)" : "none",
        padding: scrolled ? "0.75rem 0" : "1.25rem 0",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #2D6A4F, #52B788)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem",
          }}>
            🌿
          </div>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 700, color: "var(--color-forest)" }}>
            Fresh<span style={{ color: "var(--color-golden)" }}>Direct</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="hidden-mobile">
          {[
            { label: "Shop", href: "/products" },
            { label: "Farmers", href: "/farmers" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "About", href: "#about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: scrolled ? "var(--color-text-dark)" : "var(--color-forest-dark)",
                fontWeight: 500,
                fontSize: "0.95rem",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-forest)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? "var(--color-text-dark)" : "var(--color-forest-dark)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              color: "var(--color-forest)",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "0.5rem 1rem",
            }}
          >
            Sign In
          </Link>
          <Link
            href="/products"
            id="nav-shop-cta"
            style={{
              textDecoration: "none",
              backgroundColor: "var(--color-golden)",
              color: "#1A2E22",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "50px",
              boxShadow: "var(--shadow-cta)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-golden-dark)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-golden)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Shop Fresh 🛒
          </Link>
        </div>
      </div>
    </nav>
  );
}
