"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProductsFilters } from "@/components/products-filters";
import { ProductsTable } from "@/components/products-table";
import { productsService } from "@/services";
import { Product, ProductsParams } from "@/types";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const [filters, setFilters] = useState<ProductsParams>({
    page: 1,
    limit: 10,
  });

  // Read filters from URL parameters
  const getFiltersFromURL = (): ProductsParams => {
    const params: ProductsParams = {
      page: 1,
      limit: 10,
    };

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const title = searchParams.get("title");
    const material = searchParams.get("material");
    const status = searchParams.get("status");
    const isPrivate = searchParams.get("isPrivate");
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("category");
    const sortBy = searchParams.get("sortBy");

    if (page) params.page = parseInt(page, 10);
    if (limit) params.limit = parseInt(limit, 10);
    if (title) params.title = title;
    if (material) params.material = material;
    if (status && status !== "all") params.status = status === "active";
    if (isPrivate && isPrivate !== "all")
      params.isPrivate = isPrivate === "private";
    if (userId) params.userId = userId;
    if (categoryId) params.categoryId = categoryId;
    params.sortBy = sortBy || "-createdAt"; // Always include sortBy with default

    return params;
  };

  // Update URL with current filters
  const updateURL = (newFilters: ProductsParams) => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all non-default filter values to URL
    if (newFilters.page && newFilters.page !== 1)
      urlParams.set("page", newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 10)
      urlParams.set("limit", newFilters.limit.toString());
    if (newFilters.title) urlParams.set("title", newFilters.title);
    if (newFilters.material) urlParams.set("material", newFilters.material);
    if (newFilters.status !== undefined)
      urlParams.set("status", newFilters.status ? "active" : "inactive");
    if (newFilters.isPrivate !== undefined)
      urlParams.set("isPrivate", newFilters.isPrivate ? "private" : "public");
    if (newFilters.userId) urlParams.set("userId", newFilters.userId);
    if (newFilters.sortBy && newFilters.sortBy !== "-createdAt")
      urlParams.set("sortBy", newFilters.sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  const fetchProducts = async (params: ProductsParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsService.getProducts(params);

      if (response.status === "success") {
        setProducts(response.data.results);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        });
      } else {
        setError(response.message || "Failed to fetch products");
        toast.error(response.message || "Failed to fetch products");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    if (filters.page && filters.limit) {
      fetchProducts(filters);
    }
  }, [filters]);

  const handleFiltersChange = (newFilters: ProductsParams) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ProductsFilters
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
        <ProductsTable
          products={products}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => fetchProducts(filters)}
        />
      </div>
    </SidebarInset>
  );
}
