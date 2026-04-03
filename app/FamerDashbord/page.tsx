"use client";

/**
 * FarmerDashboard — Fresh Direct (Farm-to-Table Marketplace)
 *
 * A premium, glassmorphism-styled dashboard for farmers to manage their
 * products, inventory, and orders. Built with Next.js 15, Tailwind CSS v4,
 * and Lucide React icons.
 *
 * Layout:
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │  Sidebar (collapsible)  │  Header                                │
 *  │                         │────────────────────────────────────────│
 *  │  • Dashboard            │  Welcome Banner                        │
 *  │  • Products             │  KPI Cards (×4)                        │
 *  │  • Inventory            │  Recent Orders Table                   │
 *  │  • Orders               │  Quick Actions                         │
 *  │  • Settings             │                                        │
 *  └──────────────────────────────────────────────────────────────────┘
 */

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Menu,
  X,
  Leaf,
  LogOut,
  BarChart2,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
};

// ─── Static Demo Data ─────────────────────────────────────────────────────────

const FARMER_NAME = "Nimal Perera";
const FARM_NAME = "Green Hills Farm";
const FARM_LOCATION = "Nuwara Eliya";
const AVATAR_URL =
  "https://api.dicebear.com/8.x/thumbs/svg?seed=NimalPerera&backgroundColor=2D6A4F&shapeColor=D0EDD8";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "#dashboard" },
  { label: "Products", icon: <Package size={20} />, href: "#products" },
  { label: "Inventory", icon: <Warehouse size={20} />, href: "#inventory" },
  { label: "Orders", icon: <ShoppingCart size={20} />, href: "#orders" },
  { label: "Settings", icon: <Settings size={20} />, href: "#settings" },
];

const RECENT_ORDERS: Order[] = [
  { id: "ORD-2847", customer: "Anjali Fernando", date: "2026-04-03", total: 1560, status: "Pending", items: 3 },
  { id: "ORD-2846", customer: "Kasun Jayawardena", date: "2026-04-02", total: 880, status: "Shipped", items: 2 },
  { id: "ORD-2845", customer: "Priya Kumari", date: "2026-04-02", total: 2340, status: "Delivered", items: 5 },
  { id: "ORD-2844", customer: "Dilshan Rathnayake", date: "2026-04-01", total: 640, status: "Pending", items: 1 },
  { id: "ORD-2843", customer: "Shalini Mendis", date: "2026-03-31", total: 1120, status: "Cancelled", items: 4 },
  { id: "ORD-2842", customer: "Roshan Silva", date: "2026-03-30", total: 750, status: "Shipped", items: 2 },
];

// ─── Status Badge Configuration ───────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  Pending:   { bg: "bg-[#FFF8E1]",  text: "text-[#B45309]", dot: "bg-[#FFB703]", label: "Pending" },
  Shipped:   { bg: "bg-[#E8F5E9]",  text: "text-[#2D6A4F]", dot: "bg-[#52B788]", label: "Shipped" },
  Delivered: { bg: "bg-[#EDE9FE]",  text: "text-[#5B21B6]", dot: "bg-[#7C3AED]", label: "Delivered" },
  Cancelled: { bg: "bg-[#FEF2F2]",  text: "text-[#991B1B]", dot: "bg-[#EF4444]", label: "Cancelled" },
};

// ─── Floating Leaf Animation ──────────────────────────────────────────────────

const FLOATING_LEAVES = [
  { emoji: "🌿", top: "12%",  left: "3%",  delay: "0s",    size: "1.6rem" },
  { emoji: "🍃", top: "30%",  left: "8%",  delay: "1.2s",  size: "1.2rem" },
  { emoji: "🌱", top: "60%",  left: "2%",  delay: "2.5s",  size: "1rem"   },
  { emoji: "🍃", top: "75%",  left: "12%", delay: "0.8s",  size: "1.4rem" },
  { emoji: "🌿", top: "88%",  left: "5%",  delay: "3.1s",  size: "1.1rem" },
];

