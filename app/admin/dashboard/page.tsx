"use client";

/**
 * Admin Dashboard — /app/admin/dashboard/page.tsx
 *
 * Layout: flex h-screen overflow-hidden
 *   ├── AdminSidebar  (h-full, no scroll)
 *   └── Main area     (flex-1 flex-col h-full overflow-hidden)
 *       ├── Header    (sticky, no scroll)
 *       └── <main>    (flex-1 overflow-y-auto p-6 bg-[#F0F7F0])  ← ONLY thing that scrolls
 */

import { useState } from "react";
import {
  Menu,
  Bell,
  Users,
  UserCheck,
  ShoppingBag,
  Activity,
  Search,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";

import AdminSidebar   from "@/components/admin/AdminSidebar";
import StatCard       from "@/components/admin/StatCard";
import ApprovalTable  from "@/components/admin/ApprovalTable";
import PricingConsole from "@/components/admin/PricingConsole";

import { AT, PENDING_FARMERS, PRICING_DATA } from "@/constants/adminData";
import type { AdminPage, AdminStat } from "@/types/admin";

// ─── cn ───────────────────────────────────────────────────────────────────────
const cn = (...c: (string | boolean | undefined | null)[]) => c.filter(Boolean).join(" ");

// ─── Overview Stats ───────────────────────────────────────────────────────────
const STATS: AdminStat[] = [
  {
    label:   "Active Farmers",
    value:   "142",
    sub:     "Verified & live on platform",
    icon:    Users,
    accent:  `linear-gradient(135deg, ${AT.primary}, ${AT.success})`,
    trend:   12,
  },
  {
    label:   "Pending Verification",
    value:   PENDING_FARMERS.length,
    sub:     "Awaiting admin review",
    icon:    UserCheck,
    accent:  `linear-gradient(135deg, #C47A0A, ${AT.gold})`,
    trend:   null,
  },
  {
    label:   "Today's Revenue",
    value:   "LKR 84,200",
    sub:     "Across all farmer sales",
    icon:    Activity,
    accent:  `linear-gradient(135deg, #1E6B3C, ${AT.success})`,
    trend:   8,
  },
  {
    label:   "Market Health",
    value:   "97%",
    sub:     "Orders fulfilled on time",
    icon:    ShoppingBag,
    accent:  `linear-gradient(135deg, #1A4A6E, #2B6CB0)`,
    trend:   -2,
  },
];

// ─── Page label map ───────────────────────────────────────────────────────────
const PAGE_LABELS: Record<AdminPage, { title: string; sub: string }> = {
  dashboard: { title: "Admin Overview",    sub: "Platform-wide metrics at a glance"        },
  approvals: { title: "Farmer Approvals",  sub: "Review and verify new farmer applications" },
  pricing:   { title: "Market Pricing",    sub: "Dynamic pricing engine for all products"  },
  orders:    { title: "Active Orders",     sub: "Monitor all live marketplace orders"       },
  users:     { title: "User Management",   sub: "Manage customers, farmers, and admins"     },
};

// ─── Coming Soon placeholder ──────────────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 shadow-[0_6px_20px_rgba(26,48,32,0.2)]"
        style={{ background: `linear-gradient(135deg, ${AT.primary}, ${AT.success})` }}
      >
        <Activity className="w-8 h-8 text-white" />
      </div>
      <h3
        className="text-[1.2rem] font-extrabold mb-2"
        style={{ color: AT.textDark, fontFamily: "'Playfair Display', serif" }}
      >
        {label}
      </h3>
      <p className="text-[0.85rem]" style={{ color: AT.textLight }}>
        This module is coming soon. Check back in the next sprint.
      </p>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  sub,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-3xl border p-6 shadow-[0_4px_20px_rgba(26,48,32,0.07)]"
      style={{ borderColor: AT.border }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(26,48,32,0.2)]"
            style={{ background: `linear-gradient(135deg, ${AT.primary}, ${AT.success})` }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2
              className="font-extrabold text-[1.05rem] leading-tight"
              style={{ color: AT.textDark, fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </h2>
            {sub && (
              <p className="text-[0.76rem] mt-0.5" style={{ color: AT.textLight }}>
                {sub}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [currentPage,    setCurrentPage]    = useState<AdminPage>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search,         setSearch]         = useState("");

  const { title, sub } = PAGE_LABELS[currentPage];

  return (
    <>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── Root: h-screen, no page-level scroll ────────────────────────── */}
      <div
        className="flex h-screen overflow-hidden w-full"
        style={{ background: AT.bg, fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Sidebar (h-full, no scroll) ──────────────────────────────── */}
        <AdminSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* ── Main area (flex-1 flex-col h-full overflow-hidden) ─────────── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

          {/* ── Sticky Header ──────────────────────────────────────────── */}
          <header
            className="flex items-center gap-4 px-5 py-4 border-b flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              borderColor: AT.border,
              boxShadow: "0 2px 12px rgba(26,48,32,0.06)",
            }}
          >
            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-2xl flex items-center justify-center bg-white border transition-colors hover:bg-[#F0F7F0]"
              style={{ borderColor: AT.border }}
            >
              <Menu className="w-5 h-5" style={{ color: AT.textDark }} />
            </button>

            {/* Page title */}
            <div className="flex-1 min-w-0">
              <h1
                className="font-extrabold text-[1.1rem] truncate leading-tight"
                style={{ color: AT.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h1>
              <p className="text-[0.72rem] hidden sm:block" style={{ color: AT.textLight }}>
                {sub}
              </p>
            </div>

            {/* Search */}
            <div
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl border flex-shrink-0"
              style={{ background: AT.bg, borderColor: AT.border }}
            >
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: AT.textLight }} />
              <input
                type="text"
                placeholder="Search farmers, orders…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-[0.82rem] w-44 placeholder:text-[#8FAF9A]"
                style={{ color: AT.textDark }}
              />
            </div>

            {/* Notifications */}
            <button
              className="relative w-10 h-10 rounded-2xl flex items-center justify-center border flex-shrink-0 hover:bg-[#F0F7F0] transition-colors"
              style={{ borderColor: AT.border, background: "#fff" }}
            >
              <Bell className="w-5 h-5" style={{ color: AT.textDark }} />
              {PENDING_FARMERS.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[0.62rem] font-bold text-white flex items-center justify-center"
                  style={{ background: AT.gold }}
                >
                  {PENDING_FARMERS.length}
                </span>
              )}
            </button>

            {/* Admin avatar */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow"
              style={{ background: `linear-gradient(135deg, ${AT.primary}, ${AT.success})` }}
            >
              SA
            </div>
          </header>

          {/* ── Scrollable content area (ONLY this scrolls) ───────────────── */}
          <main
            className="flex-1 overflow-y-auto p-6"
            style={{ background: AT.bg }}
          >
            {/* ════════════════ OVERVIEW / DASHBOARD ════════════════════ */}
            {currentPage === "dashboard" && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto">

                {/* Welcome strip */}
                <div
                  className="rounded-3xl p-6 relative overflow-hidden shadow-[0_8px_32px_rgba(26,48,32,0.18)]"
                  style={{ background: `linear-gradient(135deg, ${AT.primary} 0%, #2D6A4F 60%, ${AT.success} 100%)` }}
                >
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
                  <p className="text-white/70 text-[0.8rem] font-medium mb-1">Good morning ☀️</p>
                  <h2
                    className="text-white text-[1.5rem] font-extrabold mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    System Administrator
                  </h2>
                  <p className="text-white/60 text-[0.82rem]">
                    {PENDING_FARMERS.length} farmer{PENDING_FARMERS.length !== 1 ? "s" : ""} awaiting your
                    verification today.
                  </p>
                </div>

                {/* 4 Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {STATS.map((s) => (
                    <StatCard key={s.label} stat={s} />
                  ))}
                </div>

                {/* Two column: approvals preview + pricing preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Section
                    title="Pending Approvals"
                    sub="Latest farmer applications"
                    icon={UserCheck}
                    action={
                      <button
                        onClick={() => setCurrentPage("approvals")}
                        className="text-[0.78rem] font-bold px-3 py-1.5 rounded-xl border hover:opacity-80 transition-opacity min-h-[36px]"
                        style={{ borderColor: AT.success, color: AT.success, background: "#E6F4E610" }}
                      >
                        View all →
                      </button>
                    }
                  >
                    <ApprovalTable farmers={PENDING_FARMERS.slice(0, 2)} />
                  </Section>

                  <Section
                    title="Live Pricing Snapshot"
                    sub="Top 4 high-demand products"
                    icon={TrendingUp}
                    action={
                      <button
                        onClick={() => setCurrentPage("pricing")}
                        className="text-[0.78rem] font-bold px-3 py-1.5 rounded-xl border hover:opacity-80 transition-opacity min-h-[36px]"
                        style={{ borderColor: AT.success, color: AT.success, background: "#E6F4E610" }}
                      >
                        Full engine →
                      </button>
                    }
                  >
                    <PricingConsole rows={PRICING_DATA.slice(0, 4)} />
                  </Section>
                </div>
              </div>
            )}

            {/* ════════════════ FARMER APPROVALS ════════════════════════ */}
            {currentPage === "approvals" && (
              <div className="max-w-5xl mx-auto">
                {/* Pending count banner */}
                {PENDING_FARMERS.length > 0 && (
                  <div
                    className="rounded-3xl p-4 mb-6 flex items-center gap-3 border shadow-[0_4px_16px_rgba(242,180,65,0.15)]"
                    style={{ background: "#FFFBEE", borderColor: `${AT.gold}50` }}
                  >
                    <div
                      className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: AT.gold }}
                    >
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[0.88rem]" style={{ color: AT.textDark }}>
                        {PENDING_FARMERS.length} Application{PENDING_FARMERS.length !== 1 ? "s" : ""} Awaiting Review
                      </p>
                      <p className="text-[0.75rem]" style={{ color: AT.textLight }}>
                        Use Approve / Reject on each row. Status updates are instant.
                      </p>
                    </div>
                  </div>
                )}

                <Section
                  title="Farmer Verification Hub"
                  sub="Review NIC, location, and crop profile before approving"
                  icon={UserCheck}
                >
                  <ApprovalTable farmers={PENDING_FARMERS} />
                </Section>
              </div>
            )}

            {/* ════════════════ PRICING ENGINE ══════════════════════════ */}
            {currentPage === "pricing" && (
              <div className="max-w-5xl mx-auto">
                <div
                  className="rounded-3xl p-4 mb-6 flex items-center gap-3 border"
                  style={{ background: "#EDF7ED", borderColor: `${AT.success}40` }}
                >
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: AT.success }}
                  >
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[0.82rem]" style={{ color: AT.textMid }}>
                    Dynamic prices are computed from{" "}
                    <strong>supply availability</strong> and{" "}
                    <strong>demand signals</strong>. High demand + low supply = premium pricing.
                  </p>
                </div>

                <Section
                  title="Dynamic Pricing Engine"
                  sub="All approved products with real-time demand adjustment"
                  icon={TrendingUp}
                >
                  <PricingConsole rows={PRICING_DATA} />
                </Section>
              </div>
            )}

            {/* ════════════════ ORDERS ══════════════════════════════════ */}
            {currentPage === "orders" && (
              <div className="max-w-5xl mx-auto">
                <Section title="Active Orders" icon={ShoppingBag}>
                  <ComingSoon label="Active Orders Module" />
                </Section>
              </div>
            )}

            {/* ════════════════ USERS ═══════════════════════════════════ */}
            {currentPage === "users" && (
              <div className="max-w-5xl mx-auto">
                <Section title="User Management" icon={Users}>
                  <ComingSoon label="User Management Module" />
                </Section>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
