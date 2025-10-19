"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Image as ImageIcon,
  Calendar,
  Hash,
  Tag,
} from "lucide-react";
import { uiComponentsService } from "@/services";
import { UIComponent } from "@/types";
import { toast } from "sonner";
import { formatDate } from "@/utils";

export default function UIComponentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const componentId = params.componentId as string;

  const [loading, setLoading] = useState(true);
  const [component, setComponent] = useState<UIComponent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await uiComponentsService.getUIComponentById(
          componentId
        );

        if (response.status === "success") {
          setComponent(response.data);
        } else {
          setError(response.message || "Failed to fetch component");
          toast.error(response.message || "Failed to fetch component");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch component";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error fetching component:", err);
      } finally {
        setLoading(false);
      }
    };

    if (componentId) {
      fetchComponent();
    }
  }, [componentId]);

  if (loading) {
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

  if (error || !component) {
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
              <h1 className="text-2xl font-bold">Component Not Found</h1>
              <p className="text-muted-foreground">
                The requested component could not be found.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {error || "Component not found"}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/ui-components")}
              >
                Back to Components
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const componentTypeColors = {
    slider: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    banner: "bg-green-100 text-green-800 hover:bg-green-200",
    card: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 hover:bg-green-200",
    inactive: "bg-red-100 text-red-800 hover:bg-red-200",
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{component.title}</h1>
            <p className="text-muted-foreground">UI Component Details</p>
          </div>
          <Button
            variant="default"
            onClick={() => router.push(`/ui-components/${componentId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Component
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Component Information */}
          <Card>
            <CardHeader>
              <CardTitle>Component Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-sm">{component.title}</p>
              </div>

              {component.subtitle && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subtitle</Label>
                  <p className="text-sm text-muted-foreground">
                    {component.subtitle}
                  </p>
                </div>
              )}

              {component.actionUrl && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Action URL</Label>
                  <div className="flex items-center gap-2">
                    <a
                      href={component.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {component.actionUrl}
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Component Type</Label>
                <Badge
                  variant="secondary"
                  className={
                    componentTypeColors[
                      component.componentType as keyof typeof componentTypeColors
                    ] || "bg-gray-100 text-gray-800"
                  }
                >
                  {component.componentType}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Badge
                  variant="secondary"
                  className={
                    statusColors[component.status ? "active" : "inactive"]
                  }
                >
                  {component.status ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sort Order</Label>
                <p className="text-sm">{component.sortOrder}</p>
              </div>
            </CardContent>
          </Card>

          {/* Component Image */}
          <Card>
            <CardHeader>
              <CardTitle>Component Image</CardTitle>
            </CardHeader>
            <CardContent>
              {component.image?.url ? (
                <div className="space-y-4">
                  <img
                    src={component.image.url}
                    alt={component.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="text-sm text-muted-foreground">
                    <p>Image Key: {component.image.key}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No image available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created At
                </Label>
                <p className="text-sm text-muted-foreground">
                  {component.createdAt
                    ? formatDate(new Date(component.createdAt))
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Updated At
                </Label>
                <p className="text-sm text-muted-foreground">
                  {component.updatedAt
                    ? formatDate(new Date(component.updatedAt))
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Component ID
                </Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {component.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
