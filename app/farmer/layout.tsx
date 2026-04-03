"use client";

import Link from "next/link";
import { ReactNode } from "react";

export default function FarmerLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { href: "/farmer/dashboard", label: "Overview", icon: "📊" },
    { href: "/farmer/dashboard/products", label: "My Products", icon: "🌾" },
    { href: "/farmer/dashboard/products/new", label: "Add Product", icon: "➕" },
    { href: "/farmer/dashboard/orders", label: "Orders", icon: "📦" },
    { href: "/farmer/dashboard/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-off-white)", paddingTop: "4rem" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px", flexShrink: 0, background: "linear-gradient(180deg, #1B4332, #2D6A4F)",
        padding: "2rem 1rem", position: "sticky", top: "4rem", height: "calc(100vh - 4rem)",
        display: "flex", flexDirection: "column", gap: "0.5rem",
      }}>
        <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Farmer Dashboard
          </p>
        </div>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.7rem 1rem", borderRadius: "12px",
              textDecoration: "none", color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem", fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Link href="/products" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 1rem", textDecoration: "none", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
            ← Back to Marketplace
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
    </div>
  );
}
