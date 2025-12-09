"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, Eye, X, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import apiClient from "@/lib/api-client"
import { useNavigate } from "react-router"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type SaleItem = {
  id: number
  productId: number
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
  discountPercent: number
  lineTotal: number
}

export type Sale = {
  id: number
  saleNumber: string
  userId: number
  userName: string
  customerName: string
  customerPhone: string
  items: SaleItem[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: string
  status: string
  saleDate: string
  notes: string
  createdAt: string
}

type SalesResponse = {
  success: boolean
  message: string
  data: {
    content: Sale[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
  }
  timestamp: string
}

const createColumns = (
  setSelectedSale: (sale: Sale | null) => void
): ColumnDef<Sale>[] => [
  {
    accessorKey: "saleNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sale Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("saleNumber")}</div>,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const sale = row.original
      return (
        <div>
          <div className="font-medium">{sale.customerName}</div>
          {sale.customerPhone && (
            <div className="text-sm text-muted-foreground">{sale.customerPhone}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "userName",
    header: () => {
      return (
        <div className="text-sm">
          Sales Person
        </div>
      )
    },
    cell: ({ row }) => <div>{row.getValue("userName")}</div>,
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as SaleItem[]
      return (
        <div className="text-sm">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </div>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-semibold">{formatted}</div>
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string
      return <div className="capitalize">{method}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusColors: Record<string, string> = {
        COMPLETED: "text-green-600 bg-green-50",
        PENDING: "text-yellow-600 bg-yellow-50",
        CANCELLED: "text-red-600 bg-red-50",
        REFUNDED: "text-gray-600 bg-gray-50",
      }
      const colorClass = statusColors[status.toUpperCase()] || "text-gray-600 bg-gray-50"
      return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: "saleDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sale Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("saleDate"))
      return (
        <div className="text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const sale = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedSale(sale)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View sale details</span>
          </Button>
        </div>
      )
    },
  },
]

function SaleDetailDialog({ sale, open, onOpenChange }: { sale: Sale | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!sale) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <AlertDialogHeader className="flex-1 p-0">
            <AlertDialogTitle>Sale Details - {sale.saleNumber}</AlertDialogTitle>
          </AlertDialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <AlertDialogDescription asChild>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="text-sm font-semibold">{sale.customerName}</p>
                  {sale.customerPhone && (
                    <p className="text-sm text-muted-foreground">{sale.customerPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sales Person</p>
                  <p className="text-sm font-semibold">{sale.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="text-sm font-semibold capitalize">{sale.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold">{sale.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sale Date</p>
                  <p className="text-sm font-semibold">
                    {new Date(sale.saleDate).toLocaleString("en-US")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {sale.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(item.unitPrice)}
                          {item.discountPercent > 0 && (
                            <span className="text-green-600 ml-1">
                              ({item.discountPercent}% off)
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-sm font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.lineTotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(sale.subtotal)}</span>
                </div>
                {sale.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">
                      -{new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(sale.discountAmount)}
                    </span>
                  </div>
                )}
                {sale.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(sale.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(sale.totalAmount)}</span>
                </div>
              </div>

              {sale.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{sale.notes}</p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SalesHistoryHeader({ 
  globalFilter, 
  onFilterChange 
}: { 
  globalFilter: string
  onFilterChange: (value: string) => void 
}) {
  const navigate = useNavigate()
  
  return (
    <div className="flex items-center border-b px-6 py-4">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back to Sales</span>
      </Button>
      <h1 className="text-2xl font-bold">Sales History</h1>
      <Input
        placeholder="Filter by customer name or sale number..."
        value={globalFilter}
        onChange={(event) => onFilterChange(event.target.value)}
        className="max-w-sm ml-6"
      />
    </div>
  )
}

function SalesHistory() {
  const [sales, setSales] = React.useState<Sale[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "saleDate", desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [paginationInfo, setPaginationInfo] = React.useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  })
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null)
  const [showDetailDialog, setShowDetailDialog] = React.useState(false)

  React.useEffect(() => {
    if (selectedSale) {
      setShowDetailDialog(true)
    }
  }, [selectedSale])

  const fetchSales = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.append("page", pagination.pageIndex.toString())
      params.append("size", pagination.pageSize.toString())
      
      if (sorting.length > 0) {
        const sort = sorting[0]
        const columnId = sort.id
        const sortBy = columnId === "saleDate" ? "saleDate" : 
                      columnId === "saleNumber" ? "saleNumber" :
                      columnId === "customerName" ? "customerName" :
                      columnId === "userName" ? "userName" :
                      columnId
        params.append("sortBy", sortBy)
        params.append("sortDir", sort.desc ? "desc" : "asc")
      } else {
        params.append("sortBy", "saleDate")
        params.append("sortDir", "desc")
      }
      
      const response = await apiClient.get<SalesResponse>(
        `/sales?${params.toString()}`
      )
      
      if (response.data.success && response.data.data) {
        setSales(response.data.data.content || [])
        setPaginationInfo({
          totalElements: response.data.data.totalElements,
          totalPages: response.data.data.totalPages,
          first: response.data.data.first,
          last: response.data.data.last,
        })
      } else {
        setError(response.data.message || "Failed to fetch sales")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "An error occurred while fetching sales"
      )
      setSales([])
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting])

  React.useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const columns = React.useMemo(
    () => createColumns(setSelectedSale),
    []
  )

  const filteredSales = React.useMemo(() => {
    if (!globalFilter) return sales
    const filter = globalFilter.toLowerCase()
    return sales.filter(
      (sale) =>
        sale.customerName.toLowerCase().includes(filter) ||
        sale.saleNumber.toLowerCase().includes(filter)
    )
  }, [sales, globalFilter])

  const table = useReactTable({
    data: filteredSales,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: paginationInfo.totalPages,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  })

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col">
        <SalesHistoryHeader globalFilter={globalFilter} onFilterChange={setGlobalFilter} />
        <div className="flex-1 overflow-hidden rounded-md border m-6">
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col">
        <SalesHistoryHeader globalFilter={globalFilter} onFilterChange={setGlobalFilter} />
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <SalesHistoryHeader globalFilter={globalFilter} onFilterChange={setGlobalFilter} />
        <div className="flex-1 overflow-auto w-full border-b">
          <Table className="w-full">
            <thead className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="bg-background">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No sales found.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-4 border-t bg-background px-6 py-4">
          <div className="text-muted-foreground text-sm whitespace-nowrap">
            Showing {filteredSales.length} of {paginationInfo.totalElements} sale(s)
            {globalFilter && ` (filtered from ${sales.length})`}
          </div>
          {paginationInfo.totalPages > 1 && (
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      if (!paginationInfo.first && pagination.pageIndex > 0) {
                        table.previousPage()
                      }
                    }}
                    className={
                      paginationInfo.first || pagination.pageIndex === 0
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {(() => {
                  const currentPage = pagination.pageIndex + 1
                  const totalPages = paginationInfo.totalPages || 1
                  const pages: (number | "ellipsis")[] = []

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    pages.push(1)

                    if (currentPage <= 3) {
                      for (let i = 2; i <= 4; i++) {
                        pages.push(i)
                      }
                      pages.push("ellipsis")
                      pages.push(totalPages)
                    } else if (currentPage >= totalPages - 2) {
                      pages.push("ellipsis")
                      for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(i)
                      }
                    } else {
                      pages.push("ellipsis")
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                      }
                      pages.push("ellipsis")
                      pages.push(totalPages)
                    }
                  }

                  return pages.map((page, index) => (
                    <PaginationItem key={`${page}-${index}`}>
                      {page === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault()
                            table.setPageIndex(page - 1)
                          }}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))
                })()}
                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      if (!paginationInfo.last) {
                        table.nextPage()
                      }
                    }}
                    className={
                      paginationInfo.last
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
          <div className="text-muted-foreground text-sm whitespace-nowrap">
            Page {pagination.pageIndex + 1} of {paginationInfo.totalPages || 1}
          </div>
        </div>
      </div>
      <SaleDetailDialog 
        sale={selectedSale} 
        open={showDetailDialog} 
        onOpenChange={(open) => {
          setShowDetailDialog(open)
          if (!open) {
            setSelectedSale(null)
          }
        }} 
      />
    </>
  )
}

export default SalesHistory

