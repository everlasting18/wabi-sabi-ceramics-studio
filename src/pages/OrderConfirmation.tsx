import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Home, FileText, Loader2, ShoppingBag } from "lucide-react";
import { getOrderByNumber, type OrderItem } from "@/services/orderService";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderByNumber(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) {
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

  if (isError || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-serif mb-4">Không tìm thấy đơn hàng</h1>
            <p className="text-muted-foreground mb-6">
              Đơn hàng với mã {orderId} không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orderItems = order.items as OrderItem[];

  const getTimelineSteps = () => {
    const allSteps = [
      {
        icon: CheckCircle,
        title: "Đơn hàng đã được đặt",
        description: "Đơn hàng của bạn đã được xác nhận",
        status: "pending",
        orderStatus: "pending",
      },
      {
        icon: Package,
        title: "Đã xác nhận",
        description: "1-2 giờ",
        status: "confirmed",
        orderStatus: "confirmed",
      },
      {
        icon: Package,
        title: "Đang xử lý",
        description: "Đóng gói sản phẩm",
        status: "processing",
        orderStatus: "processing",
      },
      {
        icon: Truck,
        title: "Đang giao hàng",
        description: "2-4 ngày",
        status: "shipping",
        orderStatus: "shipping",
      },
      {
        icon: Home,
        title: "Đã giao hàng",
        description: "Hoàn tất",
        status: "delivered",
        orderStatus: "delivered",
      },
    ];

    const statusOrder = ["pending", "confirmed", "processing", "shipping", "delivered"];
    const currentIndex = statusOrder.indexOf(order.status);

    return allSteps.map((step, index) => ({
      ...step,
      status: index <= currentIndex ? "completed" : "pending",
    }));
  };

  const timelineSteps = order.status === "cancelled"
    ? [
        {
          icon: CheckCircle,
          title: "Đơn hàng đã được đặt",
          description: "Đơn hàng của bạn đã được xác nhận",
          status: "completed",
        },
        {
          icon: Package,
          title: "Đơn hàng đã bị hủy",
          description: "Đơn hàng đã bị hủy",
          status: "cancelled",
        },
      ]
    : getTimelineSteps();

  const paymentMethodLabels: Record<string, string> = {
    cod: "Thanh toán khi nhận hàng (COD)",
    bank: "Chuyển khoản ngân hàng",
    momo: "Ví MoMo",
    vnpay: "VNPay",
  };

  const shippingMethodLabels: Record<string, string> = {
    standard: "Giao hàng tiêu chuẩn (3-5 ngày)",
    express: "Giao hàng nhanh (1-2 ngày)",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Success Hero */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-serif mb-4">Đặt hàng thành công!</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Mã đơn hàng: <span className="font-semibold text-foreground">{order.order_number}</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.payment_status} />
            </div>
            <p className="text-muted-foreground mt-4">
              Cảm ơn bạn đã tin tưởng chúng tôi
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm mb-8 animate-fade-up">
            <h2 className="text-2xl font-serif mb-6">Trạng thái đơn hàng</h2>
            <div className="space-y-6">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        step.status === "completed"
                          ? "bg-green-600 text-white"
                          : step.status === "cancelled"
                          ? "bg-red-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div
                        className={`absolute left-6 top-12 w-0.5 h-8 transition-all ${
                          step.status === "completed" ? "bg-green-600" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3
                      className={`font-semibold ${
                        step.status === "completed" || step.status === "cancelled"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Order Info */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm animate-fade-up">
              <h2 className="text-xl font-serif mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-medium">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt:</span>
                  <span>{new Date(order.created_at).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thanh toán:</span>
                  <span>{paymentMethodLabels[order.payment_method] || order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vận chuyển:</span>
                  <span>{shippingMethodLabels[order.shipping_method || "standard"]}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm animate-fade-up">
              <h2 className="text-xl font-serif mb-4">Địa chỉ giao hàng</h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-muted-foreground">{order.customer_phone}</p>
                <p className="text-muted-foreground">{order.customer_email}</p>
                <p className="text-muted-foreground mt-2">
                  {order.shipping_address}
                  {order.shipping_address2 && `, ${order.shipping_address2}`}
                </p>
                <p className="text-muted-foreground">
                  {order.shipping_district}, {order.shipping_city}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm mb-8 animate-fade-up">
            <h2 className="text-2xl font-serif mb-6">Sản phẩm</h2>
            <div className="space-y-4 mb-6">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <img
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product_brand}</p>
                    <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.subtotal.toLocaleString("vi-VN")}₫
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.price.toLocaleString("vi-VN")}₫ x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá {order.coupon_code && `(${order.coupon_code})`}:</span>
                  <span>-{order.discount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span>
                  {order.shipping_fee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    `${order.shipping_fee.toLocaleString("vi-VN")}₫`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                <span>Tổng cộng:</span>
                <span className="text-primary">{order.total.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-muted/50 p-6 rounded-lg mb-8 animate-fade-up">
              <h3 className="font-semibold mb-2">Ghi chú đơn hàng:</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          {/* Email Confirmation Note */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-8 animate-fade-up">
            <p className="text-sm text-center">
              📧 Chúng tôi đã gửi email xác nhận đến{" "}
              <span className="font-semibold">{order.customer_email}</span>
              <br />
              <span className="text-muted-foreground">
                Kiểm tra cả thư mục spam nếu không thấy email
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
            <Button variant="outline" asChild>
              <Link to="/orders">
                <Package className="w-4 h-4 mr-2" />
                Đơn hàng của tôi
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">Tiếp tục mua sắm</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              <FileText className="w-4 h-4 mr-2" />
              In hóa đơn
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