// ─── KPI Card Data ────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: "Total Sales",
    value: "Rs. 84,620",
    change: "+12.4%",
    positive: true,
    icon: <TrendingUp size={22} />,
    iconBg: "bg-[#2D6A4F]/10",
    iconColor: "text-[#2D6A4F]",
    accent: "#52B788",
  },
  {
    label: "Active Products",
    value: "24",
    change: "+3 this week",
    positive: true,
    icon: <Package size={22} />,
    iconBg: "bg-[#52B788]/15",
    iconColor: "text-[#2D6A4F]",
    accent: "#52B788",
  },
  {
    label: "Pending Orders",
    value: "7",
    change: "2 new today",
    positive: null,
    icon: <Clock size={22} />,
    iconBg: "bg-[#FFB703]/15",
    iconColor: "text-[#B45309]",
    accent: "#FFB703",
  },
  {
    label: "Low Stock Alerts",
    value: "4",
    change: "Action needed",
    positive: false,
    icon: <AlertTriangle size={22} />,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    accent: "#EF4444",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FarmerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // ── Glass panel style helper ──────────────────────────────────────────────
  const glassPanel =
    "bg-white/90 backdrop-blur-xl border border-[rgba(208,237,216,0.6)] shadow-[0_8px_30px_rgba(45,106,79,0.08)]";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen w-full flex overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F0FBF1 0%, #D8F3DC 50%, #B7E4C7 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Decorative background orbs ───────────────────────────────────── */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: "-180px", right: "-180px",
          width: "520px", height: "520px",
          borderRadius: "50%",
          background: "rgba(45,106,79,0.06)",
          zIndex: 0,
        }}
      />
      <div
        className="pointer-events-none fixed"
        style={{
          bottom: "-120px", left: "-120px",
          width: "420px", height: "420px",
          borderRadius: "50%",
          background: "rgba(255,183,3,0.07)",
          zIndex: 0,
        }}
      />

      {/* ── Floating leaf decorations (desktop sidebar side) ─────────────── */}
      {FLOATING_LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="pointer-events-none fixed select-none hidden lg:block"
          style={{
            top: leaf.top,
            left: leaf.left,
            fontSize: leaf.size,
            opacity: 0.35,
            animation: `floatLeaf 6s ease-in-out infinite`,
            animationDelay: leaf.delay,
            zIndex: 0,
          }}
        >
          {leaf.emoji}
        </span>
      ))}

      {/* ════════════════════════════════════════════════════════════════════
          SIDEBAR — Desktop (collapsible) + Mobile (overlay)
      ════════════════════════════════════════════════════════════════════ */}

      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:relative z-40 h-full lg:h-auto
          flex flex-col
          ${glassPanel} rounded-none lg:rounded-[28px] lg:m-3 lg:mr-0
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:w-60" : "lg:w-[72px]"}
          ${mobileSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ minHeight: "calc(100vh - 24px)", zIndex: 40 }}
      >
        {/* ── Brand logo ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(208,237,216,0.5)]">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
          >
            <Leaf size={18} className="text-white" />
          </div>
          {(sidebarOpen || mobileSidebarOpen) && (
            <div className="overflow-hidden">
              <p className="text-[#1B4332] font-bold text-base leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Fresh Direct
              </p>
              <p className="text-[#52B788] text-[11px] font-medium">Farmer Portal</p>
            </div>
          )}
          {/* Mobile close button */}
          <button
            className="ml-auto lg:hidden text-[#2D6A4F]"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Navigation links ───────────────────────────────────────────── */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  setMobileSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-[#2D6A4F] text-white shadow-[0_4px_14px_rgba(45,106,79,0.35)]"
                      : "text-[#2D6A4F] hover:bg-[#2D6A4F]/10"
                  }
                `}
              >
                <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-[#2D6A4F]"}`}>
                  {item.icon}
                </span>
                {(sidebarOpen || mobileSidebarOpen) && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
                {/* Active indicator dot when collapsed */}
                {!sidebarOpen && !mobileSidebarOpen && isActive && (
                  <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Farmer profile (bottom) ────────────────────────────────────── */}
        <div className="px-2 pb-4 border-t border-[rgba(208,237,216,0.5)] pt-3">
          {(sidebarOpen || mobileSidebarOpen) ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2D6A4F]/10 transition-colors cursor-pointer">
              <img
                src={AVATAR_URL}
                alt={FARMER_NAME}
                className="w-8 h-8 rounded-full ring-2 ring-[#52B788]/40 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[#1B4332] text-sm font-semibold truncate">{FARMER_NAME}</p>
                <p className="text-[#52B788] text-[11px] truncate">{FARM_LOCATION}</p>
              </div>
              <LogOut size={16} className="text-[#52B788] flex-shrink-0" />
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <img
                src={AVATAR_URL}
                alt={FARMER_NAME}
                className="w-8 h-8 rounded-full ring-2 ring-[#52B788]/40 object-cover"
              />
            </div>
          )}
        </div>

        {/* ── Desktop collapse toggle ────────────────────────────────────── */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2
            w-6 h-6 rounded-full items-center justify-center
            bg-white border border-[rgba(208,237,216,0.8)]
            shadow-[0_2px_8px_rgba(45,106,79,0.12)]
            text-[#2D6A4F] hover:bg-[#D0EDD8] transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>

      {/* ════════════════════════════════════════════════════════════════════
          MAIN CONTENT — Header + Body
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header
          className={`${glassPanel} m-3 mb-0 rounded-[24px] px-4 lg:px-6 py-3.5
            flex items-center gap-4 flex-shrink-0`}
        >
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-[#2D6A4F] flex-shrink-0"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52B788] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products, orders…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="
                w-full pl-9 pr-4 py-2 rounded-xl text-sm
                bg-[#F0FBF1] border border-[rgba(208,237,216,0.7)]
                text-[#1B4332] placeholder-[#52B788]/70
                focus:outline-none focus:ring-2 focus:ring-[#52B788]/40
                transition-all
              "
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Stats quick peek */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D6A4F]/10 border border-[rgba(208,237,216,0.5)]">
              <BarChart2 size={14} className="text-[#52B788]" />
              <span className="text-xs font-semibold text-[#2D6A4F]">April 2026</span>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="
                  w-9 h-9 rounded-xl flex items-center justify-center
                  bg-[#F0FBF1] border border-[rgba(208,237,216,0.7)]
                  text-[#2D6A4F] hover:bg-[#D0EDD8]
                  transition-colors relative
                "
                aria-label="Notifications"
              >
                <Bell size={18} />
                {/* Notification dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFB703] border border-white" />
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div
                  className={`absolute right-0 mt-2 w-72 ${glassPanel} rounded-2xl p-3 z-50`}
                  style={{ top: "100%" }}
                >
                  <p className="text-xs font-semibold text-[#1B4332] mb-2 px-1">Notifications</p>
                  {[
                    { icon: "📦", text: "New order from Anjali Fernando", time: "5 min ago" },
                    { icon: "⚠️", text: "Baby Spinach stock running low (3 left)", time: "1 hr ago" },
                    { icon: "✅", text: "Order ORD-2845 delivered successfully", time: "2 hr ago" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 px-2 py-2 rounded-xl hover:bg-[#D0EDD8]/50 cursor-pointer transition-colors"
                    >
                      <span className="text-base mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#1B4332] leading-snug">{n.text}</p>
                        <p className="text-[10px] text-[#52B788] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile avatar */}
            <div className="flex items-center gap-2 pl-1 cursor-pointer group">
              <img
                src={AVATAR_URL}
                alt={FARMER_NAME}
                className="w-9 h-9 rounded-xl ring-2 ring-[#52B788]/40 object-cover group-hover:ring-[#52B788] transition-all"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#1B4332] leading-tight">{FARMER_NAME}</p>
                <p className="text-[11px] text-[#52B788]">{FARM_NAME}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── MAIN SCROLLABLE BODY ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-3 pt-3 space-y-4">

          {/* ── Welcome Banner ─────────────────────────────────────────────── */}
          <div
            className={`${glassPanel} rounded-[24px] px-6 py-5 relative overflow-hidden`}
            style={{
              background:
                "linear-gradient(120deg, rgba(45,106,79,0.92) 0%, rgba(27,67,50,0.90) 100%)",
              border: "1px solid rgba(82,183,136,0.3)",
            }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 50%, rgba(82,183,136,0.18) 0%, transparent 60%)",
              }}
            />
            {/* Floating leaf decorations within banner */}
            {["🌿", "🍃", "🌱"].map((leaf, i) => (
              <span
                key={i}
                className="absolute pointer-events-none select-none"
                style={{
                  right: `${12 + i * 10}%`,
                  top: `${10 + i * 18}%`,
                  fontSize: `${1.4 - i * 0.2}rem`,
                  opacity: 0.25,
                  animation: `floatLeaf 5s ease-in-out infinite`,
                  animationDelay: `${i * 0.9}s`,
                }}
              >
                {leaf}
              </span>
            ))}

            <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[#D0EDD8] text-sm font-medium mb-1">
                  🌄 Overlooking the harvest,
                </p>
                <h1
                  className="text-white text-2xl lg:text-3xl font-bold leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {FARMER_NAME}
                </h1>
                <p className="text-[#52B788] text-sm mt-1">
                  {FARM_NAME} · {FARM_LOCATION} · April 2026
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center hidden sm:block">
                  <p className="text-[#D0EDD8] text-xs">Today's Revenue</p>
                  <p className="text-white text-xl font-bold">Rs. 4,280</p>
                </div>
                <div className="w-px h-10 bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium">
                  <Star size={14} className="text-[#FFB703]" />
                  <span>4.9 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI Stat Cards ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {KPI_CARDS.map((card, i) => (
              <div
                key={i}
                className={`${glassPanel} rounded-[20px] p-4 flex flex-col gap-3
                  hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(45,106,79,0.14)]
                  transition-all duration-200 cursor-default`}
              >
                {/* Icon + change badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor} flex-shrink-0`}>
                    {card.icon}
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
                      ${
                        card.positive === true
                          ? "bg-[#D0EDD8] text-[#2D6A4F]"
                          : card.positive === false
                          ? "bg-red-50 text-red-500"
                          : "bg-[#FFF8E1] text-[#B45309]"
                      }
                    `}
                  >
                    {card.change}
                  </span>
                </div>
                {/* Value */}
                <div>
                  <p
                    className="text-[#1B4332] text-xl font-bold leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {card.value}
                  </p>
                  <p className="text-[#52B788] text-xs font-medium mt-0.5">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom section: Orders table + Quick Actions ────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* ── Recent Orders Table ─────────────────────────────────────── */}
            <div className={`${glassPanel} rounded-[24px] p-5 xl:col-span-2`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className="text-[#1B4332] text-base font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Recent Orders
                  </h2>
                  <p className="text-[#52B788] text-xs mt-0.5">{RECENT_ORDERS.length} orders in the last 7 days</p>
                </div>
                <button
                  className="
                    text-xs font-semibold text-[#2D6A4F]
                    px-3 py-1.5 rounded-xl
                    border border-[rgba(208,237,216,0.8)]
                    hover:bg-[#D0EDD8] transition-colors
                  "
                >
                  View all
                </button>
              </div>

              {/* Table — scrollable on mobile */}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(208,237,216,0.5)]">
                      {["Order ID", "Customer", "Date", "Items", "Total", "Status"].map((h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-semibold text-[#52B788] pb-2.5 px-1 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(208,237,216,0.35)]">
                    {RECENT_ORDERS.map((order) => {
                      const sc = STATUS_CONFIG[order.status];
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-[#D0EDD8]/25 transition-colors rounded-xl"
                        >
                          <td className="py-3 px-1 font-semibold text-[#1B4332] text-xs whitespace-nowrap">
                            {order.id}
                          </td>
                          <td className="py-3 px-1 text-[#1B4332] font-medium text-xs whitespace-nowrap">
                            {order.customer}
                          </td>
                          <td className="py-3 px-1 text-[#52B788] text-xs whitespace-nowrap">
                            {new Date(order.date).toLocaleDateString("en-LK", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </td>
                          <td className="py-3 px-1 text-[#52B788] text-xs text-center">
                            {order.items}
                          </td>
                          <td className="py-3 px-1 font-bold text-[#1B4332] text-xs whitespace-nowrap">
                            Rs.&nbsp;{order.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-1">
                            {/* Status pill badge */}
                            <span
                              className={`
                                inline-flex items-center gap-1.5
                                px-2.5 py-1 rounded-full text-[11px] font-semibold
                                ${sc.bg} ${sc.text}
                              `}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Quick Actions + Mini Stats ──────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Add New Product CTA */}
              <div className={`${glassPanel} rounded-[24px] p-5`}>
                <h2
                  className="text-[#1B4332] text-base font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Quick Actions
                </h2>
                <p className="text-[#52B788] text-xs mb-4">Manage your farm store</p>

                {/* Primary CTA */}
                <button
                  className="
                    w-full flex items-center justify-center gap-2
                    px-4 py-3 rounded-2xl
                    bg-[#2D6A4F] text-white font-semibold text-sm
                    shadow-[0_6px_20px_rgba(45,106,79,0.35)]
                    hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(45,106,79,0.45)]
                    transition-all duration-200
                  "
                >
                  <Plus size={18} />
                  Add New Product
                </button>

                {/* Secondary quick action buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { icon: <Package size={15} />, label: "Manage Products" },
                    { icon: <ShoppingCart size={15} />, label: "View Orders" },
                    { icon: <Warehouse size={15} />, label: "Update Stock" },
                    { icon: <BarChart2 size={15} />, label: "Analytics" },
                  ].map((action, i) => (
                    <button
                      key={i}
                      className="
                        flex items-center gap-1.5 px-3 py-2.5 rounded-xl
                        border border-[rgba(208,237,216,0.7)]
                        text-[#2D6A4F] text-xs font-medium
                        hover:bg-[#D0EDD8] hover:-translate-y-0.5
                        transition-all duration-200
                      "
                    >
                      <span className="text-[#52B788]">{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Low stock mini panel */}
              <div className={`${glassPanel} rounded-[24px] p-5 flex-1`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={14} className="text-red-500" />
                  </span>
                  <div>
                    <h3
                      className="text-[#1B4332] text-sm font-bold leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Low Stock
                    </h3>
                    <p className="text-[#52B788] text-[10px]">Needs restocking</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Baby Spinach", qty: 3, unit: "kg" },
                    { name: "Murunga Leaves", qty: 1, unit: "bunch" },
                    { name: "King Coconut", qty: 4, unit: "pcs" },
                    { name: "Ginger", qty: 2, unit: "kg" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-red-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        <span className="text-xs text-[#1B4332] font-medium">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-red-500">
                        {item.qty} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── CSS Keyframes for floating leaf animation ─────────────────────── */}
      <style>{`
        @keyframes floatLeaf {
          0%   { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-12px) rotate(6deg); }
          66%  { transform: translateY(-6px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
