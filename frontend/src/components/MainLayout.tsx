import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, LogOut, Bell, CheckCircle } from 'lucide-react';
import { SidebarMenu } from './SidebarMenu';
import { useAuth } from '../context/AuthContext';

/**
 * MainLayout bọc xung quanh các trang nội bộ sau khi đăng nhập.
 * Bao gồm Sidebar (bên trái), Header (trên cùng) và khu vực nội dung (Outlet).
 */
export const MainLayout: React.FC = () => {
  // Trạng thái đóng/mở sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Trạng thái hiển thị thông báo Toast đăng nhập thành công
  const [showToast, setShowToast] = useState(false);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hiển thị Toast dựa vào state được pass qua navigate từ LoginPage
  useEffect(() => {
    if (location.state?.loginSuccess) {
      setShowToast(true);
      
      // Xóa state khỏi history để tránh toast hiện lại khi F5 trang
      window.history.replaceState({}, document.title);
      
      // Tự động ẩn toast sau 4 giây
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Hàm xử lý đăng xuất giả lập
  const handleLogout = (): void => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      
      {/* Global Toast Thông báo thành công */}
      {showToast && (
        <div className="absolute top-6 right-6 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 shadow-lg rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="font-semibold text-emerald-800">Đăng nhập thành công</p>
              <p className="text-sm text-emerald-600">Chào mừng bạn quay lại hệ thống.</p>
            </div>
          </div>
        </div>
      )}

      {/* Cột trái: Sidebar */}
      <SidebarMenu isCollapsed={isSidebarCollapsed} />

      {/* Cột phải: Header + Nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header / Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shadow-sm">
          {/* Nút Toggle Sidebar */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
              title="Đóng/Mở Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Công cụ bên phải Header */}
          <div className="flex items-center gap-4">
            {/* Nút thông báo */}
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Thông tin user (Header) */}
            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Xin chào, {user?.name || 'Khách'}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung chính thay đổi theo Route (Outlet) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
