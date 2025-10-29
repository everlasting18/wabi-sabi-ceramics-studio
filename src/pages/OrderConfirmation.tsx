import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Home, FileText } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  const orderDetails = {
    id: orderId,
    date: new Date().toLocaleDateString("vi-VN"),
    email: "customer@example.com",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    expectedDelivery: "3-5 ngày",
    items: [
      {
        id: 1,
        name: "Bát cơm Noritake vintage",
        price: 450000,
        quantity: 1,
      },
      {
        id: 2,
        name: "Đĩa sứ hoa anh đào",
        price: 380000,
        quantity: 1,
      },
    ],
    shipping: {
      name: "Nguyễn Văn A",
      phone: "0912345678",
      address: "Số nhà, tên đường, Ba Đình, Hà Nội",
    },
    subtotal: 830000,
    shippingFee: 30000,
    total: 860000,
  };

  const timelineSteps = [
    {
      icon: CheckCircle,
      title: "Đơn hàng đã được đặt",
      description: "Đơn hàng của bạn đã được xác nhận",
      status: "completed",
    },
    {
      icon: Package,
      title: "Chờ xác nhận",
      description: "1-2 giờ",
      status: "pending",
    },
    {
      icon: Truck,
      title: "Đóng gói & giao hàng",
      description: "2-4 ngày",
      status: "pending",
    },
    {
      icon: Home,
      title: "Nhận hàng",
      description: "Dự kiến 3-5 ngày",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Success Hero */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h1 className="text-4xl font-serif mb-4">Đặt hàng thành công!</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Mã đơn hàng: <span className="font-semibold text-foreground">#{orderId}</span>
            </p>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã tin tưởng chúng tôi
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-card p-6 md:p-8 rounded-sm border border-muted mb-8 animate-fade-up">
            <h2 className="text-2xl font-serif mb-6">Trạng thái đơn hàng</h2>
            <div className="space-y-6">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3
                      className={`font-semibold ${
                        step.status === "completed" ? "text-foreground" : "text-muted-foreground"
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
            <div className="bg-card p-6 rounded-sm border border-muted animate-fade-up">
              <h2 className="text-xl font-serif mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-medium">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt:</span>
                  <span>{orderDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thanh toán:</span>
                  <span>{orderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dự kiến giao:</span>
                  <span>{orderDetails.expectedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card p-6 rounded-sm border border-muted animate-fade-up">
              <h2 className="text-xl font-serif mb-4">Địa chỉ giao hàng</h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">{orderDetails.shipping.name}</p>
                <p className="text-muted-foreground">{orderDetails.shipping.phone}</p>
                <p className="text-muted-foreground">{orderDetails.shipping.address}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card p-6 md:p-8 rounded-sm border border-muted mb-8 animate-fade-up">
            <h2 className="text-2xl font-serif mb-6">Sản phẩm</h2>
            <div className="space-y-4 mb-6">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-muted last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">{item.price.toLocaleString("vi-VN")}₫</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-muted">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span>{orderDetails.subtotal.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span>{orderDetails.shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-muted">
                <span>Tổng cộng:</span>
                <span className="text-primary">{orderDetails.total.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
          </div>

          {/* Email Confirmation Note */}
          <div className="bg-accent/5 p-6 rounded-sm mb-8 animate-fade-up">
            <p className="text-sm text-center">
              📧 Chúng tôi đã gửi email xác nhận đến{" "}
              <span className="font-semibold">{orderDetails.email}</span>
              <br />
              <span className="text-muted-foreground">
                Kiểm tra cả thư mục spam nếu không thấy email
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
            <Button variant="outline" asChild>
              <Link to={`/track-order/${orderId}`}>
                <Package className="w-4 h-4 mr-2" />
                Theo dõi đơn hàng
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                Tiếp tục mua sắm
              </Link>
            </Button>
            <Button variant="outline">
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
