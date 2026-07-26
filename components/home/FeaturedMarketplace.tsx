"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard, { ProductCardProps } from "@/components/product/ProductCard";

export default function FeaturedMarketplace() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/product");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to fetch featured products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-[#2D6A4F] font-semibold">
        Loading Featured Products... 🌾
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <section id="marketplace" className="py-12 lg:py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex justify-between items-end mb-10 lg:mb-14 flex-wrap gap-6">
          <div>
            <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#2D6A4F]">
              Live Marketplace
            </span>
            <h2
              className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3vw,2.4rem)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Fresh From the Fields Today
            </h2>
            <p className="text-[0.95rem] text-[#4A6355] leading-[1.7] mt-2">
              Prices update dynamically based on real-time demand
            </p>
          </div>
          <Link
            href="/marketplace"
            id="see-all-products"
            className="no-underline font-bold text-[0.9rem] text-[#2D6A4F] border-2 border-[#2D6A4F] px-7 py-3 rounded-full whitespace-nowrap hover:bg-[#2D6A4F] hover:text-white hover:-translate-y-0.5 transition-all duration-200"
          >
            See All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-[#1A3020] font-bold text-[1rem] mb-2">
                No featured products available
              </p>
              <p className="text-[#6B8F6E] text-[0.85rem]">
                Please check back later for fresh produce!
              </p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}