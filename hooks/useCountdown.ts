// ─── Fresh Direct — useCountdown Hook ────────────────────────────────────────
// Counts down to a specific time of day (HH:MM) and ticks every second.
// Rolls over to the next day once the target time has passed.
//
// Usage:
//   const { h, m, s } = useCountdown(16, 0); // countdown to 4:00 PM

"use client";

import { useState, useEffect } from "react";

export interface CountdownTime {
  h: number;
  m: number;
  s: number;
}

export function useCountdown(
  targetHour: number,
  targetMinute: number,
): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const now    = new Date();
      const target = new Date();
      target.setHours(targetHour, targetMinute, 0, 0);

      // If target already passed today, count to tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = Math.floor((target.getTime() - now.getTime()) / 1000);

      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    };

    calc(); // run immediately
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetHour, targetMinute]);

  return timeLeft;
}
