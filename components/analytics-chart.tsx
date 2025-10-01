"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, AlertCircle } from "lucide-react";
import { MonthlyAnalyticsData } from "@/types";
import { analyticsService } from "@/services/analytics";

export function AnalyticsChart() {
  const [data, setData] = useState<MonthlyAnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<
    "last_6_months" | "last_12_months" | "this_year"
  >("last_6_months");

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real data from API
      const response = await analyticsService.getMonthlyAnalytics(period);
      console.log(response);
      setData(response.data.results);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Monthly revenue and performance metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={period}
                onValueChange={(
                  value: "last_6_months" | "last_12_months" | "this_year"
                ) => setPeriod(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="last_12_months">Last 12 Months</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" disabled={true}>
                <RefreshCw className="h-4 w-4 animate-spin" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <div className="flex h-full items-end justify-between gap-2 rounded-md bg-muted/20 p-4">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="flex-1 rounded-sm" />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground px-4">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-4 w-8" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Monthly revenue and performance metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={period}
                onValueChange={(
                  value: "last_6_months" | "last_12_months" | "this_year"
                ) => setPeriod(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="last_12_months">Last 12 Months</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalyticsData}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalyticsData}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Monthly revenue and performance metrics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={period}
              onValueChange={(
                value: "last_6_months" | "last_12_months" | "this_year"
              ) => setPeriod(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                <SelectItem value="last_12_months">Last 12 Months</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAnalyticsData}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {/* Chart visualization */}
          <div className="flex h-full items-end justify-between gap-2 rounded-md bg-muted/20 p-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex-1 rounded-sm bg-primary transition-all hover:bg-primary/80 cursor-pointer group relative"
                style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                title={`${item.month}: $${item.revenue.toLocaleString()} (${
                  item.orders
                } orders, ${item.customers} customers)`}
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="font-semibold">{item.month}</div>
                  <div>Revenue: ${item.revenue.toLocaleString()}</div>
                  <div>Orders: {item.orders}</div>
                  <div>Customers: {item.customers}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="mt-4 flex justify-between text-sm text-muted-foreground px-4">
            {data.map((item, index) => (
              <span key={index} className="text-center flex-1">
                {item.month}
              </span>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                $
                {data
                  .reduce((sum, item) => sum + item.revenue, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.reduce((sum, item) => sum + item.orders, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.reduce((sum, item) => sum + item.customers, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Customers
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
