import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { AnalyticsChart } from "@/components/analytics-chart"
import { RecentActivity } from "@/components/recent-activity"
import { DataTable } from "@/components/data-table"

export default function DashboardPage() {
  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardStats />
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <AnalyticsChart />
          </div>
          <div className="md:col-span-1">
            <RecentActivity />
          </div>
        </div>
        <DataTable />
      </div>
    </SidebarInset>
  )
}


