"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const { status } = useSession();
  const { addToCart, openDrawer } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!inStock) return;

    // ── Not signed in → redirect to login, come back to this page after ──
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // ── Signed in → add to cart + open cart drawer ──
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

    openDrawer?.();

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock || status === "loading"}
      className={className}
    >
      <ShoppingCart className="w-4 h-4" />
      {inStock
        ? added
          ? "Added!"
          : status === "loading"
          ? "..."
          : "Buy Now"
        : "Unavailable"}
    </button>
  );
}