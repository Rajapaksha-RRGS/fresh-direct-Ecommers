/**
 * hooks/useFarmerStats.ts — SWR Hook for Dashboard Stats
 *
 * Fetches aggregated dashboard statistics (product count, sales, revenue, etc.).
 * Auto-revalidates on focus.
 *
 * Usage:
 *   const { stats, isLoading, error, mutate } = useFarmerStats();
 *   // Display stats.stats.totalProducts, etc.
 */

import useSWR from "swr";
import { IStatsResponse } from "@/types/farmerApi";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch stats");
  }
  return res.json();
};

export function useFarmerStats() {
  const { data, error, isLoading, mutate } = useSWR<IStatsResponse>(
    "/api/farmer/stats",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      refreshInterval: 30000, // Auto-refresh every 30 seconds for fresh data
    }
  );

  return {
    stats: data?.stats,
    lastUpdated: data?.lastUpdated,
    isLoading,
    error,
    mutate,
  };
}
