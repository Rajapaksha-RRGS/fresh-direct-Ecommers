"use client";

import { TrendingUp, ShoppingBag, Wallet, AlertCircle } from "lucide-react";

import { T, FARMER, ORDERS, EARNINGS } from "@/constants/dashboardData";
import { useCountdown } from "@/hooks/useCountdown";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmerStats } from "@/hooks/useFarmerStats";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import CountdownTimer from "@/components/dashboard/CountdownTimer";
import OrdersTable from "@/components/dashboard/OrdersTable";

export default function DashboardPage() {
  const countdown = useCountdown(16, 0);

  // Fetch real data from API
  const { profile, isLoading: profileLoading, isPending } = useFarmerProfile();
  const { stats, isLoading: statsLoading } = useFarmerStats();

  // Calculate estimated revenue for today (placeholder - adjust based on your logic)
  const todayRevenue = stats?.estimatedRevenue || 0;
  const recentOrders = ORDERS.slice(0, 5);

  const statCards = [
    {
      label: "Total Earnings",
      sublabel: "Today",
      value: `Rs. ${todayRevenue.toLocaleString()}`,
      change: "+18.4%",
      positive: true as boolean | null,
      icon: TrendingUp,
      accent: T.success,
      badge: null as string | null,
    },
    {
      label: "Total Orders",
      sublabel: "This month",
      value: String(stats?.totalSold || "0"),
      change: `${stats?.totalViews || 0} views`,
      positive: true as boolean | null,
      icon: ShoppingBag,
      accent: "#2C4DA0",
      badge: stats && stats.totalSold > 0 ? "ACTIVE" : null,
    },
    {
      label: "Active Products",
      sublabel: "Ready to sell",
      value: String(stats?.activeProducts || "0"),
      change: `${stats?.pendingApprovals || 0} pending approval`,
      positive: null as boolean | null,
      icon: Wallet,
      accent: T.gold,
      badge: stats && stats.pendingApprovals > 0 ? "PENDING" : null,
    },
  ];

  return (
    <div className="space-y-5">
      {/* ─── Verification Status Banner ─────────────────────────────────────── */}
      {isPending && !profileLoading && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">
              Account Pending Verification
            </h3>
            <p className="text-sm text-yellow-800 mt-1">
              Your farmer profile is awaiting admin approval. You can view your
              details, but cannot add new products until your account is
              approved.
            </p>
          </div>
        </div>
      )}

      <WelcomeBanner
        farmerName={profile?.farmName || FARMER.name}
        farmName={profile?.farmName || FARMER.farm}
        location={profile?.location || FARMER.location}
        rating={FARMER.rating}
        todayRevenue={`Rs. ${todayRevenue.toLocaleString()}`}
      />

      <StatCards cards={statCards} />

      <CountdownTimer
        hours={countdown.h}
        minutes={countdown.m}
        seconds={countdown.s}
        collectionTime="Today at 4:00 PM"
        message="All produce ready for marketplace pickup"
      />

      <OrdersTable orders={recentOrders} />
    </div>
  );
}
