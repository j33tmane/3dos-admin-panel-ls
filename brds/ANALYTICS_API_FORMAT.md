# Analytics API Response Format

## Overview

This document outlines the expected API response format for the analytics chart component. The chart displays monthly revenue, orders, and customer data for the last 6 months.

## API Endpoint

```
GET /v1/admin/analytics/monthly
```

## Query Parameters

- `period` (optional): `"last_6_months"` | `"last_12_months"` (default: `"last_6_months"`)
- `startDate` (optional): ISO date string for custom start date
- `endDate` (optional): ISO date string for custom end date

## Expected Response Format

### Success Response (200)

```json
{
  "status": "success",
  "code": 200,
  "message": "Monthly analytics data retrieved successfully",
  "data": {
    "results": [
      {
        "month": "Jan",
        "revenue": 12500.5,
        "orders": 45,
        "customers": 38
      },
      {
        "month": "Feb",
        "revenue": 18900.75,
        "orders": 67,
        "customers": 52
      },
      {
        "month": "Mar",
        "revenue": 22100.25,
        "orders": 89,
        "customers": 71
      },
      {
        "month": "Apr",
        "revenue": 15600.0,
        "orders": 58,
        "customers": 43
      },
      {
        "month": "May",
        "revenue": 28400.8,
        "orders": 102,
        "customers": 89
      },
      {
        "month": "Jun",
        "revenue": 19800.3,
        "orders": 73,
        "customers": 61
      }
    ],
    "totalRevenue": 117302.6,
    "totalOrders": 434,
    "totalCustomers": 354,
    "period": "last_6_months"
  },
  "errors": []
}
```

### Error Response (400/500)

```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid date range provided",
  "data": null,
  "errors": [
    "Start date cannot be after end date",
    "Date range cannot exceed 12 months"
  ]
}
```

## Data Structure Details

### MonthlyAnalyticsData

| Field       | Type   | Description                      | Example             |
| ----------- | ------ | -------------------------------- | ------------------- |
| `month`     | string | Month abbreviation (3 letters)   | "Jan", "Feb", "Mar" |
| `revenue`   | number | Total revenue for the month      | 12500.50            |
| `orders`    | number | Total number of orders           | 45                  |
| `customers` | number | Total number of unique customers | 38                  |

### Response Metadata

| Field            | Type   | Description                  | Example         |
| ---------------- | ------ | ---------------------------- | --------------- |
| `totalRevenue`   | number | Sum of all monthly revenues  | 117302.60       |
| `totalOrders`    | number | Sum of all monthly orders    | 434             |
| `totalCustomers` | number | Sum of all monthly customers | 354             |
| `period`         | string | Time period covered          | "last_6_months" |

## Implementation Notes

### Chart Features

- **Bar Chart**: Revenue data displayed as proportional bars
- **Hover Tooltips**: Show detailed metrics for each month
- **Summary Stats**: Total revenue, orders, and customers displayed below chart
- **Responsive Design**: Chart adapts to different screen sizes
- **Loading States**: Skeleton loaders during data fetch
- **Error Handling**: Retry functionality on API failures

### Data Processing

- Revenue values are automatically formatted with currency symbols
- Numbers are formatted with thousand separators (e.g., 12,500)
- Chart height is calculated based on the maximum revenue value
- Month labels are displayed below each bar

### Integration Steps

1. Create analytics service method:

   ```typescript
   async getMonthlyAnalytics(period: string = "last_6_months"): Promise<MonthlyAnalyticsResponse>
   ```

2. Update the chart component to use real API:

   ```typescript
   const response = await analyticsService.getMonthlyAnalytics("last_6_months");
   setData(response.data.results);
   ```

3. Handle loading and error states appropriately

## Sample Implementation

### Service Method

```typescript
// services/analytics.ts
export const getMonthlyAnalytics = async (
  period: string = "last_6_months"
): Promise<MonthlyAnalyticsResponse> => {
  const response = await apiService.get(`/analytics/monthly?period=${period}`);
  return response.data;
};
```

### Component Usage

```typescript
// components/analytics-chart.tsx
const fetchAnalyticsData = async () => {
  try {
    setLoading(true);
    const response = await analyticsService.getMonthlyAnalytics(
      "last_6_months"
    );
    setData(response.data.results);
  } catch (err) {
    setError("Failed to load analytics data");
  } finally {
    setLoading(false);
  }
};
```

## Testing

Use the sample data provided in the component for testing:

```typescript
const sampleData: MonthlyAnalyticsData[] = [
  { month: "Jan", revenue: 12500, orders: 45, customers: 38 },
  { month: "Feb", revenue: 18900, orders: 67, customers: 52 },
  // ... more months
];
```
