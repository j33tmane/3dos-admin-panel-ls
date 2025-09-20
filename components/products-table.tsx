"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  RefreshCw,
  AlertCircle,
  Lock,
  Unlock,
  Bot,
  User,
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
import { Product, ProductsParams } from "@/types";
import { formatCurrency, formatDate } from "@/utils";

interface ProductsTableProps {
  products: Product[];
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

export function ProductsTable({
  products,
  loading,
  error,
  pagination,
  onPageChange,
  onRefresh,
}: ProductsTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    setSelectedProducts((prev) =>
      prev.length === products.length
        ? []
        : products.map((product) => product.id || "").filter((id) => id !== "")
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
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your 3D models and view their details.{" "}
              {selectedProducts.length > 0 &&
                `${selectedProducts.length} selected`}
              {pagination.totalResults > 0 &&
                ` • ${pagination.totalResults} total products`}
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
            {selectedProducts.length > 0 && (
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
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                  onCheckedChange={toggleAll}
                  disabled={loading}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Created</TableHead>
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
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id || `product-${Math.random()}`}
                  className={
                    selectedProducts.includes(product.id || "")
                      ? "bg-muted/50"
                      : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id || "")}
                      onCheckedChange={() => toggleProduct(product.id || "")}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title || "Product"}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {product.title || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.cardDescription
                            ? product.cardDescription.length > 50
                              ? `${product.cardDescription.substring(0, 50)}...`
                              : product.cardDescription
                            : "N/A"}
                        </div>
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {product.tags.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.user ? (
                      <div>
                        <div className="font-medium">
                          {product.user.fullName || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.user.email || "N/A"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.price ? formatCurrency(product.price) : "N/A"}
                  </TableCell>
                  <TableCell>{product.material || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        product.status
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >
                      {product.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {product.isPrivate ? (
                        <>
                          <Lock className="h-3 w-3" />
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                          >
                            Private
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3" />
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            Public
                          </Badge>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {product.unitsSold || 0}
                      {product.isAiGenerated && (
                        <Bot
                          className="h-3 w-3 text-purple-500"
                          title="AI Generated"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {product.createdAt
                      ? formatDate(new Date(product.createdAt))
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
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Package className="h-4 w-4 mr-2" />
                          Download Files
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
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
              of {pagination.totalResults} products
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
