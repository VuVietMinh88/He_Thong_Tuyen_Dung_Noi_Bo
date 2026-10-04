import React from 'react';
import { Settings, Shield, Server, BellRing } from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-700" />
          Cấu Hình Hệ Thống
        </h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý các thiết lập chung và tham số toàn cục của hệ thống HRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors cursor-pointer group">
          <Server className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-900">Thiết lập Máy chủ</h3>
          <p className="text-gray-500 text-sm mt-2">Cấu hình kết nối API, thời gian Timeout và lưu trữ</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-500 transition-colors cursor-pointer group">
          <Shield className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-900">Bảo mật & Phân quyền</h3>
          <p className="text-gray-500 text-sm mt-2">Định nghĩa Role mới, thiết lập quy tắc mật khẩu</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-orange-500 transition-colors cursor-pointer group">
          <BellRing className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-900">Thông báo (Notification)</h3>
          <p className="text-gray-500 text-sm mt-2">Cấu hình Email template, SMS và thông báo đẩy (Push)</p>
        </div>
      </div>
    </div>
  );
};

