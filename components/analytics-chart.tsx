"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Monthly revenue for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {/* Placeholder for chart - in a real app you'd use a charting library like Recharts */}
          <div className="flex h-full items-end justify-between gap-2 rounded-md bg-muted/20 p-4">
            {[40, 60, 80, 45, 90, 70].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-sm bg-primary transition-all hover:bg-primary/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
