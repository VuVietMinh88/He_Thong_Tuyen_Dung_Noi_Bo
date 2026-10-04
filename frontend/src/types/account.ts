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

// Interface dữ liệu gửi lên khi cập nhật thông tin tài khoản (TKNHTTDNB1-144)
export interface UpdateAccountRequest {
  fullName: string;
  email: string;
}

// Interface kết quả trả về khi cập nhật thông tin tài khoản thành công
export interface UpdateAccountResponse {
  success: boolean;
  data: Account;
  message?: string;
}

// Interface lưu trữ lỗi xác thực của các trường trong form chỉnh sửa tài khoản
export interface AccountFormErrors {
  fullName?: string;
  email?: string;
  general?: string;
}

// Interface dữ liệu gửi lên khi cập nhật vai trò người dùng (TKNHTTDNB1-152)
export interface UpdateAccountRoleRequest {
  role: AccountRole;
}

// Interface kết quả trả về khi cập nhật vai trò thành công
export interface UpdateAccountRoleResponse {
  success: boolean;
  data: Account;
  message?: string;
}

// Interface dữ liệu gửi lên khi cập nhật trạng thái khóa/mở khóa tài khoản (TKNHTTDNB1-161)
export interface UpdateAccountStatusRequest {
  status: AccountStatus;
}

// Interface kết quả trả về khi cập nhật trạng thái tài khoản thành công
export interface UpdateAccountStatusResponse {
  success: boolean;
  data: Account;
  message?: string;
}

// Interface định nghĩa thông tin mô tả chi tiết của từng vai trò hệ thống
export interface RoleOption {
  value: AccountRole;
  label: string;
  description: string;
}

// Danh mục các vai trò chuẩn được hỗ trợ trong hệ thống tuyển dụng nội bộ
export const AVAILABLE_ROLES: RoleOption[] = [
  {
    value: 'ADMIN',
    label: 'Quản trị viên (ADMIN)',
    description: 'Toàn quyền quản trị hệ thống, quản lý người dùng, phân quyền vai trò và giám sát dữ liệu.',
  },
  {
    value: 'HR',
    label: 'Nhân sự (HR)',
    description: 'Quản lý tin tuyển dụng, tiếp nhận hồ sơ ứng viên, điều phối lịch phỏng vấn và báo cáo.',
  },
  {
    value: 'INTERVIEWER',
    label: 'Phỏng vấn viên (INTERVIEWER)',
    description: 'Tham gia hội đồng phỏng vấn, đánh giá năng lực chuyên môn và chấm điểm ứng viên.',
  },
  {
    value: 'EMPLOYEE',
    label: 'Nhân viên (EMPLOYEE)',
    description: 'Nhân viên công ty, theo dõi tin tuyển dụng nội bộ và gửi hồ sơ giới thiệu ứng viên.',
  },
];


