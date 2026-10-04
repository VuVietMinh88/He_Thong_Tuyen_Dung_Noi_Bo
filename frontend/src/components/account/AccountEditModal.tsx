import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, User, Mail, Shield, AlertCircle, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import type { Account, AccountFormErrors, UpdateAccountRequest } from '../../types/account';
import { accountService } from '../../services/accountService';
import { AccountStatusBadge } from './AccountStatusBadge';

// Định nghĩa giao diện thuộc tính (Props) cho modal chỉnh sửa tài khoản
export interface AccountEditModalProps {
  isOpen: boolean;
  account: Account | null;
  onClose: () => void;
  onSuccess: (updatedAccount: Account, message: string) => void;
}

/**
 * Biểu thức chính quy kiểm tra định dạng email tiêu chuẩn
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Biểu thức chính quy kiểm tra họ tên hợp lệ (chữ cái tiếng Việt, dấu cách, gạch nối, dấu nháy đơn)
 * Không cho phép chữ số hoặc các ký tự đặc biệt như @#$%^&*()
 */
const FULL_NAME_REGEX = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s'-]+$/;

/**
 * Component Modal Form Chỉnh sửa thông tin tài khoản người dùng (Story TKNHTTDNB1-144).
 * Hỗ trợ hiển thị thông tin hiện tại, validate các trường dữ liệu, hiển thị lỗi chi tiết,
 * trạng thái loading khi lưu và đồng bộ kết quả về danh sách tài khoản.
 */
