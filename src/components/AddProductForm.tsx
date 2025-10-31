import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct, getAllCategories } from "@/services/productService";
import { Loader2 } from "lucide-react";

// Form validation schema
const productFormSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  brand: z.string().min(2, "Thương hiệu phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  price: z.string().min(1, "Giá bán là bắt buộc"),
  original_price: z.string().optional(),
  condition: z.string().min(1, "Tình trạng sản phẩm là bắt buộc"),
  badge: z.enum(["new", "sale", "rare", "none"]).optional(),
  image_url: z.string().url("URL hình ảnh không hợp lệ").optional().or(z.literal("")),
  category: z.string().optional(),
  stock: z.string().min(1, "Số lượng tồn kho là bắt buộc"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface AddProductFormProps {
  onSuccess?: () => void;
}

const AddProductForm = ({ onSuccess }: AddProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      price: "",
      original_price: "",
      condition: "10/10 - Như mới",
      badge: "none",
      image_url: "",
      category: "",
      stock: "1",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Thêm sản phẩm thành công!");
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Lỗi: " + error.message);
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert string prices to numbers
      const price = parseFloat(values.price.replace(/[^0-9.]/g, ""));
      const original_price = values.original_price
        ? parseFloat(values.original_price.replace(/[^0-9.]/g, ""))
        : undefined;
      const stock = parseInt(values.stock);

      // Prepare product data
      const productData = {
        name: values.name,
        brand: values.brand,
        description: values.description || null,
        price,
        original_price: original_price || null,
        condition: values.condition,
        badge: values.badge === "none" ? null : values.badge as "new" | "sale" | "rare" | null,
        image_url: values.image_url || null,
        category: values.category || null,
        stock,
        is_active: true,
      };

      await createProductMutation.mutateAsync(productData);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Thêm Sản Phẩm Mới</CardTitle>
        <CardDescription>
          Điền thông tin sản phẩm gốm sứ Nhật Bản vào form bên dưới
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Bát cơm gốm Nhật họa tiết hoa anh đào" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thương hiệu *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Noritake, Arita, Kutani" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả sản phẩm</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả chi tiết về nguồn gốc, đặc điểm và lịch sử của sản phẩm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price and Original Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá bán *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="450000" {...field} />
                    </FormControl>
                    <FormDescription>Giá bằng VNĐ (không có ₫)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="original_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá gốc (nếu giảm giá)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="650000" {...field} />
                    </FormControl>
                    <FormDescription>Để trống nếu không giảm giá</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Condition */}
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tình trạng *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="10/10 - Như mới">10/10 - Như mới</SelectItem>
                      <SelectItem value="9/10 - Xuất sắc">9/10 - Xuất sắc</SelectItem>
                      <SelectItem value="8/10 - Rất tốt">8/10 - Rất tốt</SelectItem>
                      <SelectItem value="7/10 - Tốt">7/10 - Tốt</SelectItem>
                      <SelectItem value="6/10 - Khá">6/10 - Khá</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Badge */}
            <FormField
              control={form.control}
              name="badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhãn đặc biệt</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhãn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Không có nhãn</SelectItem>
                      <SelectItem value="new">Mới</SelectItem>
                      <SelectItem value="sale">Giảm giá</SelectItem>
                      <SelectItem value="rare">Hiếm</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Nhãn đặc biệt sẽ hiển thị trên card sản phẩm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name_vi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL */}
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL hình ảnh</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link đến hình ảnh sản phẩm (có thể upload sau)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng tồn kho *</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Số lượng sản phẩm có sẵn trong kho
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Đặt lại
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Thêm sản phẩm
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
