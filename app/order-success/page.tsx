"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8FCF8] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#3E7B27] to-[#1A3020] flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1
            className="text-[#1A3020] font-bold text-3xl mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-[#6B8F6E] text-lg mb-2">
            Thank you for your order.
          </p>
          <p className="text-[#8FAF9A] text-sm mb-8">
            We've received your order and will process it shortly. You'll receive a confirmation email with tracking details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Link
            href="/"
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Back to Marketplace
          </Link>
          
          <Link
            href="/my-orders"
            className="w-full py-4 rounded-2xl border-2 border-[#3E7B27] text-[#3E7B27] font-bold flex items-center justify-center gap-2 hover:bg-[#F0F7F0] transition-colors duration-200"
          >
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-4 bg-white rounded-2xl border border-[#E8F0E8]"
        >
          <p className="text-[#6B8F6E] text-sm">
            <span className="font-bold text-[#1A3020]">Estimated Delivery:</span> 2-3 business days
          </p>
        </motion.div>
      </div>
    </div>
  );
}
