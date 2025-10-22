"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  Folder,
  FolderOpen,
  Package,
  Calendar,
  Hash,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";
import { Category } from "@/types";
import { categoriesService } from "@/services";
import { formatDate, getCategoryId, isValidCategoryId } from "@/utils";
import { toast } from "sonner";

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

export default function CategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [ancestorCategories, setAncestorCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryDetails = async () => {
    // Validate categoryId before making API call
    if (!isValidCategoryId(categoryId)) {
      setError("Invalid category ID");
      toast.error("Invalid category ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await categoriesService.getCategoryById(categoryId);

      if (response.status === "success") {
        setCategory(response.data);

        // If category has a parent, fetch parent details
        if (response.data.parent) {
          try {
            const parentResponse = await categoriesService.getCategoryById(
              response.data.parent
            );
            if (parentResponse.status === "success") {
              setParentCategory(parentResponse.data);
            }
          } catch (error) {
            console.error("Error fetching parent category:", error);
            // Don't show error for parent category fetch failure
          }
        }

        // Fetch ancestor categories if they exist
        if (response.data.ancestors && response.data.ancestors.length > 0) {
          try {
            const ancestorPromises = response.data.ancestors.map(
              async (ancestorId: string) => {
                try {
                  const ancestorResponse =
                    await categoriesService.getCategoryById(ancestorId);
                  if (ancestorResponse.status === "success") {
                    return ancestorResponse.data;
                  }
                  return null;
                } catch (error) {
                  console.error(
                    `Error fetching ancestor category ${ancestorId}:`,
                    error
                  );
                  return null;
                }
              }
            );

            const ancestors = await Promise.all(ancestorPromises);
            setAncestorCategories(
              ancestors.filter(
                (ancestor): ancestor is Category => ancestor !== null
              )
            );
          } catch (error) {
            console.error("Error fetching ancestor categories:", error);
            // Don't show error for ancestor category fetch failure
          }
        }
      } else {
        setError(response.message || "Failed to load category");
        toast.error(response.message || "Failed to load category");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load category";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error loading category:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  const handleEdit = () => {
    router.push(`/categories/${categoryId}/edit`);
  };

  const handleAddSubcategory = () => {
    router.push(`/categories/new?parent=${categoryId}`);
  };

  const handleBack = () => {
    router.push("/categories");
  };

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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCategoryDetails}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Category not found</AlertDescription>
          </Alert>
        </div>
      </SidebarInset>
    );
  }

  const FolderIcon = category.level === 0 ? Folder : FolderOpen;

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
            <div className="flex items-center gap-2">
              <FolderIcon className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold">{category.name}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddSubcategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Category
            </Button>
          </div>
        </div>

        {/* Category Details */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Core details about this category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {category.image?.url ? (
                  <img
                    src={category.image.url}
                    alt={category.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Slug:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge
                    variant="secondary"
                    className={
                      statusColors[category.isActive ? "active" : "inactive"]
                    }
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Level:</span>
                  <Badge
                    variant="secondary"
                    className={
                      levelColors[category.level as keyof typeof levelColors] ||
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    Level {category.level}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sort Order:</span>
                  <span className="text-sm">{category.sortOrder}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Products:</span>
                  <Badge variant="outline" className="gap-1">
                    <Package className="h-3 w-3" />
                    {category.productCount}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hierarchy Information */}
          <Card>
            <CardHeader>
              <CardTitle>Hierarchy</CardTitle>
              <CardDescription>
                Category hierarchy and relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {parentCategory ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Parent Category:
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/categories/${
                            parentCategory._id || parentCategory.id
                          }`
                        )
                      }
                      className="p-0 h-auto"
                    >
                      {parentCategory.name}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {category.parent?.slice(0, 8)}...
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  This is a root category
                </div>
              )}

              {ancestorCategories.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Ancestors:</span>
                  <div className="text-xs text-muted-foreground">
                    {ancestorCategories.map((ancestor, index) => (
                      <span key={ancestor._id || ancestor.id}>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/categories/${getCategoryId(ancestor)}`
                            )
                          }
                          className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
                        >
                          {ancestor.name}
                        </Button>
                        {index < ancestorCategories.length - 1 && " → "}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {category.categoryPath && category.categoryPath.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Category Path:</span>
                  <div className="text-xs text-muted-foreground">
                    {category.categoryPath.join(" / ")}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SEO Information */}
        {(category.seoTitle || category.seoDescription || category.seoSlug) && (
          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
              <CardDescription>
                Search engine optimization details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.seoTitle && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">SEO Title:</span>
                  <p className="text-sm">{category.seoTitle}</p>
                </div>
              )}

              {category.seoDescription && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">SEO Description:</span>
                  <p className="text-sm">{category.seoDescription}</p>
                </div>
              )}

              {category.seoSlug && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">SEO Slug:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {category.seoSlug}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Keywords Information */}
        {((category.coreKeywords && category.coreKeywords.length > 0) ||
          (category.semanticKeywords1 &&
            category.semanticKeywords1.length > 0) ||
          (category.semanticKeywords2 &&
            category.semanticKeywords2.length > 0)) && (
          <Card>
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
              <CardDescription>
                SEO keywords and semantic terms for this category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {category.coreKeywords && category.coreKeywords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Core Keywords:</span>
                  <div className="flex flex-wrap gap-1">
                    {category.coreKeywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {category.semanticKeywords1 &&
                category.semanticKeywords1.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">
                      Semantic Keywords 1:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {category.semanticKeywords1.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {category.semanticKeywords2 &&
                category.semanticKeywords2.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">
                      Semantic Keywords 2:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {category.semanticKeywords2.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        )}

        {/* FAQs Information */}
        {category.faqs && category.faqs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and answers for this category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.faqs.map((faq, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-blue-600">
                      Q{index + 1}: {faq.question}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
            <CardDescription>Creation and modification dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Created:</span>
                  <p className="text-sm text-muted-foreground">
                    {category.createdAt
                      ? formatDate(new Date(category.createdAt))
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Updated:</span>
                  <p className="text-sm text-muted-foreground">
                    {category.updatedAt
                      ? formatDate(new Date(category.updatedAt))
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
