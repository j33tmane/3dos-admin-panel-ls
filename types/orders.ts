// Order-related TypeScript interfaces

export interface OrderUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  isEmailVerified: boolean;
  affiliateCode: string;
  createdAt: string;
  avatar?: string;
}

export interface OrderModelImage {
  url: string;
  key: string;
  signedUrl?: string;
  id: string;
}

export interface OrderModelId {
  title: string;
  price: number;
  cardDescription: string;
  status: boolean;
  images: OrderModelImage[];
  isPrivate: boolean;
  createdAt: string;
  slug: string;
  activeOffer: any;
  id: string;
  file: any;
}

export interface OrderModelOwner {
  email: string;
  role: string;
  affiliateCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  id: string;
}

export interface OrderModel {
  modelId: OrderModelId;
  modelOwner: OrderModelOwner;
  title: string;
  description: string;
  price: number;
  images: string[];
  fileUrl?: string;
}

export interface OrderProduct {
  id: string;
  model: OrderModel;
  quantity: number;
  color: string;
  affiliateCode?: string;
}

export interface OrderShippingAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface OrderPayment {
  id: string;
  amount: number;
  status: string;
  gateway: string;
  transactionId: string;
  receivedAmount: number;
  totalRefundedAmount: number;
  refundableAmount: number;
  refunds: any[];
  createdAt: string;
}

export interface OrderTimelineEvent {
  status: string;
  timestamp: string;
  note: string;
}

export interface OrderTrackingEvent {
  eventCode: string;
  eventDescription: string;
  eventCreateTime: string;
  eventReasonCode: string;
  eventReasonDescription: string;
  location: {
    city: string;
    state: string;
    postalCode: string;
    country: string;
    streetLines: string[];
  };
}

export interface OrderDeliveryReceipt {
  url: string;
  key: string;
  uploadedAt: string;
  uploadedBy: OrderUser;
}

export interface OrderDetailProduct {
  id: string;
  model: {
    modelId: string;
    modelOwner: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    fileUrl: string;
  };
  quantity: number;
  color: string;
}

export interface OrderDetailShippingAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  fullName: string;
  zipCode: string;
  country: string;
  id: string;
}

export interface OrderDetailPayment {
  amount: number;
  status: string;
  gateway: string;
  transactionId: string;
  orderGroupId: string;
  receivedAmount: number;
  id: string;
  calculateRefundableAmount: number;
}

export interface OrderDetail {
  buyerId: OrderUser;
  sellerId: OrderUser;
  orderAssignedAt: string | null;
  orderDeliveredAt: string | null;
  orderId: string;
  orderGroupId: string;
  products: OrderDetailProduct[];
  shippingAddress: OrderDetailShippingAddress;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "picked"
    | "transit"
    | "delivered"
    | "cancelled";
  timeline: OrderTimelineEvent[];
  subTotal: number;
  shippingAmount: number;
  totalAmount: number;
  promoCode: any;
  platformEarning: number;
  creatorRoyalty: number;
  manufacturerCost: number;
  affiliateCost: number;
  processingFees: number;
  walletSynced: boolean;
  stlGenerationStatus: "not_started" | "in_progress" | "completed" | "failed";
  trackingEvents: OrderTrackingEvent[];
  createdAt: string;
  paymentId: string;
  manufacturerId?: OrderUser;
  payment: OrderDetailPayment;
  id: string;
}

export interface OrderDetailResponse {
  status: string;
  code: number;
  message: string;
  data: OrderDetail;
  errors: any[];
}

export interface Order {
  id: string;
  orderId: string;
  orderGroupId: string;
  buyerId: OrderUser;
  sellerId: OrderUser;
  manufacturerId?: OrderUser;
  products: OrderProduct[];
  shippingAddress: OrderShippingAddress;
  paymentId: OrderPayment | null;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "picked"
    | "transit"
    | "delivered"
    | "cancelled";
  timeline: OrderTimelineEvent[];
  trackingId?: string;
  carrier?: string;
  deliveryReceiptImages: OrderDeliveryReceipt[];
  trackingEvents: OrderTrackingEvent[];
  subTotal: number;
  shippingAmount: number;
  totalAmount: number;
  promoCode: any;
  platformEarning: number;
  creatorRoyalty: number;
  manufacturerCost: number;
  affiliateCost: number;
  processingFees: number;
  orderAssignedAt: string | null;
  orderDeliveredAt: string | null;
  createdAt: string;
}

export interface OrdersResponse {
  status: string;
  code: number;
  message: string;
  data: {
    results: Order[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  errors: any[];
}

export interface OrdersParams {
  page?: number;
  limit?: number;
  status?:
    | "pending"
    | "processing"
    | "shipped"
    | "picked"
    | "transit"
    | "delivered"
    | "cancelled";
  orderId?: string;
  buyerId?: string;
  sellerId?: string;
  manufacturerId?: string;
  startDate?: string; // ISO date format (YYYY-MM-DD)
  endDate?: string; // ISO date format (YYYY-MM-DD)
  sortBy?: string; // Format: "field:direction" (asc/desc)
}
