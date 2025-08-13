import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { OrdersStats } from "@/components/orders-stats"
import { OrdersFilters } from "@/components/orders-filters"
import { OrdersTable } from "@/components/orders-table"

export default function OrdersPage() {
  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <OrdersStats />
        {/* <OrdersFilters onFiltersChange={(filters) => console.log(filters)} /> */}
        <OrdersTable />
      </div>
    </SidebarInset>
  )
}
