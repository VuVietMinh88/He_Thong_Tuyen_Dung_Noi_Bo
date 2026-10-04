import React from 'react';
import { FileText, Download } from 'lucide-react';

export const SalaryReportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            Báo Cáo Lương
          </h1>
          <p className="text-gray-500 text-sm mt-1">Hệ thống tổng hợp và báo cáo quỹ lương bảo mật</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm focus:outline-none">
          <Download className="w-5 h-5" />
          Xuất Báo Cáo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <FileText className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Tính năng Báo cáo lương đang phát triển</h3>
        <p className="text-gray-500 mt-2 max-w-md">Khu vực này yêu cầu quyền <strong>VIEW_SALARY_REPORT</strong>. Dữ liệu bảng lương, chi phí nhân sự và các biểu đồ thống kê sẽ được hiển thị tại đây.</p>
      </div>
    </div>
  );
};

