import { TrendingUp, TrendingDown, Package, Clock, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Orders",
    value: "1,234",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Package,
    description: "vs last month",
  },
  {
    title: "Pending Orders",
    value: "23",
    change: "-8.2%",
    changeType: "positive" as const,
    icon: Clock,
    description: "vs last month",
  },
  {
    title: "Completed Orders",
    value: "1,156",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: CheckCircle,
    description: "vs last month",
  },
  {
    title: "Cancelled Orders",
    value: "55",
    change: "+2.1%",
    changeType: "negative" as const,
    icon: XCircle,
    description: "vs last month",
  },
]

export function OrdersStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.changeType === "positive" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stat.changeType === "positive" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
              <span className="ml-1">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
