import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route trang quên mật khẩu (TKNHTTDNB1-104) */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Route trang thiết lập mật khẩu mới (TKNHTTDNB1-105) */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Route trang đổi mật khẩu khi đang đăng nhập (TKNHTTDNB1-112) */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* Route trang chủ Dashboard tạm thời */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl font-bold text-teal-700">Trang chủ Dashboard (Đăng nhập thành công)</div>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
