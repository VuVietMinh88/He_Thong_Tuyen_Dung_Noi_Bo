import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from 'lucide-react';

// Interface định nghĩa dữ liệu form cho chức năng đổi mật khẩu.
interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface định nghĩa lỗi validation từng trường.
interface ChangePasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  submit?: string;
}

// Kiểu trạng thái của trang để hiển thị loading hoặc thành công.
type PageStatus = 'idle' | 'loading' | 'success' | 'error';

// Hàm kiểm tra mật khẩu mới theo đúng tiêu chí bảo mật yêu cầu.
// Mật khẩu phải có ít nhất 8 ký tự, có cả chữ và số.
const validateNewPassword = (value: string): string | undefined => {
  if (!value.trim()) {
    return 'Mật khẩu mới không được để trống.';
  }

  if (value.length < 8) {
    return 'Mật khẩu mới phải có ít nhất 8 ký tự.';
  }

  // Kiểm tra phải có ít nhất 1 chữ cái và 1 chữ số để đảm bảo độ an toàn.
  const hasLetter: boolean = /[a-zA-Z]/.test(value);
  const hasNumber: boolean = /\d/.test(value);

  if (!hasLetter || !hasNumber) {
    return 'Mật khẩu mới phải chứa cả chữ và số.';
  }

  return undefined;
};

export const ChangePasswordPage: React.FC = () => {
  // State quản lý dữ liệu nhập từ người dùng.
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State quản lý trạng thái hiển thị mật khẩu từng trường.
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // State quản lý thông báo lỗi và trạng thái submit.
  const [errors, setErrors] = useState<ChangePasswordFormErrors>({});
  const [pageStatus, setPageStatus] = useState<PageStatus>('idle');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Hàm cập nhật state khi người dùng nhập liệu.
  const handleInputChange = (field: keyof ChangePasswordFormData) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextValue: string = event.target.value;

    setFormData((previousData: ChangePasswordFormData) => ({
      ...previousData,
      [field]: nextValue,
    }));

    // Xóa lỗi cũ của trường đó ngay khi người dùng bắt đầu sửa.
    setErrors((previousErrors: ChangePasswordFormErrors) => ({
      ...previousErrors,
      [field]: undefined,
      submit: undefined,
    }));
  };

  // Hàm validate form trước khi submit.
  const validateForm = (): ChangePasswordFormErrors => {
    const nextErrors: ChangePasswordFormErrors = {};

    if (!formData.currentPassword.trim()) {
      nextErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    }

    const newPasswordError: string | undefined = validateNewPassword(formData.newPassword);
    if (newPasswordError) {
      nextErrors.newPassword = newPasswordError;
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
    } else if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = 'Xác nhận mật khẩu không khớp với mật khẩu mới.';
    }

    return nextErrors;
  };

  // Hàm xử lý submit đổi mật khẩu.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors: ChangePasswordFormErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPageStatus('error');
      setSuccessMessage('');
      return;
    }

    setPageStatus('loading');
    setSuccessMessage('');

    try {
      // Giả lập API đổi mật khẩu trong 1.2 giây để hiển thị trạng thái loading thực tế.
      await new Promise<void>((resolve: () => void) => {
        window.setTimeout(resolve, 1200);
      });

      // Mô phỏng trường hợp sai mật khẩu hiện tại để kiểm tra thông báo thất bại.
      // Trong môi trường API thật, đây sẽ thay bằng response từ backend.
      if (formData.currentPassword !== '12345678') {
        throw new Error('CURRENT_PASSWORD_INCORRECT');
      }

      setPageStatus('success');
      setSuccessMessage('Đổi mật khẩu thành công. Vui lòng đăng nhập lại với mật khẩu mới.');

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      setPageStatus('error');

      if (error instanceof Error && error.message === 'CURRENT_PASSWORD_INCORRECT') {
        setErrors({
          submit: 'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại.',
        });
      } else {
        setErrors({
          submit: 'Đổi mật khẩu thất bại. Vui lòng thử lại sau.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-10 text-slate-800">
      <div className="w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#0f766e]">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
            Đổi mật khẩu
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Vui lòng cập nhật mật khẩu mới để bảo vệ tài khoản của bạn.
          </p>
        </div>

        {pageStatus === 'success' && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="leading-relaxed">{successMessage}</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Trường mật khẩu hiện tại */}
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="block text-xs font-semibold text-slate-600">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                disabled={pageStatus === 'loading'}
                className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all disabled:bg-slate-50 ${
                  errors.currentPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20'
                }`}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((previousValue: boolean) => !previousValue)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs font-medium text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          {/* Trường mật khẩu mới */}
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-600">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                disabled={pageStatus === 'loading'}
                className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all disabled:bg-slate-50 ${
                  errors.newPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20'
                }`}
                placeholder="Ít nhất 8 ký tự, có chữ và số"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((previousValue: boolean) => !previousValue)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs font-medium text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Trường xác nhận mật khẩu mới */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-600">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                disabled={pageStatus === 'loading'}
                className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all disabled:bg-slate-50 ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20'
                }`}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((previousValue: boolean) => !previousValue)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pageStatus === 'loading'}
            className="flex w-full items-center justify-center rounded-lg bg-[#0f766e] px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pageStatus === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              'Đổi mật khẩu'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
