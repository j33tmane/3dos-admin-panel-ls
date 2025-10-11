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
  Folder,
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
        title: "Categories",
        url: "/categories",
        icon: Folder,
      },
      {
        title: "Products",
        url: "/products",
        icon: ShoppingCart,
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
  "/categories",
  "/products",
  "/orders",
  "/payments",
  "/settings",
  "/organization",
  "/account",
] as const;
