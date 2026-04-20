import Link from "next/link";
import { Sprout, ChevronLeft } from "lucide-react";

export default function FarmerNotFound() {
  return (
    <div className="min-h-screen bg-[#F0F7F0] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(26,48,32,0.25)]">
        <Sprout className="w-12 h-12 text-white" />
      </div>

      <h1
        className="text-[2rem] font-extrabold text-[#1A3020] mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Farmer Not Found
      </h1>
      <p className="text-[#4A6355] text-[0.95rem] mb-8 max-w-[360px] leading-relaxed">
        This farmer profile doesn&apos;t exist or hasn&apos;t been approved yet. Discover other verified farmers on our marketplace.
      </p>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white font-bold text-[0.9rem] px-8 py-3.5 rounded-2xl min-h-[48px] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_6px_24px_rgba(26,48,32,0.3)]"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>
    </div>
  );
}
