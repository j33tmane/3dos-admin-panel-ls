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
  Folder,
  FolderOpen,
  Package,
  Edit,
  Trash2,
  Plus,
  Search,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle,
  Layers,
  Eye,
} from "lucide-react";
import { categoriesService } from "@/services";
import { Category } from "@/types";
import { formatDate } from "@/utils";
import { toast } from "sonner";

const statusColors = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusIcons = {
  active: FolderOpen,
  inactive: Folder,
};

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoriesService.getCategoryById(categoryId);

      if (response.status === "success") {
        setCategory(response.data);
      } else {
        setError(response.message || "Failed to fetch category details");
        toast.error(response.message || "Failed to fetch category details");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch category details";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching category details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

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

  if (!category) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Category not found</AlertDescription>
          </Alert>
        </div>
      </SidebarInset>
    );
  }

  const StatusIcon = statusIcons[category.isActive ? "active" : "inactive"];

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">Category Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/categories/${categoryId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Category
            </Button>
            <Button variant="outline" onClick={() => router.push(`/categories/new?parent=${categoryId}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Category Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5" />
                  Category Status
                </CardTitle>
                <CardDescription>Current status of this category</CardDescription>
              </div>
              <Badge
                variant="secondary"
                className={statusColors[category.isActive ? "active" : "inactive"]}
              >
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category ID
                  </p>
                  <p className="font-mono text-sm">{category._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Slug
                  </p>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {category.slug}
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Level
                  </p>
                  <Badge variant="outline" className="w-8 h-6 flex items-center justify-center">
                    {category.level}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sort Order
                  </p>
                  <p className="font-semibold">{category.sortOrder}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p>
                    {category.createdAt
                      ? formatDate(new Date(category.createdAt))
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Updated At
                  </p>
                  <p>
                    {category.updatedAt
                      ? formatDate(new Date(category.updatedAt))
                      : "N/A"}
                  </p>
                </div>
              </div>
              {category.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="text-sm">{category.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hierarchy Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Hierarchy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Parent Category
                </p>
                {category.parent ? (
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{category.parent}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant="outline">Root Category</Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Category Path
                </p>
                <div className="text-sm">
                  {category.categoryPath && category.categoryPath.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {category.categoryPath.map((path, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <span>{path}</span>
                          {index < category.categoryPath.length - 1 && (
                            <span className="text-muted-foreground">›</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No path available</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Ancestors
                </p>
                <div className="text-sm">
                  {category.ancestors && category.ancestors.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {category.ancestors.map((ancestor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {ancestor}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No ancestors</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Product Count
                  </p>
                  <p className="text-2xl font-bold">{category.productCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="secondary"
                    className={statusColors[category.isActive ? "active" : "inactive"]}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  View Products
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Products
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SEO Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  SEO Title
                </p>
                <p className="text-sm">
                  {category.seoTitle || (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  SEO Description
                </p>
                <p className="text-sm">
                  {category.seoDescription || (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Semantic Keywords
                </p>
                <div className="space-y-2">
                  {category.semanticKeywords1 && category.semanticKeywords1.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Primary Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.semanticKeywords1.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {category.semanticKeywords2 && category.semanticKeywords2.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Secondary Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.semanticKeywords2.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {(!category.semanticKeywords1 || category.semanticKeywords1.length === 0) &&
                    (!category.semanticKeywords2 || category.semanticKeywords2.length === 0) && (
                    <span className="text-muted-foreground text-sm">No keywords set</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Image */}
        {category.image && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Category Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Image URL
                  </p>
                  <p className="text-sm font-mono break-all">
                    {category.image.url}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Key: {category.image.key}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions for this category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Package className="h-5 w-5" />
                <span className="text-sm">View Products</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Plus className="h-5 w-5" />
                <span className="text-sm">Add Subcategory</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Edit className="h-5 w-5" />
                <span className="text-sm">Edit Category</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Search className="h-5 w-5" />
                <span className="text-sm">SEO Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
