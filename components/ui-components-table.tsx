"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  AlertCircle,
  ExternalLink,
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
import { UIComponent, UIComponentsParams } from "@/types";
import { formatDate } from "@/utils";
import { toast } from "sonner";
import { uiComponentsService } from "@/services";

interface UIComponentsTableProps {
  components: UIComponent[];
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

const componentTypeColors = {
  slider: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  banner: "bg-green-100 text-green-800 hover:bg-green-200",
  card: "bg-purple-100 text-purple-800 hover:bg-purple-200",
};

const statusColors = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-red-100 text-red-800 hover:bg-red-200",
};

export function UIComponentsTable({
  components,
  loading,
  error,
  pagination,
  onPageChange,
  onRefresh,
}: UIComponentsTableProps) {
  const router = useRouter();
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] =
    useState<UIComponent | null>(null);

  const toggleComponent = (componentId: string) => {
    setSelectedComponents((prev) =>
      prev.includes(componentId)
        ? prev.filter((id) => id !== componentId)
        : [...prev, componentId]
    );
  };

  const toggleAll = () => {
    setSelectedComponents((prev) =>
      prev.length === components.length
        ? []
        : components.map((component) => component.id)
    );
  };

  const handleViewDetails = (componentId: string) => {
    router.push(`/ui-components/${componentId}`);
  };

  const handleEditComponent = (componentId: string) => {
    router.push(`/ui-components/${componentId}/edit`);
  };

  const handleDeleteComponent = (component: UIComponent) => {
    setComponentToDelete(component);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!componentToDelete) return;

    try {
      const response = await uiComponentsService.deleteUIComponent(
        componentToDelete.id
      );

      if (response.status === "success") {
        toast.success("UI Component deleted successfully");
        onRefresh();
      } else {
        toast.error(response.message || "Failed to delete UI component");
      }
    } catch (error) {
      console.error("Error deleting UI component:", error);
      toast.error("Failed to delete UI component");
    } finally {
      setDeleteDialogOpen(false);
      setComponentToDelete(null);
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
            <CardTitle>UI Components</CardTitle>
            <CardDescription>
              Manage sliders, banners, and cards for your website.{" "}
              {selectedComponents.length > 0 &&
                `${selectedComponents.length} selected`}
              {pagination.totalResults > 0 &&
                ` • ${pagination.totalResults} total components`}
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
              onClick={() => router.push("/ui-components/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Component
            </Button>
            {selectedComponents.length > 0 && (
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
                    selectedComponents.length === components.length &&
                    components.length > 0
                  }
                  onCheckedChange={toggleAll}
                  disabled={loading}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
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
                    <Skeleton className="h-12 w-16 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
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
            ) : components.length === 0 ? (
              <TableRow key="no-components">
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No UI components found
                </TableCell>
              </TableRow>
            ) : (
              components.map((component) => (
                <TableRow
                  key={component.id}
                  className={
                    selectedComponents.includes(component.id)
                      ? "bg-muted/50"
                      : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedComponents.includes(component.id)}
                      onCheckedChange={() => toggleComponent(component.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {component.image?.url ? (
                      <img
                        src={component.image.url}
                        alt={component.title}
                        className="h-12 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-medium">{component.title}</div>
                      {component.subtitle && (
                        <div className="text-sm text-muted-foreground">
                          {component.subtitle}
                        </div>
                      )}
                      {component.actionUrl && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <ExternalLink className="h-3 w-3" />
                          <span>Has action URL</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        statusColors[component.status ? "active" : "inactive"]
                      }
                    >
                      {component.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {component.sortOrder}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {component.createdAt
                      ? formatDate(new Date(component.createdAt))
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
                          onClick={() => handleViewDetails(component.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditComponent(component.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Component
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteComponent(component)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Component
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
              of {pagination.totalResults} components
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
            <AlertDialogTitle>Delete UI Component</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{componentToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Component
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
