import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardStats } from "@/components/dashboard-stats";
import { AnalyticsChart } from "@/components/analytics-chart";
import { RecentActivity } from "@/components/recent-activity";
import { DataTable } from "@/components/data-table";

export default function DashboardPage() {
  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardStats />
        <AnalyticsChart />
        <DataTable />
      </div>
    </SidebarInset>
  );
}
