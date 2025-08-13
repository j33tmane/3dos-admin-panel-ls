"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import type { PropsWithChildren } from "react"

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const isAuthRoute = pathname === "/login" || pathname === "/register"

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      {children}
    </SidebarProvider>
  )
}



