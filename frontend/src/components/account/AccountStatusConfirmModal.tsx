import React, { useState, useEffect, useCallback } from 'react';
import { X, Lock, Unlock, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { Account, AccountStatus } from '../../types/account';
import { accountService } from '../../services/accountService';
import { AccountStatusBadge } from './AccountStatusBadge';
import { useAuth } from '../../context/AuthContext';

// Định nghĩa giao diện thuộc tính (Props) cho modal xác nhận thay đổi trạng thái tài khoản
export interface AccountStatusConfirmModalProps {
  isOpen: boolean;
  account: Account | null;
  onClose: () => void;
  onSuccess: (updatedAccount: Account, message: string) => void;
}

/**
 * Component Modal Xác nhận Khóa / Mở khóa tài khoản (Story TKNHTTDNB1-161).
 * Tái sử dụng AccountStatusBadge (TKNHTTDNB1-160), kiểm tra an toàn không cho phép tự khóa tài khoản của chính mình,
 * và hiển thị cảnh báo chi tiết trước khi xác nhận.
 */
export const AccountStatusConfirmModal: React.FC<AccountStatusConfirmModalProps> = ({
  isOpen,
  account,
  onClose,
  onSuccess,
}) => {
  // Lấy thông tin tài khoản đang đăng nhập để ngăn chặn tự khóa tài khoản
  const { user: currentUser } = useAuth();

  // Trạng thái đang gửi yêu cầu lên server
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Thông báo lỗi nếu API thất bại
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Trạng thái lưu trữ mã ID tài khoản trước đó để đồng bộ state khi prop thay đổi
  const [prevAccountId, setPrevAccountId] = useState<string | number | null>(null);

  // Đồng bộ state trực tiếp khi render (theo chuẩn React 19 để tránh cascading render)
  if (isOpen && account && account.id !== prevAccountId) {
    setPrevAccountId(account.id);
    setIsSubmitting(false);
    setErrorMessage('');
  } else if (!isOpen && prevAccountId !== null) {
    setPrevAccountId(null);
  }

  // Lắng nghe phím Escape để đóng modal khi không bận
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

  // Xác định trạng thái hiện tại và trạng thái mục tiêu sau khi thực hiện
  const isCurrentlyLocked: boolean = account.status?.toUpperCase() === 'LOCKED';
  const targetStatus: AccountStatus = isCurrentlyLocked ? 'ACTIVE' : 'LOCKED';
  const actionText: string = isCurrentlyLocked ? 'Mở khóa' : 'Khóa';

  // Kiểm tra an toàn: Người dùng không được phép tự khóa tài khoản của chính mình
  const isSelfLock: boolean = !isCurrentlyLocked && currentUser !== null && String(currentUser.id) === String(account.id);

  /**
   * Xử lý xác nhận thay đổi trạng thái tài khoản
   */
  const handleConfirm = async (): Promise<void> => {
    if (isSelfLock) {
      setErrorMessage('Bạn không thể tự khóa tài khoản của chính mình đang đăng nhập.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await accountService.updateAccountStatus(account.id, {
        status: targetStatus,
      });

      if (response && response.data) {
        onSuccess(
          response.data,
          response.message || `${actionText} tài khoản thành công.`
        );
        onClose();
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ máy chủ.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Không thể thay đổi trạng thái tài khoản, vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all duration-200 scale-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isCurrentlyLocked
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {isCurrentlyLocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2
                id="status-confirm-modal-title"
                className="text-base font-bold text-slate-900 tracking-tight"
              >
                {actionText} Tài Khoản
              </h2>
              <p className="text-xs text-slate-500">Mã tài khoản: {account.id}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại xác nhận"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung thông tin tài khoản và cảnh báo */}
        <div className="p-6 space-y-4 text-xs">
          {/* Hộp tóm tắt thông tin tài khoản */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Họ và tên:</span>
              <span className="font-bold text-slate-900">{account.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-semibold text-slate-700">{account.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Trạng thái hiện tại:</span>
              <AccountStatusBadge status={account.status} />
            </div>
          </div>

          {/* Cảnh báo tác động nghiệp vụ */}
          {isSelfLock ? (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">Hành động bị chặn</p>
                <p className="mt-0.5 leading-relaxed">
                  Đây là tài khoản của bạn đang đăng nhập vào hệ thống. Hệ thống không cho phép người quản trị tự khóa tài khoản của chính mình để tránh mất quyền truy cập.
                </p>
              </div>
            </div>
          ) : isCurrentlyLocked ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-bold">Khôi phục quyền truy cập</p>
                <p className="mt-0.5 leading-relaxed">
                  Tài khoản này sẽ được mở khóa và người dùng có thể tiếp tục đăng nhập cũng như sử dụng các chức năng theo đúng vai trò đã cấp.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold">Cảnh báo hạn chế truy cập</p>
                <p className="mt-0.5 leading-relaxed">
                  Khi bị khóa, tài khoản này sẽ bị thu hồi phiên làm việc và không thể đăng nhập vào hệ thống cho đến khi được quản trị viên mở khóa.
                </p>
              </div>
            </div>
          )}

          {/* Thông báo lỗi nếu có */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <p className="leading-relaxed font-medium">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Chân trang Modal - Các nút bấm thao tác */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || isSelfLock}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white border border-transparent rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer ${
              isCurrentlyLocked
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : isCurrentlyLocked ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Xác nhận mở khóa</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Xác nhận khóa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
