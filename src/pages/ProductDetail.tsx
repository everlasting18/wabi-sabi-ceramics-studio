import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Ruler, Package, MapPin, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const ProductDetail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock product data
  const product = {
    images: [product1, product1, product2, product3, product4],
    brand: "Noritake",
    name: "Bát cơm gốm Nhật họa tiết hoa anh đào vintage",
    price: "450.000₫",
    originalPrice: "650.000₫",
    condition: {
      rating: "9/10 - Xuất sắc",
      details: [
        "✓ Không vết nứt",
        "✓ Không chỗ sứt mẻ",
        "⚠ Vài vết xước nhỏ do thời gian (không ảnh hưởng thẩm mỹ)",
      ],
    },
    description:
      "Bát cơm gốm Noritake vintage với họa tiết hoa anh đào tinh tế, mang đậm phong cách Nhật Bản truyền thống. Sản phẩm được sản xuất vào những năm 1970s, có niên đại rõ ràng.",
    features: [
      {
        icon: <Ruler className="w-5 h-5" />,
        label: "Kích thước",
        value: "12cm x 6cm",
      },
      {
        icon: <Package className="w-5 h-5" />,
        label: "Chất liệu",
        value: "Gốm sứ cao cấp",
      },
      {
        icon: <MapPin className="w-5 h-5" />,
        label: "Xuất xứ",
        value: "Nhật Bản",
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        label: "Năm sản xuất",
        value: "~1970s",
      },
    ],
    specifications: [
      { label: "Đường kính", value: "12 cm" },
      { label: "Chiều cao", value: "6 cm" },
      { label: "Trọng lượng", value: "~200g" },
      { label: "Chất liệu", value: "Gốm sứ" },
      { label: "Xuất xứ", value: "Nhật Bản" },
      { label: "Thương hiệu", value: "Noritake" },
      { label: "Niên đại", value: "1970s" },
      { label: "Màu sắc", value: "Trắng kem, hồng" },
    ],
  };

  // Mock related products
  const relatedProducts = [
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
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 lg:px-20 py-6">
          <Button
            variant="ghost"
            className="gap-2 -ml-4"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-6 lg:px-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Images */}
            <div className="animate-fade-up">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Right: Product Info */}
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <ProductInfo
                brand={product.brand}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                condition={product.condition}
                description={product.description}
                features={product.features}
                specifications={product.specifications}
              />
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Mô tả chi tiết
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Đánh giá (24)
                  </TabsTrigger>
                  <TabsTrigger
                    value="qa"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Hỏi & Đáp
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-8 space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-2xl font-serif mb-4">Về sản phẩm</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Bát cơm gốm Noritake này là một tác phẩm nghệ thuật vintage đích thực từ Nhật Bản, 
                      được sản xuất vào những năm 1970s. Họa tiết hoa anh đào (sakura) được vẽ tay tinh tế, 
                      thể hiện vẻ đẹp mong manh và thoáng qua của mùa xuân Nhật Bản.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Noritake là một trong những thương hiệu gốm sứ danh tiếng nhất của Nhật Bản, 
                      được thành lập từ năm 1904. Sản phẩm của Noritake được biết đến với chất lượng 
                      cao cấp và thiết kế tinh xảo, được nhiều gia đình Nhật Bản tin dùng qua nhiều thế hệ.
                    </p>

                    <h4 className="text-xl font-serif mt-8 mb-4">Đặc điểm nổi bật</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Họa tiết hoa anh đào vẽ tay tinh tế, độc đáo</li>
                      <li>• Men gốm mịn màng, bóng đẹp</li>
                      <li>• Kích thước vừa phải, thích hợp đựng cơm hàng ngày</li>
                      <li>• Có dấu Noritake chính hãng đáy bát</li>
                      <li>• Bền đẹp, giữ nhiệt tốt</li>
                    </ul>

                    <h4 className="text-xl font-serif mt-8 mb-4">Câu chuyện sản phẩm</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Chiếc bát này được thu mua từ một gia đình ở Kyoto, đã được sử dụng và bảo quản 
                      cẩn thận qua hơn 50 năm. Mặc dù đã có tuổi đời, sản phẩm vẫn giữ được vẻ đẹp 
                      nguyên vẹn với những vết xước nhỏ do thời gian - chính là "linh hồn" của đồ vintage, 
                      kể câu chuyện về những bữa cơm gia đình ấm áp.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-8">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Chức năng đánh giá sẽ được bổ sung sau
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="qa" className="pt-8">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Chức năng hỏi đáp sẽ được bổ sung sau
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
                Sản phẩm tương tự
              </h2>
              <p className="text-muted-foreground">
                Có thể bạn sẽ thích
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
