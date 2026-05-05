"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ChevronLeft, CreditCard, ShoppingBag, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

interface FormData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const total = totalPrice();
  const count = totalItems();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleConfirmOrder = async () => {
    setSubmitError("");
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        farmerId: item.farmerId,
        name: item.name,
        image: item.image || "",
        unitPrice: item.currentPrice,
        unit: item.unit,
        quantity: item.qty,
        subtotal: item.currentPrice * item.qty,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: total,
          deliveryAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setSubmitSuccess(true);
      clearCart();

      setTimeout(() => {
        router.push("/order-success");
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while placing your order";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FCF8] pb-20">
      <header className="bg-white border-b border-[#E8F0E8] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#6B8F6E] hover:text-[#1A3020] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Back</span>
          </Link>
          <h1
            className="text-[#1A3020] font-bold text-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Checkout
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            
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
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full bg-[#F9F9F9] border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        errors.fullName ? "border-red-400 focus:border-red-400" : "border-[#E8F0E8] focus:border-[#3E7B27]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 ml-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="07x xxx xxxx"
                      className={`w-full bg-[#F9F9F9] border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        errors.phone ? "border-red-400 focus:border-red-400" : "border-[#E8F0E8] focus:border-[#3E7B27]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 ml-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

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
                  <textarea
                    rows={3}
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="No, Street, City"
                    className={`w-full bg-[#F9F9F9] border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${
                      errors.street ? "border-red-400 focus:border-red-400" : "border-[#E8F0E8] focus:border-[#3E7B27]"
                    }`}
                  />
                  {errors.street && (
                    <p className="text-xs text-red-500 ml-1">{errors.street}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Colombo"
                      className={`w-full bg-[#F9F9F9] border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        errors.city ? "border-red-400 focus:border-red-400" : "border-[#E8F0E8] focus:border-[#3E7B27]"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 ml-1">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.75rem] font-bold text-[#6B8F6E] uppercase ml-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="10100"
                      className={`w-full bg-[#F9F9F9] border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                        errors.postalCode ? "border-red-400 focus:border-red-400" : "border-[#E8F0E8] focus:border-[#3E7B27]"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-red-500 ml-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 text-sm">Order Error</p>
                  <p className="text-red-600 text-sm mt-1">{submitError}</p>
                </div>
              </motion.div>
            )}

          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8F0E8] sticky top-24">
              <div className="flex items-center gap-3 mb-6 border-b border-[#F0F7F0] pb-4">
                <ShoppingBag className="w-5 h-5 text-[#3E7B27]" />
                <h3 className="text-[#1A3020] font-bold text-[1.1rem]">Order Summary</h3>
              </div>

              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F0F7F0] overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-[0.85rem] font-bold text-[#1A3020] leading-tight">{item.name}</p>
                        <p className="text-[0.72rem] text-[#6B8F6E]">
                          Qty: {item.qty} × {fmt(item.currentPrice)}
                        </p>
                      </div>
                    </div>
                    <span className="text-[0.85rem] font-bold text-[#1A3020]">
                      {fmt(item.currentPrice * item.qty)}
                    </span>
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

              <motion.button
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-bold text-[1rem] shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white hover:shadow-xl hover:translate-y-[-2px]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Order Placed!
                  </>
                ) : (
                  "Confirm Order"
                )}
              </motion.button>
              
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