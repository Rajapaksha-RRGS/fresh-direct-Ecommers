"use client";

import { AT } from "@/constants/adminData";
import type { AdminStat } from "@/types/admin";

const cn = (...c: (string | boolean | undefined | null)[]) => c.filter(Boolean).join(" ");

interface StatCardProps {
  stat: AdminStat;
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon    = stat.icon;
  const isUp    = stat.trend !== null && stat.trend > 0;
  const isDown  = stat.trend !== null && stat.trend < 0;
  const neutral = stat.trend === null;

  return (
    <div
      className="bg-white rounded-3xl p-5 border shadow-[0_4px_20px_rgba(26,48,32,0.07)] hover:shadow-[0_8px_32px_rgba(26,48,32,0.13)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-4"
      style={{ borderColor: AT.border }}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
          style={{ background: stat.accent }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {!neutral && (
          <span
            className={cn(
              "text-[0.72rem] font-bold px-2.5 py-1 rounded-full",
              isUp
                ? "bg-[#E6F4E6] text-[#1A5C1A]"
                : "bg-[#FEE8E8] text-[#8B1C1C]",
            )}
          >
            {isUp ? "▲" : "▼"} {Math.abs(stat.trend!)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p
          className="text-[2rem] font-extrabold leading-none mb-1"
          style={{ color: AT.textDark, fontFamily: "'Playfair Display', serif" }}
        >
          {stat.value}
        </p>
        <p className="text-[0.82rem] font-bold" style={{ color: AT.textDark }}>
          {stat.label}
        </p>
        <p className="text-[0.75rem] mt-0.5" style={{ color: AT.textLight }}>
          {stat.sub}
        </p>
      </div>
    </div>
  );
}
