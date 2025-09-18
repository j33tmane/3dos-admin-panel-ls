"use client";
import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Order, OrdersParams } from "@/types";
import { formatCurrency, formatDate } from "@/utils";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

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
  pending: Package,
  processing: Truck,
  shipped: Truck,
  picked: Truck,
  transit: Truck,
  delivered: Package,
  cancelled: Package,
};

export function OrdersTable({
  orders,
  loading,
  error,
  pagination,
  onPageChange,
  onRefresh,
}: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAll = () => {
    setSelectedOrders((prev) =>
      prev.length === orders.length
        ? []
        : orders.map((order) => order.id || "").filter((id) => id !== "")
    );
  };

  const getTotalItems = (order: Order) => {
    if (!order.products || !Array.isArray(order.products)) return 0;
    return order.products.reduce(
      (total, product) => total + (product?.quantity || 0),
      0
    );
  };

  const getPaymentStatus = (order: Order) => {
    if (!order.paymentId || !order.paymentId.status) return "Pending";
    return (
      order.paymentId.status.charAt(0).toUpperCase() +
      order.paymentId.status.slice(1)
    );
  };

  const getPaymentMethod = (order: Order) => {
    if (!order.paymentId || !order.paymentId.gateway) return "N/A";
    return (
      order.paymentId.gateway.charAt(0).toUpperCase() +
      order.paymentId.gateway.slice(1)
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={onRefresh}>
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
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Manage your orders and view their status.{" "}
              {selectedOrders.length > 0 && `${selectedOrders.length} selected`}
              {pagination.totalResults > 0 &&
                ` • ${pagination.totalResults} total orders`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            {selectedOrders.length > 0 && (
              <>
                <Button variant="outline" size="sm">
                  Export Selected
                </Button>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedOrders.length === orders.length && orders.length > 0
                  }
                  onCheckedChange={toggleAll}
                  disabled={loading}
                />
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center py-8 text-muted-foreground"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const StatusIcon = order.status
                  ? statusIcons[order.status as keyof typeof statusIcons] ||
                    Package
                  : Package;
                return (
                  <TableRow
                    key={order.id || `order-${Math.random()}`}
                    className={
                      selectedOrders.includes(order.id || "")
                        ? "bg-muted/50"
                        : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id || "")}
                        onCheckedChange={() => toggleOrder(order.id || "")}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.orderId || "N/A"}
                    </TableCell>
                    <TableCell>
                      {order.buyerId ? (
                        <div>
                          <div className="font-medium">
                            {order.buyerId.fullName || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.buyerId.email || "N/A"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.sellerId ? (
                        <div>
                          <div className="font-medium">
                            {order.sellerId.fullName || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.sellerId.email || "N/A"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.manufacturerId ? (
                        <div>
                          <div className="font-medium">
                            {order.manufacturerId.fullName || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.manufacturerId.email || "N/A"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.status ? (
                        <Badge
                          variant="secondary"
                          className={
                            statusColors[
                              order.status as keyof typeof statusColors
                            ]
                          }
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{getTotalItems(order)}</TableCell>
                    <TableCell className="font-medium">
                      {order.totalAmount
                        ? formatCurrency(order.totalAmount)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {getPaymentMethod(order)}
                        </div>
                        <div className="text-muted-foreground">
                          {getPaymentStatus(order)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.trackingId ? (
                        <div className="text-sm">
                          <div className="font-medium">{order.trackingId}</div>
                          {order.carrier && (
                            <div className="text-muted-foreground">
                              {order.carrier}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.createdAt
                        ? formatDate(new Date(order.createdAt))
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Order
                          </DropdownMenuItem>
                          {order.trackingId && (
                            <DropdownMenuItem>
                              <Truck className="h-4 w-4 mr-2" />
                              Track Package
                            </DropdownMenuItem>
                          )}
                          {order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.page * pagination.limit,
                pagination.totalResults
              )}{" "}
              of {pagination.totalResults} orders
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
