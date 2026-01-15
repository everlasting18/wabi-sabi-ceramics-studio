import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/services/productService";

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const badgeStyles = {
    new: "bg-sage-green text-white",
    sale: "bg-rust-orange text-white",
    rare: "bg-indigo-blue text-white",
  };

  const image = product.images && product.images.length > 0
    ? product.images[0]
    : product.image_url || "/placeholder.svg";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  return (
    <div className="group relative bg-card border border-border rounded-lg hover-lift overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {product.badge && (
          <Badge
            className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider shadow-lg ${
              badgeStyles[product.badge]
            }`}
          >
            {product.badge === "new" ? "Mới về" : product.badge === "sale" ? "Sale" : "Hiếm"}
          </Badge>
        )}

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 bg-background/95 hover:bg-background hover:text-primary shadow-md backdrop-blur-sm transition-all duration-300"
        >
          <Heart className="w-4 h-4" />
        </Button>

        {/* Quick View - Shows on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          {onQuickView ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onQuickView();
              }}
              className="w-full bg-background hover:bg-primary text-foreground hover:text-primary-foreground shadow-xl font-semibold"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem nhanh
            </Button>
          ) : (
            <Link to={`/product/${product.id}`}>
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-background hover:bg-primary text-foreground hover:text-primary-foreground shadow-xl font-semibold"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem nhanh
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/product/${product.id}`}>
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            {product.brand}
          </p>

          <h3 className="font-semibold text-base mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted/50 rounded">
              {product.condition}
            </span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-xs text-orange-600 font-medium">
                Chỉ còn {product.stock}
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-xs text-red-600 font-medium">
                Hết hàng
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <div onClick={(e) => e.preventDefault()}>
            <AddToCartButton product={product} variant="default" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
