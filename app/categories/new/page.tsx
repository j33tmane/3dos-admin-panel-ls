"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ArrowLeft, Save, Plus } from "lucide-react";
import { categoriesService } from "@/services";
import { CreateCategoryRequest, Category } from "@/types";
import { toast } from "sonner";
import { TagInput } from "@/components/ui/tag-input";

export default function NewCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent");

  const [loading, setLoading] = useState(false);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    description: "",
    parent: parentId && parentId.length === 24 ? parentId : undefined,
    isActive: true,
    sortOrder: 0,
    seoTitle: "",
    seoDescription: "",
    seoSlug: "",
    coreKeywords: [],
    semanticKeywords1: [],
    semanticKeywords2: [],
    faqs: [],
  });

  // Load parent category data if parentId is provided
  useEffect(() => {
    const loadParentCategory = async () => {
      if (parentId && parentId.length === 24) {
        try {
          const response = await categoriesService.getCategoryById(parentId);
          if (response.status === "success") {
            setParentCategory(response.data);
          }
        } catch (error) {
          console.error("Error loading parent category:", error);
          // Don't show error to user, just continue without parent name
        }
      }
    };

    loadParentCategory();
  }, [parentId]);

  // Function to generate SEO slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  const handleInputChange = (
    field: keyof CreateCategoryRequest,
    value: any
  ) => {
    console.log("handleInputChange called:", field, value);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Auto-generate SEO slug when name changes
      if (field === "name" && value) {
        newData.seoSlug = generateSlug(value);
      }

      console.log("Updated form data:", newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      console.log("Form data being sent:", formData);
      const response = await categoriesService.createCategory(formData);

      if (response.status === "success") {
        toast.success("Category created successfully");
        router.push("/categories");
      } else {
        toast.error(response.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const response = await categoriesService.createCategory(formData);

      if (response.status === "success") {
        toast.success("Category created successfully");
        // Reset form for next category
        setFormData({
          name: "",
          description: "",
          parent: parentId && parentId.length === 24 ? parentId : undefined,
          isActive: true,
          sortOrder: 0,
          seoTitle: "",
          seoDescription: "",
          seoSlug: "",
          coreKeywords: [],
          semanticKeywords1: [],
          semanticKeywords2: [],
          faqs: [],
        });
      } else {
        toast.error(response.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

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
          <div>
            <h1 className="text-2xl font-bold">Create New Category</h1>
            <p className="text-muted-foreground">
              {parentId && parentId.length === 24
                ? `Creating a subcategory (Parent ID: ${parentId})`
                : "Add a new category to your store"}
            </p>
          </div>
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
                    value={formData.name}
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

                {/* Parent category is automatically set from URL parameter */}
                {parentId && parentId.length === 24 && (
                  <div className="space-y-2">
                    <Label>Parent Category</Label>
                    <div className="p-3 bg-muted rounded-md">
                      {parentCategory ? (
                        <div>
                          <p className="text-sm font-medium">
                            {parentCategory.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {parentId} • Level: {parentCategory.level}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            This subcategory will be created under "
                            {parentCategory.name}"
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">
                            Loading parent category...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {parentId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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

                <div className="space-y-2">
                  <Label htmlFor="seoSlug">SEO Slug</Label>
                  <Input
                    id="seoSlug"
                    value={formData.seoSlug || ""}
                    onChange={(e) =>
                      handleInputChange("seoSlug", e.target.value)
                    }
                    placeholder="seo-friendly-url-slug"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from category name. Used in URLs and for SEO.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords Section */}
          <Card>
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <TagInput
                  id="coreKeywords"
                  label="Core Keywords"
                  value={formData.coreKeywords || []}
                  onChange={(keywords) =>
                    handleInputChange("coreKeywords", keywords)
                  }
                  placeholder="Type and press Enter to add core keywords"
                  maxTags={20}
                  maxLength={50}
                  disabled={loading}
                  description="Primary keywords for this category"
                />

                <TagInput
                  id="semanticKeywords1"
                  label="Semantic Keywords 1"
                  value={formData.semanticKeywords1 || []}
                  onChange={(keywords) =>
                    handleInputChange("semanticKeywords1", keywords)
                  }
                  placeholder="Type and press Enter to add semantic keywords"
                  maxTags={20}
                  maxLength={50}
                  disabled={loading}
                  description="Related keywords for better SEO"
                />

                <TagInput
                  id="semanticKeywords2"
                  label="Semantic Keywords 2"
                  value={formData.semanticKeywords2 || []}
                  onChange={(keywords) =>
                    handleInputChange("semanticKeywords2", keywords)
                  }
                  placeholder="Type and press Enter to add semantic keywords"
                  maxTags={20}
                  maxLength={50}
                  disabled={loading}
                  description="Additional related keywords"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQs Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.faqs?.map((faq, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">FAQ {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFaqs =
                          formData.faqs?.filter((_, i) => i !== index) || [];
                        handleInputChange("faqs", newFaqs);
                      }}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`faq-question-${index}`}>Question</Label>
                    <Input
                      id={`faq-question-${index}`}
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...(formData.faqs || [])];
                        newFaqs[index] = { ...faq, question: e.target.value };
                        handleInputChange("faqs", newFaqs);
                      }}
                      placeholder="Enter the question"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                    <Textarea
                      id={`faq-answer-${index}`}
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...(formData.faqs || [])];
                        newFaqs[index] = { ...faq, answer: e.target.value };
                        handleInputChange("faqs", newFaqs);
                      }}
                      placeholder="Enter the answer"
                      rows={3}
                      disabled={loading}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newFaqs = [
                    ...(formData.faqs || []),
                    { question: "", answer: "" },
                  ];
                  handleInputChange("faqs", newFaqs);
                }}
                disabled={loading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </CardContent>
          </Card>

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
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveAndAddAnother}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Save & Add Another
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  );
}
