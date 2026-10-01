import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Import MainLayout mới tạo
import { MainLayout } from './components/MainLayout';
// Import PermissionGuard để bảo vệ một số component mẫu
import { PermissionGuard } from './components/PermissionGuard';
import { ExampleUsage } from './components/ExampleUsage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Các Route không cần Layout nội bộ (Auth Pages) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* Các Route CẦN MainLayout và bảo mật quyền */}
        <Route element={<MainLayout />}>
          {/* Dashboard chính */}
          <Route 
            path="/dashboard" 
            element={
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Trang chủ Bảng Điều Khiển</h1>
                <p className="text-gray-600">Chào mừng bạn quay lại hệ thống quản lý nhân sự nội bộ.</p>
              </div>
            } 
          />
          
          {/* Demo trang Quản lý nhân sự chỉ dành cho ADMIN/HR */}
          <Route 
            path="/employees" 
            element={
              <PermissionGuard allowedRoles={['ADMIN', 'HR']} fallback={<div className="text-red-500 font-bold p-4">Bạn không có quyền truy cập trang này.</div>}>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h1 className="text-2xl font-bold text-blue-800 mb-4">Trang Quản Lý Nhân Sự</h1>
                  <p>Danh sách nhân sự sẽ hiển thị ở đây...</p>
                </div>
              </PermissionGuard>
            } 
          />

          {/* Demo trang có sử dụng ExampleUsage đã tạo trước đó để test PermissionGuard */}
          <Route 
            path="/settings/security" 
            element={<ExampleUsage />} 
          />

          {/* Fallback cho các đường dẫn nội bộ khác */}
          <Route 
            path="/recruitment" 
            element={<div className="p-4">Tính năng đang phát triển...</div>} 
          />
          <Route 
            path="/reports/salary" 
            element={<div className="p-4">Tính năng báo cáo lương đang phát triển...</div>} 
          />
          <Route 
            path="/settings/system" 
            element={<div className="p-4">Cấu hình hệ thống đang phát triển...</div>} 
          />
        </Route>

        {/* Route bắt lỗi chung */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
