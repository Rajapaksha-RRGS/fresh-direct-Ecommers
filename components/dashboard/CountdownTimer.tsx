"use client";

import { Clock } from "lucide-react";

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  collectionTime: string;
  message: string;
}

const T = {
  success: "#3E7B27",
} as const;

export default function CountdownTimer({
  hours,
  minutes,
  seconds,
  collectionTime,
  message,
}: CountdownTimerProps) {
  const formatTime = (num: number) => String(num).padStart(2, "0");

  return (
    <div
      className="rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden"
      style={{
        background: T.success,
        border: `1.5px solid ${T.success}`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            "radial-gradient(circle at 10% 50%, white 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-sm flex-shrink-0">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-green-100/70 text-xs font-medium uppercase tracking-widest mb-1">
            Next Collection
          </p>
          <p
            className="text-white text-xl font-extrabold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {collectionTime}
          </p>
          <p className="text-green-100/60 text-sm mt-0.5">{message}</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        {[
          { label: "HRS", value: formatTime(hours) },
          { label: "MIN", value: formatTime(minutes) },
          { label: "SEC", value: formatTime(seconds) },
        ].map((seg, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="rounded-2xl px-4 py-2 min-w-[52px] text-center"
              style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)" }}
            >
              <span className="text-white text-2xl font-extrabold tabular-nums">
                {seg.value}
              </span>
            </div>
            <span className="text-green-100/50 text-[9px] font-bold tracking-widest mt-1">
              {seg.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
