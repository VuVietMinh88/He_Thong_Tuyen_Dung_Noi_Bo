import React from 'react';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';

export const RecruitmentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Duyệt Tuyển Dụng
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý và xét duyệt các yêu cầu tuyển dụng từ các phòng ban</p>
        </div>
      </div>

      {/* Cấu trúc Grid hiển thị thống kê tổng quan (Mock) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Chờ duyệt</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Đã duyệt (Tháng này)</p>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><XCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Từ chối</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      {/* Khu vực danh sách chính */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Khu vực hiển thị danh sách yêu cầu</h3>
        <p className="text-gray-500 mt-2 max-w-md">Tính năng Đang phát triển. Tại đây sẽ hiển thị bảng dữ liệu (DataGrid) các yêu cầu tuyển dụng cần HR và Ban Giám Đốc xét duyệt.</p>
      </div>
    </div>
  );
};

