"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Wallet, Clock, Loader2 } from "lucide-react";
import { T } from "@/constants/dashboardData";

import EarningsSummaryCards from "@/components/payments/EarningsSummaryCards";
import MonthlyRevenueChart from "@/components/payments/MonthlyRevenueChart";
import PayoutHistory from "@/components/payments/PayoutHistory";
import { useFarmerStats } from "@/hooks/useFarmerStats";

function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function PaymentsPage() {
  const { stats, isLoading: statsLoading } = useFarmerStats();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    async function fetchAllFarmerOrders() {
      try {
        const res = await fetch("/api/farmer/orders?perPage=100");
        const data = await res.json();
        if (res.ok && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch farmer orders for payments:", err);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchAllFarmerOrders();
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter valid non-cancelled orders
  const validOrders = orders.filter((o) => o.status !== "CANCELLED");

  // Total Lifetime Earnings (from API stats or computed from orders)
  const computedTotal = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalRevenue = stats?.estimatedRevenue || computedTotal;

  // This Month Earnings
  const thisMonthRevenue = validOrders
    .filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Pending Payout (orders not yet delivered)
  const pendingRevenue = orders
    .filter((o) => ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status))
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Build last 6 months revenue array for chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyEarningsMap: Record<string, number> = {};

  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = months[d.getMonth()];
    monthlyEarningsMap[label] = 0;
  }

  // Populate actual order amounts into months
  validOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const label = months[d.getMonth()];
    if (monthlyEarningsMap[label] !== undefined) {
      monthlyEarningsMap[label] += o.totalAmount || 0;
    }
  });

  const chartData = Object.entries(monthlyEarningsMap).map(([month, amount]) => ({
    month,
    amount,
  }));

  // Build payout history list
  const payouts = Object.entries(monthlyEarningsMap)
    .filter(([_, amount]) => amount > 0)
    .map(([month, amount]) => ({
      month,
      amount,
      isPending: month === months[currentMonth] && pendingRevenue > 0,
    }));

  const summaryCards = [
    {
      label: "Total Earnings",
      value: fmt(totalRevenue),
      icon: TrendingUp,
      color: T.success,
    },
    {
      label: "This Month",
      value: fmt(thisMonthRevenue),
      icon: Wallet,
      color: "#2C4DA0",
    },
    {
      label: "Pending Payout",
      value: fmt(pendingRevenue),
      icon: Clock,
      color: T.gold,
    },
  ];

  if (ordersLoading || statsLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-[#C8DFC8]">
        <Loader2 className="w-8 h-8 text-[#3E7B27] animate-spin mb-2" />
        <p className="text-[#6B8F6E] text-xs font-semibold">Loading earnings and payment history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: T.textDark, fontFamily: "'Playfair Display', serif" }}
        >
          My Earnings
        </h1>
        <p className="text-base sm:text-lg mt-1 font-medium" style={{ color: T.textLight }}>
          Revenue overview &amp; payout history calculated directly from your live marketplace sales
        </p>
      </div>

      <EarningsSummaryCards cards={summaryCards} />
      <MonthlyRevenueChart earnings={chartData} />
      <PayoutHistory
        payouts={
          payouts.length > 0
            ? payouts
            : [{ month: months[currentMonth], amount: totalRevenue, isPending: pendingRevenue > 0 }]
        }
      />
    </div>
  );
}
