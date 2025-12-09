import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import apiClient from "@/lib/api-client";

const editProductSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z
    .number("Price must be a number")
    .refine((val) => val !== 0, {
      message: "Price is required",
    })
    .refine((val) => val > 0, {
      message: "Price must be greater than 0",
    }),
  stockQuantity: z.number().int().min(0, "Stock must be non-negative integer"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.union([z.string().url("Image URL must be a valid URL"), z.literal("")]).optional(),
});

type EditProductSchema = z.infer<typeof editProductSchema>;

type ProductResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    sku: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: string;
    imageUrl: string;
    isActive: boolean;
    inStock: boolean;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
};

export function EditProduct({
  className,
  onSuccess,
  ...props
}: {
  className?: string;
  onSuccess?: () => void;
} & React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const form = useForm<EditProductSchema>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      category: "",
      imageUrl: "",
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [priceInput, setPriceInput] = React.useState<string>("");

  // Fetch product details on mount
  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is required");
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        setError(null);
        const response = await apiClient.get<ProductResponse>(`/products/${id}`);
        
        if (response.data.success && response.data.data) {
          const product = response.data.data;
          form.reset({
            sku: product.sku,
            name: product.name,
            description: product.description || "",
            price: product.price,
            stockQuantity: product.stockQuantity,
            category: product.category,
            imageUrl: product.imageUrl || "",
          });
          setPriceInput(product.price.toString());
        } else {
          setError(response.data.message || "Failed to fetch product");
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message || "Failed to fetch product");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, form]);

  const onSubmit = async (data: EditProductSchema) => {
    if (!id) {
      setError("Product ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await apiClient.put<ProductResponse>(`/products/${id}`, data);
      if (response.data.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setError(response.data.message || "Failed to update product");
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={className} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>Loading product details...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/products")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <CardTitle>Edit Product</CardTitle>
              <CardDescription>Update the product information below.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={priceInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPriceInput(value);
                          if (value === "") {
                            field.onChange(0);
                          } else {
                            const numValue = Number(value);
                            if (!isNaN(numValue)) {
                              field.onChange(numValue);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value === "" || value === "0") {
                            setPriceInput("");
                            field.onChange(0);
                          } else {
                            const numValue = Number(value);
                            if (!isNaN(numValue) && numValue > 0) {
                              setPriceInput(value);
                            } else {
                              setPriceInput("");
                              field.onChange(0);
                            }
                          }
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Stock Quantity"
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Category" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
              </Button>
              {error && (
                <div className="text-sm text-red-600 mt-2">{error}</div>
              )}
              {success && (
                <div className="text-sm text-green-600 mt-2">
                  Product updated successfully!
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProduct;

