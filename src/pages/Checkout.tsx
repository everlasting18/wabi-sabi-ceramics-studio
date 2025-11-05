import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ShoppingBag, Loader2, Package, Truck, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { createOrder, cartItemsToOrderItems } from "@/services/orderService";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form validation schema
const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  customer_email: z.string().email("Email không hợp lệ"),
  customer_phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
  shipping_address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  shipping_address2: z.string().optional(),
  shipping_city: z.string().min(2, "Vui lòng nhập thành phố"),
  shipping_district: z.string().min(2, "Vui lòng nhập quận/huyện"),
  payment_method: z.enum(["cod", "bank", "momo", "vnpay"]),
  shipping_method: z.enum(["standard", "express"]),
  coupon_code: z.string().optional(),
  notes: z.string().optional(),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: "cod",
      shipping_method: "standard",
      agree_terms: false,
    },
  });

  const selectedPaymentMethod = watch("payment_method");
  const selectedShippingMethod = watch("shipping_method");
  const agreeTerms = watch("agree_terms");

  // Redirect if cart is empty
  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-serif mb-4">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <Button onClick={() => navigate("/products")}>
              Khám phá sản phẩm
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate totals
  const subtotal = getCartTotal();

  // Coupon discounts
  const coupons: Record<string, number> = {
    WELCOME10: 50000,
    SAVE20: 100000,
    VIP50: 200000,
  };

  const discount = appliedCoupon && coupons[appliedCoupon] ? coupons[appliedCoupon] : 0;

  // Shipping fees
  const shippingFees = {
    standard: subtotal >= 500000 ? 0 : 30000,
    express: subtotal >= 500000 ? 20000 : 50000,
  };

  const shippingFee = shippingFees[selectedShippingMethod] || shippingFees.standard;
  const total = subtotal - discount + shippingFee;

  // Apply coupon
  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (coupons[code]) {
      setAppliedCoupon(code);
      setValue("coupon_code", code);
      toast.success(`Đã áp dụng mã giảm giá ${code}! Giảm ${coupons[code].toLocaleString("vi-VN")}₫`);
    } else {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponCode("");
    setValue("coupon_code", "");
    toast.success("Đã xóa mã giảm giá");
  };

  // Submit order
  const onSubmit = async (data: CheckoutFormData) => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Step 3: Create order
    setLoading(true);
    try {
      const orderItems = cartItemsToOrderItems(items);

      const orderData = {
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        shipping_address: data.shipping_address,
        shipping_address2: data.shipping_address2,
        shipping_city: data.shipping_city,
        shipping_district: data.shipping_district,
        items: orderItems,
        subtotal: subtotal,
        discount: discount,
        shipping_fee: shippingFee,
        total: total,
        payment_method: data.payment_method,
        shipping_method: data.shipping_method,
        coupon_code: appliedCoupon || undefined,
        notes: data.notes,
      };

      const order = await createOrder(orderData);

      // Clear cart after successful order
      clearCart();

      toast.success("Đặt hàng thành công!");

      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.order_number}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, name: "Thông tin giao hàng" },
    { number: 2, name: "Thanh toán & Vận chuyển" },
    { number: 3, name: "Xác nhận" },
  ];

  const paymentMethods = [
    {
      value: "cod",
      label: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
    },
    {
      value: "bank",
      label: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trước khi giao hàng",
    },
    {
      value: "momo",
      label: "MoMo",
      description: "Thanh toán qua ví MoMo",
    },
    {
      value: "vnpay",
      label: "VNPay",
      description: "Thẻ ATM/Visa/Mastercard",
    },
  ];

  const shippingMethods = [
    {
      value: "standard",
      label: "Giao hàng tiêu chuẩn",
      description: "3-5 ngày làm việc",
      fee: shippingFees.standard,
    },
    {
      value: "express",
      label: "Giao hàng nhanh",
      description: "1-2 ngày làm việc",
      fee: shippingFees.express,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-primary/10">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Thanh toán</h1>
          </div>
          <p className="text-muted-foreground ml-[60px]">
            Hoàn tất đơn hàng của bạn
          </p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.number
                        ? "bg-primary border-primary text-white"
                        : currentStep === step.number
                        ? "border-primary text-primary bg-primary/10"
                        : "border-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 text-center hidden md:block font-medium ${
                      currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm animate-fade-up">
                  <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    Thông tin giao hàng
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer_name">
                        Họ và tên <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="customer_name"
                        {...register("customer_name")}
                        placeholder="Nguyễn Văn A"
                        className={errors.customer_name ? "border-destructive" : ""}
                      />
                      {errors.customer_name && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.customer_name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer_email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="customer_email"
                          type="email"
                          {...register("customer_email")}
                          placeholder="email@example.com"
                          className={errors.customer_email ? "border-destructive" : ""}
                        />
                        {errors.customer_email && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.customer_email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="customer_phone">
                          Số điện thoại <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="customer_phone"
                          {...register("customer_phone")}
                          placeholder="0912345678"
                          className={errors.customer_phone ? "border-destructive" : ""}
                        />
                        {errors.customer_phone && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.customer_phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shipping_address">
                        Địa chỉ <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shipping_address"
                        {...register("shipping_address")}
                        placeholder="Số nhà, tên đường"
                        className={errors.shipping_address ? "border-destructive" : ""}
                      />
                      {errors.shipping_address && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.shipping_address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="shipping_address2">Địa chỉ 2 (tùy chọn)</Label>
                      <Input
                        id="shipping_address2"
                        {...register("shipping_address2")}
                        placeholder="Phường/Xã"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping_city">
                          Thành phố <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="shipping_city"
                          {...register("shipping_city")}
                          placeholder="Hà Nội"
                          className={errors.shipping_city ? "border-destructive" : ""}
                        />
                        {errors.shipping_city && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.shipping_city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="shipping_district">
                          Quận/Huyện <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="shipping_district"
                          {...register("shipping_district")}
                          placeholder="Ba Đình"
                          className={errors.shipping_district ? "border-destructive" : ""}
                        />
                        {errors.shipping_district && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.shipping_district.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Ghi chú đơn hàng (tùy chọn)</Label>
                      <Textarea
                        id="notes"
                        {...register("notes")}
                        placeholder="Thời gian giao hàng, yêu cầu đặc biệt..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment & Shipping Method */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-up">
                  {/* Shipping Method */}
                  <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm">
                    <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
                      <Truck className="h-6 w-6 text-primary" />
                      Phương thức vận chuyển
                    </h2>

                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedShippingMethod === method.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              {...register("shipping_method")}
                              value={method.value}
                              className="text-primary"
                            />
                            <div>
                              <div className="font-medium">{method.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {method.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {method.fee === 0 ? (
                                <span className="text-green-600">Miễn phí</span>
                              ) : (
                                `${method.fee.toLocaleString("vi-VN")}₫`
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {subtotal < 500000 && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Mua thêm{" "}
                          <span className="font-semibold">
                            {(500000 - subtotal).toLocaleString("vi-VN")}₫
                          </span>{" "}
                          để được miễn phí vận chuyển tiêu chuẩn!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm">
                    <h2 className="text-2xl font-serif mb-6">Phương thức thanh toán</h2>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedPaymentMethod === method.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            {...register("payment_method")}
                            value={method.value}
                            className="text-primary mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{method.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {method.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-up">
                  <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-serif">Thông tin giao hàng</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                      >
                        Sửa
                      </Button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="font-semibold text-base">{watch("customer_name")}</p>
                      <p className="text-muted-foreground">{watch("customer_email")}</p>
                      <p className="text-muted-foreground">{watch("customer_phone")}</p>
                      <p className="text-muted-foreground">
                        {watch("shipping_address")}
                        {watch("shipping_address2") && `, ${watch("shipping_address2")}`}
                      </p>
                      <p className="text-muted-foreground">
                        {watch("shipping_district")}, {watch("shipping_city")}
                      </p>
                    </div>
                  </div>

                  <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-serif">Vận chuyển & Thanh toán</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                      >
                        Sửa
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vận chuyển:</span>
                        <span className="font-medium">
                          {shippingMethods.find((m) => m.value === selectedShippingMethod)
                            ?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thanh toán:</span>
                        <span className="font-medium">
                          {paymentMethods.find((m) => m.value === selectedPaymentMethod)
                            ?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card p-6 md:p-8 rounded-lg border border-border shadow-sm">
                    <h2 className="text-2xl font-serif mb-4">Sản phẩm đặt mua</h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-4">
                          <img
                            src={
                              item.product.images && item.product.images.length > 0
                                ? item.product.images[0]
                                : item.product.image_url || "/placeholder.svg"
                            }
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.product.brand}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {(item.product.price * item.quantity).toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 bg-muted/50 p-4 rounded-lg">
                    <Checkbox
                      id="agree_terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) =>
                        setValue("agree_terms", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="agree_terms"
                      className="text-sm cursor-pointer leading-relaxed"
                    >
                      Tôi đã đọc và đồng ý với{" "}
                      <a href="#" className="text-primary hover:underline font-medium">
                        điều khoản và điều kiện
                      </a>{" "}
                      của cửa hàng
                    </label>
                  </div>
                  {errors.agree_terms && (
                    <p className="text-sm text-destructive -mt-4">
                      {errors.agree_terms.message}
                    </p>
                  )}
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
                    disabled={loading}
                  >
                    Quay lại
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
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
            </div>

            {/* Order Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm sticky top-24">
                <h3 className="text-xl font-serif mb-4">Tóm tắt đơn hàng</h3>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm gap-2">
                      <span className="text-muted-foreground line-clamp-1">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {(item.product.price * item.quantity).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="mb-4 pb-4 border-b">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{appliedCoupon}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-auto p-1 text-xs"
                      >
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                        className="whitespace-nowrap"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{discount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        `${shippingFee.toLocaleString("vi-VN")}₫`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {selectedShippingMethod === "express"
                      ? "Giao hàng nhanh: 1-2 ngày"
                      : "Giao hàng tiêu chuẩn: 3-5 ngày"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Đóng gói cẩn thận, bảo hành vận chuyển
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
