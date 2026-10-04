import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Định nghĩa interface cho form validation
interface ResetFormErrors {
  password?: string;
  confirmPassword?: string;
}

// Trạng thái trang
type PageState = 'normal' | 'loading' | 'success' | 'error';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Trích xuất token từ URL
  const token = searchParams.get('token');

  // Khai báo state
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const [errors, setErrors] = useState<ResetFormErrors>({});
  const [pageState, setPageState] = useState<PageState>('normal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: ResetFormErrors = {};

    // Validate mật khẩu mới
    if (!password) {
      newErrors.password = 'Mật khẩu mới không được để trống';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Validate xác nhận mật khẩu
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Nếu form không hợp lệ, chặn submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setPageState('loading');

    try {
      // Hàm giả lập API (delay 1.5s)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Payload:', { token, newPassword: password });
      
      setPageState('success');
      
      // Chuyển hướng về login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch {
      setPageState('error');
    } finally {
      if (pageState !== 'success') {
        setPageState((prev) => (prev === 'loading' ? 'normal' : prev));
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-slate-800">
      
      {/* CỘT TRÁI: Layout đồng bộ phong cách với trang Login */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f766e] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="bg-teal-800/20 p-2 rounded-2xl mb-8 backdrop-blur-sm">
          <img 
            src="/office_illustration.jpg" 
            alt="Office Team" 
            className="w-full max-w-[500px] h-auto rounded-xl object-cover shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop';
            }}
          />
        </div>
        <h2 className="text-3xl font-extrabold tracking-wide text-white uppercase drop-shadow-md">
          PHÁT TRIỂN NỘI BỘ
        </h2>
      </div>

      {/* CỘT PHẢI: Form đặt lại mật khẩu */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-2xl shadow-lg border border-slate-100">
          
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-[#0f766e]">
              <ShieldCheck className="w-7 h-7"/>
            </div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-1">
              Khôi phục tài khoản
            </h1>
            <h2 className="text-[15px] font-semibold text-slate-700">Thiết lập mật khẩu mới</h2>
          </div>

          {pageState === 'success' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-center text-emerald-700 animate-in fade-in">
              <CheckCircle2 className="w-8 h-8 mb-2 mx-auto"/>
              <p className="text-sm font-semibold">Cập nhật mật khẩu thành công!</p>
              <p className="text-xs mt-1">Đang chuyển hướng về Đăng nhập...</p>
            </div>
          )}

          {!token && pageState !== 'success' && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2.5 text-amber-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5"/>
              <p className="text-sm font-medium">Cảnh báo: Không tìm thấy Token xác thực trên URL. Vui lòng kiểm tra lại liên kết.</p>
            </div>
          )}

          {pageState !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Mật khẩu mới</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4"/>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    disabled={pageState === 'loading'}
                    className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border ${
                      errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-[#0f766e]/20 focus:border-[#0f766e]'
                    } outline-none transition-all disabled:bg-slate-50`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={pageState === 'loading'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </button>
                </div>
                {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password}</p>}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Xác nhận mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4"/>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    disabled={pageState === 'loading'}
                    className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-[#0f766e]/20 focus:border-[#0f766e]'
                    } outline-none transition-all disabled:bg-slate-50`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={pageState === 'loading'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs font-semibold text-red-500">{errors.confirmPassword}</p>}
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                disabled={pageState === 'loading' || !token}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#0f766e] hover:bg-teal-800 transition-all disabled:opacity-70 mt-4"
              >
                {pageState === 'loading' ? (
                  <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4"/> Đang xử lý...</>
                ) : (
                  'Cập nhật mật khẩu'
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

