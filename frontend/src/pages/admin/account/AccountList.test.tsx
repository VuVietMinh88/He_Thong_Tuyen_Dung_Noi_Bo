import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountList } from './AccountList';
import { accountService } from '../../../services/accountService';
import type { AccountListResponse } from '../../../types/account';

const MOCK_RESPONSE: AccountListResponse = {
  success: true,
  data: [
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
      fullName: 'Lê Hoàng Nam',
      email: 'nam.le@company.com',
      role: 'EMPLOYEE',
      status: 'LOCKED',
      createdAt: '2026-03-05T11:45:00Z',
      lastLoginAt: '2026-08-15T16:50:00Z',
    },
  ],
  pagination: {
    page: 1,
    size: 10,
    totalElements: 2,
    totalPages: 1,
  },
};

describe('AccountList Page (TKNHTTDNB1-142, TKNHTTDNB1-150, TKNHTTDNB1-160)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Hiển thị bảng danh sách tài khoản với đầy đủ các cột và dữ liệu (TKNHTTDNB1-142)', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValueOnce(MOCK_RESPONSE);

    render(<AccountList />);

    // Kiểm tra tiêu đề trang
    expect(screen.getByText('Danh Sách Tài Khoản')).toBeInTheDocument();

    // Chờ dữ liệu hiển thị sau khi tải xong
    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    // Kiểm tra các cột trong bảng
    expect(screen.getByText('acc-001')).toBeInTheDocument();
    expect(screen.getByText('an.nguyen@company.com')).toBeInTheDocument();
    expect(screen.getByText('Quản trị viên')).toBeInTheDocument();

    // Kiểm tra tài khoản thứ 2
    expect(screen.getByText('acc-002')).toBeInTheDocument();
    expect(screen.getByText('Lê Hoàng Nam')).toBeInTheDocument();
    expect(screen.getByText('nam.le@company.com')).toBeInTheDocument();
  });

  it('2. Hiển thị trạng thái Hoạt động và Đã khóa trực quan theo TKNHTTDNB1-160', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValueOnce(MOCK_RESPONSE);

    render(<AccountList />);

    await waitFor(() => {
      expect(screen.getByTestId('status-badge-active')).toBeInTheDocument();
      expect(screen.getByTestId('status-badge-locked')).toBeInTheDocument();
    });
  });

  it('3. Vị trí hành động (Edit, Role, Lock/Unlock) được tạo sẵn và disabled cho task sau', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValueOnce(MOCK_RESPONSE);

    render(<AccountList />);

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    // Các nút hành động được render ở trạng thái disabled
    const editButtons = screen.getAllByLabelText(/Chỉnh sửa tài khoản/i);
    expect(editButtons.length).toBeGreaterThan(0);
    expect(editButtons[0]).toBeDisabled();

    const roleButtons = screen.getAllByLabelText(/Phân quyền vai trò/i);
    expect(roleButtons.length).toBeGreaterThan(0);
    expect(roleButtons[0]).toBeDisabled();
  });

  it('4. Tìm kiếm tài khoản theo họ tên / email (TKNHTTDNB1-150)', async () => {
    const getAccountsSpy = vi
      .spyOn(accountService, 'getAccounts')
      .mockResolvedValue(MOCK_RESPONSE);

    render(<AccountList />);

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('searchbox');
    await userEvent.type(searchInput, 'an.nguyen');

    // Sau khi debounce hoàn tất, API được gọi kèm tham số search
    await waitFor(
      () => {
        expect(getAccountsSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'an.nguyen',
            page: 1,
          })
        );
      },
      { timeout: 1500 }
    );
  });

  it('5. Hiển thị phân trang và tổng số tài khoản (TKNHTTDNB1-150)', async () => {
    const multiPageResponse: AccountListResponse = {
      ...MOCK_RESPONSE,
      pagination: {
        page: 1,
        size: 5,
        totalElements: 12,
        totalPages: 3,
      },
    };

    const getAccountsSpy = vi
      .spyOn(accountService, 'getAccounts')
      .mockResolvedValue(multiPageResponse);

    render(<AccountList />);

    await waitFor(() => {
      expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1);
    });

    // Nút trang 2 có trong danh sách
    const page2Button = screen.getByRole('button', { name: '2' });
    expect(page2Button).toBeInTheDocument();

    // Bấm sang trang 2
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(getAccountsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        })
      );
    });
  });

  it('6. Hiển thị trạng thái dữ liệu trống khi không có kết quả (TKNHTTDNB1-142)', async () => {
    const emptyResponse: AccountListResponse = {
      success: true,
      data: [],
      pagination: {
        page: 1,
        size: 10,
        totalElements: 0,
        totalPages: 1,
      },
    };

    vi.spyOn(accountService, 'getAccounts').mockResolvedValueOnce(emptyResponse);

    render(<AccountList />);

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy tài khoản nào')).toBeInTheDocument();
    });
  });

  it('7. Hiển thị trạng thái lỗi và nút thử lại khi gọi API thất bại (TKNHTTDNB1-142)', async () => {
    const getAccountsSpy = vi
      .spyOn(accountService, 'getAccounts')
      .mockRejectedValueOnce(new Error('Mất kết nối mạng'))
      .mockResolvedValueOnce(MOCK_RESPONSE);

    render(<AccountList />);

    await waitFor(() => {
      expect(screen.getByText('Không thể tải danh sách tài khoản')).toBeInTheDocument();
      expect(screen.getByText('Mất kết nối mạng')).toBeInTheDocument();
    });

    // Bấm nút Thử lại
    const retryButton = screen.getByRole('button', { name: /Thử lại/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(getAccountsSpy).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });
  });
});
