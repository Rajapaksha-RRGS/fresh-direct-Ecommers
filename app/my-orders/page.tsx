"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  MapPin,
  Phone,
  User,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useCartStore } from "@/store/cartStore";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface OrderItem {
  productId: string;
  farmerId: string;
  name: string;
  image: string;
  unitPrice: number;
  unit: string;
  quantity: number;
  subtotal: number;
}

interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode?: string;
}

interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  deliveryAddress: DeliveryAddress;
  trackingInfo?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Formatters ───────────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// ─── Status Configurations ───────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; bg: string; text: string; border: string; icon: React.ElementType; stepIndex: number }
> = {
  PENDING: {
    label: "Order Placed",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
    stepIndex: 1,
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: CheckCircle2,
    stepIndex: 2,
  },
  PROCESSING: {
    label: "Preparing",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    icon: RefreshCw,
    stepIndex: 2,
  },
  SHIPPED: {
    label: "Out for Delivery",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: Truck,
    stepIndex: 3,
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
    stepIndex: 4,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: XCircle,
    stepIndex: 0,
  },
};

const ORDER_STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"];

export default function MyOrdersPage() {
  const { status: authStatus } = useSession();
  const { addItem, openDrawer } = useCartStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchOrders();
    } else if (authStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [authStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders.");
      }
      setOrders(data.orders || []);
      // Auto-expand the first order if available
      if (data.orders && data.orders.length > 0) {
        setExpandedOrderId(data.orders[0]._id);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorderItem = (item: OrderItem) => {
    addItem({
      id: item.productId,
      name: item.name,
      farmerName: "Local Farmer",
      farmerId: item.farmerId,
      unit: item.unit,
      currentPrice: item.unitPrice,
      image: item.image,
    });
    setReorderSuccessId(item.productId);
    setTimeout(() => setReorderSuccessId(null), 1500);
    openDrawer();
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Filter orders by status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatusFilter === "ALL" || order.status === selectedStatusFilter;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order._id.toLowerCase().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query)) ||
      order.deliveryAddress?.city.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Calculate summary stats
  const totalAmountSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrdersCount = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status)
  ).length;

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#F8FCF8]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-5 pt-28 pb-20">
          {/* Skeleton Header */}
          <div className="animate-pulse space-y-4 mb-8">
            <div className="h-4 w-32 bg-[#E8F0E8] rounded-md" />
            <div className="h-10 w-64 bg-[#E8F0E8] rounded-xl" />
            <div className="h-16 w-full bg-[#E8F0E8] rounded-2xl" />
          </div>

          {/* Skeleton Cards */}
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-white border border-[#E8F0E8] rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="h-6 w-40 bg-[#E8F0E8] rounded-lg" />
                  <div className="h-8 w-28 bg-[#E8F0E8] rounded-full" />
                </div>
                <div className="h-20 bg-[#F0F7F0] rounded-2xl" />
                <div className="h-12 bg-[#E8F0E8] rounded-xl" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#F8FCF8] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-md mx-auto px-6 pt-32 pb-20 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-[#F0F7F0] border border-[#D0EDD8] flex items-center justify-center mb-6 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-[#3E7B27]" />
          </div>
          <h2
            className="text-2xl font-bold text-[#1A3020] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sign in to view your orders
          </h2>
          <p className="text-[#6B8F6E] text-sm mb-8">
            Please log in with your account to track your ongoing fresh produce orders and purchase history.
          </p>
          <Link
            href="/login?callbackUrl=/my-orders"
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In Now
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FCF8]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-5 pt-24 pb-24">
        {/* ── Page Header & Breadcrumbs ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B8F6E] mb-2">
            <Link href="/" className="hover:text-[#1A3020] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1A3020]">My Orders</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-extrabold text-[#1A3020] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                My Orders
              </h1>
              <p className="text-[#6B8F6E] text-sm mt-1">
                Track your farm-fresh produce deliveries and order history
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8F0E8] text-[#1A3020] text-xs font-bold shadow-sm hover:border-[#3E7B27] hover:bg-[#F0F7F0] transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Status
            </button>
          </div>
        </div>

        {/* ── Stats Highlights Bar ── */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-[#E8F0E8] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0F7F0] flex items-center justify-center text-[#3E7B27]">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#6B8F6E] uppercase tracking-wider">
                  Total Orders
                </p>
                <p className="text-2xl font-extrabold text-[#1A3020]">
                  {orders.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E8F0E8] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8EB] flex items-center justify-center text-[#F2B441]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#6B8F6E] uppercase tracking-wider">
                  In Progress
                </p>
                <p className="text-2xl font-extrabold text-[#1A3020]">
                  {activeOrdersCount}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E8F0E8] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0F7F0] flex items-center justify-center text-[#2D6A4F]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#6B8F6E] uppercase tracking-wider">
                  Total Invested
                </p>
                <p className="text-xl font-extrabold text-[#1A3020]">
                  {fmt(totalAmountSpent)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Filters & Search ── */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8F0E8] shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "ALL", label: "All Orders" },
              { id: "PENDING", label: "Pending" },
              { id: "CONFIRMED", label: "Confirmed" },
              { id: "SHIPPED", label: "Shipped" },
              { id: "DELIVERED", label: "Delivered" },
              { id: "CANCELLED", label: "Cancelled" },
            ].map((tab) => {
              const active = selectedStatusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatusFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#1A3020] text-white shadow-md"
                      : "bg-[#F8FCF8] text-[#6B8F6E] hover:bg-[#F0F7F0] hover:text-[#1A3020]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#8FAF9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order ID, items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9FBF9] border border-[#E8F0E8] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A3020] placeholder-[#8FAF9A] focus:outline-none focus:border-[#3E7B27] transition-colors"
            />
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-red-700 text-sm flex items-center justify-between">
            <p>{error}</p>
            <button
              onClick={fetchOrders}
              className="underline font-bold text-xs hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty Orders View ── */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#E8F0E8] p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F0F7F0] flex items-center justify-center text-[#3E7B27] mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#1A3020] mb-2">
              No orders found
            </h3>
            <p className="text-[#6B8F6E] text-sm max-w-sm mx-auto mb-6">
              {searchQuery || selectedStatusFilter !== "ALL"
                ? "No orders match your current filter or search criteria. Try resetting filters."
                : "You haven't placed any orders yet. Discover organic veggies and fruits directly from local farmers!"}
            </p>
            {searchQuery || selectedStatusFilter !== "ALL" ? (
              <button
                onClick={() => {
                  setSelectedStatusFilter("ALL");
                  setSearchQuery("");
                }}
                className="px-6 py-3 rounded-2xl bg-[#F0F7F0] text-[#3E7B27] font-bold text-sm hover:bg-[#E4EEE4] transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* ── Orders List ── */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedOrderId === order._id;

            return (
              <motion.article
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-[#E8F0E8] shadow-[0_4px_20px_rgba(26,48,32,0.04)] overflow-hidden transition-all duration-200"
              >
                {/* ── Order Card Header ── */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-white via-[#FBFDFB] to-white border-b border-[#F0F7F0]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Order ID & Date */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-[#1A3020] tracking-wider uppercase bg-[#F0F7F0] px-3 py-1 rounded-full border border-[#D0EDD8]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleCopyId(order._id)}
                          className="text-[#8FAF9A] hover:text-[#1A3020] transition-colors p-1"
                          title="Copy Full Order ID"
                        >
                          {copiedId === order._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-[#6B8F6E] mt-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8FAF9A]" />
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Status Badge & Expand Toggle */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusConfig.label}</span>
                      </div>

                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="w-8 h-8 rounded-full bg-[#F0F7F0] hover:bg-[#E4EEE4] text-[#1A3020] flex items-center justify-center transition-colors"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ── Delivery Stepper (Active for Non-Cancelled Orders) ── */}
                  {order.status !== "CANCELLED" && (
                    <div className="mt-6 pt-4 border-t border-[#F0F7F0]">
                      <div className="relative flex items-center justify-between max-w-xl mx-auto px-2">
                        {/* Connecting Line */}
                        <div className="absolute left-6 right-6 top-3 h-0.5 bg-[#E8F0E8] -z-0" />
                        <div
                          className="absolute left-6 top-3 h-0.5 bg-[#3E7B27] transition-all duration-500 -z-0"
                          style={{
                            width: `${
                              ((statusConfig.stepIndex - 1) / (ORDER_STEPS.length - 1)) * 100
                            }%`,
                          }}
                        />

                        {ORDER_STEPS.map((stepName, idx) => {
                          const isDone = idx + 1 <= statusConfig.stepIndex;
                          const isCurrent = idx + 1 === statusConfig.stepIndex;

                          return (
                            <div
                              key={stepName}
                              className="relative z-10 flex flex-col items-center gap-1.5"
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold transition-all ${
                                  isDone
                                    ? "bg-[#3E7B27] text-white ring-4 ring-[#F0F7F0]"
                                    : "bg-white border-2 border-[#E8F0E8] text-[#8FAF9A]"
                                } ${isCurrent ? "scale-110 shadow-md" : ""}`}
                              >
                                {isDone ? "✓" : idx + 1}
                              </div>
                              <span
                                className={`text-[0.7rem] font-bold transition-colors ${
                                  isCurrent
                                    ? "text-[#1A3020]"
                                    : isDone
                                    ? "text-[#3E7B27]"
                                    : "text-[#8FAF9A]"
                                }`}
                              >
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Order Items Preview ── */}
                <div className="p-5 sm:p-6 bg-white">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-4 pb-4 border-b border-[#F5F8F5] last:border-none last:pb-0"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-[#F0F7F0] border border-[#E8F0E8] overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#3E7B27]">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#1A3020] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#6B8F6E] mt-0.5">
                              {fmt(item.unitPrice)} per {item.unit} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-extrabold text-[#1A3020]">
                            {fmt(item.subtotal)}
                          </span>
                          
                          <button
                            onClick={() => handleReorderItem(item)}
                            className="hidden sm:flex items-center gap-1 text-[0.72rem] font-bold text-[#3E7B27] bg-[#F0F7F0] hover:bg-[#E4EEE4] px-3 py-1.5 rounded-full transition-colors"
                            title="Add item back to cart"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {reorderSuccessId === item.productId ? "Added!" : "Buy Again"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Expanded Order Details Drawer ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-[#F0F7F0] bg-[#F9FBF9] p-5 sm:p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Delivery Address & Contact */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E8F0E8]">
                          <h5 className="text-xs font-bold text-[#6B8F6E] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#3E7B27]" />
                            Delivery Details
                          </h5>
                          
                          <div className="space-y-2 text-xs text-[#1A3020]">
                            <p className="font-bold text-sm flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-[#6B8F6E]" />
                              {order.deliveryAddress?.fullName || "Valued Customer"}
                            </p>
                            <p className="flex items-center gap-1.5 text-[#4A6355]">
                              <Phone className="w-3.5 h-3.5 text-[#6B8F6E]" />
                              {order.deliveryAddress?.phone || "N/A"}
                            </p>
                            <p className="text-[#4A6355] leading-relaxed pt-1 border-t border-[#F5F8F5]">
                              {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                              {order.deliveryAddress?.postalCode ? ` - ${order.deliveryAddress.postalCode}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Payment & Invoice Summary */}
                        <div className="bg-white rounded-2xl p-4 border border-[#E8F0E8] flex flex-col justify-between">
                          <div>
                            <h5 className="text-xs font-bold text-[#6B8F6E] uppercase tracking-wider mb-3">
                              Payment Summary
                            </h5>
                            
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between text-[#6B8F6E]">
                                <span>Items Subtotal</span>
                                <span className="font-medium text-[#1A3020]">
                                  {fmt(order.totalAmount)}
                                </span>
                              </div>
                              <div className="flex justify-between text-[#6B8F6E]">
                                <span>Standard Delivery</span>
                                <span className="font-semibold text-[#3E7B27]">
                                  FREE / Included
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-[#F0F7F0]">
                                <span className="font-bold text-[#1A3020]">Total Amount</span>
                                <span className="text-base font-extrabold text-[#F2B441]">
                                  {fmt(order.totalAmount)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#F0F7F0] flex items-center justify-between text-xs">
                            <span className="text-[#6B8F6E] font-medium">
                              Payment Method: <strong className="text-[#1A3020]">Cash on Delivery</strong>
                            </span>
                            
                            {order.trackingInfo && (
                              <span className="text-[#3E7B27] font-bold bg-[#F0F7F0] px-2.5 py-1 rounded-md">
                                Tracking: {order.trackingInfo}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Order Card Footer Summary ── */}
                <div className="px-5 py-4 bg-[#F8FCF8] border-t border-[#F0F7F0] flex items-center justify-between">
                  <div className="text-xs text-[#6B8F6E]">
                    <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6B8F6E] mr-1">Total:</span>
                    <span className="text-base font-extrabold text-[#1A3020]">
                      {fmt(order.totalAmount)}
                    </span>
                  </div>
                </div>

              </motion.article>
            );
          })}
        </div>

      </main>
    </div>
  );
}
