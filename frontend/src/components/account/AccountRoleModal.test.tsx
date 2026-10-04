import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountRoleModal } from './AccountRoleModal';
import { accountService } from '../../services/accountService';
import { AuthProvider } from '../../context/AuthProvider';
import type { AuthUser } from '../../context/AuthContext';
import type { Account } from '../../types/account';

const MOCK_ACCOUNT: Account = {
  id: 'acc-001',
  fullName: 'Trần Thị Thu',
  email: 'thu.tran@company.com',
  role: 'EMPLOYEE',
  status: 'ACTIVE',
  createdAt: '2026-02-10T08:00:00Z',
  lastLoginAt: '2026-09-20T10:00:00Z',
};

const MOCK_ADMIN: AuthUser = {
  id: 'admin-001',
  name: 'Quản trị viên',
  role: 'ADMIN',
  permissions: ['ADMIN'],
};

describe('Component AccountRoleModal (TKNHTTDNB1-152)', () => {
  const onCloseMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Không hiển thị modal khi isOpen = false hoặc account = null', () => {
    const { container: c1 } = render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountRoleModal
          isOpen={false}
          account={MOCK_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountRoleModal
          isOpen={true}
          account={null}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );
    expect(c2.firstChild).toBeNull();
  });

  it('2. Hiển thị thông tin tài khoản và danh sách các vai trò chuẩn', () => {
    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountRoleModal
          isOpen={true}
          account={MOCK_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    // Tiêu đề và thông tin tài khoản
    expect(screen.getByRole('heading', { name: 'Phân Quyền Vai Trò' })).toBeInTheDocument();
    expect(screen.getByText('Trần Thị Thu')).toBeInTheDocument();
    expect(screen.getByText(/thu\.tran@company\.com/i)).toBeInTheDocument();

    // Các vai trò hệ thống
    expect(screen.getByText('Quản trị viên (ADMIN)')).toBeInTheDocument();
    expect(screen.getByText('Nhân sự (HR)')).toBeInTheDocument();
    expect(screen.getByText('Phỏng vấn viên (INTERVIEWER)')).toBeInTheDocument();
    expect(screen.getByText('Nhân viên (EMPLOYEE)')).toBeInTheDocument();

    // Nhãn "Hiện tại" trên vai trò EMPLOYEE
    expect(screen.getByText('Hiện tại')).toBeInTheDocument();
  });

  it('3. Hiển thị cảnh báo khi tài khoản đang thao tác là chính quản trị viên đăng nhập', () => {
    const selfUser: AuthUser = {
      id: 'acc-001',
      name: 'Trần Thị Thu',
      role: 'ADMIN',
      permissions: ['ADMIN'],
    };

    render(
      <AuthProvider user={selfUser}>
        <AccountRoleModal
          isOpen={true}
          account={MOCK_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    expect(screen.getByText('Cảnh báo quan trọng')).toBeInTheDocument();
    expect(
      screen.getByText(/Bạn đang thay đổi vai trò của chính tài khoản đang đăng nhập/i)
    ).toBeInTheDocument();
  });

  it('4. Cập nhật vai trò mới thành công qua API và kích hoạt onSuccess', async () => {
    const updateRoleSpy = vi.spyOn(accountService, 'updateAccountRole').mockResolvedValueOnce({
      success: true,
      data: {
        ...MOCK_ACCOUNT,
        role: 'HR',
      },
      message: 'Đã cập nhật vai trò người dùng thành HR.',
    });

    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountRoleModal
          isOpen={true}
          account={MOCK_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    // Chọn vai trò HR
    const hrRadio = screen.getByLabelText(/Nhân sự \(HR\)/i);
    fireEvent.click(hrRadio);

    // Nút submit được bật
    const submitBtn = screen.getByRole('button', { name: /Cập nhật vai trò/i });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateRoleSpy).toHaveBeenCalledWith('acc-001', { role: 'HR' });
      expect(onSuccessMock).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'HR' }),
        'Đã cập nhật vai trò người dùng thành HR.'
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('5. Hiển thị thông báo lỗi khi API thất bại và không đóng modal', async () => {
    vi.spyOn(accountService, 'updateAccountRole').mockRejectedValueOnce(
      new Error('Bạn không có quyền thay đổi vai trò này.')
    );

    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountRoleModal
          isOpen={true}
          account={MOCK_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    // Đổi sang ADMIN
    const adminRadio = screen.getByLabelText(/Quản trị viên \(ADMIN\)/i);
    fireEvent.click(adminRadio);

    const submitBtn = screen.getByRole('button', { name: /Cập nhật vai trò/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Bạn không có quyền thay đổi vai trò này.')).toBeInTheDocument();
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  it('6. Đóng modal khi bấm nút Hủy bỏ hoặc icon X', () => {
    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountRoleModal
          isOpen={true}
          account={MOCK_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    const cancelBtn = screen.getByRole('button', { name: 'Hủy bỏ' });
    fireEvent.click(cancelBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    const closeIconBtn = screen.getByLabelText('Đóng form phân quyền vai trò');
    fireEvent.click(closeIconBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });
});
