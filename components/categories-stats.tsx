import { TrendingUp, TrendingDown, Folder, FolderOpen, Package, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoriesStatsProps {
  stats?: {
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    categoriesWithProducts: number;
    averageProductsPerCategory: number;
  };
  loading?: boolean;
}

export function CategoriesStats({ stats, loading = false }: CategoriesStatsProps) {
  // Default stats for when data is loading or not available
  const defaultStats = {
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
    categoriesWithProducts: 0,
    averageProductsPerCategory: 0,
  };

  const currentStats = stats || defaultStats;

  const statsData = [
    {
      title: "Total Categories",
      value: currentStats.totalCategories.toLocaleString(),
      change: "+5.2%",
      changeType: "positive" as const,
      icon: Folder,
      description: "vs last month",
    },
    {
      title: "Active Categories",
      value: currentStats.activeCategories.toLocaleString(),
      change: "+8.1%",
      changeType: "positive" as const,
      icon: FolderOpen,
      description: "vs last month",
    },
    {
      title: "Categories with Products",
      value: currentStats.categoriesWithProducts.toLocaleString(),
      change: "+12.3%",
      changeType: "positive" as const,
      icon: Package,
      description: "vs last month",
    },
    {
      title: "Avg Products/Category",
      value: currentStats.averageProductsPerCategory.toFixed(1),
      change: "+3.7%",
      changeType: "positive" as const,
      icon: Layers,
      description: "vs last month",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
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
