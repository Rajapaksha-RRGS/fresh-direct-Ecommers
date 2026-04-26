"use client";

import { T } from "@/constants/dashboardData";
import { useFarmerProducts } from "@/hooks/useFarmerProducts";

import ProductForm from "@/components/inventory/ProductForm";
import CurrentStockList from "@/components/inventory/CurrentStockList";

export default function InventoryPage() {
  const { products, pagination, isLoading } = useFarmerProducts({
    page: 1,
    perPage: 10,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: T.textDark, fontFamily: "'Playfair Display', serif" }}
        >
          Inventory Management
        </h1>
        <p className="text-sm mt-1" style={{ color: T.textLight }}>
          Add new products and manage your stock listing
        </p>
      </div>

      {/* Add New Product Form */}
      <ProductForm />

      {/* Current Stock List */}
      <CurrentStockList
        items={products}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
}
