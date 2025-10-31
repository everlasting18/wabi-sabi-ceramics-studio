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
import { Separator } from "@/components/ui/separator";
import { createProduct, getAllCategories } from "@/services/productService";
import { Loader2, Package, DollarSign, Tag, Image as ImageIcon } from "lucide-react";
import ImageUpload from "./ImageUpload";

// Form validation schema
const productFormSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  brand: z.string().min(2, "Thương hiệu phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  price: z.string().min(1, "Giá bán là bắt buộc"),
  original_price: z.string().optional(),
  condition: z.string().min(1, "Tình trạng sản phẩm là bắt buộc"),
  badge: z.enum(["new", "sale", "rare", "none"]).optional(),
  category: z.string().optional(),
  stock: z.string().min(1, "Số lượng tồn kho là bắt buộc"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface AddProductFormProps {
  onSuccess?: () => void;
}

const AddProductForm = ({ onSuccess }: AddProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
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
      setImages([]);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Lỗi: " + error.message);
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    if (images.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 ảnh sản phẩm");
      return;
    }

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
        image_url: images[0], // First image as primary
        images: images, // All images array
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
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="space-y-1 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Thêm Sản Phẩm Mới</CardTitle>
        </div>
        <CardDescription>
          Điền đầy đủ thông tin sản phẩm gốm sứ Nhật Bản vào form bên dưới
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Images Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Hình ảnh sản phẩm</h3>
                <span className="text-xs text-muted-foreground">(Bắt buộc)</span>
              </div>
              <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sản phẩm</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về sản phẩm: nguồn gốc, đặc điểm, lịch sử..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả hấp dẫn sẽ giúp sản phẩm bán tốt hơn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectItem value="10/10 - Như mới">⭐⭐⭐⭐⭐ 10/10 - Như mới</SelectItem>
                          <SelectItem value="9/10 - Xuất sắc">⭐⭐⭐⭐ 9/10 - Xuất sắc</SelectItem>
                          <SelectItem value="8/10 - Rất tốt">⭐⭐⭐ 8/10 - Rất tốt</SelectItem>
                          <SelectItem value="7/10 - Tốt">⭐⭐ 7/10 - Tốt</SelectItem>
                          <SelectItem value="6/10 - Khá">⭐ 6/10 - Khá</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Giá & Kho hàng</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá bán *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="450000"
                            className="pr-10"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(value);
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription>Giá bằng VNĐ</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Original Price */}
                <FormField
                  control={form.control}
                  name="original_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá gốc (sale)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="650000"
                            className="pr-10"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(value);
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription>Để trống nếu không giảm giá</FormDescription>
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
                      <FormLabel>Tồn kho *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Số lượng có sẵn</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <SelectItem value="new">🆕 Mới</SelectItem>
                        <SelectItem value="sale">🔥 Giảm giá</SelectItem>
                        <SelectItem value="rare">💎 Hiếm</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Nhãn sẽ hiển thị nổi bật trên card sản phẩm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setImages([]);
                }}
                disabled={isSubmitting}
              >
                Đặt lại
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[150px]"
              >
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
