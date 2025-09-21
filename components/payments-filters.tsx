"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentsParams } from "@/types/payments";

interface PaymentsFiltersProps {
  onFiltersChange: (filters: PaymentsParams) => void;
  loading?: boolean;
}

export function PaymentsFilters({
  onFiltersChange,
  loading = false,
}: PaymentsFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [transactionId, setTransactionId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    // Check if clearAll parameter is present - if so, reset all filters
    const clearAll = searchParams.get("clearAll");
    if (clearAll === "true") {
      // Reset all filters to default values
      setTransactionId("");
      setStatusFilter("all");
      setGatewayFilter("all");
      setBuyerEmail("");
      setStartDate("");
      setEndDate("");
      setSortBy("-createdAt");
      setShowFilters(false);

      // Remove clearAll parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("clearAll");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
      // Notify parent with reset filters
      const resetFilters: PaymentsParams = {
        page: 1,
        limit: 10,
      };
      onFiltersChange(resetFilters);
      return;
    }

    const urlTransactionId = searchParams.get("transactionId") || "";
    const urlStatus = searchParams.get("status") || "all";
    const urlGateway = searchParams.get("gateway") || "all";
    const urlBuyerEmail = searchParams.get("buyerEmail") || "";
    const urlStartDate = searchParams.get("startDate") || "";
    const urlEndDate = searchParams.get("endDate") || "";
    const urlSortBy = searchParams.get("sortBy") || "-createdAt";

    setTransactionId(urlTransactionId);
    setStatusFilter(urlStatus);
    setGatewayFilter(urlGateway);
    setBuyerEmail(urlBuyerEmail);
    setStartDate(urlStartDate);
    setEndDate(urlEndDate);
    setSortBy(urlSortBy);

    // Show filters if any are active
    const hasActiveFilters = Boolean(
      urlTransactionId ||
        urlStatus !== "all" ||
        urlGateway !== "all" ||
        urlBuyerEmail ||
        urlStartDate ||
        urlEndDate ||
        urlSortBy !== "-createdAt"
    );
    setShowFilters(hasActiveFilters);
  }, [searchParams]);

  const activeFilters = [];
  if (transactionId)
    activeFilters.push({
      key: "transactionId",
      label: `Transaction ID: ${transactionId}`,
    });
  if (statusFilter !== "all")
    activeFilters.push({ key: "status", label: `Status: ${statusFilter}` });
  if (gatewayFilter !== "all")
    activeFilters.push({ key: "gateway", label: `Gateway: ${gatewayFilter}` });
  if (buyerEmail)
    activeFilters.push({ key: "buyerEmail", label: `Buyer: ${buyerEmail}` });
  if (startDate)
    activeFilters.push({ key: "startDate", label: `From: ${startDate}` });
  if (endDate) activeFilters.push({ key: "endDate", label: `To: ${endDate}` });
  if (sortBy !== "-createdAt")
    activeFilters.push({ key: "sort", label: `Sort: ${sortBy}` });

  const clearFilter = (key: string) => {
    if (key === "transactionId") setTransactionId("");
    if (key === "status") setStatusFilter("all");
    if (key === "gateway") setGatewayFilter("all");
    if (key === "buyerEmail") setBuyerEmail("");
    if (key === "startDate") setStartDate("");
    if (key === "endDate") setEndDate("");
    if (key === "sort") setSortBy("-createdAt");

    // The URL will be updated automatically through the notifyFiltersChange effect
    // The API call will be triggered by the useEffect that watches for state changes
  };

  const clearAllFilters = () => {
    // Add clearAll parameter to URL to trigger reset
    const url = new URL(window.location.href);
    url.searchParams.set("clearAll", "true");
    window.history.replaceState(
      {},
      "",
      url.pathname + "?" + url.searchParams.toString()
    );
  };

  // Update URL with current filter values
  const updateURL = () => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all non-default filter values to URL
    if (transactionId) urlParams.set("transactionId", transactionId);
    if (statusFilter !== "all") urlParams.set("status", statusFilter);
    if (gatewayFilter !== "all") urlParams.set("gateway", gatewayFilter);
    if (buyerEmail) urlParams.set("buyerEmail", buyerEmail);
    if (startDate) urlParams.set("startDate", startDate);
    if (endDate) urlParams.set("endDate", endDate);
    if (sortBy && sortBy !== "-createdAt") urlParams.set("sortBy", sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  // Notify parent on any filter change
  const notifyFiltersChange = () => {
    const filters: PaymentsParams = {
      page: 1,
      limit: 10,
      sortBy: sortBy, // Always include sortBy
    };

    if (transactionId) filters.transactionId = transactionId;
    if (statusFilter !== "all") filters.status = statusFilter as any;
    if (gatewayFilter !== "all") filters.gateway = gatewayFilter as any;
    if (buyerEmail) filters.buyerEmail = buyerEmail;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    onFiltersChange(filters);
    updateURL(); // Update URL whenever filters change
  };

  // Call whenever any state changes
  useEffect(() => {
    notifyFiltersChange();
  }, [
    transactionId,
    statusFilter,
    gatewayFilter,
    buyerEmail,
    startDate,
    endDate,
    sortBy,
  ]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Transaction ID..."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="pl-8"
                disabled={loading}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
              disabled={loading}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={gatewayFilter}
                onValueChange={setGatewayFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gateways</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Buyer Email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Select
                value={sortBy}
                onValueChange={setSortBy}
                disabled={loading}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-createdAt">Newest First</SelectItem>
                  <SelectItem value="createdAt">Oldest First</SelectItem>
                  <SelectItem value="-amount">Highest Amount</SelectItem>
                  <SelectItem value="amount">Lowest Amount</SelectItem>
                  <SelectItem value="status">Status A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {activeFilters.map((filter) => (
                <Badge key={filter.key} variant="secondary" className="gap-1">
                  {filter.label}
                  <button
                    type="button"
                    className="h-3 w-3 cursor-pointer p-0 m-0 bg-transparent border-none outline-none flex items-center justify-center"
                    aria-label={`Clear filter ${filter.label}`}
                    onClick={() => clearFilter(filter.key)}
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                disabled={loading}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
