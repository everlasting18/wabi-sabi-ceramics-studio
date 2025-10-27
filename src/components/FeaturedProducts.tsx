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
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="eyebrow mb-4">Được chọn lọc đặc biệt</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-charcoal mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-muted-foreground">
            Những món đồ gốm tuyệt đẹp được nhập trực tiếp từ Nhật Bản
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="btn-ghost px-8"
          >
            Xem tất cả sản phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
