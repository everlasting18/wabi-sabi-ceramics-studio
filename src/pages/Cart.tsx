import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bát cơm Noritake vintage",
      brand: "Noritake",
      condition: "9/10",
      price: 450000,
      quantity: 1,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Đĩa sứ hoa anh đào",
      brand: "Hasami",
      condition: "8.5/10",
      price: 380000,
      quantity: 1,
      image: "/placeholder.svg",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-grow container mx-auto px-4 py-12 mt-20">
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-serif mb-4">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-8">
              Hãy khám phá những món đồ tuyệt vời từ Nhật Bản
            </p>
            <Button asChild size="lg">
              <Link to="/">Tiếp tục mua sắm</Link>
            </Button>

            {/* Suggestions */}
            <div className="mt-16">
              <h2 className="text-xl font-serif mb-6">Có thể bạn thích</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    to={`/product/${i}`}
                    className="group"
                  >
                    <div className="aspect-square bg-muted rounded-sm mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="Product"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                      Sản phẩm {i}
                    </h3>
                    <p className="text-sm text-primary font-semibold">
                      {(300000 + i * 50000).toLocaleString("vi-VN")}₫
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        <h1 className="text-4xl font-serif mb-8 animate-fade-up">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-card p-6 rounded-sm border border-muted flex gap-6 animate-fade-up"
              >
                {/* Product Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-sm hover:opacity-80 transition-opacity"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.brand} • Tình trạng: {item.condition}
                      </p>
                      <p className="text-sm text-accent font-medium">
                        ✓ Còn hàng
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-lg">
                        {item.price.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Số lượng:</span>
                      <span className="font-medium">{item.quantity}</span>
                      <span className="text-xs text-muted-foreground">(Sản phẩm 2hand)</span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-sm border border-muted sticky top-24 animate-fade-up">
              <h2 className="text-xl font-serif mb-6">Tổng đơn hàng</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span>{shipping.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6 pb-6 border-b border-muted">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-between">
                    <span>Có mã giảm giá?</span>
                    <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      Áp dụng
                    </Button>
                  </div>
                </details>
              </div>

              <div className="flex justify-between font-semibold text-xl mb-6 pb-6 border-b border-muted">
                <span>Tổng cộng:</span>
                <span className="text-primary">{total.toLocaleString("vi-VN")}₫</span>
              </div>

              <Button asChild size="lg" className="w-full mb-4">
                <Link to="/checkout">Thanh toán</Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/">Tiếp tục mua sắm</Link>
              </Button>

              <div className="mt-6 space-y-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Miễn phí vận chuyển cho đơn hàng trên 1,000,000₫</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Đổi trả trong 7 ngày</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Thanh toán an toàn & bảo mật</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
