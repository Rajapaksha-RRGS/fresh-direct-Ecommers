"use client";

import { useState } from "react";
import { X, Leaf, LogOut, ChevronRight, Shield } from "lucide-react";
import { AT, ADMIN_NAV } from "@/constants/adminData";
import type { AdminPage } from "@/types/admin";

const cn = (...c: (string | boolean | undefined | null)[]) => c.filter(Boolean).join(" ");

interface AdminSidebarProps {
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({
  currentPage,
  onPageChange,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleNav = (pageId: AdminPage) => {
    onPageChange(pageId);
    onMobileClose();
  };

  const panel = (
    <div
      className={cn(
        "flex flex-col h-screen  transition-all duration-300 ease-in-out rounded-3xl shadow-2xl overflow-hidden",
        collapsed ? "w-[72px]" : "w-64",
      )}
      style={{
        background: `linear-gradient(170deg, ${AT.primary} 0%, #0E1F14 100%)`,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-6 pb-5 flex items-center gap-3 border-b border-white/[0.08] relative">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${AT.success}, ${AT.gold})` }}
        >
          <Leaf className="w-5 h-5 text-white" />
        </div>

        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p
              className="text-white font-bold text-base leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fresh Direct
            </p>
            <p className="text-[11px] font-semibold tracking-wide" style={{ color: AT.gold }}>
              Admin Console
            </p>
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.08] hover:bg-white/15 transition-colors"
            aria-label="Collapse sidebar"
          >
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-hidden">
        {ADMIN_NAV.map((item) => {
          const Icon     = item.icon;
          const isActive = currentPage === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleNav(item.id)}
                className={cn(
                  "w-full flex items-center transition-all duration-300 ease-in-out relative overflow-hidden",
                  collapsed ? "justify-center w-12 h-12 mx-auto rounded-2xl" : "gap-3 px-4 py-3 rounded-2xl",
                  !isActive && "hover:bg-white/[0.08]",
                  isActive && "shadow-lg",
                )}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${AT.success}, rgba(242,180,65,0.12))`,
                        border: `1px solid ${AT.success}40`,
                      }
                    : {}
                }
              >
                <Icon
                  className={cn(
                    "flex-shrink-0 w-5 h-5 transition-colors duration-300",
                    isActive ? "text-white" : "text-white/50 group-hover:text-white/80",
                  )}
                />

                {!collapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <div
                      className={cn(
                        "font-semibold text-sm whitespace-nowrap transition-colors duration-300",
                        isActive ? "text-white" : "text-white/60 group-hover:text-white/90",
                      )}
                    >
                      {item.name}
                    </div>
                    {isActive && (
                      <div className="text-[11px] text-white/50 mt-0.5 whitespace-nowrap">
                        {item.description}
                      </div>
                    )}
                  </div>
                )}

                {isActive && !collapsed && (
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: AT.gold }} />
                )}

                {isActive && collapsed && (
                  <>
                    <div
                      className="absolute inset-0 rounded-2xl opacity-20 animate-pulse"
                      style={{ background: AT.success }}
                    />
                    <div
                      className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full"
                      style={{ background: AT.gold }}
                    />
                  </>
                )}
              </button>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div
                  className="absolute left-full ml-4 px-3 py-2 rounded-xl z-50 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  style={{
                    background: AT.primary,
                    border: "1px solid rgba(255,255,255,0.1)",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <div className="font-semibold text-sm text-white">{item.name}</div>
                  <div className="text-xs text-white/50 mt-0.5">{item.description}</div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45"
                    style={{ background: AT.primary }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Admin profile strip ───────────────────────────────────────────── */}
      <div className="px-3 pb-5 pt-4 border-t border-white/[0.06]">
        <div
          className={cn(
            "flex items-center rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-colors duration-200",
            collapsed ? "justify-center py-2" : "gap-3 px-3 py-2.5",
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${AT.success}, ${AT.gold})` }}
          >
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">System Administrator</p>
                <p className="text-white/40 text-[11px] truncate">admin@freshdirect.lk</p>
              </div>
              <LogOut className="w-4 h-4 text-white/30 flex-shrink-0" />
            </>
          )}
        </div>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="pb-3 flex justify-center">
          <button
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.08] hover:bg-white/15 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col h-full m-3 mr-0">{panel}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onMobileClose}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 flex flex-col p-3 lg:hidden">
            {panel}
          </div>
        </>
      )}
    </>
  );
}
