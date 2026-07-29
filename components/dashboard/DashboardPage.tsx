"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { T } from "@/constants/dashboardData";
import { useCountdown } from "@/hooks/useCountdown";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmerStats } from "@/hooks/useFarmerStats";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import CountdownTimer from "@/components/dashboard/CountdownTimer";
import OrdersTable from "@/components/dashboard/OrdersTable";

function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function DashboardPage() {
  const countdown = useCountdown(16, 0);

  // Fetch real profile & stats from API
  const { profile, isLoading: profileLoading, isPending } = useFarmerProfile();
  const { stats, isLoading: statsLoading } = useFarmerStats();

  // Real orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/farmer/orders?perPage=5");
        const data = await res.json();
        if (res.ok && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching recent orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const totalRevenue = stats?.estimatedRevenue || 0;
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    {
      label: "Total Earnings",
      sublabel: "Estimated Sales",
      value: fmt(totalRevenue),
      change: `${stats?.totalSold || 0} units sold`,
      positive: true as boolean | null,
      icon: TrendingUp,
      accent: T.success,
      badge: null as string | null,
    },
    {
      label: "Total Orders",
      sublabel: "Overall Activity",
      value: String(orders.length || stats?.totalSold || "0"),
      change: `${stats?.totalViews || 0} views`,
      positive: true as boolean | null,
      icon: ShoppingBag,
      accent: "#2C4DA0",
      badge: orders.length > 0 ? "ACTIVE" : null,
    },
    {
      label: "Active Products",
      sublabel: "Ready in Market",
      value: String(stats?.activeProducts || "0"),
      change: `${stats?.pendingApprovals || 0} pending approval`,
      positive: null as boolean | null,
      icon: Wallet,
      accent: T.gold,
      badge: stats && stats.pendingApprovals > 0 ? "PENDING" : null,
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* ─── Verification Status Banner ─────────────────────────────────────── */}
      {isPending && !profileLoading && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-2xl shadow-sm">
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
        farmerName={profile?.farmName || "Farmer"}
        farmName={profile?.farmName || "Fresh Farm"}
        location={profile?.location || "Sri Lanka"}
        rating={4.9}
        todayRevenue={fmt(totalRevenue)}
      />

      <StatCards cards={statCards} />

      <CountdownTimer
        hours={countdown.h}
        minutes={countdown.m}
        seconds={countdown.s}
        collectionTime="Today at 4:00 PM"
        message="All produce ready for marketplace pickup"
      />

      {ordersLoading ? (
        <div className="py-8 flex items-center justify-center bg-white rounded-3xl border border-[#C8DFC8]">
          <Loader2 className="w-6 h-6 text-[#3E7B27] animate-spin mr-2" />
          <span className="text-xs font-bold text-[#6B8F6E]">Loading recent produce orders...</span>
        </div>
      ) : (
        <OrdersTable
          orders={recentOrders}
          title="Recent Produce Orders"
          subtitle="Live orders containing your products"
        />
      )}
    </div>
  );
}
