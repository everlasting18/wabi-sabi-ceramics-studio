import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/services/productService";

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "detailed";
  className?: string;
}

const AddToCartButton = ({ product, variant = "default", className = "" }: AddToCartButtonProps) => {
  const { addToCart, isInCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const inCart = isInCart(product.id);
  const cartItem = items.find((item) => item.product.id === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowSuccess(true);
    setQuantity(1);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > availableStock) {
      return;
    }
    setQuantity(newQuantity);
  };

  const handleInputChange = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      setQuantity(1);
    } else if (num > availableStock) {
      setQuantity(availableStock);
    } else {
      setQuantity(num);
    }
  };

  // Out of stock
  if (product.stock === 0 || availableStock === 0) {
    return (
      <Button
        className={className}
        disabled
        variant="secondary"
      >
        Hết hàng
      </Button>
    );
  }

  // Default variant - simple button
  if (variant === "default") {
    return (
      <Button
        className={className}
        onClick={handleAddToCart}
        disabled={showSuccess}
      >
        {showSuccess ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Đã thêm
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Thêm vào giỏ
          </>
        )}
      </Button>
    );
  }

  // Detailed variant - with quantity selector
  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Stock Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tình trạng</span>
          <span className={product.stock > 10 ? "text-green-600" : "text-orange-600"}>
            {product.stock > 10
              ? `Còn hàng (${product.stock})`
              : `Chỉ còn ${product.stock} sản phẩm`}
          </span>
        </div>

        {inCart && (
          <div className="text-sm bg-primary/10 text-primary p-2 rounded">
            ℹ️ Đã có {cartItem?.quantity} sản phẩm trong giỏ hàng
          </div>
        )}

        {/* Quantity Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">Số lượng</label>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Input
              type="number"
              min="1"
              max={availableStock}
              value={quantity}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-20 text-center"
            />

            <Button
              size="icon"
              variant="outline"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= availableStock}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground ml-2">
              / {availableStock} có sẵn
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full h-12 text-base shadow-lg"
          size="lg"
          onClick={handleAddToCart}
          disabled={showSuccess}
        >
          {showSuccess ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Đã thêm vào giỏ hàng
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </>
          )}
        </Button>

        {/* Buy Now Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            handleAddToCart();
            // Navigate to cart or checkout after a short delay
            setTimeout(() => {
              window.location.href = "/cart";
            }, 500);
          }}
        >
          Mua ngay
        </Button>
      </div>
    </Card>
  );
};

export default AddToCartButton;
