// Orders service for handling order-related API calls
import { apiService } from "./api";
import { OrdersResponse, OrdersParams, OrderDetailResponse } from "@/types";

class OrdersService {
  /**
   * Fetch orders with pagination and filters
   */
  async getOrders(params: OrdersParams = {}): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.status) queryParams.append("status", params.status);
    if (params.orderId) queryParams.append("orderId", params.orderId);
    if (params.buyerId) queryParams.append("buyerId", params.buyerId);
    if (params.sellerId) queryParams.append("sellerId", params.sellerId);
    if (params.manufacturerId)
      queryParams.append("manufacturerId", params.manufacturerId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const endpoint = `/admin/orders${queryString ? `?${queryString}` : ""}`;

    return apiService.get<OrdersResponse>(endpoint);
  }

  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string): Promise<OrdersResponse> {
    return apiService.get<OrdersResponse>(`/admin/orders/${orderId}`);
  }

  /**
   * Get detailed order information by order number
   */
  async getOrderDetails(orderNumber: string): Promise<OrderDetailResponse> {
    return apiService.get<OrderDetailResponse>(`/admin/orders/${orderNumber}`);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<OrdersResponse> {
    return apiService.patch<OrdersResponse>(`/admin/orders/${orderId}/status`, {
      status,
    });
  }

  /**
   * Get orders statistics
   */
  async getOrdersStats(): Promise<OrdersResponse> {
    return apiService.get<OrdersResponse>("/admin/orders/stats");
  }
}

export const ordersService = new OrdersService();
