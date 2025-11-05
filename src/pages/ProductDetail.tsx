import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Home, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById, getProductsByCategory } from "@/services/productService";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch product
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
    enabled: !!id,
  });

  // Fetch related products from same category
  const { data: relatedProducts } = useQuery({
    queryKey: ["relatedProducts", product?.category],
    queryFn: () => getProductsByCategory(product?.category || ""),
    enabled: !!product?.category,
  });

  // Filter out current product and limit to 4 related products
  const filteredRelatedProducts = relatedProducts
    ?.filter((p) => p.id !== product?.id)
    .slice(0, 4);

  // Prepare images for gallery
  const productImages =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image_url
      ? [product.image_url]
      : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navigation />
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-4">Không tìm thấy sản phẩm</h1>
            <p className="text-muted-foreground mb-6">
              Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/products")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại trang sản phẩm
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 lg:px-20 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="hover:text-primary transition-colors">
                  {product.category}
                </span>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-6 lg:px-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Images */}
            <div className="animate-fade-up">
              <ImageGallery images={productImages} productName={product.name} />
            </div>

            {/* Right: Product Info */}
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <ProductInfo product={product} />
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
                    {product.description ? (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {product.name} là một sản phẩm gốm sứ Nhật Bản chính hãng từ thương hiệu{" "}
                        {product.brand}. Sản phẩm được làm thủ công tinh xảo, mang đậm phong cách
                        truyền thống Nhật Bản với chất lượng cao cấp.
                      </p>
                    )}

                    <h4 className="text-xl font-serif mt-8 mb-4">Đặc điểm nổi bật</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• 100% chính hãng từ Nhật Bản</li>
                      <li>• Chất liệu gốm sứ cao cấp, bền đẹp</li>
                      <li>• Thiết kế tinh tế, sang trọng</li>
                      <li>• Phù hợp cho sử dụng hàng ngày hoặc làm quà tặng</li>
                      <li>• Đã được kiểm tra chất lượng kỹ lưỡng</li>
                    </ul>

                    <h4 className="text-xl font-serif mt-8 mb-4">
                      Câu chuyện sản phẩm
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Gốm sứ Nhật Bản nổi tiếng với nghệ thuật làm đồ gốm có lịch sử hàng nghìn năm.
                      Mỗi sản phẩm đều mang trong mình triết lý wabi-sabi - vẻ đẹp của sự không hoàn hảo,
                      sự giản dị và tự nhiên. Đây không chỉ là đồ dùng mà còn là tác phẩm nghệ thuật,
                      mang đến sự bình yên và thẩm mỹ cho không gian sống của bạn.
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
        {filteredRelatedProducts && filteredRelatedProducts.length > 0 && (
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
                {filteredRelatedProducts.map((relatedProduct, index) => (
                  <div
                    key={relatedProduct.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {product.category && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link to="/products">
                      Xem thêm sản phẩm
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
