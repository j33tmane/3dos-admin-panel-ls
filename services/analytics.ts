import { apiService } from "./api";
import { MonthlyAnalyticsResponse, AnalyticsResponse } from "@/types";

const analyticsService = {
  /**
   * Get general analytics data for dashboard stats
   * @returns Promise<AnalyticsResponse>
   */
  async getAnalytics(): Promise<AnalyticsResponse> {
    const response = await apiService.get("/admin/analytics");
    return response as AnalyticsResponse;
  },

  /**
   * Get monthly analytics data
   * @param period - Time period: "last_6_months" | "last_12_months" | "this_year"
   * @returns Promise<MonthlyAnalyticsResponse>
   */
  async getMonthlyAnalytics(
    period: "last_6_months" | "last_12_months" | "this_year" = "last_6_months"
  ): Promise<MonthlyAnalyticsResponse> {
    const response = await apiService.get(
      `/admin/analytics/monthly?period=${period}`
    );
    return response as MonthlyAnalyticsResponse;
  },
};

export { analyticsService };
