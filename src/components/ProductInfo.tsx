import { useState } from "react";
import { Heart, Share2, Star, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface ProductInfoProps {
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  condition: {
    rating: string;
    details: string[];
  };
  description: string;
  features: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
  }>;
  specifications: Array<{
    label: string;
    value: string;
  }>;
}

const ProductInfo = ({
  brand,
  name,
  price,
  originalPrice,
  condition,
  description,
  features,
  specifications,
}: ProductInfoProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã copy link sản phẩm!");
  };

  return (
    <div className="space-y-6">
      {/* Brand & Category */}
      <div className="space-y-1">
        <p className="eyebrow text-primary">{brand}</p>
        <h1 className="text-3xl lg:text-4xl font-serif text-charcoal leading-tight">
          {name}
        </h1>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 4
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          4.8 (24 đánh giá)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">{price}</span>
        {originalPrice && (
          <span className="text-xl text-muted-foreground line-through">
            {originalPrice}
          </span>
        )}
      </div>

      <Separator />

      {/* Condition Badge */}
      <div className="bg-muted/50 rounded p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-sage-green text-white">
            Tình trạng: {condition.rating}
          </Badge>
          <Info className="w-4 h-4 text-muted-foreground" />
        </div>
        <ul className="space-y-2">
          {condition.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              {detail.includes("✓") ? (
                <CheckCircle2 className="w-4 h-4 text-sage-green flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-rust-orange flex-shrink-0 mt-0.5" />
              )}
              <span>{detail.replace(/^[✓⚠]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Short Description */}
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Key Features */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-primary mt-1">{feature.icon}</div>
            <div>
              <p className="text-sm font-medium">{feature.label}</p>
              <p className="text-sm text-muted-foreground">{feature.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Actions */}
      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleWishlist}
            className={isWishlisted ? "border-primary text-primary" : ""}
          >
            <Heart
              className={`w-5 h-5 mr-2 ${
                isWishlisted ? "fill-primary" : ""
              }`}
            />
            Yêu thích
          </Button>
          <Button variant="outline" size="lg" onClick={handleShare}>
            <Share2 className="w-5 h-5 mr-2" />
            Chia sẻ
          </Button>
        </div>
      </div>

      <Separator />

      {/* Accordion Sections */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="specifications">
          <AccordionTrigger className="text-base font-medium">
            Thông số kỹ thuật
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="care">
          <AccordionTrigger className="text-base font-medium">
            Hướng dẫn bảo quản
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground pt-2">
              <p>• Rửa bằng tay với nước ấm và xà phòng nhẹ</p>
              <p>• Không dùng máy rửa bát</p>
              <p>• Không dùng lò vi sóng</p>
              <p>• Lau khô sau khi rửa để tránh đọng nước</p>
              <p>• Bảo quản ở nơi khô ráo, thoáng mát</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shipping">
          <AccordionTrigger className="text-base font-medium">
            Chính sách đổi trả
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground pt-2">
              <p>
                • Đổi trả trong vòng 7 ngày nếu sản phẩm không đúng mô tả
              </p>
              <p>• Miễn phí đổi trả nếu lỗi từ nhà cung cấp</p>
              <p>• Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng</p>
              <p>• Liên hệ hotline: 0123 456 789 để được hỗ trợ</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Trust Badges */}
      <div className="bg-muted/30 rounded p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-sage-green" />
          <span>100% Authentic từ Nhật Bản</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-sage-green" />
          <span>Đóng gói cẩn thận, bảo hành vận chuyển</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-sage-green" />
          <span>Thanh toán an toàn, bảo mật</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
