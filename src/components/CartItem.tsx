import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart, type CartItem as CartItemType } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      return;
    }
    setQuantity(newQuantity);
    updateQuantity(item.product.id, newQuantity);
  };

  const handleInputChange = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      setQuantity(1);
      updateQuantity(item.product.id, 1);
    } else if (num > item.product.stock) {
      setQuantity(item.product.stock);
      updateQuantity(item.product.id, item.product.stock);
    } else {
      setQuantity(num);
      updateQuantity(item.product.id, num);
    }
  };

  const price = item.product.price;
  const originalPrice = item.product.original_price;
  const total = price * item.quantity;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          to={`/product/${item.product.id}`}
          className="flex-shrink-0 group"
        >
          {item.product.image_url ? (
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <Link
                to={`/product/${item.product.id}`}
                className="hover:underline"
              >
                <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
                  {item.product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                {item.product.brand}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.product.condition}
              </p>

              {/* Badge */}
              {item.product.badge && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {item.product.badge === "new" && "🆕 Mới"}
                    {item.product.badge === "sale" && "🔥 Giảm giá"}
                    {item.product.badge === "rare" && "💎 Hiếm"}
                  </span>
                </div>
              )}
            </div>

            {/* Price (Desktop) */}
            <div className="hidden sm:block text-right">
              <div className="font-semibold text-lg">
                {new Intl.NumberFormat("vi-VN").format(price)}₫
              </div>
              {originalPrice && originalPrice > price && (
                <div className="text-sm text-muted-foreground line-through">
                  {new Intl.NumberFormat("vi-VN").format(originalPrice)}₫
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                Tồn: {item.product.stock}
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>

              <Input
                type="number"
                min="1"
                max={item.product.stock}
                value={quantity}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-16 h-8 text-center"
              />

              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= item.product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeFromCart(item.product.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>

            {/* Total (Mobile) */}
            <div className="sm:hidden ml-auto text-right">
              <div className="font-semibold">
                {new Intl.NumberFormat("vi-VN").format(total)}₫
              </div>
              <div className="text-xs text-muted-foreground">
                {quantity} x {new Intl.NumberFormat("vi-VN").format(price)}₫
              </div>
            </div>
          </div>
        </div>

        {/* Total (Desktop) */}
        <div className="hidden sm:block text-right min-w-[100px]">
          <div className="text-sm text-muted-foreground mb-1">Tổng</div>
          <div className="font-bold text-lg text-primary">
            {new Intl.NumberFormat("vi-VN").format(total)}₫
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
