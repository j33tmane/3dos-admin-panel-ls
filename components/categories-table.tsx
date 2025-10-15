"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  Plus,
  Package,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Category, CategoriesParams } from "@/types";
import { formatDate } from "@/utils";
import { toast } from "sonner";
import { categoriesService } from "@/services";

interface CategoriesTableProps {
  categories: Category[];
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
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-red-100 text-red-800 hover:bg-red-200",
};

const levelColors = {
  0: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  1: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  2: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  3: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  4: "bg-pink-100 text-pink-800 hover:bg-pink-200",
};

export function CategoriesTable({
  categories,
  loading,
  error,
  pagination,
  onPageChange,
  onRefresh,
}: CategoriesTableProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [parentNames, setParentNames] = useState<Record<string, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  // Fetch parent category names when categories change
  useEffect(() => {
    const fetchParentNames = async () => {
      const parentIds = categories
        .map((cat) => cat.parent)
        .filter((id): id is string => Boolean(id))
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

      if (parentIds.length === 0) return;

      const newParentNames: Record<string, string> = {};

      for (const parentId of parentIds) {
        try {
          const response = await categoriesService.getCategoryById(parentId);
          if (response.status === "success") {
            newParentNames[parentId] = response.data.name;
          }
        } catch (error) {
          console.error(`Error fetching parent category ${parentId}:`, error);
          newParentNames[parentId] = `Unknown (${parentId.slice(0, 8)}...)`;
        }
      }

      setParentNames(newParentNames);
    };

    fetchParentNames();
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAll = () => {
    setSelectedCategories((prev) =>
      prev.length === categories.length
        ? []
        : categories.map((category) => category._id).filter((id) => id !== "")
    );
  };

  const handleViewDetails = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  const handleEditCategory = (categoryId: string) => {
    // Debug: Log the categoryId and check if it's valid
    console.log(
      "Edit category clicked with ID:",
      categoryId,
      "Type:",
      typeof categoryId
    );

    // Validate categoryId before navigation
    if (!categoryId || categoryId === "undefined" || categoryId.length !== 24) {
      console.error("Invalid category ID:", categoryId);
      toast.error("Invalid category ID");
      return;
    }
    router.push(`/categories/${categoryId}/edit`);
  };

  const handleDeleteCategory = (category: Category) => {
    // Validate categoryId before showing modal
    const categoryId = category._id;
    if (!categoryId || categoryId === "undefined" || categoryId.length !== 24) {
      console.error("Invalid category ID:", categoryId);
      toast.error("Invalid category ID");
      return;
    }

    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    const categoryId = categoryToDelete._id;

    try {
      const response = await categoriesService.deleteCategory(categoryId);

      if (response.status === "success") {
        toast.success("Category deleted successfully");
        // Refresh the categories list
        onRefresh();
      } else {
        toast.error(response.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    // Validate categoryId before navigation
    if (!categoryId || categoryId === "undefined" || categoryId.length !== 24) {
      console.error("Invalid parent category ID:", categoryId);
      toast.error("Invalid parent category ID");
      return;
    }
    router.push(`/categories/new?parent=${categoryId}`);
  };

  const handleUpdateProductCount = (categoryId: string) => {
    // TODO: Implement update product count functionality
    console.log("Update product count for category:", categoryId);
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
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage your product categories and their hierarchy.{" "}
              {selectedCategories.length > 0 &&
                `${selectedCategories.length} selected`}
              {pagination.totalResults > 0 &&
                ` • ${pagination.totalResults} total categories`}
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
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/categories/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
            {selectedCategories.length > 0 && (
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
                    selectedCategories.length === categories.length &&
                    categories.length > 0
                  }
                  onCheckedChange={toggleAll}
                  disabled={loading}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sort Order</TableHead>
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
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-12" />
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
            ) : categories.length === 0 ? (
              <TableRow key="no-categories">
                <TableCell
                  colSpan={11}
                  className="text-center py-8 text-muted-foreground"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => {
                // Debug: Log category object to see its structure
                console.log(
                  "Rendering category:",
                  category,
                  "ID:",
                  category._id
                );
                const FolderIcon = category.level === 0 ? Folder : FolderOpen;
                return (
                  <TableRow
                    key={category._id || `category-${index}`}
                    className={
                      selectedCategories.includes(category._id)
                        ? "bg-muted/50"
                        : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedCategories.includes(category._id)}
                        onCheckedChange={() => toggleCategory(category._id)}
                      />
                    </TableCell>
                    <TableCell>
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{category.name}</span>
                      </div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {category.description.length > 50
                            ? `${category.description.substring(0, 50)}...`
                            : category.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {category.parent ? (
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {parentNames[category.parent] || "Loading..."}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            ID: {category.parent.slice(0, 8)}...
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Root
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          levelColors[
                            category.level as keyof typeof levelColors
                          ] || "bg-gray-100 text-gray-800"
                        }
                      >
                        Level {category.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Package className="h-3 w-3" />
                        {category.productCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusColors[
                            category.isActive ? "active" : "inactive"
                          ]
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {category.sortOrder}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {category.createdAt
                        ? formatDate(new Date(category.createdAt))
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
                            onClick={() => handleViewDetails(category._id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditCategory(category._id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddSubcategory(category._id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Subcategory
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateProductCount(category._id)
                            }
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Update Product Count
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Category
                          </DropdownMenuItem>
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
              of {pagination.totalResults} categories
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

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This
              action cannot be undone.
              {categoryToDelete?.productCount &&
                categoryToDelete.productCount > 0 && (
                  <span className="block mt-2 text-amber-600 font-medium">
                    ⚠️ This category has {categoryToDelete.productCount}{" "}
                    products. Deleting it will remove the category assignment
                    from these products.
                  </span>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
