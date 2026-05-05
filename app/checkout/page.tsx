"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ChevronLeft, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";

// Price Formatter (CartDrawer එකේ වගේම)
function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();

  // බඩු මුකුත් නැත්නම් Cart එකට යවනවා
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FCF8] p-6">
        <h2 className="text-[#1A3020] text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/" className="text-[#3E7B27] font-semibold flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FCF8] pb-20">
      {/* --- Header --- */}
      <header className="bg-white border-b border-[#E8F0E8] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#6B8F6E] hover:text-[#1A3020] transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Back</span>
          </Link>
          <h1 className="text-[#1A3020] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Checkout
          </h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Left Column: Form Details --- */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact Information */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8F0E8]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#F0F7F0] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#3E7B27]" />
                </div>
                <h3 className="text-[#1A3020] font-bold text-[1.1rem]">Contact Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-[#F9F9F9] border border-[#E8F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3E7B27] transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">Phone Number</label>
                    <input type="tel" placeholder="07x xxx xxxx" className="w-full bg-[#F9F9F9] border border-[#E8F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3E7B27] transition-colors" />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Delivery Address */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8F0E8]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#F0F7F0] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#3E7B27]" />
                </div>
                <h3 className="text-[#1A3020] font-bold text-[1.1rem]">Delivery Address</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">Street Address</label>
                  <textarea rows={3} placeholder="No, Street, City" className="w-full bg-[#F9F9F9] border border-[#E8F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3E7B27] transition-colors resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">City</label>
                    <input type="text" placeholder="Colombo" className="w-full bg-[#F9F9F9] border border-[#E8F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3E7B27] transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">Postal Code</label>
                    <input type="text" placeholder="10100" className="w-full bg-[#F9F9F9] border border-[#E8F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3E7B27] transition-colors" />
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* --- Right Column: Order Summary --- */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8F0E8] sticky top-24">
              <div className="flex items-center gap-3 mb-6 border-b border-[#F0F7F0] pb-4">
                <ShoppingBag className="w-5 h-5 text-[#3E7B27]" />
                <h3 className="text-[#1A3020] font-bold text-[1.1rem]">Order Summary</h3>
              </div>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F0F7F0] overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-[0.85rem] font-bold text-[#1A3020] leading-tight">{item.name}</p>
                        <p className="text-[0.72rem] text-[#6B8F6E]">Qty: {item.qty} × {fmt(item.currentPrice)}</p>
                      </div>
                    </div>
                    <span className="text-[0.85rem] font-bold text-[#1A3020]">{fmt(item.currentPrice * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-[#F0F7F0] pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B8F6E]">Subtotal</span>
                  <span className="font-semibold text-[#1A3020]">{fmt(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B8F6E]">Delivery Fee</span>
                  <span className="font-semibold text-[#3E7B27]">Calculated at next step</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#F0F7F0]">
                  <span className="text-[#1A3020] font-bold">Total</span>
                  <span className="text-xl font-extrabold text-[#F2B441]">{fmt(total)}</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white font-bold text-[1rem] shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200">
                Confirm Order
              </button>
              
              <p className="text-center text-[0.7rem] text-[#8FAF9A] mt-4 flex items-center justify-center gap-1">
                <CreditCard className="w-3 h-3" /> Secure Checkout Powered by FreshDirect
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}