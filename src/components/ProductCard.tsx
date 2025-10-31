import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id?: number;
  image: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  condition: string;
  badge?: "new" | "sale" | "rare";
}

const ProductCard = ({
  id = 1,
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
    <div className="group relative bg-card border border-border rounded-lg hover-lift overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
        />
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge */}
        {badge && (
          <Badge
            className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider shadow-lg ${
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
          className="absolute top-4 right-4 bg-background/95 hover:bg-background hover:text-primary shadow-md backdrop-blur-sm transition-all duration-300"
        >
          <Heart className="w-4 h-4" />
        </Button>
        
        {/* Quick View - Shows on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <Link to={`/product/${id}`}>
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-background hover:bg-primary text-foreground hover:text-primary-foreground shadow-xl font-semibold"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem nhanh
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <Link to={`/product/${id}`}>
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            {brand}
          </p>
          
          <h3 className="font-semibold text-base mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted/50 rounded">{condition}</span>
        </div>
        
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {price}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
