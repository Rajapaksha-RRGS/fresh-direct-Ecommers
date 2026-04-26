/**
 * hooks/useFarmerOrders.ts — SWR Hook for Orders (Paginated)
 *
 * Fetches paginated orders containing items from this farmer's products.
 *
 * Usage:
 *   const { orders, pagination, isLoading, error, mutate } = useFarmerOrders({ page: 1, perPage: 10 });
 */

import useSWR from "swr";
import { IOrdersListResponse } from "@/types/farmerApi";

interface PaginationParams {
  page?: number;
  perPage?: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch orders");
  }
  return res.json();
};

export function useFarmerOrders(params?: PaginationParams) {
  const page = params?.page || 1;
  const perPage = params?.perPage || 10;

  const queryString = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  }).toString();

  const { data, error, isLoading, mutate } = useSWR<IOrdersListResponse>(
    `/api/farmer/orders?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      refreshInterval: 60000, // Auto-refresh every 60 seconds
    }
  );

  return {
    orders: data?.orders || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}
