import React from 'react';
import { PermissionGuard } from './PermissionGuard';

/**
 * Component ví dụ mô phỏng một trang hoặc một phần giao diện 
 * cần kiểm tra quyền truy cập.
 */
export const ExampleUsage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trang Quản Lý (Ví dụ)</h1>
      
      <div className="space-y-4">
        {/* Ví dụ 1: Component này hiển thị cho bất kỳ ai */}
        <div className="p-4 border rounded bg-gray-50">
          <p>Nội dung công khai: Bất kỳ ai đăng nhập cũng có thể thấy phần này.</p>
        </div>

        {/* Ví dụ 2: Ẩn/hiện theo Role (Vai trò) */}
        <PermissionGuard allowedRoles={['ADMIN', 'HR']}>
          <div className="p-4 border rounded bg-blue-50 text-blue-800">
            <h2 className="font-semibold">Khu vực dành cho ADMIN hoặc HR</h2>
            <p>Chỉ những người dùng có role là ADMIN hoặc HR mới thấy được khối này.</p>
          </div>
        </PermissionGuard>

        {/* Ví dụ 3: Ẩn/hiện theo Permission (Quyền cụ thể) */}
        <PermissionGuard requiredPermissions={['DELETE_USER']}>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Nút Xóa Người Dùng (Chỉ thấy nếu có quyền DELETE_USER)
          </button>
        </PermissionGuard>

        {/* Ví dụ 4: Có Fallback UI nếu không có quyền */}
        <PermissionGuard 
          requiredPermissions={['MANAGE_SALARY']}
          fallback={
            <div className="p-4 border rounded bg-red-50 text-red-600 italic">
              Bạn không có quyền xem thông tin lương.
            </div>
          }
        >
          <div className="p-4 border rounded bg-green-50 text-green-800">
            <h2 className="font-semibold">Thông tin lương (Bảo mật)</h2>
            <p>Lương tháng này: 20,000,000 VNĐ</p>
          </div>
        </PermissionGuard>

        {/* Ví dụ 5: Kết hợp cả Role và Permission */}
        <PermissionGuard 
          allowedRoles={['ADMIN']} 
          requiredPermissions={['MANAGE_USERS']}
        >
          <div className="p-4 border border-purple-200 rounded bg-purple-50 text-purple-800">
            <h2 className="font-semibold">Khu vực đặc biệt</h2>
            <p>Chỉ hiển thị cho người dùng có role ADMIN VÀ có quyền MANAGE_USERS.</p>
          </div>
        </PermissionGuard>
      </div>
    </div>
  );
};
