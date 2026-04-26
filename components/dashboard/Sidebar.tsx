"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { X, Leaf, LogOut, ChevronRight } from "lucide-react";

import { T, NAV_ITEMS } from "@/constants/dashboardData";
import type { Page } from "@/types/dashboard";

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

// Helper function to extract initials from a name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  currentPage,
  onPageChange,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: session } = useSession();

  const handleNav = (pageId: Page) => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => onPageChange(pageId), 150);
    } else {
      onPageChange(pageId);
    }
    onMobileClose();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Dynamic user data from session
  const userName = session?.user?.name || "Farmer User";
  const userInitials = getInitials(userName);
  const userLocation = session?.user?.location || "Farmer Partner";

  const panel = (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out",
        "rounded-3xl shadow-2xl overflow-hidden",
        isExpanded ? "w-64" : "w-[72px]",
      )}
      style={{
        background: `linear-gradient(170deg, ${T.primary} 0%, #0E1F14 100%)`,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand */}
      <div className="px-4 pt-6 pb-5 flex items-center gap-3 border-b border-white/[0.08] relative">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${T.success}, ${T.gold})`,
          }}
        >
          <Leaf className="w-5 h-5 text-white" />
        </div>

        {isExpanded && (
          <div className="overflow-hidden flex-1">
            <p
              className="text-white font-bold text-base leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fresh Direct
            </p>
            <p className="text-green-400/70 text-[11px] font-medium tracking-wide">
              Farmer Portal
            </p>
          </div>
        )}

        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.08] hover:bg-white/15 transition-colors"
            aria-label="Collapse sidebar"
          >
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleNav(item.id)}
                className={cn(
                  "w-full flex items-center transition-all duration-300 ease-in-out relative overflow-hidden",
                  isExpanded
                    ? "gap-3 px-4 py-3 rounded-2xl"
                    : "justify-center w-12 h-12 mx-auto rounded-2xl",
                  !isActive && "hover:bg-white/[0.08]",
                  isActive && "shadow-lg",
                )}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${T.success}, rgba(242,180,65,0.12))`,
                        border: `1px solid ${T.success}40`,
                      }
                    : {}
                }
              >
                <Icon
                  className={cn(
                    "flex-shrink-0 w-5 h-5 transition-colors duration-300",
                    isActive
                      ? "text-white"
                      : "text-white/50 group-hover:text-white/80",
                  )}
                />

                {isExpanded && (
                  <div className="flex-1 text-left overflow-hidden">
                    <div
                      className={cn(
                        "font-semibold text-sm whitespace-nowrap transition-colors duration-300",
                        isActive
                          ? "text-white"
                          : "text-white/60 group-hover:text-white/90",
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

                {isActive && isExpanded && (
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: T.gold }}
                  />
                )}

                {isActive && !isExpanded && (
                  <>
                    <div
                      className="absolute inset-0 rounded-2xl opacity-20 animate-pulse"
                      style={{ background: T.success }}
                    />
                    <div
                      className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full"
                      style={{ background: T.gold }}
                    />
                  </>
                )}
              </button>

              {!isExpanded && (
                <div
                  className="absolute left-full ml-4 px-3 py-2 rounded-xl z-50 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  style={{
                    background: T.primary,
                    border: "1px solid rgba(255,255,255,0.1)",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <div className="font-semibold text-sm text-white">
                    {item.name}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {item.description}
                  </div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45"
                    style={{ background: T.primary }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Farmer profile */}
      <div className="px-3 pb-5 pt-4 border-t border-white/[0.06]">
        <div
          className={cn(
            "flex items-center rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-colors duration-200",
            isExpanded ? "gap-3 px-3 py-2.5" : "justify-center py-2",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${T.success}, ${T.gold})`,
            }}
          >
            {userInitials}
          </div>
          {isExpanded && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">
                  {userName}
                </p>
                <p className="text-white/40 text-[11px] truncate">
                  {userLocation}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="w-4 h-4 text-white/30 flex-shrink-0 hover:text-white/60 transition-colors duration-200"
                aria-label="Logout"
              >
                <LogOut className="w-full h-full" />
              </button>
            </>
          )}
        </div>
      </div>

      {!isExpanded && (
        <div className="pb-3 flex justify-center">
          <button
            onClick={() => setIsExpanded(true)}
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
      {/* h-full fills the constrained h-screen parent — no independent scroll */}
      <div className="hidden lg:flex flex-col h-full m-3 mr-0">
        {panel}
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onMobileClose} />
          <div className="fixed left-0 top-0 bottom-0 z-50 flex flex-col p-3 lg:hidden">{panel}</div>
        </>
      )}
    </>
  );
}
