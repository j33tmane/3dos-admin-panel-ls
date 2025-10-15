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
import { CategoriesParams } from "@/types";

interface CategoriesFiltersProps {
  onFiltersChange: (filters: CategoriesParams) => void;
  loading?: boolean;
}

export function CategoriesFilters({
  onFiltersChange,
  loading = false,
}: CategoriesFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [parentFilter, setParentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    // Check if clearAll parameter is present - if so, reset all filters
    const clearAll = searchParams.get("clearAll");
    if (clearAll === "true") {
      // Reset all filters to default values
      setName("");
      setParentFilter("all");
      setStatusFilter("all");
      setLevelFilter("all");
      setSortBy("-createdAt");
      setShowFilters(false);

      // Remove clearAll parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("clearAll");
      window.history.replaceState(
        {},
        "",
        url.pathname + "?" + url.searchParams.toString()
      );

      // Notify parent with reset filters
      const resetFilters: CategoriesParams = {
        page: 1,
        limit: 10,
      };
      onFiltersChange(resetFilters);
      return;
    }

    const urlName = searchParams.get("name") || "";
    const urlParent = searchParams.get("parent") || "all";
    const urlStatus = searchParams.get("isActive") || "all";
    const urlLevel = searchParams.get("level") || "all";
    const urlSortBy = searchParams.get("sortBy") || "-createdAt";

    setName(urlName);
    setParentFilter(urlParent);
    setStatusFilter(urlStatus);
    setLevelFilter(urlLevel);
    setSortBy(urlSortBy);

    // Show filters if any are active
    const hasActiveFilters = Boolean(
      urlName ||
        urlParent !== "all" ||
        urlStatus !== "all" ||
        urlLevel !== "all" ||
        urlSortBy !== "-createdAt"
    );
    setShowFilters(hasActiveFilters);
  }, [searchParams]);

  const activeFilters = [];
  if (name) activeFilters.push({ key: "name", label: `Name: ${name}` });
  if (parentFilter !== "all")
    activeFilters.push({ key: "parent", label: `Parent: ${parentFilter}` });
  if (statusFilter !== "all")
    activeFilters.push({ key: "status", label: `Status: ${statusFilter}` });
  if (levelFilter !== "all")
    activeFilters.push({ key: "level", label: `Level: ${levelFilter}` });
  if (sortBy !== "-createdAt")
    activeFilters.push({ key: "sort", label: `Sort: ${sortBy}` });

  const clearFilter = (key: string) => {
    if (key === "name") setName("");
    if (key === "parent") setParentFilter("all");
    if (key === "status") setStatusFilter("all");
    if (key === "level") setLevelFilter("all");
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
    if (name) urlParams.set("name", name);
    if (parentFilter !== "all") urlParams.set("parent", parentFilter);
    if (statusFilter !== "all") urlParams.set("isActive", statusFilter);
    if (levelFilter !== "all") urlParams.set("level", levelFilter);
    if (sortBy && sortBy !== "-createdAt") urlParams.set("sortBy", sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  // Notify parent on any filter change
  const notifyFiltersChange = () => {
    const filters: CategoriesParams = {
      page: 1,
      limit: 10,
      sortBy: sortBy, // Always include sortBy
    };

    if (name) filters.name = name;
    if (parentFilter !== "all") filters.parent = parentFilter;
    if (statusFilter !== "all") filters.isActive = statusFilter === "active";
    if (levelFilter !== "all") filters.level = parseInt(levelFilter, 10);

    onFiltersChange(filters);
    updateURL(); // Update URL whenever filters change
  };

  // Call whenever any state changes
  useEffect(() => {
    notifyFiltersChange();
  }, [name, parentFilter, statusFilter, levelFilter, sortBy]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by category name..."
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
              <Input
                placeholder="Parent Category ID"
                value={parentFilter === "all" ? "" : parentFilter}
                onChange={(e) => setParentFilter(e.target.value || "all")}
                className="w-[160px]"
                disabled={loading}
              />

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
                value={levelFilter}
                onValueChange={setLevelFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="0">Root (0)</SelectItem>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
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
                  <SelectItem value="-createdAt">Newest First</SelectItem>
                  <SelectItem value="createdAt">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="-name">Name Z-A</SelectItem>
                  <SelectItem value="sortOrder">Sort Order</SelectItem>
                  <SelectItem value="-productCount">Most Products</SelectItem>
                  <SelectItem value="productCount">Least Products</SelectItem>
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
