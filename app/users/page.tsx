"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { UsersFilters } from "@/components/users-filters";
import { UsersTable } from "@/components/users-table";
import { usersService } from "@/services";
import { User, UsersParams } from "@/types";
import { toast } from "sonner";

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalResults: 0,
  });
  const [filters, setFilters] = useState<UsersParams>({
    page: 1,
    limit: 20,
  });

  // Read filters from URL parameters
  const getFiltersFromURL = (): UsersParams => {
    const params: UsersParams = {
      page: 1,
      limit: 20,
    };

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const username = searchParams.get("username");
    const role = searchParams.get("role");
    const sortBy = searchParams.get("sortBy");

    if (page) params.page = parseInt(page, 10);
    if (limit) params.limit = parseInt(limit, 10);
    if (email) params.email = email;
    if (name) params.name = name;
    if (username) params.username = username;
    if (role && role !== "all") params.role = role;
    params.sortBy = sortBy || "-createdAt"; // Always include sortBy with default

    return params;
  };

  // Update URL with current filters
  const updateURL = (newFilters: UsersParams) => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all non-default filter values to URL
    if (newFilters.page && newFilters.page !== 1)
      urlParams.set("page", newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 20)
      urlParams.set("limit", newFilters.limit.toString());
    if (newFilters.email) urlParams.set("email", newFilters.email);
    if (newFilters.name) urlParams.set("name", newFilters.name);
    if (newFilters.username) urlParams.set("username", newFilters.username);
    if (newFilters.role) urlParams.set("role", newFilters.role);
    if (newFilters.sortBy && newFilters.sortBy !== "-createdAt")
      urlParams.set("sortBy", newFilters.sortBy);

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;
    router.replace(newURL, { scroll: false });
  };

  const fetchUsers = async (params: UsersParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersService.getUsers(params);

      if (response.status === "success") {
        setUsers(response.data.results);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        });
      } else {
        setError(response.message || "Failed to fetch users");
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch users when filters change
  useEffect(() => {
    if (filters.page && filters.limit) {
      fetchUsers(filters);
    }
  }, [filters]);

  const handleFiltersChange = (newFilters: UsersParams) => {
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
        <UsersFilters onFiltersChange={handleFiltersChange} loading={loading} />
        <UsersTable
          users={users}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => fetchUsers(filters)}
        />
      </div>
    </SidebarInset>
  );
}