export const AccountEditModal: React.FC<AccountEditModalProps> = ({
  isOpen,
  account,
  onClose,
  onSuccess,
}) => {
  // Trạng thái dữ liệu nhập trên form
  const [formData, setFormData] = useState<UpdateAccountRequest>({
    fullName: '',
    email: '',
  });

  // Trạng thái lưu trữ mã ID tài khoản trước đó để đồng bộ form state trực tiếp khi props thay đổi
  const [prevAccountId, setPrevAccountId] = useState<string | number | null>(null);

  // Trạng thái lưu trữ lỗi validate của từng trường
  const [errors, setErrors] = useState<AccountFormErrors>({});

  // Trạng thái đang gửi yêu cầu cập nhật lên server
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Tham chiếu đến ô nhập Họ và tên để tự động focus khi mở modal
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ form state trực tiếp trong render khi tài khoản được chọn thay đổi (tránh cascading render trong effect)
  if (isOpen && account && account.id !== prevAccountId) {
    setPrevAccountId(account.id);
    setFormData({
      fullName: account.fullName || '',
      email: account.email || '',
    });
    setErrors({});
    setIsSubmitting(false);
  } else if (!isOpen && prevAccountId !== null) {
    setPrevAccountId(null);
  }

  // Tự động focus vào ô nhập đầu tiên sau khi modal xuất hiện
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fullNameInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lắng nghe phím Escape để đóng modal khi không trong trạng thái submitting
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    },
    [isSubmitting, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  // Không hiển thị modal nếu trạng thái isOpen = false hoặc chưa có dữ liệu tài khoản
  if (!isOpen || !account) {
    return null;
  }

  /**
   * Hàm kiểm tra tính hợp lệ của dữ liệu trước khi gửi lên API (Client-side Validation).
   * Trả về true nếu toàn bộ dữ liệu hợp lệ, false nếu có lỗi.
   */
  const validateForm = (): boolean => {
    const newErrors: AccountFormErrors = {};
    const trimmedFullName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();

    // 1. Kiểm tra trường Họ và tên
    if (!trimmedFullName) {
      newErrors.fullName = 'Họ và tên không được để trống.';
    } else if (trimmedFullName.length < 2) {
      newErrors.fullName = 'Họ và tên phải có tối thiểu 2 ký tự.';
    } else if (trimmedFullName.length > 100) {
      newErrors.fullName = 'Họ và tên không được vượt quá 100 ký tự.';
    } else if (!FULL_NAME_REGEX.test(trimmedFullName)) {
      newErrors.fullName = 'Họ và tên chỉ được chứa chữ cái tiếng Việt, không chứa số hoặc ký tự đặc biệt.';
    }

    // 2. Kiểm tra trường Email
    if (!trimmedEmail) {
      newErrors.email = 'Địa chỉ email không được để trống.';
    } else if (trimmedEmail.length > 100) {
      newErrors.email = 'Email không được vượt quá 100 ký tự.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Địa chỉ email không đúng định dạng (Ví dụ: ten@company.com).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Xử lý thay đổi dữ liệu trên từng ô nhập và tự động xóa lỗi của ô đó
   */
  const handleInputChange = (field: keyof UpdateAccountRequest, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Xóa thông báo lỗi của trường tương ứng khi người dùng bắt đầu nhập lại
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    }
  };

  /**
   * Xử lý gửi form cập nhật thông tin tài khoản
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Thực hiện validate toàn bộ dữ liệu trước khi gửi
    const isValid: boolean = validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: UpdateAccountRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      };

      const response = await accountService.updateAccount(account.id, payload);

      if (response && response.data) {
        onSuccess(
          response.data,
          response.message || 'Cập nhật thông tin tài khoản thành công.'
        );
        onClose();
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ máy chủ.');
      }
    } catch (err: unknown) {
      let message = 'Đã có lỗi xảy ra trong quá trình cập nhật tài khoản.';
      if (err instanceof Error) {
        message = err.message;
      }

      // Nếu lỗi chỉ rõ liên quan đến email (ví dụ trùng lặp)
      if (message.toLowerCase().includes('email')) {
        setErrors((prev) => ({
          ...prev,
          email: message,
          general: 'Vui lòng kiểm tra lại thông tin email đã nhập.',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: message,
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-account-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
    >
      {/* Khung nội dung chính của Modal */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all duration-200 scale-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00867D]/10 text-[#00867D] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="edit-account-modal-title"
                className="text-base font-bold text-slate-900 tracking-tight"
              >
                Chỉnh Sửa Tài Khoản
              </h2>
              <p className="text-xs text-slate-500">
                Mã tài khoản: <span className="font-mono font-semibold text-slate-700">{account.id}</span>
              </p>
            </div>
          </div>

          {/* Nút đóng modal */}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng form chỉnh sửa"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông báo lỗi chung từ Server nếu có */}
        {errors.general && (
          <div
            role="alert"
            className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <p className="font-semibold">Thao tác không thành công</p>
              <p className="mt-0.5 text-rose-600 leading-relaxed">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Form chỉnh sửa thông tin */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* Hàng thông tin hiện tại (Chỉ đọc - Readonly Information) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Thông tin hệ thống (Chỉ đọc)
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Vai trò hiện tại:</span>
                <span className="font-semibold text-slate-800 inline-flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  {account.role}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Trạng thái:</span>
                <div className="mt-0.5">
                  <AccountStatusBadge status={account.status} />
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200/50">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Vai trò và trạng thái tài khoản được quản lý ở các chức năng phân quyền chuyên biệt.</span>
            </div>
          </div>

          {/* Trường 1: Họ và tên */}
          <div className="space-y-1">
            <label
              htmlFor="edit-fullName"
              className="block text-xs font-semibold text-slate-700"
            >
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                ref={fullNameInputRef}
                id="edit-fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                placeholder="Nhập họ và tên đầy đủ..."
                className={`w-full pl-9 pr-3.5 py-2 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 ${
                  errors.fullName
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/70'
                    : 'border-slate-200 focus:border-[#00867D] focus:ring-2 focus:ring-[#00867D]/15'
                }`}
              />
            </div>
            {errors.fullName && (
              <p
                id="fullName-error"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Trường 2: Địa chỉ Email */}
          <div className="space-y-1">
            <label
              htmlFor="edit-email"
              className="block text-xs font-semibold text-slate-700"
            >
              Địa chỉ Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="ten.nguoidung@company.com"
                className={`w-full pl-9 pr-3.5 py-2 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 ${
                  errors.email
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/70'
                    : 'border-slate-200 focus:border-[#00867D] focus:ring-2 focus:ring-[#00867D]/15'
                }`}
              />
            </div>
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Chân trang Modal - Cụm nút bấm thao tác */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            {/* Nút Hủy */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy bỏ
            </button>

            {/* Nút Lưu thay đổi */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#00867D] hover:bg-[#00736B] border border-transparent rounded-lg shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
