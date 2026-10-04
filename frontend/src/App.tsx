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
import { UserManagementPage } from './pages/admin/UserManagementPage';

import { RecruitmentPage } from './pages/recruitment/RecruitmentPage';
import { SalaryReportPage } from './pages/reports/SalaryReportPage';
import { SystemSettingsPage } from './pages/settings/SystemSettingsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
              
              {/* Cấu hình hệ thống - Chỉ ADMIN */}
              <Route path="/settings/system" element={<SystemSettingsPage />} />
            </Route>
            
            {/* Trang Quản lý nhân sự dành cho ADMIN / HR */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR']} />}>
              <Route path="/employees" element={<UserManagementPage />} />
            </Route>

            {/* Trang sử dụng ExampleUsage để test PermissionGuard */}
            <Route path="/settings/security" element={<ExampleUsage />} />

            {/* Tuyển dụng */}
            <Route path="/recruitment" element={<RecruitmentPage />} />

            {/* Báo cáo lương */}
            <Route element={<ProtectedRoute requiredPermissions={['VIEW_SALARY_REPORT']} />}>
              <Route path="/reports/salary" element={<SalaryReportPage />} />
            </Route>

          </Route>
        </Route>

        {/* Route bắt lỗi chung - chuyển về trang đăng nhập */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
