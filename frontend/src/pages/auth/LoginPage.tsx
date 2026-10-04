import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth, type AuthUser } from '../../context/AuthContext';
// import { authService } from '../../services/authService'; // Đã giữ comment bằng tiếng Việt, sẽ bỏ khi nối API thật

type LoginState = 'normal' | 'error' | 'lockout' | 'loading' | 'success';

const MOCK_USERS: Record<string, AuthUser> = {
  'admin@gmail.com': {
    id: 'admin-1',
    name: 'Quản trị viên',
    role: 'ADMIN',
    permissions: ['VIEW_SALARY_REPORT', 'APPROVE_RECRUITMENT', 'MANAGE_USERS'],
  },
  'recruiter@company.com': {
    id: 'recruiter-1',
    name: 'Nhân viên tuyển dụng',
    role: 'HR',
    permissions: ['APPROVE_RECRUITMENT'],
  },
  'dtc24520060@ictu.edu.vn': {
    id: 'employee-1',
    name: 'Nhân viên',
    role: 'EMPLOYEE',
    permissions: [],
  },
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 phút

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  // Các trạng thái của biểu mẫu đăng nhập
  const [appState, setAppState] = useState<LoginState>('normal');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('admin@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Quản lý số lần đăng nhập sai (Lưu vào localStorage để chống F5)
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    return parseInt(localStorage.getItem('login_failed_attempts') || '0', 10);
  });

  // Quản lý thời gian mở khóa (Lưu timestamp vào localStorage)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    const stored = localStorage.getItem('login_lockout_until');
    return stored ? parseInt(stored, 10) : null;
  });

  // Trạng thái đếm ngược thời gian khóa hiển thị trên giao diện
  const [remainingTime, setRemainingTime] = useState<string>('');

  // Effect chạy đồng hồ đếm ngược nếu tài khoản đang bị khóa
  React.useEffect(() => {
    if (!lockoutUntil) return;

    const updateCountdown = () => {
      const now = Date.now();
      if (now >= lockoutUntil) {
        // Đã hết thời gian khóa
        setLockoutUntil(null);
        setFailedAttempts(0);
        setAppState('normal');
        localStorage.removeItem('login_lockout_until');
        localStorage.removeItem('login_failed_attempts');
      } else {
        // Vẫn đang trong thời gian khóa
        setAppState('lockout');
        const diff = lockoutUntil - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setRemainingTime(`${minutes} phút ${seconds} giây`);
      }
    };

    updateCountdown(); // Gọi ngay lập tức 1 lần
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [lockoutUntil]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    
    // Khóa cấp 2: Ngăn chặn submit nếu vẫn đang bị khóa
    if (lockoutUntil && Date.now() < lockoutUntil) return;

    setAppState('loading');
    setErrorMessage('');

    try {
      // GIẢ LẬP GỌI API (Mock)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const authenticatedUser = MOCK_USERS[email.trim().toLowerCase()];

      if (authenticatedUser && password === '123456') {
        // Nếu đăng nhập thành công, xóa trắng lịch sử sai
        setFailedAttempts(0);
        localStorage.removeItem('login_failed_attempts');
        localStorage.removeItem('login_lockout_until');

        signIn(authenticatedUser);
        
        // Cập nhật trạng thái thành công để hiện alert ở trang login
        setAppState('success');
        
        // Chờ 1 giây để người dùng thấy thông báo, sau đó chuyển hướng và gửi kèm state
        setTimeout(() => {
          navigate('/dashboard', { state: { loginSuccess: true } });
        }, 1000);
      } else {
        // Thất bại: Ném lỗi để block catch xử lý
        throw new Error('INVALID_CREDENTIALS');
      }
    } catch (err: unknown) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('login_failed_attempts', newAttempts.toString());

      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        // Vượt quá 5 lần -> Kích hoạt khóa 15 phút
        const unlockTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(unlockTime);
        localStorage.setItem('login_lockout_until', unlockTime.toString());
      } else {
        // Chưa quá 5 lần -> Báo lỗi số lần còn lại
        setAppState('error');
        setErrorMessage(`Email hoặc mật khẩu không chính xác. Bạn còn ${MAX_FAILED_ATTEMPTS - newAttempts} lần thử.`);
      }
    } finally {
      setAppState((prev) => (prev === 'loading' ? 'normal' : prev));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-slate-800">
      
      {/* Cột trái: Nhận diện thương hiệu với nền xanh ngọc */}
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

      {/* Cột phải: Biểu mẫu đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          {/* Tiêu đề biểu mẫu */}
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

          {/* Thông báo lỗi đăng nhập */}
          {appState === 'error' && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2.5 text-red-600 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0"/>
              <p className="text-sm font-medium leading-tight">{errorMessage}</p>
            </div>
          )}

          {/* Thông báo thành công */}
          {appState === 'success' && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2.5 text-emerald-600 animate-in fade-in">
              <ShieldCheck className="w-5 h-5 flex-shrink-0"/>
              <p className="text-sm font-medium leading-tight">Đăng nhập thành công! Đang chuyển hướng...</p>
            </div>
          )}

          {appState === 'lockout' && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3 text-orange-700 animate-in fade-in shadow-sm">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-500" />
              <div>
                <p className="text-[15px] font-bold leading-tight">Tài khoản bị tạm khóa</p>
                <p className="text-sm font-medium mt-1">
                  Bạn đã nhập sai 5 lần. Vui lòng thử lại sau: <span className="text-red-600 font-bold">{remainingTime}</span>
                </p>
              </div>
            </div>
          )}

          {/* Các trường thông tin đăng nhập */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Địa chỉ email */}
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
                  className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Mật khẩu */}
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
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
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

            {/* Ghi nhớ phiên đăng nhập và quên mật khẩu */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${rememberMe ? 'bg-[#0f766e]' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${rememberMe ? 'left-[18px]' : 'left-0.5'}`}></div>
                </div>
                <span className="text-[13px] font-medium text-slate-500">Ghi nhớ phiên đăng nhập</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[13px] font-semibold text-[#0f766e] hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Nút gửi biểu mẫu */}
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
