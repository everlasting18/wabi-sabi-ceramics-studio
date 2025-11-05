import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import AddProductForm from "@/components/AddProductForm";
import EditProductDialog from "@/components/EditProductDialog";
import DeleteProductDialog from "@/components/DeleteProductDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProducts, getAllCategories, type Product } from "@/services/productService";
import { getAllOrders, updateOrderStatus, updatePaymentStatus, type Order, type OrderItem } from "@/services/orderService";
import { getAllGalleries, deleteGallery, togglePublishGallery, type Gallery } from "@/services/galleryService";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import GalleryForm from "@/components/GalleryForm";
import {
  Loader2,
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  ClipboardList,
  Images,
} from "lucide-react";

const Admin = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [badgeFilter, setBadgeFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  // Fetch data
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    enabled: !!user,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    enabled: !!user,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["all-orders"],
    queryFn: getAllOrders,
    enabled: !!user,
  });

  const { data: galleries, isLoading: galleriesLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: getAllGalleries,
    enabled: !!user,
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      // Badge filter
      const matchesBadge =
        badgeFilter === "all" ||
        (badgeFilter === "none" && !product.badge) ||
        product.badge === badgeFilter;

      return matchesSearch && matchesCategory && matchesBadge;
    });
  }, [products, searchQuery, categoryFilter, badgeFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!products) return { total: 0, active: 0, lowStock: 0, totalValue: 0 };

    return {
      total: products.length,
      active: products.filter((p) => p.is_active).length,
      lowStock: products.filter((p) => p.stock < 5).length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    };
  }, [products]);

  // Handle actions
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // Gallery handlers
  const handleEditGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setShowGalleryForm(true);
  };

  const handleNewGallery = () => {
    setSelectedGallery(null);
    setShowGalleryForm(true);
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) {
      try {
        await deleteGallery(id);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting gallery:", error);
      }
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await togglePublishGallery(id, !isPublished);
      window.location.reload();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  // Redirect if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                Quản Lý Sản Phẩm
              </h1>
              <p className="text-muted-foreground">
                Quản lý kho hàng gốm sứ Nhật Bản
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Đăng nhập với</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <Button
                size="lg"
                onClick={() => setActiveTab("add")}
                className="shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 h-12">
            <TabsTrigger value="overview" className="text-base">
              <BarChart3 className="h-4 w-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="list" className="text-base">
              <Package className="h-4 w-4 mr-2" />
              Sản phẩm
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-base">
              <ClipboardList className="h-4 w-4 mr-2" />
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger value="galleries" className="text-base">
              <Images className="h-4 w-4 mr-2" />
              Bộ sưu tập
            </TabsTrigger>
            <TabsTrigger value="add" className="text-base">
              <Plus className="h-4 w-4 mr-2" />
              Thêm mới
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tổng sản phẩm
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.active} đang hoạt động
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Giá trị kho
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat("vi-VN", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(stats.totalValue)}₫
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tổng giá trị hàng tồn
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Sắp hết hàng
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">{stats.lowStock}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sản phẩm còn dưới 5 chiếc
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Danh mục
                  </CardTitle>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{categories?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Phân loại sản phẩm
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Products */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sản phẩm mới nhất
                </CardTitle>
                <CardDescription>
                  10 sản phẩm được thêm gần đây
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="space-y-3">
                    {products.slice(0, 10).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tồn: {product.stock}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có sản phẩm nào
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product List Tab */}
          <TabsContent value="list" className="space-y-6 mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Danh sách sản phẩm
                    </CardTitle>
                    <CardDescription>
                      {filteredProducts.length} / {products?.length || 0} sản phẩm
                    </CardDescription>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name_vi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={badgeFilter} onValueChange={setBadgeFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Nhãn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="new">Mới</SelectItem>
                        <SelectItem value="sale">Giảm giá</SelectItem>
                        <SelectItem value="rare">Hiếm</SelectItem>
                        <SelectItem value="none">Không nhãn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Ảnh</TableHead>
                          <TableHead>Tên sản phẩm</TableHead>
                          <TableHead>Thương hiệu</TableHead>
                          <TableHead>Danh mục</TableHead>
                          <TableHead className="text-right">Giá</TableHead>
                          <TableHead className="text-center">Tồn</TableHead>
                          <TableHead className="text-center">Nhãn</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id} className="hover:bg-muted/50">
                            <TableCell>
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="h-14 w-14 object-cover rounded"
                                />
                              ) : (
                                <div className="h-14 w-14 bg-muted rounded flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium max-w-[200px]">
                              <div className="truncate">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {product.condition}
                              </div>
                            </TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>
                              {categories?.find((c) => c.name === product.category)
                                ?.name_vi || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-semibold">
                                {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                              </div>
                              {product.original_price && (
                                <div className="text-xs text-muted-foreground line-through">
                                  {new Intl.NumberFormat("vi-VN").format(
                                    product.original_price
                                  )}
                                  ₫
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={product.stock < 5 ? "destructive" : "secondary"}
                              >
                                {product.stock}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {product.badge && (
                                <Badge variant="outline">
                                  {product.badge === "new" && "🆕 Mới"}
                                  {product.badge === "sale" && "🔥 Sale"}
                                  {product.badge === "rare" && "💎 Hiếm"}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(product)}
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(product)}
                                  title="Xóa"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || categoryFilter !== "all" || badgeFilter !== "all"
                        ? "Không tìm thấy sản phẩm phù hợp"
                        : "Chưa có sản phẩm nào"}
                    </p>
                    {(!searchQuery && categoryFilter === "all" && badgeFilter === "all") && (
                      <Button onClick={() => setActiveTab("add")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm đầu tiên
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6 mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Quản lý đơn hàng
                    </CardTitle>
                    <CardDescription>
                      {orders?.length || 0} đơn hàng
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã đơn hàng</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Ngày đặt</TableHead>
                          <TableHead className="text-right">Tổng tiền</TableHead>
                          <TableHead className="text-center">Trạng thái đơn</TableHead>
                          <TableHead className="text-center">Thanh toán</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => {
                          const orderItems = order.items as OrderItem[];
                          const itemCount = orderItems.length;

                          return (
                            <TableRow key={order.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">
                                <div>{order.order_number}</div>
                                <div className="text-xs text-muted-foreground">
                                  {itemCount} sản phẩm
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[180px]">
                                  <div className="font-medium truncate">{order.customer_name}</div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {order.customer_phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(order.created_at).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-semibold">
                                  {order.total.toLocaleString("vi-VN")}₫
                                </div>
                                {order.discount > 0 && (
                                  <div className="text-xs text-green-600">
                                    Giảm {order.discount.toLocaleString("vi-VN")}₫
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Select
                                  value={order.status}
                                  onValueChange={async (newStatus) => {
                                    try {
                                      await updateOrderStatus(order.id, newStatus as Order["status"]);
                                      window.location.reload();
                                    } catch (error) {
                                      console.error("Error updating order status:", error);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue>
                                      <OrderStatusBadge status={order.status} />
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="shipping">Đang giao</SelectItem>
                                    <SelectItem value="delivered">Đã giao</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-center">
                                <Select
                                  value={order.payment_status}
                                  onValueChange={async (newStatus) => {
                                    try {
                                      await updatePaymentStatus(order.id, newStatus as Order["payment_status"]);
                                      window.location.reload();
                                    } catch (error) {
                                      console.error("Error updating payment status:", error);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue>
                                      <PaymentStatusBadge status={order.payment_status} />
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(`/order-confirmation/${order.order_number}`, '_blank')}
                                  title="Xem chi tiết"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Chưa có đơn hàng nào
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Galleries Tab */}
          <TabsContent value="galleries" className="space-y-6 mt-6">
            {showGalleryForm ? (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowGalleryForm(false);
                    setSelectedGallery(null);
                  }}
                >
                  ← Quay lại danh sách
                </Button>
                <GalleryForm
                  gallery={selectedGallery || undefined}
                  onSuccess={() => {
                    setShowGalleryForm(false);
                    setSelectedGallery(null);
                  }}
                />
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Images className="h-5 w-5" />
                        Quản lý bộ sưu tập
                      </CardTitle>
                      <CardDescription>
                        {galleries?.length || 0} bộ sưu tập
                      </CardDescription>
                    </div>
                    <Button onClick={handleNewGallery}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo bộ sưu tập mới
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {galleriesLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : galleries && galleries.length > 0 ? (
                    <div className="space-y-4">
                      {galleries.map((gallery) => {
                        const imageCount = gallery.images.length;
                        const firstImage = gallery.images[0];

                        return (
                          <div
                            key={gallery.id}
                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex gap-4">
                              {/* Thumbnail */}
                              {firstImage && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={firstImage.thumbnailUrl || firstImage.url}
                                    alt={gallery.title}
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                </div>
                              )}

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg truncate">
                                      {gallery.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {imageCount} ảnh • Tạo ngày{" "}
                                      {new Date(gallery.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge variant={gallery.is_published ? "default" : "secondary"}>
                                      {gallery.is_published ? "Đã xuất bản" : "Bản nháp"}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Description preview */}
                                {gallery.description && (
                                  <div
                                    className="text-sm text-muted-foreground line-clamp-2 mb-3"
                                    dangerouslySetInnerHTML={{
                                      __html: gallery.description.replace(/<[^>]*>/g, " ").substring(0, 150),
                                    }}
                                  />
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditGallery(gallery)}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Chỉnh sửa
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleTogglePublish(gallery.id, gallery.is_published)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    {gallery.is_published ? "Ẩn" : "Xuất bản"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteGallery(gallery.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Images className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Chưa có bộ sưu tập nào</p>
                      <Button onClick={handleNewGallery}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo bộ sưu tập đầu tiên
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add" className="mt-6">
            <AddProductForm onSuccess={() => setActiveTab("list")} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EditProductDialog
        product={selectedProduct}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DeleteProductDialog
        product={selectedProduct}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
};

export default Admin;
