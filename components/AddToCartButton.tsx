"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    _id: string;
    farmerId: string;
    name: string;
    images?: string[];
    basePrice: number;
    unit: string;
    stockQty: number;
  };
  className: string;
  inStock: boolean;
}

export default function AddToCartButton({ product, className, inStock }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    
    addToCart({
      productId: product._id,
      farmerId: product.farmerId,
      name: product.name,
      image: product.images?.[0] || "",
      unitPrice: product.basePrice,
      unit: product.unit,
      quantity: 1,
      stockQty: product.stockQty,
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock}
      className={className}
    >
      <ShoppingCart className="w-4 h-4" />
      {inStock ? (added ? "Added!" : "Buy Now") : "Unavailable"}
    </button>
  );
}
