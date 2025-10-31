# Gốm Nhật - Wabi-Sabi Ceramics Studio 🏺

Website thương mại điện tử chuyên về đồ gốm sứ Nhật Bản cổ, mang phong cách wabi-sabi tối giản và thanh lịch.

## 📋 Giới Thiệu

**Gốm Nhật** là một nền tảng e-commerce cao cấp chuyên bán đồ gốm sứ vintage Nhật Bản chính hãng. Website được thiết kế theo triết lý **wabi-sabi** - vẻ đẹp của sự không hoàn hảo, giản dị và tự nhiên, phù hợp với khách hàng Việt Nam yêu thích nghệ thuật gốm sứ Nhật Bản.

### 🎯 Mục Đích

- Cung cấp trải nghiệm mua sắm trực tuyến mượt mà cho sản phẩm gốm sứ cao cấp
- Giới thiệu vẻ đẹp của nghệ thuật gốm sứ Nhật Bản đến người Việt
- Đảm bảo tính xác thực và chất lượng của từng sản phẩm

## ✨ Tính Năng Chính

### 🛍️ Cho Người Dùng

#### 1. **Catalog & Khám Phá Sản Phẩm**
- Hiển thị sản phẩm nổi bật với hình ảnh chất lượng cao
- Phân loại sản phẩm theo danh mục (Bát/Chén, Đĩa, Đồ Trà)
- Trang chi tiết sản phẩm với gallery hình ảnh, thông số kỹ thuật và đánh giá tình trạng
- Nhãn đặc biệt: Mới, Giảm Giá, Hiếm
- Hệ thống đánh giá tình trạng sản phẩm (9/10, 8/10, v.v.)

#### 2. **Mua Sắm**
- Giỏ hàng với quản lý sản phẩm linh hoạt
- Thêm/xóa sản phẩm, điều chỉnh số lượng
- Hỗ trợ mã giảm giá/coupon
- Danh sách yêu thích (wishlist)
- Chức năng chia sẻ sản phẩm

#### 3. **Thanh Toán**
- Quy trình thanh toán 3 bước:
  1. **Thông tin giao hàng**: Địa chỉ, số điện thoại, email
  2. **Phương thức thanh toán**: COD, Chuyển khoản, MoMo, VNPay
  3. **Xác nhận đơn hàng**: Xem lại và hoàn tất
- Thu thập thông tin khách hàng đầy đủ
- Xác nhận điều khoản và điều kiện

#### 4. **Quản Lý Đơn Hàng**
- Trang xác nhận đơn hàng chi tiết
- Theo dõi trạng thái đơn hàng với timeline trực quan
- Tóm tắt đơn hàng: Sản phẩm, giá, địa chỉ giao hàng
- Mã đơn hàng tự động
- Chức năng in hóa đơn

#### 5. **Xác Thực & Tài Khoản**
- Đăng ký tài khoản mới
- Đăng nhập bằng email/mật khẩu
- Đăng nhập nhanh với Google OAuth
- Lưu phiên làm việc tự động
- Menu tài khoản với liên kết đến hồ sơ và đơn hàng
- Đăng xuất an toàn
- Mật khẩu tối thiểu 6 ký tự

#### 6. **Giao Tiếp & Newsletter**
- Form đăng ký nhận tin tức qua email
- Thông báo toast cho phản hồi người dùng
- Hệ thống thông báo realtime

#### 7. **Nội Dung & Thông Tin**
- Hero section với video nền
- Thẻ danh mục với hình ảnh minh họa
- Phần USP (Điểm Bán Hàng Độc Đáo)
- Thông tin sản phẩm với thông số kỹ thuật
- Hướng dẫn bảo quản (accordion)
- Chính sách đổi trả (accordion)
- Badge tin cậy và thông điệp xác thực

#### 8. **Điều Hướng & UX**
- Thanh điều hướng cố định (sticky header)
- Menu mobile responsive
- Điều hướng desktop và mobile
- Logo và thương hiệu
- Icon tìm kiếm
- Badge thông báo trên giỏ hàng và wishlist

### 🔧 Cho Nhà Phát Triển

- **Type-safe**: TypeScript hoàn toàn với Zod validation
- **Component Library**: 30+ shadcn/ui components có thể tùy chỉnh
- **Authentication**: Supabase Auth với Google OAuth
- **Form Management**: React Hook Form với validation
- **State Management**: TanStack React Query
- **Responsive**: Mobile-first design
- **Performance**: Vite + SWC transpiler

## 🛠️ Công Nghệ Sử Dụng

