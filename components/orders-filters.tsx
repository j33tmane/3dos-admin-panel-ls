// File: components/orders-filters.tsx
'use client'

import { useState } from "react"
import { Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface OrdersFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function OrdersFilters({ onFiltersChange }: OrdersFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const activeFilters = []
  if (searchTerm) activeFilters.push({ key: "search", label: `Search: ${searchTerm}` })
  if (statusFilter !== "all") activeFilters.push({ key: "status", label: `Status: ${statusFilter}` })
  if (dateRange !== "all") activeFilters.push({ key: "date", label: `Date: ${dateRange}` })

  const clearFilter = (key: string) => {
    if (key === "search") setSearchTerm("")
    if (key === "status") setStatusFilter("all")
    if (key === "date") setDateRange("all")
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateRange("all")
  }

  // Notify parent on any filter change
  const notifyFiltersChange = () => {
    onFiltersChange({
      search: searchTerm,
      status: statusFilter,
      date: dateRange
    })
  }

  // Call whenever any state changes
  useState(() => {
    notifyFiltersChange()
  })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, customers, or order IDs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  notifyFiltersChange()
                }}
                className="pl-8"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val)
                  notifyFiltersChange()
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateRange}
                onValueChange={(val) => {
                  setDateRange(val)
                  notifyFiltersChange()
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter.key} variant="secondary" className="gap-1">
                  {filter.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => {
                    clearFilter(filter.key)
                    notifyFiltersChange()
                  }} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={() => {
                clearAllFilters()
                notifyFiltersChange()
              }}>
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
