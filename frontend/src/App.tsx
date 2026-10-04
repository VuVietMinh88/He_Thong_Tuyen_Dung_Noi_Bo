import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { UnauthorizedPage } from './pages/errors/UnauthorizedPage';

// Import Layout chính và các Route bảo vệ
import { MainLayout } from './components/MainLayout';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { ExampleUsage } from './components/ExampleUsage';
import { AccountList } from './pages/admin/account/AccountList';

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
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Các Route CẦN MainLayout và bảo mật quyền đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard chính */}
            <Route 
              path="/dashboard" 
              element={
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Trang chủ / Bảng Điều Khiển</h1>
                  <p className="text-gray-600">Chào mừng bạn quay lại hệ thống quản lý tuyển dụng nội bộ.</p>
                </div>
              } 
            />

            {/* Quản lý danh sách tài khoản (Story 17 - TKNHTTDNB1-142) dành riêng cho ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/accounts" element={<AccountList />} />
              <Route path="/accounts" element={<AccountList />} />
            </Route>
            
            {/* Trang Quản lý nhân sự dành cho ADMIN / HR */}
            <Route 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'HR']} />}
            >
              <Route
                path="/employees"
                element={
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-blue-800 mb-4">Trang Quản Lý Nhân Sự</h1>
                    <p>Danh sách nhân sự sẽ hiển thị ở đây...</p>
                  </div>
                }
              />
            </Route>

            {/* Trang sử dụng ExampleUsage để test PermissionGuard */}
            <Route 
              path="/settings/security" 
              element={<ExampleUsage />} 
            />

            {/* Tuyển dụng */}
            <Route 
              path="/recruitment" 
              element={<div className="p-4">Tính năng đang phát triển...</div>} 
            />

            {/* Báo cáo lương */}
            <Route element={<ProtectedRoute requiredPermissions={['VIEW_SALARY_REPORT']} />}>
              <Route
                path="/reports/salary"
                element={<div className="p-4">Tính năng báo cáo lương đang phát triển...</div>}
              />
            </Route>

            {/* Cấu hình hệ thống */}
            <Route 
              path="/settings/system" 
              element={<div className="p-4">Cấu hình hệ thống đang phát triển...</div>} 
            />
          </Route>
        </Route>

        {/* Route bắt lỗi chung - chuyển về trang đăng nhập */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
