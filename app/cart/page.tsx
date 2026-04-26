"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, Building, CircleCheck, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, cartCount } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Default address fields (would ideally come from user profile)
  const [address, setAddress] = useState({
    fullName: session?.user?.name || "",
    phone: "",
    street: "",
    city: "",
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!session) {
      alert("Please login first to place an order.");
      // router.push("/login?callbackUrl=/cart");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: getCartTotal(),
          deliveryAddress: address,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to place order");
      }

      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F0F7F0] font-sans pt-20 pb-10 px-4 flex flex-col items-center">
        <CircleCheck className="w-20 h-20 text-[#3E7B27] mb-6" />
        <h1 className="text-3xl font-extrabold text-[#1A3020] mb-4 text-center">Order Placed Successfully!</h1>
        <p className="text-[#4A6355] text-center mb-8 max-w-md">
          Thank you for supporting local farmers! Your fresh produce will be delivered to you soon.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:-translate-y-1 transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F0] font-sans pb-20">
      <nav className="bg-white/90 backdrop-blur-[12px] border-b border-[#C8DFC8] shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-[#3D5C42] hover:text-[#1A3020] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="font-extrabold text-[#1A3020] text-xl flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#3E7B27]" />
            Your Cart
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#C8DFC8] p-12 flex flex-col items-center text-center shadow-sm">
            <ShoppingCart className="w-16 h-16 text-[#C8DFC8] mb-4" />
            <h2 className="text-xl font-bold text-[#1A3020] mb-2">Your cart is empty</h2>
            <p className="text-[#6B8F6E] mb-6">Looks like you haven't added any fresh produce yet.</p>
            <Link
              href="/"
              className="bg-[#1A3020] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#3E7B27] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl border border-[#C8DFC8] p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8F0E8] pb-4 mb-4">
                  <h2 className="font-bold text-[#1A3020] text-lg">Items ({cartCount})</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-500 text-sm font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-[#F0F7F0] rounded-xl overflow-hidden flex-shrink-0 border border-[#E8F0E8] flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building className="text-[#C8DFC8] w-8 h-8" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-extrabold text-[#1A3020] text-[0.95rem]">{item.name}</h3>
                        <p className="text-[#6B8F6E] text-sm">
                          Rs. {item.unitPrice} / {item.unit}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-[#C8DFC8] rounded-xl overflow-hidden h-8">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-full flex items-center justify-center bg-[#F8FCF8] hover:bg-[#E8F0E8] text-[#1A3020 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-[#1A3020] bg-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-full flex items-center justify-center bg-[#F8FCF8] hover:bg-[#E8F0E8] text-[#1A3020 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right pl-4">
                        <span className="font-extrabold text-[#1A3020] block">
                          Rs. {item.unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-[#C8DFC8] p-6 shadow-sm sticky top-24">
                <h2 className="font-bold text-[#1A3020] text-lg mb-4">Order Summary</h2>
                
                <div className="space-y-3 pb-4 border-b border-[#E8F0E8] mb-4">
                  <div className="flex justify-between text-[#4A6355]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1A3020]">Rs. {getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-[#4A6355]">
                    <span>Delivery</span>
                    <span className="text-[#3E7B27] font-semibold">Free</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-extrabold text-[#1A3020] mb-6">
                  <span>Total</span>
                  <span>Rs. {getCartTotal()}</span>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <h3 className="font-bold text-[#1A3020] text-sm mb-2 pt-2 border-t border-[#E8F0E8]">
                    Delivery Details
                  </h3>
                  
                  {!session && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-xl text-xs flex gap-2 mb-4">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>You are not logged in. You need to log in to place an order.</span>
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#C8DFC8] text-sm focus:outline-none focus:border-[#3E7B27] focus:ring-1 focus:ring-[#3E7B27]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#C8DFC8] text-sm focus:outline-none focus:border-[#3E7B27] focus:ring-1 focus:ring-[#3E7B27]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#C8DFC8] text-sm focus:outline-none focus:border-[#3E7B27] focus:ring-1 focus:ring-[#3E7B27]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#C8DFC8] text-sm focus:outline-none focus:border-[#3E7B27] focus:ring-1 focus:ring-[#3E7B27]"
                  />

                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading || !session}
                    className="w-full bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white font-bold py-3.5 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none min-h-[52px]"
                  >
                    {loading ? "Processing..." : session ? "Place Order" : "Login to Order"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
