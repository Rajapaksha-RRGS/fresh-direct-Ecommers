"use client";

import { useState } from "react";
import { Menu, Bell } from "lucide-react";

type Page = "dashboard" | "orders" | "inventory" | "payments";

interface HeaderProps {
  currentPage: Page;
  onMobileMenuOpen: () => void;
}

const T = {
  primary: "#1A3020",
  success: "#3E7B27",
  gold: "#F2B441",
  bg: "#F0F7F0",
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  textDark: "#1A3020",
  textMid: "#3D5C42",
  textLight: "#6B8F6E",
} as const;

const FARMER = {
  name: "Nimal Perera",
  location: "Nuwara Eliya",
  initials: "NP",
};

const pageTitle: Record<Page, string> = {
  dashboard: "Overview",
  orders: "Active Orders",
  inventory: "Manage Stock",
  payments: "My Earnings",
};

export default function Header({ currentPage, onMobileMenuOpen }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 py-4 mx-3 mt-3 rounded-2xl flex-shrink-0"
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 2px 16px rgba(26,48,32,0.06)",
      }}
    >
      {/* Mobile hamburger */}
      <button
        className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center transition-colors min-h-[44px]"
        style={{ background: T.bg }}
        onClick={onMobileMenuOpen}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" style={{ color: T.textDark }} />
      </button>

      <h2 className="font-extrabold text-lg hidden sm:block" style={{ color: T.textDark }}>
        {pageTitle[currentPage]}
      </h2>

      <div className="flex-1" />

      {/* Date */}
      <div
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
        style={{ background: T.bg, border: `1.5px solid ${T.border}` }}
      >
        <span className="text-xs font-bold" style={{ color: T.textMid }}>
          {new Date().toLocaleDateString("en-LK", {
            weekday: "short",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 min-h-[44px]"
          style={{ background: T.bg, border: `1.5px solid ${T.border}` }}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" style={{ color: T.textMid }} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: T.gold }}
          />
        </button>

        {notifOpen && (
          <div
            className="absolute right-0 mt-2 w-80 rounded-2xl z-50 overflow-hidden"
            style={{
              background: T.cardBg,
              border: `1.5px solid ${T.border}`,
              boxShadow: "0 8px 30px rgba(26,48,32,0.15)",
              top: "100%",
            }}
          >
            <div
              className="px-4 py-3 border-b flex items-center justify-between"
              style={{ borderColor: T.border }}
            >
              <p className="font-bold text-sm" style={{ color: T.textDark }}>
                Notifications
              </p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: T.gold }}
              >
                3 NEW
              </span>
            </div>
            {[
              { icon: "📦", text: "New order from Anjali Fernando", time: "5 min ago" },
              { icon: "⚠️", text: "Baby Spinach stock running low (3 kg left)", time: "1 hr ago" },
              { icon: "✅", text: "Order ORD-3009 ready for pickup", time: "2 hr ago" },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 border-b last:border-0"
                style={{ borderColor: `${T.border}50` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                <div>
                  <p className="text-xs font-semibold leading-snug" style={{ color: T.textDark }}>
                    {n.text}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: T.textLight }}>
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-2.5 cursor-pointer">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0 shadow-md"
          style={{ background: `linear-gradient(135deg, ${T.success}, ${T.gold})` }}
        >
          {FARMER.initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-bold leading-tight" style={{ color: T.textDark }}>
            {FARMER.name}
          </p>
          <p className="text-[11px]" style={{ color: T.textLight }}>
            {FARMER.location}
          </p>
        </div>
      </div>
    </header>
  );
}
