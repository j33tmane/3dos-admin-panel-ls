"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Payment } from "@/types/payments";
import { formatCurrency, formatDate, showToast } from "@/utils";
import {
  CreditCard,
  User,
  Calendar,
  DollarSign,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  RotateCcw,
} from "lucide-react";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
}: PaymentDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      showToast.error("Failed to copy to clipboard");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <Ban className="h-4 w-4 text-gray-600" />;
      case "refunded":
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: {
        variant: "default" as const,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      failed: {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      pending: {
        variant: "secondary" as const,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      cancelled: {
        variant: "outline" as const,
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
      refunded: {
        variant: "secondary" as const,
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className={config.className}>
        {getStatusIcon(status)}
        <span className="ml-1">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  const getGatewayIcon = (gateway: string) => {
    switch (gateway.toLowerCase()) {
      case "stripe":
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case "coinbase":
        return <CreditCard className="h-4 w-4 text-orange-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatValue = (value: any, type: string = "text") => {
    if (value === null || value === undefined || value === "") {
      return (
        <span className="text-muted-foreground italic">Not available</span>
      );
    }

    switch (type) {
      case "currency":
        return formatCurrency(value);
      case "date":
        return formatDate(value);
      case "boolean":
        return value ? "Yes" : "No";
      default:
        return String(value);
    }
  };

  if (!payment) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto"
          style={{ maxWidth: "75vw", width: "75vw" }}
        >
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payment data available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: "75vw", width: "75vw" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Transaction ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {payment.transactionId}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(payment.transactionId, "Transaction ID")
                    }
                  >
                    {copiedField === "Transaction ID" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Payment ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{payment.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(payment.id, "Payment ID")}
                  >
                    {copiedField === "Payment ID" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Status
                </span>
                {getStatusBadge(payment.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Gateway
                </span>
                <div className="flex items-center gap-2">
                  {getGatewayIcon(payment.gateway)}
                  <span className="capitalize">{payment.gateway}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Amount
                </span>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Received Amount
                </span>
                <span className="font-medium">
                  {formatValue(payment.receivedAmount, "currency")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Created Date
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(payment.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Order Group ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {formatValue(payment.orderGroupId)}
                  </span>
                  {payment.orderGroupId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(payment.orderGroupId, "Order Group ID")
                      }
                    >
                      {copiedField === "Order Group ID" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment URL */}
          {payment.urlToPay && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Payment URL
              </span>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="font-mono text-sm flex-1 truncate">
                  {payment.urlToPay}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(payment.urlToPay, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(payment.urlToPay, "Payment URL")
                  }
                >
                  {copiedField === "Payment URL" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Buyer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Buyer Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Buyer ID
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {payment.buyerInfo.id}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(payment.buyerInfo.id, "Buyer ID")
                      }
                    >
                      {copiedField === "Buyer ID" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Email
                  </span>
                  <span className="text-sm">{payment.buyerInfo.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Role
                  </span>
                  <Badge variant="outline" className="capitalize">
                    {payment.buyerInfo.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Refund Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Refunded
                </span>
                <span className="font-medium">
                  {formatValue(payment.totalRefundedAmount, "currency")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Refundable Amount
                </span>
                <span className="font-medium">
                  {formatValue(payment.refundableAmount, "currency")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Calculate Refundable
                </span>
                <span className="font-medium">
                  {formatValue(payment.calculateRefundableAmount, "currency")}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Payment Metrics
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Refunded Amount
                  </span>
                  <span className="font-medium">
                    {formatValue(
                      payment.metrics.totalRefundedAmount,
                      "currency"
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Refundable Amount
                  </span>
                  <span className="font-medium">
                    {formatValue(payment.metrics.refundableAmount, "currency")}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Refund Count
                  </span>
                  <span className="font-medium">
                    {formatValue(payment.metrics.refundCount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Fully Refunded
                  </span>
                  <span className="font-medium">
                    {formatValue(payment.metrics.isFullyRefunded, "boolean")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Partially Refunded
                  </span>
                  <span className="font-medium">
                    {formatValue(
                      payment.metrics.isPartiallyRefunded,
                      "boolean"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Orders */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Related Orders ({payment.relatedOrders.length})
            </h3>
            {payment.relatedOrders.length > 0 ? (
              <div className="space-y-3">
                {payment.relatedOrders.map((order, index) => (
                  <div
                    key={order.id || index}
                    className="p-4 bg-muted rounded-lg"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Order ID
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              {order.orderId}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  order.orderId,
                                  `Order ID ${index + 1}`
                                )
                              }
                            >
                              {copiedField === `Order ID ${index + 1}` ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Status
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Total Amount
                          </span>
                          <span className="font-medium">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Created
                          </span>
                          <span className="text-sm">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Buyer
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {order.buyerId.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.buyerId.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Seller
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {order.sellerId.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.sellerId.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No related orders found
              </div>
            )}
          </div>

          {/* Refunds */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Refunds ({payment.refunds.length})
            </h3>
            {payment.refunds.length > 0 ? (
              <div className="space-y-3">
                {payment.refunds.map((refund, index) => (
                  <div
                    key={refund.id || index}
                    className="p-4 bg-muted rounded-lg"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Refund ID
                        </span>
                        <span className="font-mono text-sm">
                          {formatValue(refund.id)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Amount
                        </span>
                        <span className="font-medium">
                          {formatValue(refund.amount, "currency")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Created
                        </span>
                        <span className="text-sm">
                          {formatValue(refund.createdAt, "date")}
                        </span>
                      </div>
                    </div>
                    {refund.reason && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Reason:{" "}
                        </span>
                        <span className="text-sm">{refund.reason}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No refunds found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
