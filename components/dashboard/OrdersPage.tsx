"use client";

import { useState, useEffect } from "react";
import { T } from "@/constants/dashboardData";
import FilterPills from "@/components/orders/FilterPills";
import OrderCards from "@/components/orders/OrderCards";
import { Loader2, RefreshCw } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  const statuses: any[] = [
    "All", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
  ];

  const fetchFarmerOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/farmer/orders");
      const data = await res.json();
      if (res.ok && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching farmer orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerOrders();
  }, []);

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: T.textDark, fontFamily: "'Playfair Display', serif" }}
          >
            Active Orders
          </h1>
          <p className="text-base sm:text-lg mt-1 font-medium" style={{ color: T.textLight }}>
            {orders.length} live orders containing your farm's produce
          </p>
        </div>

        <button
          onClick={fetchFarmerOrders}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#F0F7F0] text-[#3E7B27] hover:bg-[#E4EEE4] transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Orders
        </button>
      </div>

      <FilterPills
        statuses={statuses}
        activeFilter={filter as any}
        onFilterChange={(st) => setFilter(st)}
      />

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-[#C8DFC8]">
          <Loader2 className="w-8 h-8 text-[#3E7B27] animate-spin mb-2" />
          <p className="text-[#6B8F6E] text-xs font-semibold">Loading orders for your farm...</p>
        </div>
      ) : (
        <OrderCards orders={filtered} />
      )}
    </div>
  );
}
