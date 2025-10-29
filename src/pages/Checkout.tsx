import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Bát cơm Noritake vintage",
      price: 450000,
      quantity: 1,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Đĩa sứ hoa anh đào",
      price: 380000,
      quantity: 1,
      image: "/placeholder.svg",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 30000;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLoading(true);
      // Simulate order processing
      setTimeout(() => {
        const orderId = `ORD-${Date.now()}`;
        navigate(`/order-confirmation/${orderId}`);
      }, 1500);
    }
  };

  const steps = [
    { number: 1, name: "Thông tin giao hàng" },
    { number: 2, name: "Thanh toán" },
    { number: 3, name: "Xác nhận" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.number
                        ? "bg-primary border-primary text-white"
                        : currentStep === step.number
                        ? "border-primary text-primary"
                        : "border-muted text-muted"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-sm mt-2 text-center hidden md:block">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="bg-card p-6 md:p-8 rounded-sm border border-muted animate-fade-up">
                  <h2 className="text-2xl font-serif mb-6">Thông tin giao hàng</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0912345678"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address1">Địa chỉ</Label>
                      <Input
                        id="address1"
                        type="text"
                        placeholder="Số nhà, tên đường"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address2">Địa chỉ 2 (tùy chọn)</Label>
                      <Input
                        id="address2"
                        type="text"
                        placeholder="Phường/Xã"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Thành phố</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Hà Nội"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">Quận/Huyện</Label>
                        <Input
                          id="district"
                          type="text"
                          placeholder="Ba Đình"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Ghi chú đơn hàng (tùy chọn)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Thời gian giao hàng, yêu cầu đặc biệt..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="bg-card p-6 md:p-8 rounded-sm border border-muted animate-fade-up">
                  <h2 className="text-2xl font-serif mb-6">Phương thức thanh toán</h2>
                  
                  <RadioGroup defaultValue="cod" className="space-y-3">
                    <label className="flex items-center space-x-3 p-4 border border-muted rounded-sm cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex-1">
                        <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-muted rounded-sm cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="bank" id="bank" />
                      <div className="flex-1">
                        <div className="font-medium">Chuyển khoản ngân hàng</div>
                        <div className="text-sm text-muted-foreground">Chuyển khoản trước khi giao hàng</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-muted rounded-sm cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="momo" id="momo" />
                      <div className="flex-1">
                        <div className="font-medium">MoMo</div>
                        <div className="text-sm text-muted-foreground">Thanh toán qua ví MoMo</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-muted rounded-sm cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="vnpay" id="vnpay" />
                      <div className="flex-1">
                        <div className="font-medium">VNPay</div>
                        <div className="text-sm text-muted-foreground">Thẻ ATM/Visa/Mastercard</div>
                      </div>
                    </label>
                  </RadioGroup>
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-up">
                  <div className="bg-card p-6 md:p-8 rounded-sm border border-muted">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-serif">Địa chỉ giao hàng</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                      >
                        Sửa
                      </Button>
                    </div>
                    <div className="text-muted-foreground">
                      <p className="font-medium text-foreground">Nguyễn Văn A</p>
                      <p>0912345678</p>
                      <p>Số nhà, tên đường, Ba Đình, Hà Nội</p>
                    </div>
                  </div>

                  <div className="bg-card p-6 md:p-8 rounded-sm border border-muted">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-serif">Phương thức thanh toán</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                      >
                        Sửa
                      </Button>
                    </div>
                    <p className="text-muted-foreground">Thanh toán khi nhận hàng (COD)</p>
                  </div>

                  <div className="bg-card p-6 md:p-8 rounded-sm border border-muted">
                    <h2 className="text-2xl font-serif mb-4">Sản phẩm</h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-sm"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {item.price.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Tôi đã đọc và đồng ý với{" "}
                      <a href="#" className="text-primary hover:underline">
                        điều khoản và điều kiện
                      </a>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(currentStep - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1"
                  >
                    Quay lại
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={currentStep === 3 && !agreedToTerms}
                  className="flex-1"
                >
                  {loading ? (
                    "Đang xử lý..."
                  ) : currentStep === 3 ? (
                    "Đặt hàng"
                  ) : (
                    "Tiếp tục"
                  )}
                </Button>
              </div>

              {currentStep === 3 && (
                <p className="text-xs text-center text-muted-foreground">
                  🔒 Thông tin của bạn được mã hóa và bảo mật
                </p>
              )}
            </form>
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-sm border border-muted sticky top-24">
              <h3 className="text-xl font-serif mb-4">Đơn hàng</h3>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span>{item.price.toLocaleString("vi-VN")}₫</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-muted pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{shipping.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-muted">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{total.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-muted">
                <p className="text-xs text-muted-foreground text-center">
                  Dự kiến giao hàng: 3-5 ngày
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

export default Checkout;
