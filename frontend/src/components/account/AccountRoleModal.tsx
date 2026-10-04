import React, { useState, useEffect, useCallback } from 'react';
import { X, Shield, CheckCircle2, RefreshCw, AlertCircle, AlertTriangle } from 'lucide-react';
import type { Account, AccountRole } from '../../types/account';
import { AVAILABLE_ROLES } from '../../types/account';
import { accountService } from '../../services/accountService';
import { useAuth } from '../../context/AuthContext';

// Định nghĩa giao diện thuộc tính (Props) cho modal phân quyền vai trò
export interface AccountRoleModalProps {
  isOpen: boolean;
  account: Account | null;
  onClose: () => void;
  onSuccess: (updatedAccount: Account, message: string) => void;
}

/**
 * Component Modal Quản lý và Phân quyền Vai trò người dùng (Story TKNHTTDNB1-152).
 * Cho phép Quản trị viên xem vai trò hiện tại và gán vai trò mới theo danh mục vai trò chuẩn của hệ thống.
 */
export const AccountRoleModal: React.FC<AccountRoleModalProps> = ({
  isOpen,
  account,
  onClose,
  onSuccess,
}) => {
  // Lấy thông tin người dùng đang đăng nhập để kiểm tra nghiệp vụ tự đổi quyền
  const { user: currentUser } = useAuth();

  // Vai trò được chọn trong form
  const [selectedRole, setSelectedRole] = useState<AccountRole>('EMPLOYEE');

  // Trạng thái lưu trữ mã ID tài khoản trước đó để đồng bộ state khi prop thay đổi
  const [prevAccountId, setPrevAccountId] = useState<string | number | null>(null);

  // Trạng thái đang gửi yêu cầu lên API
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Thông báo lỗi nếu có
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Đồng bộ state trực tiếp khi render (theo chuẩn React 19 để tránh cascading render)
  if (isOpen && account && account.id !== prevAccountId) {
    setPrevAccountId(account.id);
    setSelectedRole(account.role || 'EMPLOYEE');
    setIsSubmitting(false);
    setErrorMessage('');
  } else if (!isOpen && prevAccountId !== null) {
    setPrevAccountId(null);
  }

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

  if (!isOpen || !account) {
    return null;
  }

  // Kiểm tra xem đây có phải tài khoản của chính người dùng đang đăng nhập hay không
  const isSelf = currentUser && String(currentUser.id) === String(account.id);

  /**
   * Xử lý xác nhận lưu thay đổi vai trò
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Nếu không thay đổi gì so với vai trò hiện tại, đóng modal
    if (selectedRole === account.role) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await accountService.updateAccountRole(account.id, {
        role: selectedRole,
      });

      if (response && response.data) {
        onSuccess(
          response.data,
          response.message || `Đã cập nhật vai trò tài khoản thành ${selectedRole}.`
        );
        onClose();
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ máy chủ.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Không thể cập nhật vai trò, vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-role-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all duration-200 scale-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="manage-role-modal-title"
                className="text-base font-bold text-slate-900 tracking-tight"
              >
                Phân Quyền Vai Trò
              </h2>
              <p className="text-xs text-slate-500">
                Tài khoản: <span className="font-semibold text-slate-800">{account.fullName}</span> ({account.email})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng form phân quyền vai trò"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông báo cảnh báo nếu đang thao tác trên tài khoản của chính mình */}
        {isSelf && (
          <div
            role="status"
            className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="flex-1">
              <p className="font-semibold">Cảnh báo quan trọng</p>
              <p className="mt-0.5 leading-relaxed">
                Bạn đang thay đổi vai trò của chính tài khoản đang đăng nhập. Hãy cẩn trọng để không tự tước quyền quản trị của mình.
              </p>
            </div>
          </div>
        )}

        {/* Thông báo lỗi từ server nếu có */}
        {errorMessage && (
          <div
            role="alert"
            className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <p className="font-semibold">Thao tác không thành công</p>
              <p className="mt-0.5 text-rose-600 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form lựa chọn vai trò */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Chọn vai trò áp dụng cho tài khoản:
            </label>

            {/* Danh sách các vai trò dạng Radio Card */}
            <div className="space-y-2.5">
              {AVAILABLE_ROLES.map((roleOpt) => {
                const isChecked = selectedRole === roleOpt.value;
                const isCurrentRole = account.role === roleOpt.value;

                return (
                  <label
                    key={roleOpt.value}
                    htmlFor={`role-option-${roleOpt.value}`}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-purple-500 bg-purple-50/50 shadow-2xs ring-1 ring-purple-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      id={`role-option-${roleOpt.value}`}
                      type="radio"
                      name="accountRole"
                      value={roleOpt.value}
                      checked={isChecked}
                      disabled={isSubmitting}
                      onChange={() => setSelectedRole(roleOpt.value)}
                      className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                    />

                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{roleOpt.label}</span>
                        {isCurrentRole && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 mt-1 leading-relaxed">{roleOpt.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cụm nút bấm thao tác */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting || selectedRole === account.role}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 border border-transparent rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cập nhật vai trò</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
