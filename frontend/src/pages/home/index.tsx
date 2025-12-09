"use client"

import * as React from "react"
import { DollarSign, ShoppingCart, TrendingUp, Percent, Package, PlusCircle, History, BarChart } from "lucide-react"
import { useNavigate } from "react-router"
import apiClient from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DailySummary = {
  date: string
  salesCount: number
  revenue: number
}

type TopProduct = {
  productId: number
  productName: string
  quantitySold: number
  revenue: number
}

type PaymentMethodBreakdown = {
  paymentMethod: string
  count: number
  amount: number
}

type SummaryData = {
  startDate: string
  endDate: string
  totalSales: number
  totalRevenue: number
  totalTax: number
  totalDiscount: number
  averageSaleAmount: number
  dailySummary: DailySummary[]
  topProducts: TopProduct[]
  paymentMethodBreakdown: PaymentMethodBreakdown[]
}

type SummaryResponse = {
  success: boolean
  message: string
  data: SummaryData
  timestamp: string
}

function Home() {
  const navigate = useNavigate()

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [loading, setLoading] = React.useState(false)
  const [summaryData, setSummaryData] = React.useState<SummaryData | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const fetchTodaySummary = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const today = getTodayDate()
      const url = "/reports/sales/summary"
      const params = { startDate: today, endDate: today }

      const response = await apiClient.get<SummaryResponse>(url, { params })

      if (response.data.success) {
        setSummaryData(response.data.data)
      } else {
        setError(response.data.message || "Failed to fetch dashboard data")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data")
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load data automatically on component mount
  React.useEffect(() => {
    fetchTodaySummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of today's business performance
          </p>
        </div>
        <Button onClick={fetchTodaySummary} disabled={loading} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && summaryData && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalSales}</div>
                <p className="text-xs text-muted-foreground">Transactions today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">Total revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.averageSaleAmount)}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.totalTax)}
                </div>
                <p className="text-xs text-muted-foreground">Tax amount</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Additional Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Discount Given</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.totalDiscount)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total discounts applied</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2"
                    onClick={() => navigate("/sales/create")}
                  >
                    <PlusCircle className="h-6 w-6" />
                    <span>New Sale</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2"
                    onClick={() => navigate("/products/create")}
                  >
                    <Package className="h-6 w-6" />
                    <span>Add Product</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2"
                    onClick={() => navigate("/sales/history")}
                  >
                    <History className="h-6 w-6" />
                    <span>Sales History</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2"
                    onClick={() => navigate("/summary")}
                  >
                    <BarChart className="h-6 w-6" />
                    <span>View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products and Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Products */}
            {summaryData.topProducts.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Top Products Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryData.topProducts.slice(0, 5).map((product) => (
                        <TableRow key={product.productId}>
                          <TableCell className="font-medium">
                            {product.productName}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.quantitySold}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(product.revenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Top Products Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-4">
                    No products sold today
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Methods */}
            {summaryData.paymentMethodBreakdown.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryData.paymentMethodBreakdown.map((payment, index) => (
                        <TableRow key={`${payment.paymentMethod}-${index}`}>
                          <TableCell className="font-medium">
                            {payment.paymentMethod}
                          </TableCell>
                          <TableCell className="text-right">
                            {payment.count}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-4">
                    No payment data available
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !summaryData && !error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No data available for today. Start by creating a sale!
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/sales/create")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Sale
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Home