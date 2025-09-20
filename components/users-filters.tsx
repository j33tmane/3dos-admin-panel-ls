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
import { UsersParams } from "@/types";

interface UsersFiltersProps {
  onFiltersChange: (filters: UsersParams) => void;
  loading?: boolean;
}

export function UsersFilters({
  onFiltersChange,
  loading = false,
}: UsersFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("all");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    // Check if clearAll parameter is present - if so, reset all filters
    const clearAll = searchParams.get("clearAll");
    if (clearAll === "true") {
      // Reset all filters to default values
      setEmail("");
      setName("");
      setUsername("");
      setRole("all");
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
      const resetFilters: UsersParams = {
        page: 1,
        limit: 20,
      };
      onFiltersChange(resetFilters);
      return;
    }

    const urlEmail = searchParams.get("email") || "";
    const urlName = searchParams.get("name") || "";
    const urlUsername = searchParams.get("username") || "";
    const urlRole = searchParams.get("role") || "all";
    const urlSortBy = searchParams.get("sortBy") || "-createdAt";

    setEmail(urlEmail);
    setName(urlName);
    setUsername(urlUsername);
    setRole(urlRole);
    setSortBy(urlSortBy);

    // Show filters if any are active
    const hasActiveFilters = Boolean(
      urlEmail ||
        urlName ||
        urlUsername ||
        urlRole !== "all" ||
        urlSortBy !== "-createdAt"
    );
    setShowFilters(hasActiveFilters);
  }, [searchParams]);

  const activeFilters = [];
  if (email) activeFilters.push({ key: "email", label: `Email: ${email}` });
  if (name) activeFilters.push({ key: "name", label: `Name: ${name}` });
  if (username)
    activeFilters.push({ key: "username", label: `Username: ${username}` });
  if (role !== "all")
    activeFilters.push({ key: "role", label: `Role: ${role}` });
  if (sortBy !== "-createdAt")
    activeFilters.push({ key: "sort", label: `Sort: ${sortBy}` });

  const clearFilter = (key: string) => {
    if (key === "email") setEmail("");
    if (key === "name") setName("");
    if (key === "username") setUsername("");
    if (key === "role") setRole("all");
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
    if (email) urlParams.set("email", email);
    if (name) urlParams.set("name", name);
    if (username) urlParams.set("username", username);
    if (role !== "all") urlParams.set("role", role);
    if (sortBy && sortBy !== "-createdAt") urlParams.set("sortBy", sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  // Notify parent on any filter change
  const notifyFiltersChange = () => {
    const filters: UsersParams = {
      page: 1,
      limit: 20,
      sortBy: sortBy, // Always include sortBy
    };

    if (email) filters.email = email;
    if (name) filters.name = name;
    if (username) filters.username = username;
    if (role !== "all") filters.role = role;

    onFiltersChange(filters);
    updateURL(); // Update URL whenever filters change
  };

  // Call whenever any state changes
  useEffect(() => {
    notifyFiltersChange();
  }, [email, name, username, role, sortBy]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[140px]"
                disabled={loading}
              />

              <Select value={role} onValueChange={setRole} disabled={loading}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="user">User</SelectItem>
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
                  <SelectItem value="email">Email A-Z</SelectItem>
                  <SelectItem value="-email">Email Z-A</SelectItem>
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
