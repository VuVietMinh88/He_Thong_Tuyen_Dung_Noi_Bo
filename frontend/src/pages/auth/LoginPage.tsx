import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Clock, Loader2 } from 'lucide-react';
// import { authService } from '../../services/authService'; // Bỏ comment khi nối API thật

type LoginState = 'normal' | 'error' | 'lockout' | 'loading';

const INTERNAL_MOCK_EMAILS = [
  'admin@gmail.com',
  'recruiter@company.com',
  'dtc24520060@ictu.edu.vn'
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [appState, setAppState] = useState<LoginState>('normal');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('admin@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setAppState('loading');
    setErrorMessage('');

    try {
      // GIẢ LẬP GỌI API (Mock)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (INTERNAL_MOCK_EMAILS.includes(email.trim().toLowerCase()) && password === '123456') {
        // Thành công: Chuyển hướng theo AC Jira
        navigate('/dashboard');
      } else {
        // Thất bại: Cố tình throw lỗi để block catch xử lý
        throw new Error('INVALID_CREDENTIALS');
      }
    } catch (err: unknown) {
      // AC JIRA: CHỈ hiển thị 1 thông báo chung, không tiết lộ email
      setAppState('error');
      setErrorMessage('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
      
      // Giả lập logic khóa (Lockout) nếu cần
      if (err instanceof Error && err.message === 'LOCKOUT') {
        setAppState('lockout');
        setErrorMessage('Tài khoản của bạn tạm thời bị khóa 15 phút do nhập sai 5 lần liên tiếp.');
      }
    } finally {
      setAppState((prev) => (prev === 'loading' ? 'normal' : prev));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-slate-800">
      
      {/* LEFT COLUMN: BRANDING (Nền xanh Teal như thiết kế) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f766e] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Hình minh họa có viền bo góc */}
        <div className="bg-teal-800/20 p-2 rounded-2xl mb-8 backdrop-blur-sm">
          <img 
            src="/office_illustration.jpg" 
            alt="Office Team" 
            className="w-full max-w-[500px] h-auto rounded-xl object-cover shadow-2xl"
            onError={(e) => {
              // Fallback nếu chưa có ảnh
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop';
            }}
          />
        </div>
        
        {/* Tiêu đề */}
        <h2 className="text-3xl font-extrabold tracking-wide text-white uppercase drop-shadow-md">
          PHÁT TRIỂN NỘI BỘ
        </h2>
      </div>

      {/* RIGHT COLUMN: FORM ĐĂNG NHẬP */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          {/* Form Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-[#0f766e]">
              <ShieldCheck className="w-7 h-7"/>
            </div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-1">
              Hệ Thống Tuyển Dụng Nội Bộ
            </h1>
            <h2 className="text-[15px] font-semibold text-slate-700">Đăng nhập hệ thống</h2>
            <p className="text-xs text-slate-400 mt-1">dành cho cán bộ và nhân sự tuyển dụng</p>
          </div>

          {/* Error Alerts */}
          {appState === 'error' && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2.5 text-red-600 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0"/>
              <p className="text-sm font-medium leading-tight">{errorMessage}</p>
            </div>
          )}

          {appState === 'lockout' && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-2.5 text-orange-700 animate-in fade-in">
              <Clock className="w-5 h-5 flex-shrink-0"/>
              <p className="text-sm font-medium leading-tight">{errorMessage}</p>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Email công ty</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4"/>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={appState === 'lockout' || appState === 'loading'}
                  className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] outline-none transition-all disabled:bg-slate-50"
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4"/>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={appState === 'lockout' || appState === 'loading'}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] outline-none transition-all disabled:bg-slate-50"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={appState === 'lockout' || appState === 'loading'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${rememberMe ? 'bg-[#0f766e]' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${rememberMe ? 'left-[18px]' : 'left-0.5'}`}></div>
                </div>
                <span className="text-[13px] font-medium text-slate-500">Ghi nhớ phiên đăng nhập</span>
              </div>
              <button type="button" className="text-[13px] font-semibold text-[#0f766e] hover:underline">
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={appState === 'loading' || appState === 'lockout'}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#0f766e] hover:bg-teal-800 transition-all disabled:opacity-70 mt-2"
            >
              {appState === 'loading' ? (
                <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4"/> Đang xử lý...</>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
