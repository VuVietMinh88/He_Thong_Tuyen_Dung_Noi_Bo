import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountStatusConfirmModal } from './AccountStatusConfirmModal';
import { accountService } from '../../services/accountService';
import { AuthProvider } from '../../context/AuthProvider';
import type { AuthUser } from '../../context/AuthContext';
import type { Account } from '../../types/account';

const MOCK_ACTIVE_ACCOUNT: Account = {
  id: 'acc-active',
  fullName: 'Phạm Minh Tuấn',
  email: 'tuan.pham@company.com',
  role: 'HR',
  status: 'ACTIVE',
  createdAt: '2026-03-01T08:00:00Z',
  lastLoginAt: '2026-10-02T15:00:00Z',
};

const MOCK_LOCKED_ACCOUNT: Account = {
  id: 'acc-locked',
  fullName: 'Đỗ Văn Khoa',
  email: 'khoa.do@company.com',
  role: 'EMPLOYEE',
  status: 'LOCKED',
  createdAt: '2026-01-10T08:00:00Z',
  lastLoginAt: '2026-07-15T12:00:00Z',
};

const MOCK_ADMIN: AuthUser = {
  id: 'admin-root',
  name: 'Quản trị viên trưởng',
  role: 'ADMIN',
  permissions: ['ADMIN'],
};

describe('Component AccountStatusConfirmModal (TKNHTTDNB1-161 & TKNHTTDNB1-160)', () => {
  const onCloseMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Không hiển thị modal khi isOpen = false hoặc account = null', () => {
    const { container: c1 } = render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={false}
          account={MOCK_ACTIVE_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={null}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );
    expect(c2.firstChild).toBeNull();
  });

  it('2. Hiển thị chính xác giao diện Khóa tài khoản khi tài khoản đang ACTIVE', () => {
    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={MOCK_ACTIVE_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    // Tiêu đề
    expect(screen.getByRole('heading', { name: 'Khóa Tài Khoản' })).toBeInTheDocument();
    expect(screen.getByText('Mã tài khoản: acc-active')).toBeInTheDocument();
    expect(screen.getByText('Phạm Minh Tuấn')).toBeInTheDocument();
    expect(screen.getByText('tuan.pham@company.com')).toBeInTheDocument();

    // Huy hiệu trạng thái tái sử dụng từ AccountStatusBadge (TKNHTTDNB1-160)
    expect(screen.getByTestId('status-badge-active')).toBeInTheDocument();

    // Cảnh báo hạn chế truy cập
    expect(screen.getByText('Cảnh báo hạn chế truy cập')).toBeInTheDocument();

    // Nút xác nhận khóa
    expect(screen.getByRole('button', { name: 'Xác nhận khóa' })).toBeInTheDocument();
  });

  it('3. Hiển thị chính xác giao diện Mở khóa tài khoản khi tài khoản đang LOCKED', () => {
    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={MOCK_LOCKED_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    // Tiêu đề
    expect(screen.getByRole('heading', { name: 'Mở khóa Tài Khoản' })).toBeInTheDocument();
    expect(screen.getByText('Mã tài khoản: acc-locked')).toBeInTheDocument();
    expect(screen.getByText('Đỗ Văn Khoa')).toBeInTheDocument();

    // Huy hiệu trạng thái tái sử dụng từ AccountStatusBadge (TKNHTTDNB1-160)
    expect(screen.getByTestId('status-badge-locked')).toBeInTheDocument();

    // Thông tin khôi phục truy cập
    expect(screen.getByText('Khôi phục quyền truy cập')).toBeInTheDocument();

    // Nút xác nhận mở khóa
    expect(screen.getByRole('button', { name: 'Xác nhận mở khóa' })).toBeInTheDocument();
  });

  it('4. Khóa tài khoản thành công qua API và kích hoạt onSuccess', async () => {
    const updateSpy = vi.spyOn(accountService, 'updateAccountStatus').mockResolvedValueOnce({
      success: true,
      data: {
        ...MOCK_ACTIVE_ACCOUNT,
        status: 'LOCKED',
      },
      message: 'Khóa tài khoản thành công.',
    });

    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={MOCK_ACTIVE_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    const confirmBtn = screen.getByRole('button', { name: 'Xác nhận khóa' });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('acc-active', { status: 'LOCKED' });
      expect(onSuccessMock).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'LOCKED' }),
        'Khóa tài khoản thành công.'
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('5. Mở khóa tài khoản thành công qua API và kích hoạt onSuccess', async () => {
    const updateSpy = vi.spyOn(accountService, 'updateAccountStatus').mockResolvedValueOnce({
      success: true,
      data: {
        ...MOCK_LOCKED_ACCOUNT,
        status: 'ACTIVE',
      },
      message: 'Mở khóa tài khoản thành công.',
    });

    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={MOCK_LOCKED_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    const confirmBtn = screen.getByRole('button', { name: 'Xác nhận mở khóa' });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('acc-locked', { status: 'ACTIVE' });
      expect(onSuccessMock).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'ACTIVE' }),
        'Mở khóa tài khoản thành công.'
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('6. Chặn người dùng tự khóa tài khoản của chính mình', () => {
    // Tài khoản admin đăng nhập trùng với tài khoản mục tiêu
    const selfAdmin: AuthUser = {
      id: 'acc-active',
      name: 'Phạm Minh Tuấn',
      role: 'ADMIN',
      permissions: ['ADMIN'],
    };

    render(
      <AuthProvider user={selfAdmin}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={MOCK_ACTIVE_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    // Cảnh báo chặn hành động
    expect(screen.getByText('Hành động bị chặn')).toBeInTheDocument();
    expect(
      screen.getByText(/Hệ thống không cho phép người quản trị tự khóa tài khoản của chính mình/i)
    ).toBeInTheDocument();

    // Nút xác nhận bị vô hiệu hóa
    const confirmBtn = screen.getByRole('button', { name: 'Xác nhận khóa' });
    expect(confirmBtn).toBeDisabled();
  });

  it('7. Hiển thị thông báo lỗi khi API thất bại và không đóng modal', async () => {
    vi.spyOn(accountService, 'updateAccountStatus').mockRejectedValueOnce(
      new Error('Lỗi máy chủ nội bộ (500).')
    );

    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={MOCK_ACTIVE_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    const confirmBtn = screen.getByRole('button', { name: 'Xác nhận khóa' });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Lỗi máy chủ nội bộ (500).')).toBeInTheDocument();
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  it('8. Đóng modal khi bấm Hủy bỏ hoặc nút X', () => {
    render(
      <AuthProvider user={MOCK_ADMIN}>
        <AccountStatusConfirmModal
          isOpen={true}
          account={MOCK_ACTIVE_ACCOUNT}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      </AuthProvider>
    );

    const cancelBtn = screen.getByRole('button', { name: 'Hủy bỏ' });
    fireEvent.click(cancelBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    const closeIconBtn = screen.getByLabelText('Đóng hộp thoại xác nhận');
    fireEvent.click(closeIconBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });
});
