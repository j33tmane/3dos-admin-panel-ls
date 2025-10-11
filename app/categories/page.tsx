"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { CategoriesFilters } from "@/components/categories-filters";
import { CategoriesTable } from "@/components/categories-table";
import { CategoriesStats } from "@/components/categories-stats";
import { categoriesService } from "@/services";
import { Category, CategoriesParams, CategoryStats } from "@/types";
import { toast } from "sonner";

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalResults: 0,
  });
  const [filters, setFilters] = useState<CategoriesParams>({
    page: 1,
    limit: 20,
  });

  // Read filters from URL parameters
  const getFiltersFromURL = (): CategoriesParams => {
    const params: CategoriesParams = {
      page: 1,
      limit: 20,
    };

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const name = searchParams.get("name");
    const slug = searchParams.get("slug");
    const parent = searchParams.get("parent");
    const isActive = searchParams.get("isActive");
    const level = searchParams.get("level");
    const sortBy = searchParams.get("sortBy");

    if (page) params.page = parseInt(page, 10);
    if (limit) params.limit = parseInt(limit, 10);
    if (name) params.name = name;
    if (slug) params.slug = slug;
    if (parent) params.parent = parent;
    if (isActive && isActive !== "all") params.isActive = isActive === "true";
    if (level) params.level = parseInt(level, 10);
    params.sortBy = sortBy || "-createdAt"; // Always include sortBy with default

    return params;
  };

  // Update URL with current filters
  const updateURL = (newFilters: CategoriesParams) => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all non-default filter values to URL
    if (newFilters.page && newFilters.page !== 1)
      urlParams.set("page", newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 20)
      urlParams.set("limit", newFilters.limit.toString());
    if (newFilters.name) urlParams.set("name", newFilters.name);
    if (newFilters.slug) urlParams.set("slug", newFilters.slug);
    if (newFilters.parent) urlParams.set("parent", newFilters.parent);
    if (newFilters.isActive !== undefined) urlParams.set("isActive", newFilters.isActive.toString());
    if (newFilters.level) urlParams.set("level", newFilters.level.toString());
    if (newFilters.sortBy) urlParams.set("sortBy", newFilters.sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  const fetchCategories = async (params: CategoriesParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoriesService.getCategories(params);

      if (response.status === "success") {
        setCategories(response.data.results);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        });
      } else {
        setError(response.message || "Failed to fetch categories");
        toast.error(response.message || "Failed to fetch categories");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch categories";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await categoriesService.getCategoryStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching category stats:", err);
    }
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch categories when filters change
  useEffect(() => {
    if (filters.page && filters.limit) {
      fetchCategories(filters);
    }
  }, [filters]);

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const handleFiltersChange = (newFilters: CategoriesParams) => {
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
        <CategoriesStats stats={stats} loading={loading} />
        <CategoriesFilters
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
        <CategoriesTable
          categories={categories}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => fetchCategories(filters)}
        />
      </div>
    </SidebarInset>
  );
}
