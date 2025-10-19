"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { UIComponentsTable } from "@/components/ui-components-table";
import { UIComponentsFilters } from "@/components/ui-components-filters";
import { uiComponentsService } from "@/services";
import { UIComponent, UIComponentsParams } from "@/types";
import { toast } from "sonner";

export default function UIComponentsPage() {
  const router = useRouter();

  const [components, setComponents] = useState<UIComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const [filters, setFilters] = useState<UIComponentsParams>({
    page: 1,
    limit: 10,
  });

  const fetchComponents = async (params: UIComponentsParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await uiComponentsService.getUIComponents(params);

      if (response.status === "success") {
        setComponents(response.data.results);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        });
      } else {
        setError(response.message || "Failed to fetch UI components");
        toast.error(response.message || "Failed to fetch UI components");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch UI components";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching UI components:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch components when filters change
  useEffect(() => {
    if (filters.page && filters.limit) {
      fetchComponents(filters);
    }
  }, [filters]);

  const handleFiltersChange = (newFilters: UIComponentsParams) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
  };

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UIComponentsFilters
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
        <UIComponentsTable
          components={components}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => fetchComponents(filters)}
        />
      </div>
    </SidebarInset>
  );
}
