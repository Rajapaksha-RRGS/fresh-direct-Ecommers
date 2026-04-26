"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function CartNavButton() {
  const { cartCount } = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-[#3D5C42] hover:text-[#1A3020] transition-colors relative"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        {mounted && cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#F2B441] text-[#1A3020] text-[0.65rem] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </div>
      <span className="hidden sm:inline ml-1">Cart</span>
    </Link>
  );
}

import React from "react";
