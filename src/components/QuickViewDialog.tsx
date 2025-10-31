import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/services/productService";

interface QuickViewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewDialog = ({ product, open, onOpenChange }: QuickViewDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images || (product.image_url ? [product.image_url] : []);
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-serif pr-8">
              Xem Nhanh
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary hover:text-primary"
            >
              <Link to={`/product/${product.id}`} onClick={() => onOpenChange(false)}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Xem chi tiết
              </Link>
            </Button>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {hasMultipleImages && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white w-6"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Không có ảnh
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Badge */}
            {product.badge && (
              <Badge variant="outline" className="text-sm">
                {product.badge === "new" && "🆕 Mới"}
                {product.badge === "sale" && "🔥 Giảm giá"}
                {product.badge === "rare" && "💎 Hiếm"}
              </Badge>
            )}

            {/* Name & Brand */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-2">
                {product.name}
              </h2>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat("vi-VN").format(product.price)}₫
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {new Intl.NumberFormat("vi-VN").format(product.original_price)}₫
                </span>
              )}
            </div>

            <Separator />

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tình trạng:</span>
                <span className="font-medium">{product.condition}</span>
              </div>
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Danh mục:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tồn kho:</span>
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `Còn ${product.stock}` : "Hết hàng"}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Mô tả</h3>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {product.description}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Add to Cart */}
            <AddToCartButton product={product} variant="detailed" />

            {/* View Full Details */}
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to={`/product/${product.id}`} onClick={() => onOpenChange(false)}>
                Xem đầy đủ thông tin
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;
