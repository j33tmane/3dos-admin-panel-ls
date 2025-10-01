"use client";

import { useState, useEffect } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Package,
  ShoppingCart,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService } from "@/services/analytics";
import { AnalyticsData } from "@/types";

export function DashboardStats() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getAnalytics();
        console.log("response", response);
        if (response.status === "success") {
          setAnalytics(response.data);
        } else {
          setError(response.message || "Failed to fetch analytics");
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-4">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Failed to load analytics data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Daily Orders",
      value: analytics?.dailyOrders?.toString() || "0",
      icon: ShoppingCart,
    },
    {
      title: "Open Orders",
      value: analytics?.openOrders?.toString() || "0",
      icon: Package,
    },
    {
      title: "Shipped Orders",
      value: analytics?.shippedOrders?.toString() || "0",
      icon: Truck,
    },
    {
      title: "Delivered Orders",
      value: analytics?.deliveredOrders?.toString() || "0",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">Current status</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
