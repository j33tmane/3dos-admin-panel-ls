import { PaymentsResponse, PaymentsParams } from "@/types/payments";
import { ApiResponse } from "@/types/api";
import { apiService } from "./api";

class PaymentsService {
  /**
   * Get all payments with filters
   */
  async getPayments(params: PaymentsParams = {}): Promise<PaymentsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set("page", params.page.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.status) queryParams.set("status", params.status);
    if (params.gateway) queryParams.set("gateway", params.gateway);
    if (params.startDate) queryParams.set("startDate", params.startDate);
    if (params.endDate) queryParams.set("endDate", params.endDate);
    if (params.transactionId)
      queryParams.set("transactionId", params.transactionId);
    if (params.buyerEmail) queryParams.set("buyerEmail", params.buyerEmail);

    const queryString = queryParams.toString();
    const url = `/payments/all${queryString ? `?${queryString}` : ""}`;

    const response: ApiResponse<PaymentsResponse["data"]> =
      await apiService.get<PaymentsResponse["data"]>(url);

    return {
      status: response.status,
      message: response.message,
      data: response.data || {
        results: [],
        page: 1,
        limit: 20,
        totalPages: 0,
        totalResults: 0,
      },
      errors: response.errors || [],
    };
  }
}

export const paymentsService = new PaymentsService();
