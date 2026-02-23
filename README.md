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
- Tìm kiếm blog theo tiêu đề và danh mục (Category)
- CRUD Blog
- Đăng ký / Đăng nhập người dùng
- Bình luận & Thích blog
- Dashboard quản trị: Quản lý User, Blog, Tag, Category

### Kỹ thuật nổi bật
- **AT & RT handling**: Tự động refresh Access Token khi hết hạn thông qua lớp Axios interceptor, đảm bảo UX liền mạch không bị logout đột ngột
- **Axios wrapper**: Lớp API tùy chỉnh xử lý base URL, authorization header, error handling tập trung và retry logic
- **Lazy load & Suspense**: Áp dụng `React.lazy` + `Suspense` kết hợp với loading UI của Next.js (`loading.tsx`) để tối ưu thời gian tải trang
- **Server Component & Client Component**: Phân tách rõ ràng theo App Router, tận dụng SSR cho SEO và CSR cho interactive UI

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

### Kỹ thuật nổi bật
- **Access Token & Refresh Token**: Cơ chế xác thực hai lớp — AT short-lived dùng cho mỗi request, RT long-lived lưu trong Redis để cấp AT mới, hỗ trợ revoke token khi logout
- **Rate Limiting**: Giới hạn số request theo IP/user để chống brute force và abuse API
- **Image Upload**: Xử lý upload ảnh lưu trữ trên server, trả về URL để FE sử dụng
- **OAuth2**: Đăng nhập qua bên thứ ba (Google,...)
- **Logger**: Ghi log toàn bộ request/response giúp debug và monitor hệ thống

---
### DX & Code Quality
- **ESLint custom rules**: Áp dụng các quy tắc bắt buộc về:
  - Quy tắc đặt tên (naming convention) cho biến, hàm, component
  - Thứ tự và vị trí import (internal/external/alias)
  - Quy tắc export theo từng folder — ví dụ folder `types/` chỉ cho phép khai báo `interface` hoặc `type`, không được export function hay class
- Giúp codebase nhất quán, dễ review và onboard thành viên mới