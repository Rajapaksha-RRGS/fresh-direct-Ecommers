"use client";

/**
 * components/layout/UserMenu.tsx
 *
 * Dynamic auth section for the Navbar.
 * • Loading  → soft skeleton pill
 * • Logged out → "ඇතුළු වන්න / Sign In" button
 * • Logged in  → Avatar + first name + ChevronDown → floating dropdown
 *
 * Uses Auth.js v5 useSession() hook.
 * Dropdown animated with framer-motion (scale + fade).
 */

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  User,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

// ─── Menu items config ────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    label: "My Profile",
    href: "/profile",
    icon: User,
    roles: ["CUSTOMER", "FARMER", "ADMIN"],
    color: "#1A3020",
  },
  {
    label: "My Orders",
    href: "/orders",
    icon: ShoppingBag,
    roles: ["CUSTOMER", "FARMER", "ADMIN"],
    color: "#1A3020",
  },
  {
    label: "Dashboard",
    href: "/FamerDashbord",
    icon: LayoutDashboard,
    roles: ["FARMER"],
    color: "#3E7B27",
  },
  {
    label: "Admin Panel",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
    color: "#3E7B27",
  },
];

// ─── Avatar helpers ───────────────────────────────────────────────────────────
function getInitial(name?: string | null): string {
  return (name ?? "U").trim()[0].toUpperCase();
}

function getFirstName(name?: string | null): string {
  return (name ?? "User").trim().split(" ")[0];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2.5 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-[#D0EDD8]" />
        <div className="hidden sm:block h-4 w-20 rounded-full bg-[#D0EDD8]" />
      </div>
    );
  }

  // ── Logged out: Sign In button ──────────────────────────────────────────────
  if (status === "unauthenticated" || !session) {
    return (
      <Link
        href="/login"
        id="navbar-signin-btn"
        className={[
          "no-underline inline-flex items-center justify-center",
          "bg-[#3E7B27] text-white font-bold text-[0.85rem]",
          "px-5 py-2.5 rounded-full min-h-[40px]",
          "shadow-[0_4px_14px_rgba(62,123,39,0.30)]",
          "hover:bg-[#1A3020] hover:scale-105 hover:shadow-[0_6px_20px_rgba(62,123,39,0.40)]",
          "transition-all duration-200 whitespace-nowrap",
        ].join(" ")}
      >
        Sign In
      </Link>
    );
  }

  // ── Logged in ──────────────────────────────────────────────────────────────
  const user = session.user as SessionUser;
  const role = user.role ?? "CUSTOMER";
  const firstName = getFirstName(user.name);
  const initial = getInitial(user.name);

  const visibleItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* ── Trigger button ── */}
      <button
        id="user-menu-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-2.5 px-3 py-1.5 rounded-full",
          "border-2 border-[#A8D08D]",
          "hover:border-[#3E7B27] hover:bg-[#F0F7F0]",
          "transition-all duration-200 cursor-pointer",
          open ? "border-[#3E7B27] bg-[#F0F7F0]" : "",
        ].join(" ")}
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center ring-2 ring-[#A8D08D]">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              className="text-white font-extrabold text-[1rem] select-none leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {initial}
            </span>
          )}
        </div>

        {/* Name + chevron (desktop only) */}
        <span className="hidden sm:flex items-center gap-1.5">
          <span className="text-[#1A3020] font-semibold text-[0.88rem] max-w-[100px] truncate">
            {firstName}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-[#6B8F6E]" />
          </motion.div>
        </span>
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
            className={[
              "absolute right-0 top-[calc(100%+10px)] z-50",
              "w-56 bg-white rounded-2xl border border-[#D0EDD8]",
              "shadow-[0_12px_40px_rgba(26,48,32,0.16)] overflow-hidden",
            ].join(" ")}
          >
            {/* User info header */}
            <div className="px-4 py-3 bg-gradient-to-br from-[#F0F7F0] to-[#E4EEE4] border-b border-[#D0EDD8]">
              <p
                className="text-[#1A3020] font-extrabold text-[0.9rem] truncate"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {user.name ?? "User"}
              </p>
              <p className="text-[#6B8F6E] text-[0.72rem] truncate">
                {user.email}
              </p>
              {/* Role badge */}
              <span className="inline-block mt-1.5 bg-[#3E7B27]/10 border border-[#3E7B27]/20 text-[#3E7B27] text-[0.62rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                {role === "FARMER" ? "🌱 Farmer" : role === "ADMIN" ? "⚙️ Admin" : "🛒 Customer"}
              </span>
            </div>

            {/* Menu items */}
            <div className="p-2 flex flex-col gap-0.5">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                      "text-[0.85rem] font-semibold transition-all duration-150",
                      "hover:bg-[#F0F7F0] hover:scale-[1.01]",
                    ].join(" ")}
                    style={{ color: item.color }}
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#F0F7F0] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-1 border-t border-[#E8F0E8]" />

              {/* Logout */}
              <button
                id="user-menu-logout"
                onClick={async () => {
                  setOpen(false);
                  await signOut({ callbackUrl: "/" });
                }}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                  "text-[0.85rem] font-semibold text-[#E74C3C]",
                  "hover:bg-red-50 hover:scale-[1.01] transition-all duration-150",
                ].join(" ")}
              >
                <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-3.5 h-3.5 text-[#E74C3C]" />
                </span>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
