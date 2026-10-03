/**
 * Định nghĩa các kiểu dữ liệu và giao diện (Interfaces) cho Module Quản lý Tài khoản (Story 17 - TKNHTTDNB1-142).
 * Tuân thủ nghiêm ngặt quy tắc TypeScript: Không dùng kiểu `any`, 100% chú thích tiếng Việt.
 */

// Định nghĩa các trạng thái tài khoản theo quy định hệ thống (TKNHTTDNB1-160)
export type AccountStatus = 'ACTIVE' | 'LOCKED';

// Định nghĩa các vai trò hợp lệ trong hệ thống quản trị tuyển dụng nội bộ
export type AccountRole = 'ADMIN' | 'HR' | 'INTERVIEWER' | 'EMPLOYEE' | string;

// Interface đại diện cho đối tượng tài khoản người dùng hiển thị trên bảng dữ liệu
export interface Account {
  id: string | number;
  fullName: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  createdAt?: string;
  lastLoginAt?: string;
}

// Interface tham số truy vấn tìm kiếm và phân trang gửi lên API (TKNHTTDNB1-150)
export interface AccountQueryParams {
  page: number;
  size: number;
  search?: string;
  role?: string;
  status?: AccountStatus | '';
}

// Interface thông tin phân trang chuẩn trả về từ API
export interface AccountPagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Interface cấu trúc kết quả trả về chuẩn của API danh sách tài khoản
export interface AccountListResponse {
  success: boolean;
  data: Account[];
  pagination: AccountPagination;
  message?: string;
}
