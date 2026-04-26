"use client";

import { TrendingUp, Wallet, Clock } from "lucide-react";

import { T, EARNINGS } from "@/constants/dashboardData";

import EarningsSummaryCards from "@/components/payments/EarningsSummaryCards";
import MonthlyRevenueChart from "@/components/payments/MonthlyRevenueChart";
import PayoutHistory from "@/components/payments/PayoutHistory";

export default function PaymentsPage() {
  const total = EARNINGS.reduce((sum, e) => sum + e.amount, 0);

  const summaryCards = [
    {
      label: "Total (6 months)",
      value: `Rs. ${total.toLocaleString()}`,
      icon:  TrendingUp,
      color: T.success,
    },
    {
      label: "This Month",
      value: "Rs. 47,200",
      icon:  Wallet,
      color: "#2C4DA0",
    },
    {
      label: "Pending Payout",
      value: "Rs. 24,650",
      icon:  Clock,
      color: T.gold,
    },
  ];

  const payouts = EARNINGS.map((e) => ({
    month:     e.month,
    amount:    e.amount,
    isPending: e.month === "Apr",
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: T.textDark, fontFamily: "'Playfair Display', serif" }}
        >
          My Earnings
        </h1>
        <p className="text-sm mt-1" style={{ color: T.textLight }}>
          Revenue overview &amp; payout history
        </p>
      </div>

      <EarningsSummaryCards cards={summaryCards} />
      <MonthlyRevenueChart earnings={EARNINGS} />
      <PayoutHistory payouts={payouts} />
    </div>
  );
}
