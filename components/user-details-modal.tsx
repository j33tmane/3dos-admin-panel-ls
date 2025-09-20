"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User as UserIcon,
  Mail,
  MailCheck,
  Shield,
  UserCheck,
  Crown,
  Calendar,
  Hash,
  DollarSign,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Wallet,
  CreditCard,
  Globe,
  User2,
  Tag,
} from "lucide-react";
import { UserDetails } from "@/types/users";
import { formatDate, showToast } from "@/utils";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
}

export function UserDetailsModal({
  isOpen,
  onClose,
  uid,
}: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && uid) {
      fetchUserDetails();
    }
  }, [isOpen, uid]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { usersService } = await import("@/services");
      const response = await usersService.getUserDetails(uid);

      if (response.status === "success") {
        setUserDetails(response.data);
      } else {
        setError(response.message || "Failed to fetch user details");
      }
    } catch (err) {
      setError("Failed to fetch user details");
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      showToast.error("Failed to copy to clipboard");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Crown className="h-4 w-4 text-red-500" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "manufacturer":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-500" />;
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : userDetails ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {userDetails.fullName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  @{userDetails.username}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleIcon(userDetails.role)}
                  <Badge variant={getRoleBadgeVariant(userDetails.role)}>
                    {userDetails.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{userDetails.email}</span>
                    {userDetails.isEmailVerified ? (
                      <MailCheck className="h-3 w-3 text-green-500" />
                    ) : (
                      <Mail className="h-3 w-3 text-gray-400" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(userDetails.email, "Email")
                      }
                    >
                      {copiedField === "Email" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    UID
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{userDetails.uid}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userDetails.uid, "UID")}
                    >
                      {copiedField === "UID" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User2 className="h-3 w-3" />
                    Full Name
                  </label>
                  <span className="text-sm">{userDetails.fullName}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Joined
                  </label>
                  <span className="text-sm">
                    {formatDate(new Date(userDetails.createdAt))}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Account Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    Model Limit
                  </label>
                  <span className="text-sm font-semibold">
                    {userDetails.modelLimit}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    Royalty
                  </label>
                  <span className="text-sm font-semibold">
                    {userDetails.royalty}%
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-3 w-3" />
                    AI Credits
                  </label>
                  <span className="text-sm font-semibold">
                    {userDetails.aiCredits} {userDetails.aiCreditsCurrency}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    Affiliate Code
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {userDetails.affiliateCode}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          userDetails.affiliateCode,
                          "Affiliate Code"
                        )
                      }
                    >
                      {copiedField === "Affiliate Code" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Wallet Information
              </h4>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Wallet className="h-3 w-3" />
                  Balance
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {userDetails.wallet.error
                      ? userDetails.wallet.error
                      : formatCurrency(
                          userDetails.wallet.balance,
                          userDetails.wallet.currency
                        )}
                  </span>
                  {userDetails.wallet.error && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Blockchain Information
              </h4>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  Wallet Address
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono break-all">
                    {userDetails.address}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(userDetails.address, "Wallet Address")
                    }
                  >
                    {copiedField === "Wallet Address" ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* External URLs */}
            {userDetails.externalUrls &&
              userDetails.externalUrls.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    External Links
                  </h4>
                  <div className="space-y-2">
                    {userDetails.externalUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Bio */}
            {userDetails.bio && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Bio
                </h4>
                <p className="text-sm">{userDetails.bio}</p>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
