# Hướng Dẫn Cài Đặt Database

Tài liệu này hướng dẫn cách thiết lập database Supabase cho dự án Gốm Nhật.

## 📋 Yêu Cầu

- Tài khoản Supabase (miễn phí tại [supabase.com](https://supabase.com))
- Supabase project đã được tạo
- Supabase CLI (tùy chọn, để chạy migrations tự động)

## 🚀 Cách 1: Chạy SQL Trực Tiếp (Đơn Giản)

### Bước 1: Đăng Nhập Vào Supabase Dashboard

1. Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Đăng nhập vào tài khoản của bạn
3. Chọn project của bạn (hoặc tạo project mới)

### Bước 2: Mở SQL Editor

1. Trong sidebar bên trái, click vào **SQL Editor**
2. Click vào **New query** để tạo query mới

### Bước 3: Copy và Chạy Migration

1. Mở file `supabase/migrations/001_create_products_table.sql`
2. Copy toàn bộ nội dung SQL
3. Paste vào SQL Editor
4. Click **Run** để thực thi

### Bước 4: Kiểm Tra

Sau khi chạy migration thành công, bạn sẽ thấy:

- **2 tables mới**:
  - `products` - Bảng sản phẩm
  - `categories` - Bảng danh mục

- **1 enum mới**:
  - `product_badge` - Loại nhãn sản phẩm (new, sale, rare)

- **5 categories mặc định** đã được insert:
  - Bát/Chén (bowls-cups)
  - Đĩa (plates)
  - Đồ Trà (teaware)
  - Đồ Sake (sake-ware)
  - Bình (vases)

Để kiểm tra, chạy query:

```sql
SELECT * FROM categories;
SELECT * FROM products;
```

## 🛠️ Cách 2: Sử Dụng Supabase CLI (Nâng Cao)

### Bước 1: Cài Đặt Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

Hoặc xem thêm tại: https://supabase.com/docs/guides/cli

### Bước 2: Login Vào Supabase

```bash
supabase login
```

Làm theo hướng dẫn để authenticate.

### Bước 3: Link Project

```bash
supabase link --project-ref your-project-id
```

Thay `your-project-id` bằng project ID của bạn (tìm trong dashboard).

### Bước 4: Chạy Migrations

```bash
supabase db push
```

Lệnh này sẽ tự động chạy tất cả migrations trong folder `supabase/migrations/`.

## 📊 Cấu Trúc Database

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, tự động tạo |
| `name` | VARCHAR(255) | Tên sản phẩm |
| `brand` | VARCHAR(100) | Thương hiệu |
| `description` | TEXT | Mô tả chi tiết |
| `price` | DECIMAL(10,2) | Giá bán (VNĐ) |
| `original_price` | DECIMAL(10,2) | Giá gốc (nếu giảm giá) |
| `condition` | VARCHAR(50) | Tình trạng (VD: "9/10 - Xuất sắc") |
| `badge` | ENUM | Nhãn: 'new', 'sale', 'rare' |
| `image_url` | TEXT | URL hình ảnh chính |
| `images` | JSONB | Array các URL hình ảnh khác |
| `category` | VARCHAR(100) | Foreign key đến categories |
| `stock` | INTEGER | Số lượng tồn kho |
| `is_active` | BOOLEAN | Trạng thái hiển thị |
| `created_at` | TIMESTAMP | Thời gian tạo |
| `updated_at` | TIMESTAMP | Thời gian cập nhật |
| `created_by` | UUID | Foreign key đến auth.users |

### Categories Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | Tên danh mục (tiếng Anh) |
| `name_vi` | VARCHAR(100) | Tên danh mục (tiếng Việt) |
| `description` | TEXT | Mô tả danh mục |
| `image_url` | TEXT | URL hình ảnh danh mục |
| `created_at` | TIMESTAMP | Thời gian tạo |

## 🔐 Row Level Security (RLS)

Migration đã thiết lập các policies sau:

### Products Table

1. **Anyone can view active products**
   - Người dùng ẩn danh có thể xem sản phẩm đang active

2. **Authenticated users can view all products**
   - User đã đăng nhập có thể xem tất cả sản phẩm

3. **Authenticated users can insert products**
   - User đã đăng nhập có thể thêm sản phẩm

4. **Users can update their own products**
   - User chỉ có thể sửa sản phẩm do họ tạo

5. **Users can delete their own products**
   - User chỉ có thể xóa sản phẩm do họ tạo

### Categories Table

1. **Anyone can view categories**
   - Tất cả người dùng có thể xem danh mục

## 🧪 Test Database

Sau khi setup xong, bạn có thể test bằng cách:

### 1. Kiểm Tra Categories

```sql
SELECT * FROM categories;
```

Bạn sẽ thấy 5 categories đã được tạo sẵn.

### 2. Thêm Sản Phẩm Test

```sql
INSERT INTO products (name, brand, price, condition, category, stock)
VALUES (
  'Bát cơm gốm Nhật họa tiết hoa anh đào',
  'Noritake',
  450000,
  '9/10 - Xuất sắc',
  'bowls-cups',
  5
);
```

### 3. Xem Sản Phẩm Vừa Thêm

```sql
SELECT * FROM products;
```

## 📝 Sử Dụng Trong Code

Sau khi setup database, bạn có thể sử dụng các service functions:

```typescript
import { createProduct, getAllProducts } from "@/services/productService";

// Thêm sản phẩm mới
const newProduct = await createProduct({
  name: "Bát cơm gốm Nhật",
  brand: "Noritake",
  price: 450000,
  condition: "9/10 - Xuất sắc",
  category: "bowls-cups",
  stock: 5,
});

// Lấy tất cả sản phẩm
const products = await getAllProducts();
```

## 🎨 Sử Dụng Admin UI

Sau khi setup database, truy cập:

```
http://localhost:8080/admin
```

Đăng nhập với tài khoản của bạn để:
- Thêm sản phẩm mới qua form
- Xem danh sách sản phẩm
- Quản lý sản phẩm

## ❗ Lưu Ý Quan Trọng

1. **Environment Variables**: Đảm bảo file `.env` có đầy đủ thông tin:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

2. **Authentication**: Chỉ user đã đăng nhập mới có thể thêm/sửa/xóa sản phẩm

3. **Soft Delete**: Khi xóa sản phẩm, mặc định sẽ set `is_active = false` thay vì xóa vĩnh viễn

4. **Auto Timestamps**: `created_at` và `updated_at` tự động được cập nhật

## 🆘 Troubleshooting

### Lỗi: "relation already exists"

Nếu bạn thấy lỗi này, có nghĩa là bạn đã chạy migration rồi. Để chạy lại:

```sql
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TYPE IF EXISTS product_badge;
```

Sau đó chạy lại migration.

### Lỗi: "permission denied"

Kiểm tra RLS policies. Đảm bảo bạn đã đăng nhập khi thêm sản phẩm.

### Không thấy sản phẩm vừa thêm

Kiểm tra `is_active` field. Mặc định các query chỉ lấy sản phẩm có `is_active = true`.

## 📚 Tài Liệu Thêm

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Happy Coding! 🚀**
