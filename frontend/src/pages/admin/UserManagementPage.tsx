import React, { useState } from 'react';
// Kiểm tra đường dẫn cẩn thận: từ `src/pages/admin/` ra `src/components/`
import { CreateAccountModal, type CreateAccountFormData } from '../../components/CreateAccountModal';
import { Plus, Users, Search } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  // Trạng thái mở/đóng Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm xử lý khi submit form tạo tài khoản
  const handleCreateUser = async (data: CreateAccountFormData) => {
    // Giả lập gọi API mất 1.5 giây
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Hiện thông báo (alert) để kiểm chứng
    alert(`Đã tạo tài khoản thành công!\n- Họ tên: ${data.fullName}\n- Email: ${data.email}\n- Vai trò: ${data.role}`);
  };

  return (
    <div className="space-y-6">
      {/* Header của trang */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Quản Lý Nhân Sự
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý danh sách tài khoản và phân quyền hệ thống</p>
        </div>
        
        {/* Nút Kích hoạt Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Tạo tài khoản
        </button>
      </div>

      {/* Khu vực tìm kiếm */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
         <Search className="w-5 h-5 text-gray-400" />
         <input 
            type="text" 
            placeholder="Tìm kiếm nhân sự theo tên, email..." 
            className="w-full focus:outline-none text-gray-700"
         />
      </div>

      {/* Khung hiển thị dữ liệu (giả lập trống) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
           <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Chưa có dữ liệu nhân sự</h3>
        <p className="text-gray-500 mt-1 max-w-sm">Danh sách tài khoản đang trống. Hãy nhấn nút "Tạo tài khoản" ở góc trên để thêm người dùng mới vào hệ thống.</p>
      </div>

      {/* Tích hợp Modal */}
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};
