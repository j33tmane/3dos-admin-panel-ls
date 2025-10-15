"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Package,
  RefreshCw,
  AlertCircle,
  Lock,
  Unlock,
  Bot,
  User,
  Archive,
  ArchiveX,
  Download,
  Image,
  File,
  Tag,
  Check,
  ChevronsUpDown,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Product,
  ProductsParams,
  ArchiveProductResponse,
  Category,
} from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import { productsService, categoriesService } from "@/services";
import { toast } from "sonner";
import JSZip from "jszip";

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
  const [archivingProduct, setArchivingProduct] = useState<string | null>(null);
  const [downloadingProduct, setDownloadingProduct] = useState<string | null>(
    null
  );

  // Assign category modal state
  const [assignCategoryOpen, setAssignCategoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("none");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [assigningCategory, setAssigningCategory] = useState(false);

  // Searchable select state
  const [categorySelectOpen, setCategorySelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (selectedCategoryId === "none") return "No Category";
    if (!selectedCategoryId) return "Select a category";
    const category = categories.find((c) => c.id === selectedCategoryId);
    return category ? category.name : "Select a category";
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleViewDetails = (product: Product) => {
    if (!product.slug) {
      toast.error("Product slug not found");
      return;
    }

    const marketplaceUrl = `https://marketplace.3dos.io/public/products/${product.slug}`;
    window.open(marketplaceUrl, "_blank");
  };

  const downloadFileAsBlob = async (url: string): Promise<Blob> => {
    try {
      const response = await fetch(url, {
        mode: "cors",
        credentials: "omit",
      });
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return response.blob();
    } catch (error) {
      // If CORS fails, try with no-cors mode
      if (error instanceof TypeError && error.message.includes("CORS")) {
        console.warn(`CORS error for ${url}, trying alternative method`);
        try {
          const response = await fetch(url, { mode: "no-cors" });
          return response.blob();
        } catch (noCorsError) {
          throw new Error(`CORS blocked: ${url}`);
        }
      }
      throw error;
    }
  };

  const downloadZipFile = (zipBlob: Blob, filename: string) => {
    const downloadUrl = window.URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleDownloadFiles = async (product: Product) => {
    if (!product.id) {
      toast.error("Product ID not found");
      return;
    }

    setDownloadingProduct(product.id);

    try {
      const zip = new JSZip();
      const folderName = product.title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_");
      const productFolder = zip.folder(folderName);

      if (!productFolder) {
        throw new Error("Failed to create folder in zip");
      }

      const downloadPromises: Promise<void>[] = [];
      const failedDownloads: string[] = [];

      // Download STL file if available
      if (product.file?.url) {
        const fileExtension = product.file.url.split(".").pop() || "stl";
        const filename = `${product.title.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}.${fileExtension}`;

        downloadPromises.push(
          downloadFileAsBlob(product.file.url)
            .then((blob) => {
              productFolder.file(filename, blob);
            })
            .catch((error) => {
              console.error(`Failed to download STL file: ${error.message}`);
              failedDownloads.push(`STL file: ${error.message}`);
            })
        );
      }

      // Download images
      if (product.images && product.images.length > 0) {
        product.images.forEach((image, index) => {
          if (image.url) {
            const imageExtension = image.url.split(".").pop() || "jpg";
            const filename = `${product.title.replace(
              /[^a-zA-Z0-9]/g,
              "_"
            )}_image_${index + 1}.${imageExtension}`;

            downloadPromises.push(
              downloadFileAsBlob(image.url)
                .then((blob) => {
                  productFolder.file(filename, blob);
                })
                .catch((error) => {
                  console.error(
                    `Failed to download image ${index + 1}: ${error.message}`
                  );
                  failedDownloads.push(`Image ${index + 1}: ${error.message}`);
                })
            );
          }
        });
      }

      if (downloadPromises.length === 0) {
        toast.error("No files available for download");
        return;
      }

      // Wait for all downloads to complete (including failures)
      await Promise.allSettled(downloadPromises);

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFilename = `${folderName}_files.zip`;
      downloadZipFile(zipBlob, zipFilename);

      const totalFiles = downloadPromises.length;
      const successfulFiles = totalFiles - failedDownloads.length;
      const fileType = product.file?.url ? "files and images" : "images";

      if (failedDownloads.length === 0) {
        toast.success(
          `Successfully downloaded ${successfulFiles} ${fileType} for "${product.title}" in a zip file`
        );
      } else {
        toast.success(
          `Downloaded ${successfulFiles}/${totalFiles} ${fileType} for "${product.title}". ${failedDownloads.length} files failed due to CORS restrictions.`
        );
        console.warn("Failed downloads:", failedDownloads);
      }
    } catch (error) {
      console.error("Error downloading files:", error);
      toast.error("Failed to download files");
    } finally {
      setDownloadingProduct(null);
    }
  };

  const handleToggleArchiveProduct = async (product: Product) => {
    if (!product.id) {
      toast.error("Product ID not found");
      return;
    }

    const isArchiving = product.status; // If status is true, we're archiving; if false, we're unarchiving

    try {
      setArchivingProduct(product.id);
      const response: ArchiveProductResponse =
        await productsService.archiveProduct(product.id);
      console.log(response);
      if (response.status === "success") {
        // Show the response message from the API
        const actionText = isArchiving ? "archived" : "unarchived";
        toast.success(
          response.message || `Product ${actionText} successfully`,
          {
            description: response.data?.title
              ? `"${response.data.title}" has been ${actionText}`
              : undefined,
            duration: 4000,
          }
        );
        onRefresh(); // Refresh the products list
      } else {
        const actionText = isArchiving ? "archive" : "unarchive";
        toast.error(response.message || `Failed to ${actionText} product`);
      }
    } catch (error) {
      console.error("Error toggling archive status:", error);
      const actionText = isArchiving ? "archive" : "unarchive";
      toast.error(`Failed to ${actionText} product`);
    } finally {
      setArchivingProduct(null);
    }
  };

  // Assign category functions
  const handleAssignCategory = async (product: Product) => {
    setSelectedProduct(product);
    setAssignCategoryOpen(true);
    setLoadingCategories(true);
    setSearchTerm("");
    setCategorySelectOpen(false);

    try {
      // Fetch all categories
      const response = await categoriesService.getCategories({
        limit: 100, // Get all categories
        isActive: true, // Only active categories
      });

      if (response.status === "success") {
        setCategories(response.data.results);
        // Pre-select current category if product has one
        setSelectedCategoryId("none");
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleConfirmAssignCategory = async () => {
    if (!selectedProduct) {
      toast.error("No product selected");
      return;
    }

    if (!selectedCategoryId || selectedCategoryId === "none") {
      toast.error("Please select a category");
      return;
    }

    try {
      setAssigningCategory(true);
      const response = await categoriesService.assignProductToCategory(
        selectedCategoryId,
        { productId: selectedProduct.id }
      );

      if (response.status === "success") {
        toast.success("Category assigned successfully");
        setAssignCategoryOpen(false);
        onRefresh();
      } else {
        toast.error(response.message || "Failed to assign category");
      }
    } catch (error) {
      console.error("Error assigning category:", error);
      toast.error("Failed to assign category");
    } finally {
      setAssigningCategory(false);
    }
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
              <TableHead>Category</TableHead>
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
                    <Skeleton className="h-4 w-16" />
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
                    {product.category ? (
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No Category
                      </span>
                    )}
                  </TableCell>
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
                        <Bot className="h-3 w-3 text-purple-500" />
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
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(product)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadFiles(product)}
                          disabled={downloadingProduct === product.id}
                        >
                          {downloadingProduct === product.id ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          {downloadingProduct === product.id
                            ? "Downloading..."
                            : "Download Files"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAssignCategory(product)}
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Assign Category
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-orange-600"
                          onClick={() => handleToggleArchiveProduct(product)}
                          disabled={archivingProduct === product.id}
                        >
                          {product.status ? (
                            <Archive className="h-4 w-4 mr-2" />
                          ) : (
                            <ArchiveX className="h-4 w-4 mr-2" />
                          )}
                          {archivingProduct === product.id
                            ? product.status
                              ? "Archiving..."
                              : "Unarchiving..."
                            : product.status
                            ? "Archive Product"
                            : "Unarchive Product"}
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

      {/* Assign Category Modal */}
      <Dialog open={assignCategoryOpen} onOpenChange={setAssignCategoryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Category</DialogTitle>
            <DialogDescription>
              Select a category for "{selectedProduct?.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-select">Category</Label>
              <Popover
                open={categorySelectOpen}
                onOpenChange={setCategorySelectOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categorySelectOpen}
                    className="w-full justify-between"
                    disabled={loadingCategories}
                  >
                    {loadingCategories
                      ? "Loading categories..."
                      : getSelectedCategoryName()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search categories..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="none"
                          onSelect={(currentValue) => {
                            console.log(
                              "No Category onSelect called with:",
                              currentValue
                            );
                            setSelectedCategoryId(currentValue);
                            setCategorySelectOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedCategoryId === "none"
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          No Category
                        </CommandItem>
                        {filteredCategories.map((category, index) => (
                          <CommandItem
                            key={category.id || `category-${index}`}
                            value={category.name}
                            onSelect={() => {
                              setSelectedCategoryId(category.id);
                              setCategorySelectOpen(false);
                              setSearchTerm("");
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${(() => {
                                const categoryId = category.id;
                                const isSelected =
                                  selectedCategoryId === categoryId;
                                return isSelected ? "opacity-100" : "opacity-0";
                              })()}`}
                            />
                            <div className="flex items-center space-x-2">
                              <span>{category.name}</span>
                              {category.parent && (
                                <Badge variant="outline" className="text-xs">
                                  Subcategory
                                </Badge>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignCategoryOpen(false)}
              disabled={assigningCategory}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAssignCategory}
              disabled={
                assigningCategory ||
                !selectedCategoryId ||
                selectedCategoryId === "none"
              }
            >
              {assigningCategory ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
