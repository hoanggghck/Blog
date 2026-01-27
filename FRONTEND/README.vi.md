## Frontend – Blog Web Application

Frontend của dự án Blog Web Application được xây dựng bằng Next.js (App Router), thiết kế theo tư duy Senior Frontend Developer, tập trung vào khả năng mở rộng, maintain lâu dài và onboarding nhanh cho team.

==================================================

## CÔNG NGHỆ SỬ DỤNG

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- React Query (server state)
- Zustand (client state)
- Axios

==================================================

## CHỨC NĂNG CHÍNH

- Hiển thị danh sách blog
- Tìm kiếm blog theo tiêu đề và danh mục
- Tạo, chỉnh sửa, xoá blog
- Đăng ký, đăng nhập người dùng
- Bình luận và thích blog
- Dashboard quản trị:
  + Quản lý user
  + Quản lý blog
  + Quản lý tag
  + Quản lý category

==================================================

## TƯ DUY KIẾN TRÚC

- app chỉ dùng cho routing và layout, call api SEO
- components chỉ render UI, không xử lý data
- Business logic nằm tại features và hooks
- API layer tách biệt hoàn toàn
==================================================

## CẤU TRÚC THƯ MỤC

src/
├── apis/
├── app/
├── assets/
├── components/
├── services/
├── const/
├── features/
├── hooks/
├── lib/
├── providers/
├── stores/
├── styles/
├── types/
├── utils/
middleware.ts

==================================================

## MÔ TẢ CHI TIẾT CẤU TRÚC THƯ MỤC 

apis/
Chứa các root API modules, được xây dựng từ core Axios service. API được phân theo domain (blog, auth, user...). Không xử lý nghiệp vụ, chỉ đảm nhiệm việc gọi API và trả dữ liệu.

Ví dụ:
export const blogApi = {
  createBlog: async (p: FormData) => apiServicePrivateUploadFile.post('/blog', p),
}

--------------------------------------------------

app/
Sử dụng Next.js App Router. Thư mục này chỉ làm nhiệm vụ routing, nhận params từ URL, bọc layout, component con. Call api SEO.

--------------------------------------------------

assets/
Chứa hình ảnh, font và các static files dùng trong dự án.

--------------------------------------------------

components/
Chứa các UI component thuần. Component chỉ render HTML/JSX, nhận props và callback. Không call API, không xử lý logic nghiệp vụ.

--------------------------------------------------

services/
Catching dữ liệu trên server để tránh recall nhiều lần

--------------------------------------------------

const/
Lưu trữ enum, constant dùng chung cho toàn bộ dự án như role, route, status mapping.

--------------------------------------------------

features/
Là trung tâm xử lý nghiệp vụ của frontend. Chứa các component đảm nhiệm việc fetching dữ liệu, xử lý logic, kết nối API và truyền dữ liệu xuống UI component.

Mỗi feature tương ứng với một domain như: auth, blog, user, dashboard.

--------------------------------------------------

hooks/
Chứa các custom hook cho dự án. Chủ yếu dùng React Query để call API, caching, retry, invalidate. Không render UI.

--------------------------------------------------

lib/
Chứa các thư viện dùng chung cho toàn dự án.

API core được chia thành:
- base-api.public: dùng cho API không cần token
- base-api.private: dùng cho API cần token

Xử lý Axios instance, interceptor, inject token, handle request/response và các logic dùng chung cho API.

--------------------------------------------------

providers/
Chứa các provider bọc ứng dụng như React Query Provider, Theme Provider, Router Provider.

--------------------------------------------------

stores/
Sử dụng Zustand để lưu trữ client state như authentication, user data, UI state. Không dùng để lưu server state.

--------------------------------------------------

styles/
Chứa global CSS, theme và custom CSS.

--------------------------------------------------

types/
Chứa các TypeScript type và interface dùng chung cho toàn dự án.

--------------------------------------------------

utils/
Chứa các helper function và utility dùng chung.

--------------------------------------------------

middleware.ts
Xử lý authentication cho các route private. Kiểm tra token và redirect khi người dùng truy cập các trang yêu cầu đăng nhập như dashboard.

==================================================

## MỤC TIÊU KIẾN TRÚC

- Dễ mở rộng feature
- Dễ maintain
- Dễ test
- Onboard nhanh cho developer mới
- Phù hợp dự án thực tế, không demo

==================================================