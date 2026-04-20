"use client";

import { TrendingUp, ShoppingBag, Wallet } from "lucide-react";

import { T, FARMER, ORDERS, EARNINGS } from "@/constants/dashboardData";
import { useCountdown } from "@/hooks/useCountdown";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import CountdownTimer from "@/components/dashboard/CountdownTimer";
import OrdersTable from "@/components/dashboard/OrdersTable";

export default function DashboardPage() {
  const countdown    = useCountdown(16, 0);
  const recentOrders = ORDERS.slice(0, 5);
  const todayRevenue = EARNINGS[EARNINGS.length - 1].amount;

  const statCards = [
    {
      label:    "Total Earnings",
      sublabel: "Today",
      value:    "Rs. 4,280",
      change:   "+18.4%",
      positive: true  as boolean | null,
      icon:     TrendingUp,
      accent:   T.success,
      badge:    null as string | null,
    },
    {
      label:    "New Orders",
      sublabel: "Awaiting action",
      value:    "7",
      change:   "2 new",
      positive: true  as boolean | null,
      icon:     ShoppingBag,
      accent:   "#2C4DA0",
      badge:    "2 NEW",
    },
    {
      label:    "Pending Payout",
      sublabel: "Next Thursday",
      value:    "Rs. 24,650",
      change:   "Rs. 6,300 held",
      positive: null  as boolean | null,
      icon:     Wallet,
      accent:   T.gold,
      badge:    null as string | null,
    },
  ];

  return (
    <div className="space-y-5">
      <WelcomeBanner
        farmerName={FARMER.name}
        farmName={FARMER.farm}
        location={FARMER.location}
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