### Frontend Framework
- **Vite 5.4.19** - Build tool nhanh với HMR
- **React 18.3.1** - Thư viện UI
- **TypeScript 5.8.3** - Type safety
- **React Router DOM 6.30.1** - Client-side routing

### UI & Styling
- **shadcn/ui** - Component library cao cấp
- **Radix UI** - Primitives components không style
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Lucide React 0.462.0** - Icon library
- **Tailwind CSS Animate** - Animation utilities

### Form & Validation
- **React Hook Form 7.61.1** - Quản lý form hiệu quả
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers 3.10.0** - Integration layer

### State & Data
- **TanStack React Query 5.83.0** - Server state management
- **Sonner 1.7.4** - Toast notifications

### Backend & Database
- **Supabase 2.76.1** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication service
  - Real-time subscriptions
- **localStorage** - Session persistence

### Development Tools
- **ESLint 9.32.0** - Code linting
- **SWC** - Fast TypeScript/JavaScript compiler
- **Lovable Tagger** - Component tagging

## 📁 Cấu Trúc Dự Án

```
wabi-sabi-ceramics-studio/
├── src/
│   ├── pages/                      # Các trang chính (routed)
│   │   ├── Index.tsx              # Trang chủ
│   │   ├── ProductDetail.tsx       # Chi tiết sản phẩm
│   │   ├── Cart.tsx               # Giỏ hàng
│   │   ├── Checkout.tsx           # Thanh toán
│   │   ├── OrderConfirmation.tsx  # Xác nhận đơn hàng
│   │   ├── Auth.tsx               # Đăng nhập/Đăng ký
│   │   └── NotFound.tsx           # Trang 404
│   │
│   ├── components/                # Components tái sử dụng
│   │   ├── Navigation.tsx         # Header & navigation
│   │   ├── Hero.tsx               # Hero section với video
│   │   ├── CategoryCards.tsx      # Danh mục sản phẩm
│   │   ├── FeaturedProducts.tsx   # Sản phẩm nổi bật
│   │   ├── ProductCard.tsx        # Card sản phẩm
│   │   ├── ProductInfo.tsx        # Chi tiết sản phẩm
│   │   ├── ImageGallery.tsx       # Gallery hình ảnh
│   │   ├── USPSection.tsx         # Điểm bán hàng độc đáo
│   │   ├── Newsletter.tsx         # Form đăng ký email
│   │   ├── Footer.tsx             # Footer
│   │   └── ui/                    # shadcn/ui components (30+)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── tabs.tsx
│   │       ├── dialog.tsx
│   │       └── ... (30+ components)
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.tsx            # Hook authentication
│   │   ├── use-toast.ts           # Hook toast notifications
│   │   └── use-mobile.tsx         # Hook phát hiện mobile
│   │
│   ├── integrations/              # Tích hợp dịch vụ bên ngoài
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client
│   │       └── types.ts           # TypeScript types từ DB
│   │
│   ├── lib/                       # Utilities
│   │   └── utils.ts               # Helper functions
│   │
│   ├── assets/                    # Static assets
│   │   ├── product-*.jpg          # Hình sản phẩm
│   │   ├── category-*.jpg         # Hình danh mục
│   │   └── hero-pottery.mp4       # Video hero
│   │
│   ├── App.tsx                    # Main app với routes
│   ├── main.tsx                   # React DOM entry point
│   └── index.css                  # Global styles
│
├── public/                         # Static files công khai
├── .env                           # Environment variables
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind config
├── vite.config.ts                 # Vite config
└── components.json                # shadcn/ui config
```

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống

- **Node.js** >= 18.x
- **npm** hoặc **yarn** hoặc **pnpm**
- **Git**

### Bước 1: Clone Repository

