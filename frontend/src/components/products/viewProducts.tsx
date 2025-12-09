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
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

export type Product = {
  id: number
  sku: string
  name: string
  description: string
  price: number
  stockQuantity: number
  category: string
  imageUrl: string
  isActive: boolean
  inStock: boolean
  createdAt: string
  updatedAt: string
}

type ProductsResponse = {
  success: boolean
  message: string
  data: {
    content: Product[]
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
  navigate: (path: string) => void,
  fetchProducts: () => Promise<void>
): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "stockQuantity",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-normal hover:bg-transparent"
          >
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const quantity = row.getValue("stockQuantity") as number
      return (
        <div className={`text-right ${quantity === 0 ? "text-red-500 font-semibold" : ""}`}>
          {quantity}
        </div>
      )
    },
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
    cell: ({ row }) => {
      const inStock = row.getValue("inStock") as boolean
      return (
        <div className={inStock ? "text-green-600" : "text-red-600"}>
          {inStock ? "Yes" : "No"}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/products/edit/${product.id}`)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit product</span>
          </Button>
          <AlertDialogDeleteProduct productId={product.id} fetchProducts={fetchProducts} />
        </div>
      )
    },
  },
]

export function AlertDialogDeleteProduct({ productId, fetchProducts }: { productId: number, fetchProducts: () => Promise<void> }) {
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const handleDelete = async () => {
        await apiClient.delete(`/products/${productId}`)
        // Refresh the product list
        fetchProducts()
        toast.success("Product deleted successfully")
        setShowAlertDialog(false)
    }   
    return (
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete product</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

export default function ViewProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
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

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters dynamically
      const params = new URLSearchParams()
      params.append("page", pagination.pageIndex.toString())
      params.append("size", pagination.pageSize.toString())
      
      // Handle sorting
      if (sorting.length > 0) {
        const sort = sorting[0]
        const columnId = sort.id
        // Map column IDs to API field names (convert camelCase to camelCase or handle special cases)
        const sortBy = columnId === "stockQuantity" ? "stockQuantity" : 
                      columnId === "inStock" ? "inStock" :
                      columnId
        params.append("sortBy", sortBy)
        params.append("sortDir", sort.desc ? "desc" : "asc")
      } else {
        // Default sorting if none specified
        params.append("sortBy", "name")
        params.append("sortDir", "asc")
      }
      
      const response = await apiClient.get<ProductsResponse>(
        `/products?${params.toString()}`
      )
      
      if (response.data.success && response.data.data) {
        setProducts(response.data.data.content || [])
        setPaginationInfo({
          totalElements: response.data.data.totalElements,
          totalPages: response.data.data.totalPages,
          first: response.data.data.first,
          last: response.data.data.last,
        })
      } else {
        setError(response.data.message || "Failed to fetch products")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "An error occurred while fetching products"
      )
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting])

  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = React.useCallback(async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await apiClient.delete(`/products/${id}`)
      // Refresh the product list
      await fetchProducts()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete product"
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }, [fetchProducts])

  const columns = React.useMemo(
    () => createColumns(navigate, fetchProducts),
    [navigate, fetchProducts]
  )

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: paginationInfo.totalPages,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center border-b px-6 py-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="ml-auto h-10 w-32" />
        </div>
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
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center border-b px-6 py-4">
        <Input
          placeholder="Filter by name or SKU..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button className="ml-auto" onClick={() => navigate("/products/create")}>Create Product</Button>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <div className="h-full w-full overflow-hidden border-b">
          <div className="h-full w-full overflow-auto">
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-4 border-t bg-background px-6 py-4">
        <div className="text-muted-foreground text-sm whitespace-nowrap">
          Showing {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {paginationInfo.totalElements} row(s) selected
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
                  // Show all pages if 7 or fewer
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  // Always show first page
                  pages.push(1)

                  if (currentPage <= 3) {
                    // Near the start: 1, 2, 3, 4, ..., last
                    for (let i = 2; i <= 4; i++) {
                      pages.push(i)
                    }
                    pages.push("ellipsis")
                    pages.push(totalPages)
                  } else if (currentPage >= totalPages - 2) {
                    // Near the end: 1, ..., n-3, n-2, n-1, n
                    pages.push("ellipsis")
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    // In the middle: 1, ..., current-1, current, current+1, ..., last
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
  )
}
