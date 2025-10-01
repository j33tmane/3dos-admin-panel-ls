// Analytics related types

export interface MonthlyAnalyticsData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface AnalyticsData {
  dailyOrders: number;
  openOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  timestamp: string;
}

export interface MonthlyAnalyticsResponse {
  status: string;
  code: number;
  message: string;
  data: {
    results: MonthlyAnalyticsData[];
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    period: string; // e.g., "last_6_months", "last_12_months"
  };
  errors: string[];
}

export interface AnalyticsResponse {
  status: string;
  code: number;
  message: string;
  data: AnalyticsData;
  errors: any[];
}
