import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  image: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  condition: string;
  badge?: "new" | "sale" | "rare";
}

const ProductCard = ({
  image,
  name,
  brand,
  price,
  originalPrice,
  condition,
  badge,
}: ProductCardProps) => {
  const badgeStyles = {
    new: "bg-sage-green text-white",
    sale: "bg-rust-orange text-white",
    rare: "bg-indigo-blue text-white",
  };

  return (
    <div className="group relative bg-card border border-border rounded hover-lift overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge */}
        {badge && (
          <Badge
            className={`absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider ${
              badgeStyles[badge]
            }`}
          >
            {badge === "new" ? "Mới về" : badge === "sale" ? "Sale" : "Hiếm"}
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
        >
          <Heart className="w-4 h-4" />
        </Button>
        
        {/* Quick View - Shows on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem nhanh
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          {brand}
        </p>
        
        <h3 className="font-medium text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground">{condition}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {price}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
