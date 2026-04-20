"use client";

import { useState } from "react";

import { T, ORDERS } from "@/constants/dashboardData";
import type { CropStatus } from "@/types/dashboard";

import FilterPills from "@/components/orders/FilterPills";
import OrderCards from "@/components/orders/OrderCards";

export default function OrdersPage() {
  const [filter, setFilter] = useState<"All" | CropStatus>("All");

  const statuses: ("All" | CropStatus)[] = [
    "All", "Ready", "Processing", "Harvesting", "Cancelled",
  ];

  const filtered =
    filter === "All" ? ORDERS : ORDERS.filter((o) => o.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: T.textDark, fontFamily: "'Playfair Display', serif" }}
        >
          Active Orders
        </h1>
        <p className="text-sm mt-1" style={{ color: T.textLight }}>
          {ORDERS.length} orders this period
        </p>
      </div>

      <FilterPills
        statuses={statuses}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <OrderCards orders={filtered} />
    </div>
  );
}
