import { Link } from "react-router-dom";
import { ShoppingCart, ShoppingBag, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-20 py-12 sm:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                Giỏ hàng
              </h1>
              <p className="text-muted-foreground mt-1">
                {items.length === 0
                  ? "Giỏ hàng của bạn đang trống"
                  : `${items.length} sản phẩm trong giỏ hàng`}
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-foreground">Giỏ hàng</span>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto text-center py-16">
            <div className="mb-6">
              <div className="inline-flex p-6 rounded-full bg-muted">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-3">
              Giỏ hàng trống
            </h2>
            <p className="text-muted-foreground mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
              gốm sứ Nhật Bản tuyệt đẹp của chúng tôi!
            </p>
            <Button size="lg" asChild className="shadow-lg">
              <Link to="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear Cart Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Sản phẩm ({items.length})
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Xóa tất cả
                </Button>
              </div>

              {/* Items List */}
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}

              {/* Continue Shopping (Mobile) */}
              <div className="lg:hidden pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}

        {/* Trust Section */}
        {items.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🔒</div>
                <div>
                  <h3 className="font-semibold mb-1">Thanh toán an toàn</h3>
                  <p className="text-sm text-muted-foreground">
                    Bảo mật thông tin thanh toán
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-3xl">🚚</div>
                <div>
                  <h3 className="font-semibold mb-1">Giao hàng nhanh</h3>
                  <p className="text-sm text-muted-foreground">
                    Miễn phí với đơn trên 500k
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-3xl">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Hàng chính hãng</h3>
                  <p className="text-sm text-muted-foreground">
                    100% gốm sứ Nhật Bản
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-3xl">↩️</div>
                <div>
                  <h3 className="font-semibold mb-1">Đổi trả dễ dàng</h3>
                  <p className="text-sm text-muted-foreground">
                    Trong vòng 7 ngày
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
