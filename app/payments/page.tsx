"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { PaymentsFilters } from "@/components/payments-filters";
import { PaymentsTable } from "@/components/payments-table";
import { Payment, PaymentsParams, PaymentsResponse } from "@/types/payments";
import { paymentsService } from "@/services";
import { showToast } from "@/utils";

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });
  const [filters, setFilters] = useState<PaymentsParams>({
    page: 1,
    limit: 10,
  });

  // Read filters from URL parameters
  const getFiltersFromURL = (): PaymentsParams => {
    const params: PaymentsParams = {
      page: 1,
      limit: 10,
    };

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const status = searchParams.get("status");
    const gateway = searchParams.get("gateway");
    const transactionId = searchParams.get("transactionId");
    const buyerEmail = searchParams.get("buyerEmail");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy");

    if (page) params.page = parseInt(page, 10);
    if (limit) params.limit = parseInt(limit, 10);
    if (status && status !== "all") params.status = status as any;
    if (gateway && gateway !== "all") params.gateway = gateway as any;
    if (transactionId) params.transactionId = transactionId;
    if (buyerEmail) params.buyerEmail = buyerEmail;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    params.sortBy = sortBy || "-createdAt"; // Always include sortBy with default

    return params;
  };

  // Update URL with current filters
  const updateURL = (newFilters: PaymentsParams) => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all non-default filter values to URL
    if (newFilters.page && newFilters.page !== 1)
      urlParams.set("page", newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 10)
      urlParams.set("limit", newFilters.limit.toString());
    if (newFilters.status) urlParams.set("status", newFilters.status);
    if (newFilters.gateway) urlParams.set("gateway", newFilters.gateway);
    if (newFilters.transactionId)
      urlParams.set("transactionId", newFilters.transactionId);
    if (newFilters.buyerEmail)
      urlParams.set("buyerEmail", newFilters.buyerEmail);
    if (newFilters.startDate) urlParams.set("startDate", newFilters.startDate);
    if (newFilters.endDate) urlParams.set("endDate", newFilters.endDate);
    if (newFilters.sortBy) urlParams.set("sortBy", newFilters.sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  const fetchPayments = async (params: PaymentsParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response: PaymentsResponse = await paymentsService.getPayments(
        params
      );

      if (response.status === "success") {
        setPayments(response.data.results);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        });
      } else {
        setError(response.message || "Failed to fetch payments");
        showToast.error(response.message || "Failed to fetch payments");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch payments";
      setError(errorMessage);
      showToast.error(errorMessage);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch payments when filters change
  useEffect(() => {
    if (filters.page && filters.limit) {
      fetchPayments(filters);
    }
  }, [filters]);

  const handleFiltersChange = (newFilters: PaymentsParams) => {
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
        <PaymentsFilters
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
        <PaymentsTable
          payments={payments}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => fetchPayments(filters)}
        />
      </div>
    </SidebarInset>
  );
}
