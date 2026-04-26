/**
 * hooks/useFarmerProfile.ts — SWR Hook for Farmer Profile
 *
 * Fetches and manages the farmer's profile including verification status.
 * Auto-revalidates when the window regains focus (SWR default behavior).
 *
 * Usage:
 *   const data = useFarmerProfile();
 *   if (data.isPending) show warning banner
 */

import useSWR from "swr";
import { IFarmerProfileResponse } from "@/types/farmerApi";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch profile");
  }
  return res.json();
};

export function useFarmerProfile() {
  const { data, error, isLoading, mutate } = useSWR<IFarmerProfileResponse>(
    "/api/farmer/profile",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
    }
  );

  return {
    profile: data,
    isLoading,
    error,
    mutate,
    isPending: data?.status === "PENDING",
    isApproved: data?.status === "APPROVED",
  };
}
