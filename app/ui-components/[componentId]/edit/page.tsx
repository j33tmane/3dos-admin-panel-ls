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
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { uiComponentsService } from "@/services";
import { UIComponent, UpdateUIComponentRequest } from "@/types";
import { toast } from "sonner";

export default function EditUIComponentPage() {
  const router = useRouter();
  const params = useParams();
  const componentId = params.componentId as string;

  const [loading, setLoading] = useState(false);
  const [component, setComponent] = useState<UIComponent | null>(null);
  const [formData, setFormData] = useState<UpdateUIComponentRequest>({
    title: "",
    subtitle: "",
    actionUrl: "",
    status: true,
    sortOrder: 0,
    componentType: "slider",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Fetch component data
  useEffect(() => {
    const fetchComponent = async () => {
      try {
        setLoading(true);
        const response = await uiComponentsService.getUIComponentById(
          componentId
        );

        if (response.status === "success") {
          setComponent(response.data);
          setFormData({
            title: response.data.title,
            subtitle: response.data.subtitle || "",
            actionUrl: response.data.actionUrl || "",
            status: response.data.status,
            sortOrder: response.data.sortOrder,
            componentType: response.data.componentType,
          });
          setImagePreview(response.data.image?.url || null);
        } else {
          toast.error(response.message || "Failed to fetch component");
          router.push("/ui-components");
        }
      } catch (error) {
        console.error("Error fetching component:", error);
        toast.error("Failed to fetch component");
        router.push("/ui-components");
      } finally {
        setLoading(false);
      }
    };

    if (componentId) {
      fetchComponent();
    }
  }, [componentId, router]);

  const handleInputChange = (
    field: keyof UpdateUIComponentRequest,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setNewImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      // Prepare update data
      const updateData: UpdateUIComponentRequest = {
        title: formData.title,
        subtitle: formData.subtitle,
        actionUrl: formData.actionUrl,
        status: formData.status,
        sortOrder: formData.sortOrder,
        componentType: formData.componentType,
      };

      // Add image if a new one was selected
      if (newImage) {
        updateData.image = newImage;
      }

      const response = await uiComponentsService.updateUIComponent(
        componentId,
        updateData
      );

      if (response.status === "success") {
        toast.success("UI Component updated successfully");
        router.push("/ui-components");
      } else {
        toast.error(response.message || "Failed to update UI component");
      }
    } catch (error) {
      console.error("Error updating UI component:", error);
      toast.error("Failed to update UI component");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !component) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading component...</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (!component) {
    return (
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground">Component not found</p>
              <Button
                variant="outline"
                onClick={() => router.push("/ui-components")}
                className="mt-4"
              >
                Back to Components
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
            <h1 className="text-2xl font-bold">Edit UI Component</h1>
            <p className="text-muted-foreground">
              Update component details and settings
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
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter component title"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle || ""}
                    onChange={(e) =>
                      handleInputChange("subtitle", e.target.value)
                    }
                    placeholder="Enter component subtitle"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actionUrl">Action URL</Label>
                  <Input
                    id="actionUrl"
                    type="url"
                    value={formData.actionUrl || ""}
                    onChange={(e) =>
                      handleInputChange("actionUrl", e.target.value)
                    }
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="componentType">Component Type</Label>
                  <Select
                    value={formData.componentType}
                    onValueChange={(value: any) =>
                      handleInputChange("componentType", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select component type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slider">Slider</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) =>
                      handleInputChange("status", checked)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="status">Active</Label>
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

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Update Image</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      {imagePreview ? (
                        <div className="space-y-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 max-w-full rounded object-cover"
                          />
                          <p className="text-sm text-muted-foreground text-center">
                            {newImage?.name || "Current image"}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to keep current image. Maximum file size: 5MB.
                    Supported formats: JPEG, PNG, GIF, WebP
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
              {loading ? "Updating..." : "Update Component"}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  );
}
