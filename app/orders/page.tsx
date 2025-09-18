"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { OrdersFilters } from "@/components/orders-filters";
import { OrdersTable } from "@/components/orders-table";
import { ordersService } from "@/services";
import { Order, OrdersParams } from "@/types";
import { toast } from "sonner";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const [filters, setFilters] = useState<OrdersParams>({
    page: 1,
    limit: 10,
  });

  // Read filters from URL parameters
  const getFiltersFromURL = (): OrdersParams => {
    const params: OrdersParams = {
      page: 1,
      limit: 10,
    };

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");
    const buyerId = searchParams.get("buyerId");
    const sellerId = searchParams.get("sellerId");
    const manufacturerId = searchParams.get("manufacturerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy");

    if (page) params.page = parseInt(page, 10);
    if (limit) params.limit = parseInt(limit, 10);
    if (status && status !== "all") params.status = status as any;
    if (orderId) params.orderId = orderId;
    if (buyerId) params.buyerId = buyerId;
    if (sellerId) params.sellerId = sellerId;
    if (manufacturerId) params.manufacturerId = manufacturerId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (sortBy) params.sortBy = sortBy;

    return params;
  };

  // Update URL with current filters
  const updateURL = (newFilters: OrdersParams) => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all non-default filter values to URL
    if (newFilters.page && newFilters.page !== 1)
      urlParams.set("page", newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 10)
      urlParams.set("limit", newFilters.limit.toString());
    if (newFilters.status) urlParams.set("status", newFilters.status);
    if (newFilters.orderId) urlParams.set("orderId", newFilters.orderId);
    if (newFilters.buyerId) urlParams.set("buyerId", newFilters.buyerId);
    if (newFilters.sellerId) urlParams.set("sellerId", newFilters.sellerId);
    if (newFilters.manufacturerId)
      urlParams.set("manufacturerId", newFilters.manufacturerId);
    if (newFilters.startDate) urlParams.set("startDate", newFilters.startDate);
    if (newFilters.endDate) urlParams.set("endDate", newFilters.endDate);
    if (newFilters.sortBy) urlParams.set("sortBy", newFilters.sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  const fetchOrders = async (params: OrdersParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersService.getOrders(params);

      if (response.status === "success") {
        setOrders(response.data.results);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        });
      } else {
        setError(response.message || "Failed to fetch orders");
        toast.error(response.message || "Failed to fetch orders");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch orders when filters change
  useEffect(() => {
    if (filters.page && filters.limit) {
      fetchOrders(filters);
    }
  }, [filters]);

  const handleFiltersChange = (newFilters: OrdersParams) => {
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
        <OrdersFilters
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
        <OrdersTable
          orders={orders}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => fetchOrders(filters)}
        />
      </div>
    </SidebarInset>
  );
}
