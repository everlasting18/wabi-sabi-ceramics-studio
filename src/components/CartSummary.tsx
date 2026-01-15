import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Tag, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const CartSummary = () => {
  const { items, getCartTotal, getCartCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const total = subtotal - discount + shipping;
  const itemCount = getCartCount();

  const handleApplyCoupon = () => {
    // Demo coupon logic
    const coupons: Record<string, number> = {
      "WELCOME10": 50000,
      "SAVE20": 100000,
      "VIP50": 200000,
    };

    const upperCode = couponCode.toUpperCase();
    if (coupons[upperCode]) {
      setDiscount(coupons[upperCode]);
      toast.success(`Đã áp dụng mã giảm giá ${upperCode}!`);
    } else {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Item Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Số lượng sản phẩm</span>
          <span className="font-medium">{itemCount} sản phẩm</span>
        </div>

        <Separator />

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-semibold">
            {new Intl.NumberFormat("vi-VN").format(subtotal)}₫
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Giảm giá
            </span>
            <span className="font-medium">
              -{new Intl.NumberFormat("vi-VN").format(discount)}₫
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Truck className="h-4 w-4" />
            Phí vận chuyển
          </span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? (
              "Miễn phí"
            ) : (
              `${new Intl.NumberFormat("vi-VN").format(shipping)}₫`
            )}
          </span>
        </div>

        {shipping > 0 && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            💡 Mua thêm{" "}
            {new Intl.NumberFormat("vi-VN").format(500000 - subtotal)}₫ để được
            miễn phí vận chuyển
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span className="text-primary">
            {new Intl.NumberFormat("vi-VN").format(total)}₫
          </span>
        </div>

        {/* Coupon Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mã giảm giá</label>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã..."
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
            />
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={!couponCode}
            >
              Áp dụng
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            VD: WELCOME10, SAVE20, VIP50
          </p>
        </div>

        <Separator />

        {/* Checkout Button */}
        <Button
          className="w-full h-12 text-base shadow-lg"
          size="lg"
          asChild
          disabled={items.length === 0}
        >
          <Link to="/checkout">
            Tiến hành thanh toán
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        {/* Continue Shopping */}
        <Button
          variant="ghost"
          className="w-full"
          asChild
        >
          <Link to="/">
            Tiếp tục mua sắm
          </Link>
        </Button>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-xs font-medium">Thanh toán an toàn</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl mb-1">🚚</div>
            <div className="text-xs font-medium">Giao hàng nhanh</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl mb-1">✓</div>
            <div className="text-xs font-medium">Hàng chính hãng</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl mb-1">↩️</div>
            <div className="text-xs font-medium">Đổi trả 7 ngày</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
