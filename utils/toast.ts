import { toast } from "sonner";

// Common toast utility with proper styling
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: "hsl(var(--success))",
        color: "hsl(var(--success-foreground))",
        border: "1px solid hsl(var(--success))",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: {
        background: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
        border: "1px solid hsl(var(--destructive))",
      },
    });
  },

  info: (message: string) => {
    toast.info(message, {
      style: {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "1px solid hsl(var(--primary))",
      },
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      style: {
        background: "hsl(var(--warning))",
        color: "hsl(var(--warning-foreground))",
        border: "1px solid hsl(var(--warning))",
      },
    });
  },
};
