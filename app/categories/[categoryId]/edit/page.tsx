"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { categoriesService } from "@/services";
import { Category, UpdateCategoryRequest } from "@/types";
import { toast } from "sonner";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<UpdateCategoryRequest>({
    name: "",
    description: "",
    parent: undefined,
    isActive: true,
    sortOrder: 0,
    seoTitle: "",
    seoDescription: "",
  });

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      // Validate categoryId before making API call
      if (
        !categoryId ||
        categoryId === "undefined" ||
        categoryId.length !== 24
      ) {
        toast.error("Invalid category ID");
        router.push("/categories");
        return;
      }

      try {
        setLoading(true);
        const response = await categoriesService.getCategoryById(categoryId);

        if (response.status === "success") {
          const categoryData = response.data;
          setCategory(categoryData);
          setFormData({
            name: categoryData.name || "",
            description: categoryData.description || "",
            parent: categoryData.parent || undefined,
            isActive: categoryData.isActive ?? true,
            sortOrder: categoryData.sortOrder || 0,
            seoTitle: categoryData.seoTitle || "",
            seoDescription: categoryData.seoDescription || "",
          });
        } else {
          toast.error(response.message || "Failed to load category");
          router.push("/categories");
        }
      } catch (error) {
        console.error("Error loading category:", error);
        toast.error("Failed to load category");
        router.push("/categories");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId, router]);

  const handleInputChange = (
    field: keyof UpdateCategoryRequest,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const response = await categoriesService.updateCategory(
        categoryId,
        formData
      );

      if (response.status === "success") {
        toast.success("Category updated successfully");
        router.push("/categories");
      } else {
        toast.error(response.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await categoriesService.deleteCategory(categoryId);

      if (response.status === "success") {
        toast.success("Category deleted successfully");
        router.push("/categories");
      } else {
        toast.error(response.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading category...</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (!category) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground">Category not found</p>
              <Button
                variant="outline"
                onClick={() => router.push("/categories")}
                className="mt-4"
              >
                Back to Categories
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Edit Category</h1>
            <p className="text-muted-foreground">
              Update category information and settings
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter category name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter category description"
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select
                    value={formData.parent || "none"}
                    onValueChange={(value) =>
                      handleInputChange(
                        "parent",
                        value === "none" ? undefined : value
                      )
                    }
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Root Category)</SelectItem>
                      {/* TODO: Load parent categories from API */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      handleInputChange(
                        "sortOrder",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    min="0"
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle || ""}
                    onChange={(e) =>
                      handleInputChange("seoTitle", e.target.value)
                    }
                    placeholder="SEO title for search engines"
                    maxLength={60}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.seoTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription || ""}
                    onChange={(e) =>
                      handleInputChange("seoDescription", e.target.value)
                    }
                    placeholder="SEO description for search engines"
                    rows={3}
                    maxLength={160}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.seoDescription?.length || 0}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  );
}
