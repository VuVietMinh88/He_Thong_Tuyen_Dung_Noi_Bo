import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountList } from './AccountList';
import { accountService } from '../../../services/accountService';
import { AuthProvider } from '../../../context/AuthProvider';
import type { AuthUser } from '../../../context/AuthContext';
import type { AccountListResponse } from '../../../types/account';

// Dữ liệu người dùng quản trị viên giả lập để phục vụ kiểm thử quyền
const MOCK_ADMIN_USER: AuthUser = {
  id: 'admin-999',
  name: 'Quản trị viên hệ thống',
  role: 'ADMIN',
  permissions: ['ADMIN', 'MANAGE_USERS'],
};

// Dữ liệu danh sách tài khoản mẫu trả về từ API
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

/**
 * Hàm tiện ích hỗ trợ render AccountList bọc trong AuthProvider
 */
const renderAccountList = (authUser: AuthUser | null = MOCK_ADMIN_USER): ReturnType<typeof render> => {
  return render(
    <AuthProvider user={authUser}>
      <AccountList />
    </AuthProvider>
  );
};

describe('AccountList Page (TKNHTTDNB1-142, TKNHTTDNB1-144, TKNHTTDNB1-150, TKNHTTDNB1-152, TKNHTTDNB1-160, TKNHTTDNB1-161)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Hiển thị bảng danh sách tài khoản với đầy đủ các cột và dữ liệu (TKNHTTDNB1-142)', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValueOnce(MOCK_RESPONSE);

    renderAccountList();

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

    // Dòng thứ 2
    expect(screen.getByText('Lê Hoàng Nam')).toBeInTheDocument();
    expect(screen.getByText('nam.le@company.com')).toBeInTheDocument();
  });

  it('2. Hiển thị trạng thái Hoạt động và Đã khóa trực quan theo TKNHTTDNB1-160', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValueOnce(MOCK_RESPONSE);

    renderAccountList();

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    // Tài khoản 1: ACTIVE -> badge Hoạt động
    const activeBadge = screen.getByTestId('status-badge-active');
    expect(activeBadge).toBeInTheDocument();
    expect(activeBadge).toHaveTextContent('Hoạt động');

    // Tài khoản 2: LOCKED -> badge Đã khóa
    const lockedBadge = screen.getByTestId('status-badge-locked');
    expect(lockedBadge).toBeInTheDocument();
    expect(lockedBadge).toHaveTextContent('Đã khóa');
  });

  it('3. Kích hoạt đầy đủ các nút hành động (Chỉnh sửa, Phân quyền Role, Khóa/Mở khóa) cho Quản trị viên', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValueOnce(MOCK_RESPONSE);

    renderAccountList();

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    // 1. Nút Chỉnh sửa tài khoản (TKNHTTDNB1-144)
    const editButtons = screen.getAllByLabelText(/Chỉnh sửa tài khoản/i);
    expect(editButtons.length).toBeGreaterThan(0);
    expect(editButtons[0]).not.toBeDisabled();

    // 2. Nút Phân quyền vai trò (TKNHTTDNB1-152)
    const roleButtons = screen.getAllByLabelText(/Phân quyền vai trò cho/i);
    expect(roleButtons.length).toBeGreaterThan(0);
    expect(roleButtons[0]).not.toBeDisabled();

    // 3. Nút Khóa / Mở khóa tài khoản (TKNHTTDNB1-161)
    const lockButtons = screen.getAllByLabelText(/Khóa tài khoản|Mở khóa tài khoản/i);
    expect(lockButtons.length).toBeGreaterThan(0);
    expect(lockButtons[0]).not.toBeDisabled();
  });

  it('4. Tìm kiếm tài khoản theo họ tên / email (TKNHTTDNB1-150)', async () => {
    const getAccountsSpy = vi
      .spyOn(accountService, 'getAccounts')
      .mockResolvedValue(MOCK_RESPONSE);

    renderAccountList();

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

    renderAccountList();

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

    renderAccountList();

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy tài khoản nào')).toBeInTheDocument();
    });
  });

  it('7. Hiển thị trạng thái lỗi và nút thử lại khi gọi API thất bại (TKNHTTDNB1-142)', async () => {
    const getAccountsSpy = vi
      .spyOn(accountService, 'getAccounts')
      .mockRejectedValueOnce(new Error('Mất kết nối mạng'))
      .mockResolvedValueOnce(MOCK_RESPONSE);

    renderAccountList();

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

  it('8. Mở form chỉnh sửa khi bấm nút Chỉnh sửa trên dòng tài khoản và lưu thành công (TKNHTTDNB1-144)', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValue(MOCK_RESPONSE);
    const updateSpy = vi.spyOn(accountService, 'updateAccount').mockResolvedValueOnce({
      success: true,
      data: {
        ...MOCK_RESPONSE.data[0],
        fullName: 'Nguyễn Văn An Đã Đổi Tên',
        email: 'an.doiten@company.com',
      },
      message: 'Cập nhật thông tin tài khoản thành công.',
    });

    renderAccountList();

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    // Bấm nút Chỉnh sửa tài khoản đầu tiên
    const editButton = screen.getAllByLabelText(/Chỉnh sửa tài khoản/i)[0];
    fireEvent.click(editButton);

    // Modal xuất hiện
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Chỉnh Sửa Tài Khoản' })).toBeInTheDocument();
    });

    // Kiểm tra thông tin hiện tại được nạp vào modal
    const fullNameInput = screen.getByLabelText(/Họ và tên/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Địa chỉ Email/i) as HTMLInputElement;
    expect(fullNameInput.value).toBe('Nguyễn Văn An');
    expect(emailInput.value).toBe('an.nguyen@company.com');

    // Chỉnh sửa họ tên và email
    await userEvent.clear(fullNameInput);
    await userEvent.type(fullNameInput, 'Nguyễn Văn An Đã Đổi Tên');

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'an.doiten@company.com');

    // Bấm nút Lưu thay đổi
    const saveButton = screen.getByRole('button', { name: /Lưu thay đổi/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('acc-001', {
        fullName: 'Nguyễn Văn An Đã Đổi Tên',
        email: 'an.doiten@company.com',
      });
      // Modal đóng lại
      expect(screen.queryByRole('heading', { name: 'Chỉnh Sửa Tài Khoản' })).not.toBeInTheDocument();
      // Thông báo thành công hiển thị
      expect(screen.getByText('Cập nhật thông tin tài khoản thành công.')).toBeInTheDocument();
    });
  });

  it('9. Cho phép thay đổi số lượng bản ghi mỗi trang (Page Size) (TKNHTTDNB1-150)', async () => {
    const getAccountsSpy = vi
      .spyOn(accountService, 'getAccounts')
      .mockResolvedValue(MOCK_RESPONSE);

    renderAccountList();

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    const pageSizeSelect = screen.getByLabelText('Chọn số bản ghi trên mỗi trang');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });

    await waitFor(() => {
      expect(getAccountsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 20,
          page: 1,
        })
      );
    });
  });

  it('10. Mở modal phân quyền vai trò, chọn vai trò mới và lưu thành công (TKNHTTDNB1-152)', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValue(MOCK_RESPONSE);
    const updateRoleSpy = vi.spyOn(accountService, 'updateAccountRole').mockResolvedValueOnce({
      success: true,
      data: {
        ...MOCK_RESPONSE.data[1],
        role: 'HR',
      },
      message: 'Cập nhật vai trò người dùng thành công.',
    });

    renderAccountList();

    await waitFor(() => {
      expect(screen.getByText('Lê Hoàng Nam')).toBeInTheDocument();
    });

    // Bấm nút phân quyền vai trò cho tài khoản thứ 2 (Lê Hoàng Nam, hiện là EMPLOYEE)
    const roleButton = screen.getByLabelText(/Phân quyền vai trò cho Lê Hoàng Nam/i);
    fireEvent.click(roleButton);

    // Modal xuất hiện
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Phân Quyền Vai Trò' })).toBeInTheDocument();
    });

    // Chọn vai trò HR
    const hrRadio = screen.getByLabelText(/Nhân sự \(HR\)/i);
    fireEvent.click(hrRadio);

    // Bấm nút Cập nhật vai trò
    const submitButton = screen.getByRole('button', { name: /Cập nhật vai trò/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateRoleSpy).toHaveBeenCalledWith('acc-002', { role: 'HR' });
      // Modal đóng lại
      expect(screen.queryByRole('heading', { name: 'Phân Quyền Vai Trò' })).not.toBeInTheDocument();
      // Hiển thị thông báo thành công
      expect(screen.getByText('Cập nhật vai trò người dùng thành công.')).toBeInTheDocument();
    });
  });

  it('11. Mở modal xác nhận Khóa tài khoản và thực hiện thành công (TKNHTTDNB1-161)', async () => {
    vi.spyOn(accountService, 'getAccounts').mockResolvedValue(MOCK_RESPONSE);
    const updateStatusSpy = vi.spyOn(accountService, 'updateAccountStatus').mockResolvedValueOnce({
      success: true,
      data: {
        ...MOCK_RESPONSE.data[0],
        status: 'LOCKED',
      },
      message: 'Khóa tài khoản thành công.',
    });

    renderAccountList();

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    // Bấm nút Khóa tài khoản của Nguyễn Văn An (hiện tại ACTIVE)
    const lockButton = screen.getByLabelText('Khóa tài khoản Nguyễn Văn An');
    fireEvent.click(lockButton);

    // Modal xác nhận xuất hiện
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Khóa Tài Khoản' })).toBeInTheDocument();
    });

    // Kiểm tra thông tin tài khoản hiển thị trong modal
    expect(screen.getByText('Mã tài khoản: acc-001')).toBeInTheDocument();
    expect(screen.getAllByText('an.nguyen@company.com').length).toBeGreaterThanOrEqual(2);

    // Bấm nút Xác nhận khóa
    const confirmButton = screen.getByRole('button', { name: 'Xác nhận khóa' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(updateStatusSpy).toHaveBeenCalledWith('acc-001', { status: 'LOCKED' });
      // Modal đóng lại
      expect(screen.queryByRole('heading', { name: 'Khóa Tài Khoản' })).not.toBeInTheDocument();
      // Hiển thị thông báo thành công
      expect(screen.getByText('Khóa tài khoản thành công.')).toBeInTheDocument();
    });
  });

  it('12. Chặn tự khóa tài khoản của chính quản trị viên đang đăng nhập (TKNHTTDNB1-161)', async () => {
    // Giả lập admin đăng nhập có ID trùng với Nguyễn Văn An (acc-001)
    const selfAdmin: AuthUser = {
      id: 'acc-001',
      name: 'Nguyễn Văn An',
      role: 'ADMIN',
      permissions: ['ADMIN'],
    };

    vi.spyOn(accountService, 'getAccounts').mockResolvedValue(MOCK_RESPONSE);

    renderAccountList(selfAdmin);

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
    });

    // Bấm nút Khóa tài khoản của chính mình
    const lockButton = screen.getByLabelText('Khóa tài khoản Nguyễn Văn An');
    fireEvent.click(lockButton);

    // Modal hiển thị cảnh báo chặn hành động
    await waitFor(() => {
      expect(screen.getByText('Hành động bị chặn')).toBeInTheDocument();
      expect(
        screen.getByText(/Hệ thống không cho phép người quản trị tự khóa tài khoản của chính mình/i)
      ).toBeInTheDocument();
    });

    // Nút xác nhận bị disable
    const confirmButton = screen.getByRole('button', { name: 'Xác nhận khóa' });
    expect(confirmButton).toBeDisabled();
  });
});
