# Hệ Thống Thiết Kế Giao Diện (UI Design System) - Team K3S4_N3

Dựa trên mẫu thiết kế chuẩn của hệ thống tuyển dụng nội bộ, mọi giao diện Frontend (React + TypeScript) bắt buộc tuân theo bảng quy chuẩn thiết kế sau:

---

## 1. Bảng màu chủ đạo (Color Palette)

| Loại màu | Mã HEX | RGB / HSL | Mô tả & Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Primary (Chủ đạo)** | `#00867D` | `rgb(0, 134, 125)` | Màu xanh lục ngọc đậm (Deep Teal). Dùng cho background banner trái, icon nhận diện thương hiệu. |
| **Primary Hover / Active** | `#00736B` | `rgb(0, 115, 107)` | Trạng thái hover/active của nút bấm và link chính. |
| **Accent / Button** | `#05998B` | `rgb(5, 153, 139)` | Màu nút chính (CTA "Đăng nhập", nút xác nhận), link quan trọng. |
| **Background (Right Panel)**| `#F8F9FA` ~ `#F9F8FD` | `rgb(249, 248, 253)` | Nền toàn trang, nền trang làm việc sáng sủa, êm mắt. |
| **Surface / Card Background**| `#FFFFFF` | `rgb(255, 255, 255)` | Nền Card form, Dialog, Modal, Bảng dữ liệu. |
| **Text Primary (Tiêu đề)** | `#0F172A` | `rgb(15, 23, 42)` | Tiêu đề chính, text có độ nhấn cao. |
| **Text Secondary (Nội dung)**| `#334155` | `rgb(51, 65, 85)` | Nội dung chính, label form ("Email công ty", "Mật khẩu"). |
| **Text Muted (Phụ/Gợi ý)** | `#64748B` | `rgb(100, 116, 139)` | Dòng chú thích, placeholder, icon phụ. |
| **Border / Divider** | `#E2E8F0` | `rgb(226, 232, 240)` | Viền ô input, viền card, đường ngăn cách. |
| **Border Focus** | `#05998B` | `rgb(5, 153, 139)` | Viền khi focus vào ô input (kèm box-shadow glow nhẹ). |

---

## 2. Kiểu chữ & Căn lề (Typography & Alignment)

### Phông chữ (Font Family)
- Ưu tiên: `'Plus Jakarta Sans'`, `'Inter'`, `'Roboto'`, hoặc `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

### Cấp bậc phông chữ & Trọng số (Hierarchy & Weight)
* **Banner Title (Trái):** `24px - 28px` | `font-weight: 800` (Extra Bold) | Chữ in hoa (`uppercase`) | Căn giữa (`text-align: center`) | Màu `#FFFFFF`.
* **Form Main Heading:** `20px - 22px` | `font-weight: 700` (Bold) | Chữ in hoa (`uppercase`) | Căn giữa (`text-align: center`) | Màu `#0F172A`.
* **Section Title / Step:** `15px - 16px` | `font-weight: 600` (Semi-bold) | Căn giữa | Màu `#334155`.
* **Subtitle / Ghi chú:** `12px - 13px` | `font-weight: 400` (Regular) | Căn giữa | Màu `#64748B`.
* **Form Label:** `13px - 14px` | `font-weight: 500` (Medium) | Căn trái (`text-align: left`) | Màu `#334155`.
* **Input Text / Placeholder:** `14px` | `font-weight: 400` (Regular) | Căn trái | Màu nhập `#0F172A`, placeholder `#94A3B8`.
* **Action Link ("Quên mật khẩu?"):** `13px` | `font-weight: 500` (Medium) | Căn phải | Màu `#00867D` / `#05998B`.
* **Button Text:** `14px - 15px` | `font-weight: 600` (Semi-bold) | Căn giữa | Màu `#FFFFFF`.