```bash
git clone https://github.com/your-username/wabi-sabi-ceramics-studio.git
cd wabi-sabi-ceramics-studio
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Bước 3: Thiết Lập Environment Variables

Tạo file `.env` trong thư mục gốc với nội dung:

```env
VITE_SUPABASE_URL=https://izaetfahekjfacppzsis.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=izaetfahekjfacppzsis
```

> ⚠️ **Lưu ý**: Thay thế `your_supabase_anon_key` bằng anon key thực tế từ Supabase project của bạn.

### Bước 4: Thiết Lập Database

Chạy SQL migration để tạo database schema:

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy nội dung file `supabase/migrations/001_create_products_table.sql`
5. Paste và chạy SQL

Xem chi tiết trong file [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### Bước 5: Chạy Development Server

```bash
npm run dev
```

Website sẽ chạy tại: **http://localhost:8080**

### Các Lệnh Khác

```bash
# Build cho production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Build development mode
npm run build:dev
```

## 🗺️ Các Trang Web

| Route | Component | Mô Tả |
|-------|-----------|-------|
| `/` | `Index.tsx` | Trang chủ với hero, danh mục, sản phẩm nổi bật |
| `/product/:id` | `ProductDetail.tsx` | Chi tiết sản phẩm với gallery, specs, sản phẩm liên quan |
| `/cart` | `Cart.tsx` | Giỏ hàng với quản lý sản phẩm |
| `/checkout` | `Checkout.tsx` | Quy trình thanh toán 3 bước |
| `/order-confirmation/:orderId` | `OrderConfirmation.tsx` | Xác nhận đơn hàng thành công |
| `/auth` | `Auth.tsx` | Đăng nhập/Đăng ký |
| `/admin` | `Admin.tsx` | Quản lý sản phẩm (yêu cầu đăng nhập) |
| `/account` | *(Đang phát triển)* | Quản lý tài khoản |
| `/orders` | *(Đang phát triển)* | Lịch sử đơn hàng |
| `*` | `NotFound.tsx` | Trang 404 |

## 🔐 Authentication

### Phương Thức Đăng Nhập

1. **Email/Password**
   - Đăng ký với email, mật khẩu (tối thiểu 6 ký tự), họ tên
   - Đăng nhập với email và mật khẩu
   - Lưu session tự động trong localStorage
   - Auto refresh token

2. **Google OAuth**
   - Đăng nhập một chạm với Google
   - Redirect sau khi xác thực thành công
   - Đồng bộ thông tin user từ Google

### Provider

- **Supabase Auth** quản lý:
  - User sessions
  - Credentials
  - Token lifecycle
  - User metadata (full_name, email)

## 🗄️ Database & Backend

### Supabase PostgreSQL

- **URL**: `https://izaetfahekjfacppzsis.supabase.co`
- **Region**: Supabase Cloud
- **Authentication**: Supabase Auth service

### Trạng Thái Hiện Tại

✅ **Database schema đã được tạo** - Sẵn sàng để sử dụng!

### Tables Đã Implement

#### 1. **products** - Bảng sản phẩm
```sql
- id (UUID, Primary Key)
- name (VARCHAR) - Tên sản phẩm
- brand (VARCHAR) - Thương hiệu
- description (TEXT) - Mô tả
- price (DECIMAL) - Giá bán
- original_price (DECIMAL) - Giá gốc
- condition (VARCHAR) - Tình trạng
- badge (ENUM) - Nhãn: new/sale/rare
- image_url (TEXT) - URL hình ảnh
- images (JSONB) - Array hình ảnh
- category (VARCHAR) - Danh mục
- stock (INTEGER) - Tồn kho
- is_active (BOOLEAN) - Trạng thái
- created_at, updated_at, created_by
```

#### 2. **categories** - Bảng danh mục
```sql
- id (UUID, Primary Key)
- name (VARCHAR) - Tên (EN)
- name_vi (VARCHAR) - Tên (VI)
- description (TEXT)
- image_url (TEXT)
- created_at
```

### Data Hiện Tại

- **Database**: PostgreSQL trên Supabase
- **Auth storage**: Supabase Auth tự động quản lý users
- **Session**: localStorage
- **RLS Policies**: Đã thiết lập bảo mật row-level

### Chức Năng CRUD Sản Phẩm

Sử dụng các service functions trong `src/services/productService.ts`:

```typescript
// Lấy tất cả sản phẩm
await getAllProducts();

// Lấy sản phẩm theo ID
await getProductById(id);

// Tạo sản phẩm mới
await createProduct(productData);

// Cập nhật sản phẩm
await updateProduct(id, updates);

// Xóa sản phẩm (soft delete)
await deleteProduct(id);

// Tìm kiếm sản phẩm
await searchProducts(query);
```

## 🎨 Design System

### Màu Sắc (Japanese Pottery Aesthetic)

- **Cream White**: Background chính
- **Charcoal**: Text màu chủ đạo
- **Clay Brown**: Accent chính (gốm/sứ)
- **Terracotta**: Accent phụ
- **Sage Green**: Success/accent
- **Rust Orange**: Warning/accent
- **Indigo Blue**: Accent phụ

### Typography

- **Serif font**: Headings (elegant, Japanese pottery vibe)
- **Sans-serif**: Body text
- Custom font weights và sizes

