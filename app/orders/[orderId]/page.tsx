"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Package,
  Truck,
  User,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { ordersService } from "@/services";
import { OrderDetail } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import { toast } from "sonner";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  shipped: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  picked: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  transit: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  delivered: "bg-green-100 text-green-800 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  picked: Truck,
  transit: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersService.getOrderDetails(orderId);

      if (response.status === "success") {
        setOrder(response.data);
      } else {
        setError(response.message || "Failed to fetch order details");
        toast.error(response.message || "Failed to fetch order details");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch order details";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </SidebarInset>
    );
  }

  if (error) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </SidebarInset>
    );
  }

  if (!order) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Order not found</AlertDescription>
          </Alert>
        </div>
      </SidebarInset>
    );
  }

  const StatusIcon = order.status
    ? statusIcons[order.status as keyof typeof statusIcons]
    : Package;

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Order #{order.orderId}</p>
          </div>
        </div>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5" />
                  Order Status
                </CardTitle>
                <CardDescription>Current status of your order</CardDescription>
              </div>
              <Badge
                variant="secondary"
                className={
                  order.status &&
                  statusColors[order.status as keyof typeof statusColors]
                    ? statusColors[order.status as keyof typeof statusColors]
                    : "bg-gray-100 text-gray-800"
                }
              >
                {order.status || "N/A"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </p>
                  <p className="font-mono">{order.orderId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order Group ID
                  </p>
                  <p className="font-mono text-sm">
                    {order.orderGroupId || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p>
                    {order.createdAt
                      ? formatDate(new Date(order.createdAt))
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    STL Status
                  </p>
                  <Badge variant="outline">
                    {order.stlGenerationStatus
                      ? order.stlGenerationStatus.replace("_", " ")
                      : "N/A"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="font-semibold">
                    {order.payment?.amount
                      ? formatCurrency(order.payment.amount)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="secondary"
                    className={
                      order.payment?.status &&
                      paymentStatusColors[
                        order.payment.status as keyof typeof paymentStatusColors
                      ]
                        ? paymentStatusColors[
                            order.payment
                              .status as keyof typeof paymentStatusColors
                          ]
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {order.payment?.status || "N/A"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Gateway
                  </p>
                  <p className="capitalize">
                    {order.payment?.gateway || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="font-mono text-sm">
                    {order.payment?.transactionId || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Buyer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Buyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p>{order.buyerId?.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p>{order.buyerId?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="font-mono text-sm">
                  {order.buyerId?.id || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p>{order.sellerId?.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p>{order.sellerId?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="font-mono text-sm">
                  {order.sellerId?.id || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Manufacturer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Manufacturer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.manufacturerId ? (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Name
                    </p>
                    <p>{order.manufacturerId.fullName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p>{order.manufacturerId.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      User ID
                    </p>
                    <p className="font-mono text-sm">
                      {order.manufacturerId.id || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    No manufacturer is assigned to this order
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p>{order.shippingAddress?.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Label
                </p>
                <p>{order.shippingAddress?.label || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Street
                </p>
                <p>{order.shippingAddress?.street || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  City
                </p>
                <p>{order.shippingAddress?.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  State
                </p>
                <p>{order.shippingAddress?.state || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Zip Code
                </p>
                <p>{order.shippingAddress?.zipCode || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Country
                </p>
                <p>{order.shippingAddress?.country || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products ({order.products ? order.products.length : 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.products && order.products.length > 0 ? (
                order.products.map((product, index) => (
                  <div
                    key={product.id || `product-${index}`}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      {product.model?.images &&
                        product.model.images.length > 0 && (
                          <img
                            src={product.model.images[0]}
                            alt={product.model.title || "Product"}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {product.model?.title || "N/A"}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.model?.description || "N/A"}
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">
                              Quantity
                            </p>
                            <p>{product.quantity || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">
                              Color
                            </p>
                            <p>{product.color || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">
                              Price
                            </p>
                            <p>
                              {product.model?.price
                                ? formatCurrency(product.model.price)
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No products found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {order.subTotal ? formatCurrency(order.subTotal) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingAmount
                    ? formatCurrency(order.shippingAmount)
                    : "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {order.totalAmount
                    ? formatCurrency(order.totalAmount)
                    : "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Platform Earning</span>
                <span>
                  {order.platformEarning
                    ? formatCurrency(order.platformEarning)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Creator Royalty</span>
                <span>
                  {order.creatorRoyalty
                    ? formatCurrency(order.creatorRoyalty)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Manufacturer Cost</span>
                <span>
                  {order.manufacturerCost
                    ? formatCurrency(order.manufacturerCost)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Affiliate Cost</span>
                <span>
                  {order.affiliateCost
                    ? formatCurrency(order.affiliateCost)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing Fees</span>
                <span>
                  {order.processingFees
                    ? formatCurrency(order.processingFees)
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
