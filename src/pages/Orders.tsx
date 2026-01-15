import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Loader2, Eye, ChevronRight } from "lucide-react";
import { getUserOrders, type Order, type OrderItem } from "@/services/orderService";
import { useAuth } from "@/hooks/useAuth";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";

const Orders = () => {
  const { user, loading: authLoading } = useAuth();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-orders"],
    queryFn: getUserOrders,
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-serif mb-4">Vui lòng đăng nhập</h1>
            <p className="text-muted-foreground mb-6">
              Bạn cần đăng nhập để xem đơn hàng của mình
            </p>
            <Button asChild>
              <Link to="/auth">Đăng nhập</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-serif mb-4">Có lỗi xảy ra</h1>
            <p className="text-muted-foreground mb-6">
              Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
            </p>
            <Button onClick={() => window.location.reload()}>Tải lại</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sortedOrders = orders?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold">Đơn hàng của tôi</h1>
            </div>
            <p className="text-muted-foreground ml-[60px]">
              Quản lý và theo dõi đơn hàng của bạn
            </p>
          </div>

          {/* Orders List */}
          {sortedOrders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-serif mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-muted-foreground mb-6">
                Bạn chưa đặt đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
              </p>
              <Button asChild>
                <Link to="/products">Khám phá sản phẩm</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order, index) => {
                const orderItems = order.items as OrderItem[];
                const firstItem = orderItems[0];
                const remainingCount = orderItems.length - 1;

                return (
                  <Card
                    key={order.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="bg-muted/30 border-b">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            Đơn hàng #{order.order_number}
                          </CardTitle>
                          <CardDescription>
                            Đặt ngày {new Date(order.created_at).toLocaleDateString("vi-VN")} lúc{" "}
                            {new Date(order.created_at).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.payment_status} />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Items Preview */}
                        <div className="lg:col-span-2">
                          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                            Sản phẩm
                          </h3>
                          <div className="space-y-3">
                            {/* First item with image */}
                            <div className="flex gap-3">
                              <img
                                src={firstItem.product_image || "/placeholder.svg"}
                                alt={firstItem.product_name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium line-clamp-1">
                                  {firstItem.product_name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {firstItem.product_brand}
                                </p>
                                <p className="text-sm">
                                  {firstItem.price.toLocaleString("vi-VN")}₫ x {firstItem.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Remaining items count */}
                            {remainingCount > 0 && (
                              <p className="text-sm text-muted-foreground pl-[76px]">
                                + {remainingCount} sản phẩm khác
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6">
                          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                            Tổng đơn hàng
                          </h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Tạm tính:</span>
                              <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Giảm giá:</span>
                                <span>-{order.discount.toLocaleString("vi-VN")}₫</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Vận chuyển:</span>
                              <span>
                                {order.shipping_fee === 0
                                  ? "Miễn phí"
                                  : `${order.shipping_fee.toLocaleString("vi-VN")}₫`}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                              <span>Tổng:</span>
                              <span className="text-primary">
                                {order.total.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </div>

                          <Button asChild className="w-full" variant="outline">
                            <Link to={`/order-confirmation/${order.order_number}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                              <ChevronRight className="w-4 h-4 ml-auto" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
