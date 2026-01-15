import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct, type Product } from "@/services/productService";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteProductDialog = ({ product, open, onOpenChange }: DeleteProductDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Đã xóa sản phẩm thành công!");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Lỗi khi xóa sản phẩm: " + error.message);
    },
  });

  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      await deleteProductMutation.mutateAsync(product.id);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này sẽ ẩn sản phẩm
              khỏi danh sách hiển thị.
            </p>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium text-foreground text-sm mb-1">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.brand} • {new Intl.NumberFormat("vi-VN").format(product.price)}₫
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Lưu ý: Sản phẩm sẽ không bị xóa vĩnh viễn mà chỉ được đánh dấu là không hoạt động.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa sản phẩm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
