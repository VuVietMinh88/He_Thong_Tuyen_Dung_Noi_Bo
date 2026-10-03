import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Mail, ShieldCheck } from 'lucide-react';

// Interface định nghĩa dữ liệu form cho chức năng quên mật khẩu.
interface ForgotPasswordFormData {
  email: string;
}

// Interface định nghĩa lỗi validation của form.
interface ForgotPasswordFormErrors {
  email?: string;
}

// Kiểu trạng thái của trang để hiển thị loading/success/error.
type PageStatus = 'idle' | 'loading' | 'success' | 'error';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // State quản lý dữ liệu nhập liệu và lỗi validation.
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [pageStatus, setPageStatus] = useState<PageStatus>('idle');
  const [message, setMessage] = useState<string>('');

  // Hàm validate email theo định dạng cơ bản.
  const validateEmail = (email: string): string | undefined => {
    const trimmedEmail: string = email.trim();
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      return 'Vui lòng nhập email đã đăng ký.';
    }

    if (!emailRegex.test(trimmedEmail)) {
      return 'Email không hợp lệ. Vui lòng kiểm tra lại.';
    }

    return undefined;
  };

  // Hàm xử lý thay đổi input email.
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    setFormData((previousFormData: ForgotPasswordFormData) => ({
      ...previousFormData,
      email: value,
    }));

    if (errors.email) {
      setErrors((previousErrors: ForgotPasswordFormErrors) => ({
        ...previousErrors,
        email: undefined,
      }));
    }
  };

  // Hàm xử lý submit form khi người dùng gửi yêu cầu khôi phục mật khẩu.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors: ForgotPasswordFormErrors = {};
    const emailError: string | undefined = validateEmail(formData.email);

    if (emailError) {
      nextErrors.email = emailError;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPageStatus('error');
      setMessage('Thông tin chưa hợp lệ. Vui lòng kiểm tra lại email.');
      return;
    }

    setPageStatus('loading');
    setMessage('');

    try {
      // Giả lập thời gian gửi yêu cầu API trong 1.2 giây để có hiệu ứng loading thực tế.
      await new Promise<void>((resolve: () => void) => {
        window.setTimeout(resolve, 1200);
      });

      setPageStatus('success');
      setMessage('Mã xác nhận đã được gửi thành công. Vui lòng kiểm tra hộp thư của bạn.');

      // Chuyển hướng người dùng sang trang nhập mã hoặc bước tiếp theo sau khi gửi thành công.
      window.setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(formData.email.trim())}`);
      }, 1200);
    } catch (error: unknown) {
      setPageStatus('error');
      setMessage('Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.');
      console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-slate-800">
      {/* Cột trái: banner thương hiệu, đồng bộ với trang Login để tạo trải nghiệm thống nhất. */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f766e] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="bg-teal-800/20 p-2 rounded-2xl mb-8 backdrop-blur-sm">
          <img
            src="/office_illustration.jpg"
            alt="Office Team"
            className="w-full max-w-[500px] h-auto rounded-xl object-cover shadow-2xl"
            onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
              const target: HTMLImageElement = event.currentTarget;
              target.src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop';
            }}
          />
        </div>

        <h2 className="text-3xl font-extrabold tracking-wide text-white uppercase drop-shadow-md">
          PHÁT TRIỂN NỘI BỘ
        </h2>
      </div>

      {/* Cột phải: form quên mật khẩu với giao diện hiện đại và thân thiện. */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-[#0f766e]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-1">
              Khôi phục mật khẩu
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Nhập email đã đăng ký để nhận mã xác nhận khôi phục tài khoản.
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-3 rounded-lg flex items-start gap-2.5 text-sm font-medium ${
                pageStatus === 'success'
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                  : 'bg-red-50 border border-red-100 text-red-600'
              }`}
            >
              {pageStatus === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600">
                Email đã đăng ký
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={pageStatus === 'loading'}
                  className={`block w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border outline-none transition-all disabled:bg-slate-50 ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                      : 'border-slate-200 focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]'
                  }`}
                  placeholder="example@company.com"
                  autoComplete="email"
                />
              </div>

              {errors.email && (
                <p className="text-xs font-semibold text-red-500">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pageStatus === 'loading'}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#0f766e] hover:bg-teal-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {pageStatus === 'loading' ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Đang gửi...
                </>
              ) : (
                'Gửi mã xác nhận'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-teal-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