### Nguyên Tắc Thiết Kế

- ✨ **Wabi-sabi aesthetic**: Vẻ đẹp của sự không hoàn hảo
- 🎯 **Minimalist**: Thiết kế sạch sẽ, tối giản
- 💎 **Premium**: Cảm giác cao cấp, sang trọng
- 🎭 **Smooth animations**: Hiệu ứng mượt mà
- 📱 **Responsive**: Mobile-first design
- 🌓 **Dark mode ready**: Hỗ trợ dark mode

## 📦 Deployment

### Lovable Platform

Website được host trên **Lovable.dev**:

- **URL**: https://lovable.dev/projects/f8e179aa-17ea-48a8-be4a-a9d8719dfab2
- **Auto-deploy**: Mỗi commit tự động deploy
- **Custom domain**: Có thể kết nối domain riêng

### Deploy Bằng Tay

```bash
# Build production
npm run build

# Deploy dist/ folder lên hosting của bạn
# (Netlify, Vercel, Cloudflare Pages, etc.)
```

### Environment Variables cho Production

Đảm bảo set các biến môi trường sau trên hosting platform:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## 🎯 Quản Lý Sản Phẩm (Admin)

### Truy cập Admin Panel

Sau khi đăng nhập, truy cập: **http://localhost:8080/admin**

### Tính Năng Admin

1. **Thêm Sản Phẩm Mới**
   - Form nhập liệu đầy đủ với validation
   - Upload URL hình ảnh
   - Chọn danh mục từ dropdown
   - Thiết lập nhãn (New/Sale/Rare)
   - Quản lý tồn kho

2. **Xem Danh Sách Sản Phẩm**
   - Hiển thị tất cả sản phẩm
   - Thông tin chi tiết: giá, tồn kho, ngày tạo
   - Badge nhãn trực quan

3. **Bảo Mật**
   - Chỉ user đã đăng nhập mới truy cập được
   - Row Level Security (RLS) policies
   - Mỗi user chỉ sửa/xóa sản phẩm của họ

### Video Demo

*(Thêm video demo nếu có)*

## 📝 Development Roadmap

### ✅ Đã Hoàn Thành

- [x] UI/UX Design & Components
- [x] Authentication (Email + Google OAuth)
- [x] Product Display & Details
- [x] Shopping Cart
- [x] Multi-step Checkout
- [x] Order Confirmation
- [x] Responsive Mobile Design
- [x] Navigation & Routing
- [x] Form Validation
- [x] **Database Schema (Products & Categories)**
- [x] **Product Service Functions (CRUD)**
- [x] **Admin Panel cho quản lý sản phẩm**
- [x] **Row Level Security (RLS)**

### ⚠️ Đang Phát Triển

- [ ] Payment Gateway Integration (COD, MoMo, VNPay)
- [ ] Order Tracking System với real-time updates
- [ ] Product Reviews & Ratings
- [ ] Q&A Section
- [ ] Search Functionality với filters
- [ ] Persistent Wishlist
- [ ] Upload hình ảnh trực tiếp (Supabase Storage)
- [ ] Bulk import sản phẩm (CSV/Excel)
- [ ] Product analytics dashboard

### 🔮 Tương Lai

- [ ] User Account Dashboard
- [ ] Order History
- [ ] Coupon/Discount Logic
- [ ] Email Notifications
- [ ] Admin Dashboard
- [ ] Analytics & Reports
- [ ] Multi-language Support (i18n)
- [ ] SEO Optimization

## 🔒 Bảo Mật

### Đã Implement

- ✅ HTTPS-ready (Supabase)
- ✅ Environment variables cho sensitive data
- ✅ Session management với token refresh
- ✅ Client-side validation (Zod)
- ✅ Password minimum length (6 chars)

### Cần Implement

- ⚠️ Server-side validation
- ⚠️ CSRF protection
- ⚠️ Input sanitization
- ⚠️ Rate limiting
- ⚠️ Payment PCI compliance

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Project này được cấp phép theo MIT License - xem file [LICENSE](LICENSE) để biết chi tiết.

## 📞 Liên Hệ

- **Project URL**: https://lovable.dev/projects/f8e179aa-17ea-48a8-be4a-a9d8719dfab2
- **Repository**: https://github.com/your-username/wabi-sabi-ceramics-studio

## 🙏 Cảm Ơn

- [Lovable.dev](https://lovable.dev) - Development platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool

---

**Made with ❤️ for Japanese Ceramics Lovers**

*Wabi-sabi: Finding beauty in imperfection*
