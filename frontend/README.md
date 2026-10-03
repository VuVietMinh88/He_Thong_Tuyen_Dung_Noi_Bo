# Hệ Thống Tuyển Dụng Nội Bộ - Frontend

Đây là thư mục chứa mã nguồn Frontend của dự án **Hệ Thống Tuyển Dụng Nội Bộ**.

## Công nghệ sử dụng
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Lucide React (Icons)

## Hướng dẫn cài đặt
1. Cài đặt các thư viện:
   ```bash
   npm install
   ```

2. Khởi động môi trường phát triển (Dev Server):
   ```bash
   npm run dev
   ```

3. Build dự án:
   ```bash
   npm run build
   ```

## Cấu trúc thư mục
- `src/types/`: Chứa định nghĩa các Interface, Type của TypeScript.
- `src/services/`: Chứa các hàm giao tiếp với API (Axios).
- `src/context/`: Quản lý Global State.
- `src/components/layout/`: Các thành phần bố cục (Header, Sidebar).
- `src/components/routes/`: Quản lý các Route (ProtectedRoute).
- `src/pages/`: Chứa các trang chính của ứng dụng (Auth, Dashboard).

## Quy ước Code (Coding Convention)
- Sử dụng tiếng Việt 100% trong các comment và tài liệu.
- Xử lý lỗi chặt chẽ bằng `try...catch...finally` để không bao giờ nuốt lỗi hoặc kẹt Loading state.
- Đặt tên biến theo chuẩn `camelCase`, Component/Interface theo chuẩn `PascalCase`.
- Tách biệt logic API ra khỏi giao diện.
