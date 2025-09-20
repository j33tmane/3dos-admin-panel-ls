"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  User as UserIcon,
  RefreshCw,
  AlertCircle,
  Shield,
  UserCheck,
  Crown,
  Mail,
  MailCheck,
  ExternalLink,
  Hash,
  UserPlus,
  AlertTriangle,
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
import { User as UserType, UsersParams } from "@/types/users";
import { formatCurrency, formatDate, showToast } from "@/utils";
import { UserDetailsModal } from "@/components/user-details-modal";
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

interface UsersTableProps {
  users: UserType[];
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

export function UsersTable({
  users,
  loading,
  error,
  pagination,
  onPageChange,
  onRefresh,
}: UsersTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [makingManufacturer, setMakingManufacturer] = useState<string | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<UserType | null>(null);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAll = () => {
    setSelectedUsers((prev) =>
      prev.length === users.length
        ? []
        : users.map((user) => user.id || "").filter((id) => id !== "")
    );
  };

  const handleViewDetails = (user: UserType) => {
    setSelectedUserUid(user.uid);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUserUid(null);
  };

  const handleMakeManufacturer = (user: UserType) => {
    if (!user.email) {
      showToast.error("User email not found");
      return;
    }

    if (user.role === "manufacturer") {
      showToast.error("User is already a manufacturer");
      return;
    }

    setUserToUpdate(user);
    setShowConfirmDialog(true);
  };

  const confirmMakeManufacturer = async () => {
    if (!userToUpdate) return;

    setMakingManufacturer(userToUpdate.id);
    setShowConfirmDialog(false);

    try {
      const { usersService } = await import("@/services");
      const response = await usersService.updateUserRoleToManufacturer({
        email: userToUpdate.email,
      });

      if (response.status === "success") {
        showToast.success(
          response.message || "User role updated to manufacturer successfully"
        );
        // Refresh the users list
        onRefresh();
      } else {
        // Handle API error responses
        const errorMessage = response.message || "Failed to update user role";
        const errorDetails =
          response.errors && response.errors.length > 0
            ? response.errors.join(", ")
            : "";

        showToast.error(
          errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage
        );
      }
    } catch (err: any) {
      // Handle network errors or other exceptions
      let errorMessage = "Failed to update user role";

      if (err?.response?.data) {
        // Handle HTTP error responses
        const errorData = err.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage += `: ${errorData.errors.join(", ")}`;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast.error(errorMessage);
      console.error("Error updating user role:", err);
    } finally {
      setMakingManufacturer(null);
      setUserToUpdate(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Crown className="h-3 w-3 text-red-500" />;
      case "moderator":
        return <Shield className="h-3 w-3 text-blue-500" />;
      case "manufacturer":
        return <UserCheck className="h-3 w-3 text-green-500" />;
      default:
        return <UserIcon className="h-3 w-3 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      case "manufacturer":
        return "secondary";
      default:
        return "outline";
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts and view their details.{" "}
                {selectedUsers.length > 0 && `${selectedUsers.length} selected`}
                {pagination.totalResults > 0 &&
                  ` • ${pagination.totalResults} total users`}
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
              {selectedUsers.length > 0 && (
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
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onCheckedChange={toggleAll}
                    disabled={loading}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Model Limit</TableHead>
                <TableHead>Royalty</TableHead>
                <TableHead>Joined</TableHead>
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
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: UserType) => (
                  <TableRow
                    key={user.id || `user-${Math.random()}`}
                    className={
                      selectedUsers.includes(user.id || "") ? "bg-muted/50" : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id || "")}
                        onCheckedChange={() => toggleUser(user.id || "")}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.fullName || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{user.username || "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{user.email || "N/A"}</div>
                        {user.isEmailVerified ? (
                          <MailCheck className="h-3 w-3 text-green-500" />
                        ) : (
                          <Mail className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role || "N/A"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        {user.modelLimit || 0}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.royalty || 0}%
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt
                        ? formatDate(new Date(user.createdAt))
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
                            onClick={() => handleViewDetails(user)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {user.role !== "manufacturer" && (
                            <DropdownMenuItem
                              onClick={() => handleMakeManufacturer(user)}
                              disabled={makingManufacturer === user.id}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              {makingManufacturer === user.id
                                ? "Updating..."
                                : "Make Manufacturer"}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
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
                of {pagination.totalResults} users
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

      {/* User Details Modal */}
      {selectedUserUid && (
        <UserDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          uid={selectedUserUid}
        />
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Role Update
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update{" "}
              <strong>{userToUpdate?.fullName}</strong> ({userToUpdate?.email})
              to a manufacturer role?
              <br />
              <br />
              This action will change their role from{" "}
              <strong>{userToUpdate?.role}</strong> to{" "}
              <strong>manufacturer</strong>.
              <br />
              <br />
              <span className="text-amber-600 text-sm">
                ⚠️ Note: If the user is already a manufacturer, this action will
                fail.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMakeManufacturer}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Yes, Update Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
