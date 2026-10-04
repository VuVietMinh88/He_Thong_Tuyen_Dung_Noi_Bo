import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountEditModal } from './AccountEditModal';
import { accountService } from '../../services/accountService';
import type { Account } from '../../types/account';

const MOCK_ACCOUNT: Account = {
  id: 'acc-001',
  fullName: 'Nguyễn Văn An',
  email: 'an.nguyen@company.com',
  role: 'ADMIN',
  status: 'ACTIVE',
  createdAt: '2026-01-15T08:30:00Z',
  lastLoginAt: '2026-10-01T14:20:00Z',
};

describe('Component AccountEditModal (TKNHTTDNB1-144)', () => {
  const onCloseMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Không hiển thị modal khi isOpen = false', () => {
    const { container } = render(
      <AccountEditModal
        isOpen={false}
        account={MOCK_ACCOUNT}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('2. Hiển thị thông tin ban đầu của tài khoản khi mở form', () => {
    render(
      <AccountEditModal
        isOpen={true}
        account={MOCK_ACCOUNT}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    // Tiêu đề form và mã tài khoản
    expect(screen.getByRole('heading', { name: 'Chỉnh Sửa Tài Khoản' })).toBeInTheDocument();
    expect(screen.getByText('acc-001')).toBeInTheDocument();

    // Thông tin vai trò và trạng thái chỉ đọc
    expect(screen.getByText('ADMIN')).toBeInTheDocument();

    // Giá trị trong ô input
    const fullNameInput = screen.getByLabelText(/Họ và tên/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Địa chỉ Email/i) as HTMLInputElement;

    expect(fullNameInput.value).toBe('Nguyễn Văn An');
    expect(emailInput.value).toBe('an.nguyen@company.com');
  });

  it('3. Validate trường Họ và tên: báo lỗi khi để trống hoặc chứa ký tự đặc biệt', async () => {
    render(
      <AccountEditModal
        isOpen={true}
        account={MOCK_ACCOUNT}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    const updateSpy = vi.spyOn(accountService, 'updateAccount');
    const fullNameInput = screen.getByLabelText(/Họ và tên/i);
    const submitButton = screen.getByRole('button', { name: /Lưu thay đổi/i });

    // Xóa trắng ô họ và tên
    await userEvent.clear(fullNameInput);
    fireEvent.click(submitButton);

    expect(await screen.findByText('Họ và tên không được để trống.')).toBeInTheDocument();
    expect(updateSpy).not.toHaveBeenCalled();

    // Nhập họ và tên có ký tự đặc biệt/số
    await userEvent.type(fullNameInput, 'Nguyễn Văn An 123 @#');
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(
        'Họ và tên chỉ được chứa chữ cái tiếng Việt, không chứa số hoặc ký tự đặc biệt.'
      )
    ).toBeInTheDocument();
  });

  it('4. Validate trường Email: báo lỗi khi để trống hoặc sai định dạng', async () => {
    render(
      <AccountEditModal
        isOpen={true}
        account={MOCK_ACCOUNT}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    const emailInput = screen.getByLabelText(/Địa chỉ Email/i);
    const submitButton = screen.getByRole('button', { name: /Lưu thay đổi/i });

    // Xóa trắng email
    await userEvent.clear(emailInput);
    fireEvent.click(submitButton);

    expect(await screen.findByText('Địa chỉ email không được để trống.')).toBeInTheDocument();

    // Nhập email sai định dạng
    await userEvent.type(emailInput, 'email-sai-dinh-dang');
    fireEvent.click(submitButton);

    expect(
      await screen.findByText('Địa chỉ email không đúng định dạng (Ví dụ: ten@company.com).')
    ).toBeInTheDocument();
  });

  it('5. Đóng modal khi nhấn nút Hủy bỏ hoặc phím Escape', () => {
    render(
      <AccountEditModal
        isOpen={true}
        account={MOCK_ACCOUNT}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Hủy bỏ' });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    // Nhấn phím Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });

  it('6. Gọi API updateAccount thành công và trả kết quả qua onSuccess', async () => {
    const updatedAccount: Account = {
      ...MOCK_ACCOUNT,
      fullName: 'Nguyễn Văn An Cập Nhật',
      email: 'an.updated@company.com',
    };

    vi.spyOn(accountService, 'updateAccount').mockResolvedValueOnce({
      success: true,
      data: updatedAccount,
      message: 'Cập nhật thông tin tài khoản thành công.',
    });

    render(
      <AccountEditModal
        isOpen={true}
        account={MOCK_ACCOUNT}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    const fullNameInput = screen.getByLabelText(/Họ và tên/i);
    const emailInput = screen.getByLabelText(/Địa chỉ Email/i);
    const submitButton = screen.getByRole('button', { name: /Lưu thay đổi/i });

    await userEvent.clear(fullNameInput);
    await userEvent.type(fullNameInput, 'Nguyễn Văn An Cập Nhật');

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'an.updated@company.com');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(accountService.updateAccount).toHaveBeenCalledWith('acc-001', {
        fullName: 'Nguyễn Văn An Cập Nhật',
        email: 'an.updated@company.com',
      });
      expect(onSuccessMock).toHaveBeenCalledWith(
        updatedAccount,
        'Cập nhật thông tin tài khoản thành công.'
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('7. Hiển thị thông báo lỗi khi API trả về thất bại', async () => {
    vi.spyOn(accountService, 'updateAccount').mockRejectedValueOnce(
      new Error('Email đã được sử dụng bởi một tài khoản khác trong hệ thống.')
    );

    render(
      <AccountEditModal
        isOpen={true}
        account={MOCK_ACCOUNT}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Lưu thay đổi/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Email đã được sử dụng bởi một tài khoản khác trong hệ thống.')
      ).toBeInTheDocument();
    });

    // Form không bị đóng khi xảy ra lỗi
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});
