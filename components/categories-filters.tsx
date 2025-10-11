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
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("");
  const [isActive, setIsActive] = useState("all");
  const [level, setLevel] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    // Check if clearAll parameter is present - if so, reset all filters
    const clearAll = searchParams.get("clearAll");
    if (clearAll === "true") {
      // Reset all filters to default values
      setName("");
      setSlug("");
      setParent("");
      setIsActive("all");
      setLevel("");
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
        limit: 20,
      };
      onFiltersChange(resetFilters);
      return;
    }

    const urlName = searchParams.get("name") || "";
    const urlSlug = searchParams.get("slug") || "";
    const urlParent = searchParams.get("parent") || "";
    const urlIsActive = searchParams.get("isActive") || "all";
    const urlLevel = searchParams.get("level") || "";
    const urlSortBy = searchParams.get("sortBy") || "-createdAt";

    setName(urlName);
    setSlug(urlSlug);
    setParent(urlParent);
    setIsActive(urlIsActive);
    setLevel(urlLevel);
    setSortBy(urlSortBy);

    // Show filters if any are active
    const hasActiveFilters = Boolean(
      urlName ||
        urlSlug ||
        urlParent ||
        urlIsActive !== "all" ||
        urlLevel ||
        urlSortBy !== "-createdAt"
    );
    setShowFilters(hasActiveFilters);
  }, [searchParams]);

  const activeFilters = [];
  if (name) activeFilters.push({ key: "name", label: `Name: ${name}` });
  if (slug) activeFilters.push({ key: "slug", label: `Slug: ${slug}` });
  if (parent) activeFilters.push({ key: "parent", label: `Parent: ${parent}` });
  if (isActive !== "all")
    activeFilters.push({ key: "isActive", label: `Status: ${isActive}` });
  if (level) activeFilters.push({ key: "level", label: `Level: ${level}` });
  if (sortBy !== "-createdAt")
    activeFilters.push({ key: "sort", label: `Sort: ${sortBy}` });

  const clearFilter = (key: string) => {
    if (key === "name") setName("");
    if (key === "slug") setSlug("");
    if (key === "parent") setParent("");
    if (key === "isActive") setIsActive("all");
    if (key === "level") setLevel("");
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
    if (slug) urlParams.set("slug", slug);
    if (parent) urlParams.set("parent", parent);
    if (isActive !== "all") urlParams.set("isActive", isActive);
    if (level) urlParams.set("level", level);
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
      limit: 20,
      sortBy: sortBy, // Always include sortBy
    };

    if (name) filters.name = name;
    if (slug) filters.slug = slug;
    if (parent) filters.parent = parent;
    if (isActive !== "all") filters.isActive = isActive === "true";
    if (level) filters.level = parseInt(level, 10);

    onFiltersChange(filters);
    updateURL(); // Update URL whenever filters change
  };

  // Call whenever any state changes
  useEffect(() => {
    notifyFiltersChange();
  }, [name, slug, parent, isActive, level, sortBy]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
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
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Input
                placeholder="Parent ID"
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Input
                placeholder="Level"
                type="number"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-[100px]"
                disabled={loading}
              />

              <Select value={isActive} onValueChange={setIsActive} disabled={loading}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
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
                  <SelectItem value="productCount">Most Products</SelectItem>
                  <SelectItem value="-productCount">Least Products</SelectItem>
                  <SelectItem value="level">Level Asc</SelectItem>
                  <SelectItem value="-level">Level Desc</SelectItem>
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
