import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import AddProductForm from "@/components/AddProductForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllProducts } from "@/services/productService";
import { Loader2, Package, Plus, ListTree } from "lucide-react";

const Admin = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("add");

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    enabled: !!user,
  });

  // Redirect if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                Quản lý Sản phẩm
              </h1>
              <p className="text-muted-foreground">
                Thêm và quản lý sản phẩm gốm sứ Nhật Bản
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Đăng nhập với</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListTree className="h-4 w-4" />
              Danh sách
            </TabsTrigger>
          </TabsList>

          {/* Add Product Tab */}
          <TabsContent value="add" className="mt-0">
            <AddProductForm onSuccess={() => setActiveTab("list")} />
          </TabsContent>

          {/* Product List Tab */}
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Danh sách sản phẩm
                </CardTitle>
                <CardDescription>
                  {products?.length || 0} sản phẩm trong cơ sở dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {product.brand} • {product.condition}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-semibold text-primary">
                                {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                              </span>
                              {product.original_price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {new Intl.NumberFormat("vi-VN").format(product.original_price)}₫
                                </span>
                              )}
                              {product.badge && (
                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                  {product.badge === "new" && "Mới"}
                                  {product.badge === "sale" && "Giảm giá"}
                                  {product.badge === "rare" && "Hiếm"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Tồn kho: {product.stock}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(product.created_at).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Chưa có sản phẩm nào trong cơ sở dữ liệu
                    </p>
                    <Button onClick={() => setActiveTab("add")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm sản phẩm đầu tiên
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
