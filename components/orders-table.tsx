"use client"
import { useState } from "react"
import { MoreHorizontal, Eye, Edit, Trash2, Package, Truck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    status: "completed",
    amount: "$250.00",
    date: "2024-01-15",
    items: 3,
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    amount: "$150.00",
    date: "2024-01-14",
    items: 1,
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    status: "shipped",
    amount: "$350.00",
    date: "2024-01-13",
    items: 5,
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    status: "completed",
    amount: "$200.00",
    date: "2024-01-12",
    items: 2,
    paymentMethod: "Bank Transfer",
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    status: "cancelled",
    amount: "$100.00",
    date: "2024-01-11",
    items: 1,
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-006",
    customer: "Diana Prince",
    email: "diana@example.com",
    status: "pending",
    amount: "$450.00",
    date: "2024-01-10",
    items: 4,
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-007",
    customer: "Edward Norton",
    email: "edward@example.com",
    status: "shipped",
    amount: "$320.00",
    date: "2024-01-09",
    items: 3,
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-008",
    customer: "Fiona Green",
    email: "fiona@example.com",
    status: "completed",
    amount: "$180.00",
    date: "2024-01-08",
    items: 2,
    paymentMethod: "Credit Card",
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  shipped: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
}

const statusIcons = {
  completed: Package,
  pending: Package,
  shipped: Truck,
  cancelled: Package,
}

export function OrdersTable() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const toggleOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const toggleAll = () => {
    setSelectedOrders((prev) => (prev.length === orders.length ? [] : orders.map((order) => order.id)))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Manage your orders and view their status.{" "}
              {selectedOrders.length > 0 && `${selectedOrders.length} selected`}
            </CardDescription>
          </div>
          {selectedOrders.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedOrders.length === orders.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
              return (
                <TableRow key={order.id} className={selectedOrders.includes(order.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleOrder(order.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="font-medium">{order.amount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.paymentMethod}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
