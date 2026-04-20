"use client";

/**
 * FarmerDashboard — Root Entry Point
 *
 * This file is intentionally lean. It only handles:
 *  1. Top-level page state (which page is active, mobile menu open)
 *  2. Composing the layout (Sidebar + Header + main content area)
 *
 * All UI logic lives in components/dashboard/
 * All data/types live in constants/ and types/
 */

import { useState } from "react";

import { T } from "@/constants/dashboardData";
import type { Page } from "@/types/dashboard";

import Sidebar       from "@/components/dashboard/Sidebar";
import Header        from "@/components/dashboard/Header";
import DashboardPage from "@/components/dashboard/DashboardPage";
import OrdersPage    from "@/components/dashboard/OrdersPage";
import InventoryPage from "@/components/dashboard/InventoryPage";
import PaymentsPage  from "@/components/dashboard/PaymentsPage";

// ─── Page Renderer ────────────────────────────────────────────────────────────

function renderPage(page: Page) {
  switch (page) {
    case "dashboard":  return <DashboardPage />;
    case "orders":     return <OrdersPage />;
    case "inventory":  return <InventoryPage />;
    case "payments":   return <PaymentsPage />;
  }
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function FarmerDashboard() {
  const [currentPage,    setCurrentPage]    = useState<Page>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="dashboard-root h-screen w-full flex overflow-hidden"
      style={{ background: T.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar — handles collapse/expand, desktop + mobile overlay */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main area — fills remaining width, clips overflow so only <main> scrolls */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          currentPage={currentPage}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />

        {/* Only this element scrolls — Header stays fixed relative to its container */}
        <main className="flex-1 overflow-y-auto dashboard-scroll p-3 pt-4 pb-8">
          {renderPage(currentPage)}
        </main>
      </div>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-14px) rotate(7deg); }
        }
      `}</style>
    </div>
  );
}
