"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, CheckCircle2, Loader2, PlusCircle, ChevronDown } from "lucide-react";

interface StockFormProps {
  cropTypes: string[];
  onSubmit?: (data: {
    cropType: string;
    quantity: string;
    price: string;
  }) => void;
}

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  success: "#3E7B27",
  textDark: "#1A3020",
  textMid: "#3D5C42",
  textLight: "#6B8F6E",
  bg: "#F0F7F0",
} as const;

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function StockForm({ cropTypes, onSubmit }: StockFormProps) {
  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropType || !quantity) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      onSubmit?.({ cropType, quantity, price });
      setTimeout(() => {
        setSubmitted(false);
        setCropType("");
        setQuantity("");
        setPrice("");
      }, 3000);
    }, 1200);
  };

  const inputBase = cn(
    "w-full rounded-2xl px-5 py-4 text-base font-semibold",
    "transition-all duration-200 outline-none min-h-[56px]",
    "placeholder:font-normal"
  );

  return (
    <div
      className="rounded-3xl p-6 sm:p-8"
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 4px 24px rgba(26,48,32,0.08)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: `${T.success}12` }}
        >
          <Zap className="w-5 h-5" style={{ color: T.success }} />
        </div>
        <div>
          <h2 className="font-extrabold text-base" style={{ color: T.textDark }}>
            Update Stock Listing
          </h2>
          <p className="text-xs" style={{ color: T.textLight }}>
            Changes go live instantly
          </p>
        </div>
      </div>

      {submitted ? (
        <div
          className="rounded-2xl px-6 py-8 text-center"
          style={{
            background: `${T.success}10`,
            border: `2px solid ${T.success}30`,
          }}
        >
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: T.success }} />
          <p className="font-extrabold text-lg" style={{ color: T.textDark }}>
            Marketplace Updated!
          </p>
          <p className="text-sm mt-1" style={{ color: T.textLight }}>
            {cropType} · {quantity} kg is now live
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Crop Type */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Crop Type <span style={{ color: T.success }}>*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(inputBase, "flex items-center justify-between text-left")}
                style={{
                  background: T.bg,
                  border: `2px solid ${dropdownOpen ? T.success : T.border}`,
                  color: cropType ? T.textDark : T.textLight,
                  boxShadow: dropdownOpen ? `0 0 0 3px ${T.success}20` : "none",
                }}
              >
                <span>{cropType || "Select your crop..."}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                    dropdownOpen ? "rotate-180" : ""
                  )}
                  style={{ color: T.textLight }}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50 max-h-56 overflow-y-auto"
                  style={{
                    background: T.cardBg,
                    border: `2px solid ${T.border}`,
                    boxShadow: "0 8px 30px rgba(26,48,32,0.15)",
                  }}
                >
                  {cropTypes.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => {
                        setCropType(crop);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-3.5 text-sm font-semibold transition-colors duration-150"
                      style={{ color: crop === cropType ? T.success : T.textDark }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {crop === cropType && <span className="mr-2">✓</span>}
                      {crop}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Available Quantity (kg) <span style={{ color: T.success }}>*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50"
              className={inputBase}
              style={{
                background: T.bg,
                border: `2px solid ${quantity ? T.success : T.border}`,
                color: T.textDark,
                boxShadow: quantity ? `0 0 0 3px ${T.success}15` : "none",
              }}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: T.textMid }}>
              Price per kg (Rs.)
              <span className="font-normal text-xs" style={{ color: T.textLight }}>
                {" "}
                Optional
              </span>
            </label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 110"
              className={inputBase}
              style={{
                background: T.bg,
                border: `2px solid ${T.border}`,
                color: T.textDark,
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !cropType || !quantity}
            className="w-full rounded-2xl font-extrabold text-base text-white flex items-center justify-center gap-3 transition-all duration-300 min-h-[56px] mt-2 hover:-translate-y-0.5 disabled:translate-y-0"
            style={{
              background:
                loading || !cropType || !quantity
                  ? T.textLight
                  : `linear-gradient(135deg, ${T.success}, #2C6020)`,
              cursor: loading || !cropType || !quantity ? "not-allowed" : "pointer",
              boxShadow:
                loading || !cropType || !quantity
                  ? "none"
                  : `0 8px 24px ${T.success}50`,
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating Marketplace…
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Update Marketplace
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
