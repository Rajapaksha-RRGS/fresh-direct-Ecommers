/**
 * hooks/useAdminApi.ts — Custom hooks for admin API endpoints
 *
 * Provides data fetching hooks for all admin endpoints with loading/error states.
 */

import { useState, useEffect } from "react";
import type {
  GetFarmersResponse,
  GetAnalyticsResponse,
  GetProductsResponse,
  GetPricingConfigResponse,
  FarmerOverviewItem,
  AnalyticsData,
  ProductOverviewItem,
  PricingConfigData,
} from "@/types/adminApi";

// ─── Generic fetch hook ──────────────────────────────────────────────────────

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook: Fetch farmers list with optional status filter
 */
export function useFarmers(status?: string) {
  const [state, setState] = useState<UseFetchState<FarmerOverviewItem[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setState({ data: null, loading: true, error: null });

        const url = new URL("/api/admin/farmers", window.location.origin);
        if (status) url.searchParams.append("status", status);

        const res = await fetch(url.toString());

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch farmers");
        }

        const result: GetFarmersResponse = await res.json();
        setState({ data: result.data, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    fetchFarmers();
  }, [status]);

  return state;
}

/**
 * Hook: Fetch dashboard analytics
 *
 * Returns all the usual data/loading/error fields PLUS a `refetch()` function.
 * Call `refetch()` after any mutation (e.g. approving a farmer) to re-sync
 * the stats cards without a page reload.
 */
export function useAnalytics() {
  const [state, setState] = useState<UseFetchState<AnalyticsData>>({
    data: null,
    loading: true,
    error: null,
  });

  // Incrementing this key re-runs the useEffect fetch.
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const res = await fetch("/api/admin/analytics");

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch analytics");
        }

        const result: GetAnalyticsResponse = await res.json();
        setState({ data: result.data, loading: false, error: null });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    };

    fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  /** Call this after any write operation to re-sync analytics from the DB. */
  const refetch = () => setRefetchKey((k) => k + 1);

  return { ...state, refetch };
}

/**
 * Hook: Fetch products with sorting
 */
export function useProducts(
  sortBy: "demandScore" | "stockQty" | "currentPrice" | "totalSold" = "demandScore",
  order: "asc" | "desc" = "desc",
  status?: string
) {
  const [state, setState] = useState<UseFetchState<ProductOverviewItem[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setState({ data: null, loading: true, error: null });

        const url = new URL("/api/admin/products", window.location.origin);
        url.searchParams.append("sortBy", sortBy);
        url.searchParams.append("order", order);
        if (status) url.searchParams.append("status", status);

        const res = await fetch(url.toString());

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch products");
        }

        const result: GetProductsResponse = await res.json();
        setState({ data: result.data, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    fetchProducts();
  }, [sortBy, order, status]);

  return state;
}

/**
 * Hook: Fetch pricing configuration
 */
export function usePricingConfig() {
  const [state, setState] = useState<UseFetchState<PricingConfigData>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPricingConfig = async () => {
      try {
        setState({ data: null, loading: true, error: null });

        const res = await fetch("/api/admin/pricing/config");

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch pricing config");
        }

        const result: GetPricingConfigResponse = await res.json();
        setState({ data: result.data, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    fetchPricingConfig();
  }, []);

  return state;
}

/**
 * Hook: Update pricing configuration (mutation)
 */
export function useUpdatePricingConfig() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    demandSensitivity?: number,
    supplySensitivity?: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/pricing/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandSensitivity, supplySensitivity }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update pricing config");
      }

      return await res.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

/**
 * Hook: Verify farmer (mutation)
 */
export function useVerifyFarmer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (
    farmerId: string,
    action: "APPROVE" | "REJECT",
    reason?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/farmers/${farmerId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to verify farmer");
      }

      return await res.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, error };
}
