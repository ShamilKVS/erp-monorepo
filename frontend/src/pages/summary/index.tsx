"use client"

import * as React from "react"
import { DollarSign, ShoppingCart, TrendingUp, Percent, Award, Download, Filter, FileSpreadsheet } from "lucide-react"
import apiClient from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Removed FilterType - only using date range now

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

function Summary() {
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [startDate, setStartDate] = React.useState(getTodayDate())
  const [endDate, setEndDate] = React.useState(getTodayDate())
  const [loading, setLoading] = React.useState(false)
  const [summaryData, setSummaryData] = React.useState<SummaryData | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const fetchSummary = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (!startDate || !endDate) {
        setError("Please select both start and end dates")
        setLoading(false)
        return
      }

      const url = "/reports/sales/summary"
      const params = { startDate, endDate }

      const response = await apiClient.get<SummaryResponse>(url, { params })
      
      if (response.data.success) {
        setSummaryData(response.data.data)
      } else {
        setError(response.data.message || "Failed to fetch summary data")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch summary data")
      console.error("Error fetching summary:", err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  // Load data automatically on component mount
  React.useEffect(() => {
    fetchSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const downloadPDF = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates")
      return
    }

    try {
      const url = "/reports/sales/download/pdf"
      const params = { startDate, endDate }

      const response = await apiClient.get(url, {
        params,
        responseType: 'blob', // Important for binary data
      })

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' })
      
      // Create a temporary URL for the blob
      const url_blob = window.URL.createObjectURL(blob)
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a')
      link.href = url_blob
      link.download = `sales-report-${startDate}-to-${endDate}.pdf`
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url_blob)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to download PDF"
      setError(errorMessage)
      console.error("Error downloading PDF:", err)
    }
  }

  const downloadCSV = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates")
      return
    }

    try {
      const url = "/reports/sales/download/csv"
      const params = { startDate, endDate }

      const response = await apiClient.get(url, {
        params,
        responseType: 'blob', // Important for binary data
      })

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'text/csv' })
      
      // Create a temporary URL for the blob
      const url_blob = window.URL.createObjectURL(blob)
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a')
      link.href = url_blob
      link.download = `sales-report-${startDate}-to-${endDate}.csv`
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url_blob)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to download CSV"
      setError(errorMessage)
      console.error("Error downloading CSV:", err)
    }
  }


  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Date Range */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Sales Summary</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Date Range Inputs */}
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto"
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-auto"
              placeholder="End Date"
            />
            <Button onClick={fetchSummary} disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              Apply
            </Button>
            <Button 
              onClick={downloadPDF} 
              disabled={loading || !startDate || !endDate}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={downloadCSV} 
              disabled={loading || !startDate || !endDate}
              variant="outline"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
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

      {/* Summary Data */}
      {!loading && summaryData && (
        <>
          {/* Date Range Info */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Period: {formatDate(summaryData.startDate)} - {formatDate(summaryData.endDate)}
              </p>
            </CardContent>
          </Card>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalSales}</div>
                <p className="text-xs text-muted-foreground">Number of transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">Gross revenue</p>
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
                <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.totalTax)}
                </div>
                <p className="text-xs text-muted-foreground">Tax collected</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Total Discount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(summaryData.totalDiscount)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Summary Table */}
          {summaryData.dailySummary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Sales Count</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.dailySummary.map((daily, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(daily.date)}</TableCell>
                        <TableCell className="text-right">{daily.salesCount}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(daily.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Top Products Table */}
          {summaryData.topProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Quantity Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.topProducts.map((product, index) => (
                      <TableRow key={index}>
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
          )}

          {/* Payment Method Breakdown */}
          {summaryData.paymentMethodBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.paymentMethodBreakdown.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {payment.paymentMethod}
                        </TableCell>
                        <TableCell className="text-right">{payment.count}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !summaryData && !error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No summary data available for the selected period.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Summary

