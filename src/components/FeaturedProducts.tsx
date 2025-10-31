import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  {
    id: 1,
    image: product1,
    name: "Bát cơm gốm Nhật họa tiết hoa anh đào",
    brand: "Noritake",
    price: "450.000₫",
    originalPrice: "650.000₫",
    condition: "9/10 - Xuất sắc",
    badge: "sale" as const,
  },
  {
    id: 2,
    image: product2,
    name: "Đĩa sứ vintage họa tiết xanh indigo",
    brand: "Arita",
    price: "580.000₫",
    condition: "10/10 - Như mới",
    badge: "new" as const,
  },
  {
    id: 3,
    image: product3,
    name: "Chén sake truyền thống set 4",
    brand: "Kutani",
    price: "720.000₫",
    condition: "9/10 - Xuất sắc",
    badge: "rare" as const,
  },
  {
    id: 4,
    image: product4,
    name: "Ấm trà gốm kyusu tay cầm tre",
    brand: "Tokoname",
    price: "890.000₫",
    condition: "8/10 - Rất tốt",
  },
  {
    id: 5,
    image: product1,
    name: "Bát súp gốm men ngọc vintage",
    brand: "Imari",
    price: "420.000₫",
    condition: "9/10 - Xuất sắc",
  },
  {
    id: 6,
    image: product2,
    name: "Đĩa lớn họa tiết sóng biển",
    brand: "Hasami",
    price: "640.000₫",
    originalPrice: "850.000₫",
    condition: "9/10 - Xuất sắc",
    badge: "sale" as const,
  },
  {
    id: 7,
    image: product3,
    name: "Ly trà gốm men mờ cao cấp",
    brand: "Shigaraki",
    price: "380.000₫",
    condition: "10/10 - Như mới",
    badge: "new" as const,
  },
  {
    id: 8,
    image: product4,
    name: "Ấm sake gốm men đồng cổ",
    brand: "Bizen",
    price: "1.200.000₫",
    condition: "8/10 - Rất tốt",
    badge: "rare" as const,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 lg:py-40 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
          <p className="eyebrow mb-6">Được chọn lọc đặc biệt</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 leading-tight">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Những món đồ gốm tuyệt đẹp được nhập trực tiếp từ Nhật Bản
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <Button
            size="lg"
            variant="outline"
            className="btn-ghost px-10 py-6 text-base font-semibold shadow-md hover:shadow-xl"
          >
            Xem tất cả sản phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
