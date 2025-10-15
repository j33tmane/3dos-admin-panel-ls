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
import { ProductsParams, Category } from "@/types";
import { categoriesService } from "@/services";

interface ProductsFiltersProps {
  onFiltersChange: (filters: ProductsParams) => void;
  loading?: boolean;
}

export function ProductsFilters({
  onFiltersChange,
  loading = false,
}: ProductsFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [material, setMaterial] = useState("");
  const [status, setStatus] = useState("all");
  const [isPrivate, setIsPrivate] = useState("all");
  const [userId, setUserId] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    // Check if clearAll parameter is present - if so, reset all filters
    const clearAll = searchParams.get("clearAll");
    if (clearAll === "true") {
      // Reset all filters to default values
      setTitle("");
      setMaterial("");
      setStatus("all");
      setIsPrivate("all");
      setUserId("");
      setCategoryId("all");
      setSortBy("-createdAt");
      setShowFilters(false);

      // Remove clearAll parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("clearAll");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));

      // Notify parent with reset filters
      const resetFilters: ProductsParams = {
        page: 1,
        limit: 10,
      };
      onFiltersChange(resetFilters);
      return;
    }

    const urlTitle = searchParams.get("title") || "";
    const urlMaterial = searchParams.get("material") || "";
    const urlStatus = searchParams.get("status") || "all";
    const urlIsPrivate = searchParams.get("isPrivate") || "all";
    const urlUserId = searchParams.get("userId") || "";
    const urlCategoryId = searchParams.get("category") || "all";
    const urlSortBy = searchParams.get("sortBy") || "-createdAt";

    setTitle(urlTitle);
    setMaterial(urlMaterial);
    setStatus(urlStatus);
    setIsPrivate(urlIsPrivate);
    setUserId(urlUserId);
    setCategoryId(urlCategoryId);
    setSortBy(urlSortBy);

    // Show filters if any are active
    const hasActiveFilters = Boolean(
      urlTitle ||
        urlMaterial ||
        urlStatus !== "all" ||
        urlIsPrivate !== "all" ||
        urlUserId ||
        urlCategoryId !== "all" ||
        urlSortBy !== "-createdAt"
    );
    setShowFilters(hasActiveFilters);
  }, [searchParams]);

  const activeFilters = [];
  if (title) activeFilters.push({ key: "title", label: `Title: ${title}` });
  if (material)
    activeFilters.push({ key: "material", label: `Material: ${material}` });
  if (status !== "all")
    activeFilters.push({ key: "status", label: `Status: ${status}` });
  if (isPrivate !== "all")
    activeFilters.push({ key: "isPrivate", label: `Private: ${isPrivate}` });
  if (userId)
    activeFilters.push({ key: "userId", label: `User ID: ${userId}` });
  if (categoryId && categoryId !== "all") {
    const category = categories.find((c) => c.id === categoryId);
    activeFilters.push({
      key: "categoryId",
      label: `Category: ${category?.name || categoryId}`,
    });
  }
  if (sortBy !== "-createdAt")
    activeFilters.push({ key: "sort", label: `Sort: ${sortBy}` });

  const clearFilter = (key: string) => {
    if (key === "title") setTitle("");
    if (key === "material") setMaterial("");
    if (key === "status") setStatus("all");
    if (key === "isPrivate") setIsPrivate("all");
    if (key === "userId") setUserId("");
    if (key === "categoryId") setCategoryId("all");
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
    if (title) urlParams.set("title", title);
    if (material) urlParams.set("material", material);
    if (status !== "all") urlParams.set("status", status);
    if (isPrivate !== "all") urlParams.set("isPrivate", isPrivate);
    if (userId) urlParams.set("userId", userId);
    if (categoryId && categoryId !== "all")
      urlParams.set("category", categoryId);
    if (sortBy && sortBy !== "-createdAt") urlParams.set("sortBy", sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  // Notify parent on any filter change
  const notifyFiltersChange = () => {
    const filters: ProductsParams = {
      page: 1,
      limit: 10,
      sortBy: sortBy, // Always include sortBy
    };

    if (title) filters.title = title;
    if (material) filters.material = material;
    if (status !== "all") filters.status = status === "active";
    if (isPrivate !== "all") filters.isPrivate = isPrivate === "private";
    if (userId) filters.userId = userId;
    if (categoryId && categoryId !== "all") filters.categoryId = categoryId;

    onFiltersChange(filters);
    updateURL(); // Update URL whenever filters change
  };

  // Call whenever any state changes
  useEffect(() => {
    notifyFiltersChange();
  }, [title, material, status, isPrivate, userId, categoryId, sortBy]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await categoriesService.getCategories({
          limit: 100,
          isActive: true,
        });
        if (response.status === "success") {
          setCategories(response.data.results);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                placeholder="Material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Select
                value={status}
                onValueChange={setStatus}
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
                value={isPrivate}
                onValueChange={setIsPrivate}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={loading || loadingCategories}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
                  <SelectItem value="-price">Highest Price</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="-unitsSold">Most Sold</SelectItem>
                  <SelectItem value="unitsSold">Least Sold</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
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
