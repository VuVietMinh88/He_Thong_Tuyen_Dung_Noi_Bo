import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Route trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route trang thiết lập mật khẩu mới (TKNHTTDNB1-105) */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Route trang chủ Dashboard tạm thời */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl font-bold text-teal-700">Trang chủ Dashboard (Đăng nhập thành công)</div>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
