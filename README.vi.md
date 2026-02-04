# Blog Web Application (Fullstack)

Dự án Blog Web Application được xây dựng theo mô hình **Fullstack**, tách biệt rõ ràng giữa Frontend và Backend, hướng tới khả năng **mở rộng, maintain lâu dài và scale cho team**.

---

## 🧱 Kiến trúc tổng quan

- **Frontend (FE)**: Next.js App Router
- **Backend (BE)**: NestJS (REST API)
- **Database**: PostgreSQL
- **Cache / Session**: Redis

---

## 🎨 Frontend (FE)

Frontend được xây dựng để phục vụ Web App Blog với đầy đủ nghiệp vụ người dùng và dashboard quản trị.

### Công nghệ sử dụng
- **Next.js** (App Router)
- **Tailwind CSS**
- **shadcn/ui**
- **lucide-react**
- **React Query**
- **Zustand**

### Chức năng chính
- Hiển thị danh sách blog
- Tìm kiếm blog theo:
  - Tiêu đề
  - Danh mục (Category)
- CRUD Blog
- Đăng ký / Đăng nhập người dùng
- Bình luận & Thích blog
- Dashboard quản trị:
  - Quản lý User
  - Quản lý Blog
  - Quản lý Tag
  - Quản lý Category

---

## ⚙️ Backend (BE)

Backend được xây dựng theo kiến trúc module của NestJS, tập trung vào **clean architecture** và **tách biệt nghiệp vụ rõ ràng**.

### Công nghệ sử dụng
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Redis**
- **Logger**
- **Seeder**

### Chức năng
- REST API cho toàn bộ nghiệp vụ Blog
- Authentication & Authorization
- Logging request / response
- Seeder dữ liệu ban đầu
- Cache & session handling với Redis

---

## 📁 Cấu trúc thư mục

