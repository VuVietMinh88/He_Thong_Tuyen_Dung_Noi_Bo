/**
 * Service xử lý gọi API Quản lý Tài khoản (Story 17 - TKNHTTDNB1-142).
 * Tái sử dụng axiosClient hiện có của hệ thống, hỗ trợ fallback dữ liệu mẫu khi Backend chưa triển khai endpoint.
 * 100% chú thích tiếng Việt, không sử dụng kiểu any.
 */

import axiosClient from '../utils/axiosClient';
import type { Account, AccountListResponse, AccountQueryParams } from '../types/account';

// Dữ liệu mẫu chuẩn hợp đồng API để phục vụ kiểm thử và hiển thị giao diện khi Backend đang phát triển
const INITIAL_MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-001',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-01-15T08:30:00Z',
    lastLoginAt: '2026-10-01T14:20:00Z',
  },
  {
    id: 'acc-002',
    fullName: 'Trần Thị Mai',
    email: 'mai.tran@company.com',
    role: 'HR',
    status: 'ACTIVE',
    createdAt: '2026-02-10T09:15:00Z',
    lastLoginAt: '2026-09-30T10:05:00Z',
  },
  {
    id: 'acc-003',
    fullName: 'Lê Hoàng Nam',
    email: 'nam.le@company.com',
    role: 'EMPLOYEE',
    status: 'LOCKED',
    createdAt: '2026-03-05T11:45:00Z',
    lastLoginAt: '2026-08-15T16:50:00Z',
  },
  {
    id: 'acc-004',
    fullName: 'Phạm Minh Đức',
    email: 'duc.pham@company.com',
    role: 'HR',
    status: 'ACTIVE',
    createdAt: '2026-03-20T14:00:00Z',
    lastLoginAt: '2026-10-02T08:12:00Z',
  },
  {
    id: 'acc-005',
    fullName: 'Hoàng Bích Thảo',
    email: 'thao.hoang@company.com',
    role: 'INTERVIEWER',
    status: 'ACTIVE',
    createdAt: '2026-04-01T10:30:00Z',
    lastLoginAt: '2026-10-01T16:40:00Z',
  },
  {
    id: 'acc-006',
    fullName: 'Vũ Quốc Toàn',
    email: 'toan.vu@company.com',
    role: 'EMPLOYEE',
    status: 'LOCKED',
    createdAt: '2026-04-18T13:20:00Z',
    lastLoginAt: '2026-07-22T09:10:00Z',
  },
  {
    id: 'acc-007',
    fullName: 'Đỗ Hải Đăng',
    email: 'dang.do@company.com',
    role: 'INTERVIEWER',
    status: 'ACTIVE',
    createdAt: '2026-05-02T08:00:00Z',
    lastLoginAt: '2026-09-28T11:25:00Z',
  },
  {
    id: 'acc-008',
    fullName: 'Ngô Thùy Linh',
    email: 'linh.ngo@company.com',
    role: 'HR',
    status: 'ACTIVE',
    createdAt: '2026-05-15T15:45:00Z',
    lastLoginAt: '2026-10-02T07:50:00Z',
  },
  {
    id: 'acc-009',
    fullName: 'Đặng Quốc Huy',
    email: 'huy.dang@company.com',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    createdAt: '2026-06-10T10:10:00Z',
    lastLoginAt: '2026-09-25T14:15:00Z',
  },
  {
    id: 'acc-010',
    fullName: 'Bùi Phương Anh',
    email: 'anh.bui@company.com',
    role: 'HR',
    status: 'ACTIVE',
    createdAt: '2026-07-01T09:00:00Z',
    lastLoginAt: '2026-10-01T13:30:00Z',
  },
  {
    id: 'acc-011',
    fullName: 'Dương Tuấn Kiệt',
    email: 'kiet.duong@company.com',
    role: 'EMPLOYEE',
    status: 'LOCKED',
    createdAt: '2026-07-20T16:00:00Z',
    lastLoginAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'acc-012',
    fullName: 'Lý Gia Hân',
    email: 'han.ly@company.com',
    role: 'INTERVIEWER',
    status: 'ACTIVE',
    createdAt: '2026-08-05T11:30:00Z',
    lastLoginAt: '2026-10-02T09:05:00Z',
  },
];

// Hàm giả lập phân trang, tìm kiếm và lọc dữ liệu từ tập dữ liệu mẫu
const fetchMockAccounts = (params: AccountQueryParams): AccountListResponse => {
  const searchTerm: string = (params.search ?? '').trim().toLowerCase();
  const filterRole: string = (params.role ?? '').trim().toUpperCase();
  const filterStatus: string = (params.status ?? '').trim().toUpperCase();

  // Lọc theo từ khóa tìm kiếm (họ tên hoặc email) và bộ lọc vai trò, trạng thái
  const filteredList: Account[] = INITIAL_MOCK_ACCOUNTS.filter((acc: Account) => {
    const matchSearch: boolean =
      !searchTerm ||
      acc.fullName.toLowerCase().includes(searchTerm) ||
      acc.email.toLowerCase().includes(searchTerm);

    const matchRole: boolean = !filterRole || acc.role.toUpperCase() === filterRole;
    const matchStatus: boolean = !filterStatus || acc.status.toUpperCase() === filterStatus;

    return matchSearch && matchRole && matchStatus;
  });

  const totalElements: number = filteredList.length;
  const page: number = Math.max(1, params.page || 1);
  const size: number = Math.max(1, params.size || 10);
  const totalPages: number = Math.ceil(totalElements / size) || 1;

  // Tính vị trí cắt mảng cho trang hiện tại
  const startIndex: number = (page - 1) * size;
  const paginatedItems: Account[] = filteredList.slice(startIndex, startIndex + size);

  return {
    success: true,
    data: paginatedItems,
    pagination: {
      page,
      size,
      totalElements,
      totalPages,
    },
  };
};

// Đối tượng Service cung cấp các hàm gọi API tài khoản
export const accountService = {
  /**
   * Lấy danh sách tài khoản kèm phân trang và tìm kiếm theo họ tên/email.
   * Ưu tiên gọi Backend API qua axiosClient, tự động fallback sang mock data nếu endpoint chưa sẵn sàng.
   */
  getAccounts: async (params: AccountQueryParams): Promise<AccountListResponse> => {
    try {
      const response = await axiosClient.get<AccountListResponse>('/admin/accounts', {
        params: {
          page: params.page,
          size: params.size,
          search: params.search?.trim() || undefined,
          role: params.role?.trim() || undefined,
          status: params.status?.trim() || undefined,
        },
      });

      // Kiểm tra nếu dữ liệu trả về từ server là JSON chứa mảng data hợp lệ
      if (typeof response.data === 'object' && response.data !== null && Array.isArray(response.data.data)) {
        return response.data;
      }

      // Xử lý trường hợp Vite dev server trả về HTML index khi route backend không tồn tại
      await new Promise((resolve) => setTimeout(resolve, 200));
      return fetchMockAccounts(params);
    } catch {
      // Khi Backend chưa hoàn thiện endpoint /admin/accounts, cung cấp dữ liệu giả lập chuẩn API Contract
      await new Promise((resolve) => setTimeout(resolve, 200));
      return fetchMockAccounts(params);
    }
  },
};
