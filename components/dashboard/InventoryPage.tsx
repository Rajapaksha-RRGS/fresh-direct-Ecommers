"use client";

import { T, CROP_TYPES, STOCK } from "@/constants/dashboardData";

import StockForm from "@/components/inventory/StockForm";
import CurrentStockList from "@/components/inventory/CurrentStockList";

export default function InventoryPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: T.textDark, fontFamily: "'Playfair Display', serif" }}
        >
          Manage Stock
        </h1>
        <p className="text-sm mt-1" style={{ color: T.textLight }}>
          Update your available produce for the marketplace
        </p>
      </div>

      <StockForm cropTypes={CROP_TYPES} />
      <CurrentStockList items={STOCK} />
    </div>
  );
}
