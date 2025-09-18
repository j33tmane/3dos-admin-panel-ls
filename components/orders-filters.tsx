// File: components/orders-filters.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { OrdersParams } from "@/types";

interface OrdersFiltersProps {
  onFiltersChange: (filters: OrdersParams) => void;
  loading?: boolean;
}

export function OrdersFilters({
  onFiltersChange,
  loading = false,
}: OrdersFiltersProps) {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [buyerId, setBuyerId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
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
      setOrderId("");
      setStatusFilter("all");
      setBuyerId("");
      setSellerId("");
      setManufacturerId("");
      setStartDate("");
      setEndDate("");
      setSortBy("-createdAt");
      setShowFilters(false);

      // Remove clearAll parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("clearAll");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
      // Notify parent with reset filters
      const resetFilters: OrdersParams = {
        page: 1,
        limit: 10,
      };
      onFiltersChange(resetFilters);
      return;
    }

    const urlOrderId = searchParams.get("orderId") || "";
    const urlStatus = searchParams.get("status") || "all";
    const urlBuyerId = searchParams.get("buyerId") || "";
    const urlSellerId = searchParams.get("sellerId") || "";
    const urlManufacturerId = searchParams.get("manufacturerId") || "";
    const urlStartDate = searchParams.get("startDate") || "";
    const urlEndDate = searchParams.get("endDate") || "";
    const urlSortBy = searchParams.get("sortBy") || "-createdAt";

    setOrderId(urlOrderId);
    setStatusFilter(urlStatus);
    setBuyerId(urlBuyerId);
    setSellerId(urlSellerId);
    setManufacturerId(urlManufacturerId);
    setStartDate(urlStartDate);
    setEndDate(urlEndDate);
    setSortBy(urlSortBy);

    // Show filters if any are active
    const hasActiveFilters = Boolean(
      urlOrderId ||
        urlStatus !== "all" ||
        urlBuyerId ||
        urlSellerId ||
        urlManufacturerId ||
        urlStartDate ||
        urlEndDate ||
        urlSortBy !== "-createdAt"
    );
    setShowFilters(hasActiveFilters);
  }, [searchParams]);

  const activeFilters = [];
  if (orderId)
    activeFilters.push({ key: "orderId", label: `Order ID: ${orderId}` });
  if (statusFilter !== "all")
    activeFilters.push({ key: "status", label: `Status: ${statusFilter}` });
  if (buyerId)
    activeFilters.push({ key: "buyerId", label: `Buyer: ${buyerId}` });
  if (sellerId)
    activeFilters.push({ key: "sellerId", label: `Seller: ${sellerId}` });
  if (manufacturerId)
    activeFilters.push({
      key: "manufacturerId",
      label: `Manufacturer: ${manufacturerId}`,
    });
  if (startDate)
    activeFilters.push({ key: "startDate", label: `From: ${startDate}` });
  if (endDate) activeFilters.push({ key: "endDate", label: `To: ${endDate}` });
  if (sortBy !== "-createdAt")
    activeFilters.push({ key: "sort", label: `Sort: ${sortBy}` });

  const clearFilter = (key: string) => {
    if (key === "orderId") setOrderId("");
    if (key === "status") setStatusFilter("all");
    if (key === "buyerId") setBuyerId("");
    if (key === "sellerId") setSellerId("");
    if (key === "manufacturerId") setManufacturerId("");
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
    window.history.replaceState({}, "", url.pathname);
  };

  // Notify parent on any filter change
  const notifyFiltersChange = () => {
    const filters: OrdersParams = {
      page: 1,
      limit: 10,
    };

    if (orderId) filters.orderId = orderId;
    if (statusFilter !== "all") filters.status = statusFilter as any;
    if (buyerId) filters.buyerId = buyerId;
    if (sellerId) filters.sellerId = sellerId;
    if (manufacturerId) filters.manufacturerId = manufacturerId;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (sortBy) filters.sortBy = sortBy;

    onFiltersChange(filters);
  };

  // Call whenever any state changes
  useEffect(() => {
    notifyFiltersChange();
  }, [
    orderId,
    statusFilter,
    buyerId,
    sellerId,
    manufacturerId,
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
                placeholder="Search by Order ID..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="picked">Picked</SelectItem>
                  <SelectItem value="transit">Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Buyer ID"
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Input
                placeholder="Seller ID"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Input
                placeholder="Manufacturer ID"
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
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
                  <SelectItem value="-totalAmount">Highest Amount</SelectItem>
                  <SelectItem value="totalAmount">Lowest Amount</SelectItem>
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
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => clearFilter(filter.key)}
                  />
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
