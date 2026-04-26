/**
 * hooks/useFarmerProducts.ts — SWR Hook for Products (Paginated)
 *
 * Fetches paginated products for the farmer.
 * Supports adding, updating, and deleting products with optimistic updates.
 *
 * Usage:
 *   const { products, pagination, isLoading, error, mutate, addProduct, updateProduct, deleteProduct }
 *     = useFarmerProducts({ page: 1, perPage: 10 });
 */

import useSWR from "swr";
import { IProductsListResponse, ICreateProductRequest, IUpdateProductRequest } from "@/types/farmerApi";

interface PaginationParams {
  page?: number;
  perPage?: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch products");
  }
  return res.json();
};

export function useFarmerProducts(params?: PaginationParams) {
  const page = params?.page || 1;
  const perPage = params?.perPage || 10;

  const queryString = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  }).toString();

  const { data, error, isLoading, mutate } = useSWR<IProductsListResponse>(
    `/api/farmer/products?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  // Optimistic add product
  const addProduct = async (productData: ICreateProductRequest) => {
    try {
      const response = await fetch("/api/farmer/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product");
      }

      const newProduct = await response.json();

      // Optimistically update local data
      if (data) {
        mutate({
          ...data,
          products: [newProduct, ...data.products],
          pagination: {
            ...data.pagination,
            total: data.pagination.total + 1,
          },
        }, false);
      }

      // Revalidate to get fresh data
      mutate();

      return newProduct;
    } catch (error) {
      throw error;
    }
  };

  // Update product
  const updateProduct = async (productId: string, updateData: IUpdateProductRequest) => {
    try {
      const response = await fetch(`/api/farmer/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
      }

      // Revalidate to get fresh data
      mutate();

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/farmer/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete product");
      }

      // Optimistically remove from local data
      if (data) {
        mutate({
          ...data,
          products: data.products.filter((p) => p.id !== productId),
          pagination: {
            ...data.pagination,
            total: data.pagination.total - 1,
          },
        }, false);
      }

      // Revalidate to get fresh data
      mutate();
    } catch (error) {
      throw error;
    }
  };

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
