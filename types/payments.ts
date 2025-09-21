export interface BuyerInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface OrderBuyerSeller {
  name: string;
  email: string;
}

export interface RelatedOrder {
  orderId: string;
  status: string;
  totalAmount: number;
  buyerId: OrderBuyerSeller;
  sellerId: OrderBuyerSeller;
}

export interface PaymentMetrics {
  totalRefundedAmount: number;
  refundableAmount: number;
  refundCount: number;
  isFullyRefunded: boolean;
  isPartiallyRefunded: boolean;
}

export interface Refund {
  id: string;
  amount: number;
  reason?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  buyerId: string;
  orders: string[];
  amount: number;
  status: "succeeded" | "failed" | "pending" | "cancelled" | "refunded";
  gateway: "stripe" | "coinbase";
  urlToPay?: string;
  transactionId: string;
  orderGroupId?: string;
  totalRefundedAmount: number;
  refunds: Refund[];
  createdAt: string;
  receivedAmount: number;
  refundableAmount: number;
  calculateRefundableAmount: number;
  buyerInfo: BuyerInfo;
  relatedOrders: RelatedOrder[];
  metrics: PaymentMetrics;
}

export interface PaymentsResponse {
  status: string;
  message: string;
  data: {
    results: Payment[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  errors?: any[];
}

export interface PaymentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  status?: string;
  gateway?: string;
  startDate?: string;
  endDate?: string;
  transactionId?: string;
  buyerEmail?: string;
}
