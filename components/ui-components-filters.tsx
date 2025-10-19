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
import { UIComponentsParams } from "@/types";

interface UIComponentsFiltersProps {
  onFiltersChange: (filters: UIComponentsParams) => void;
  loading?: boolean;
}

export function UIComponentsFilters({
  onFiltersChange,
  loading = false,
}: UIComponentsFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [componentType, setComponentType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    // Check if clearAll parameter is present - if so, reset all filters
    const clearAll = searchParams.get("clearAll");
    if (clearAll === "true") {
      // Reset all filters to default values
      setName("");
      setComponentType("all");
      setStatusFilter("all");
      setSortBy("createdAt:desc");
      setShowFilters(false);

      // Remove clearAll parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("clearAll");
      window.history.replaceState(
        {},
        "",
        url.pathname + "?" + url.searchParams.toString()
      );
      return;
    }

    // Initialize from URL parameters
    const nameParam = searchParams.get("name");
    const componentTypeParam = searchParams.get("componentType");
    const statusParam = searchParams.get("status");
    const sortParam = searchParams.get("sortBy");

    if (nameParam) setName(nameParam);
    if (componentTypeParam) setComponentType(componentTypeParam);
    if (statusParam) setStatusFilter(statusParam);
    if (sortParam) setSortBy(sortParam);
  }, [searchParams]);

  // Track active filters for display
  const activeFilters: { key: string; label: string }[] = [];
  if (name) activeFilters.push({ key: "name", label: `Search: "${name}"` });
  if (componentType !== "all")
    activeFilters.push({
      key: "componentType",
      label: `Type: ${componentType}`,
    });
  if (statusFilter !== "all")
    activeFilters.push({
      key: "status",
      label: `Status: ${statusFilter}`,
    });
  if (sortBy !== "createdAt:desc")
    activeFilters.push({ key: "sort", label: `Sort: ${sortBy}` });

  const clearFilter = (key: string) => {
    if (key === "name") setName("");
    if (key === "componentType") setComponentType("all");
    if (key === "status") setStatusFilter("all");
    if (key === "sort") setSortBy("createdAt:desc");

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
    if (name) urlParams.set("name", name);
    if (componentType !== "all") urlParams.set("componentType", componentType);
    if (statusFilter !== "all") urlParams.set("status", statusFilter);
    if (sortBy && sortBy !== "createdAt:desc") urlParams.set("sortBy", sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  // Notify parent on any filter change
  const notifyFiltersChange = () => {
    const filters: UIComponentsParams = {
      page: 1,
      limit: 10,
      sortBy: sortBy, // Always include sortBy
    };

    // Add filters only if they have non-default values
    if (name) filters.name = name;
    if (componentType !== "all") filters.componentType = componentType as any;
    if (statusFilter !== "all") filters.status = statusFilter === "active";

    onFiltersChange(filters);
    updateURL();
  };

  // Call whenever any state changes
  useEffect(() => {
    notifyFiltersChange();
  }, [name, componentType, statusFilter, sortBy]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by component title..."
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={componentType}
                onValueChange={setComponentType}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="slider">Slider</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>

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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={setSortBy}
                disabled={loading}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">
                    Created (Newest)
                  </SelectItem>
                  <SelectItem value="createdAt:asc">
                    Created (Oldest)
                  </SelectItem>
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
                    className="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
                    aria-label={`Remove filter ${filter.label}`}
                    onClick={() => clearFilter(filter.key)}
                    disabled={loading}
                    style={{
                      lineHeight: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
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
