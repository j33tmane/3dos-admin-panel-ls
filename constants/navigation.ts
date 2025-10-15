// Navigation configuration
import {
  BarChart3,
  Building2,
  CreditCard,
  Home,
  Settings,
  ShoppingCart,
  Users,
  Receipt,
  FolderTree,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Products",
        url: "/products",
        icon: ShoppingCart,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: FolderTree,
      },
      {
        title: "Orders",
        url: "/orders",
        icon: CreditCard,
      },
      {
        title: "Payments",
        url: "/payments",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "General",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Organization",
        url: "/organization",
        icon: Building2,
      },
    ],
  },
] as const;

export const AUTH_ROUTES = ["/login", "/register"] as const;

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/analytics",
  "/users",
  "/products",
  "/categories",
  "/orders",
  "/payments",
  "/settings",
  "/organization",
  "/account",
] as const;
