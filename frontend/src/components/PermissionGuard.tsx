import React from 'react';

// Định nghĩa kiểu cho User để tránh dùng any
export interface User {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

// Giả lập một hook để lấy thông tin user hiện tại (thường lấy từ AuthContext)
// Trong dự án thực tế, bạn sẽ import hook này từ context hoặc state management (Redux, Zustand, v.v.)
export const useAuth = () => {
  // Mock dữ liệu user hiện tại đang đăng nhập
  const currentUser: User | null = {
    id: 'u1',
    name: 'Nguyễn Văn A',
    role: 'ADMIN', // Ví dụ: 'ADMIN', 'HR', 'EMPLOYEE'
    permissions: ['VIEW_DASHBOARD', 'MANAGE_USERS', 'CREATE_JOB'], 
  };
  
  return { user: currentUser };
};

// Định nghĩa interface cho props của PermissionGuard
export interface PermissionGuardProps {
  // Nội dung sẽ được hiển thị nếu thỏa mãn điều kiện
  children: React.ReactNode;
  
  // Danh sách các quyền cần thiết (một trong các quyền hoặc tất cả tùy logic)
  requiredPermissions?: string[];
  
  // Danh sách các vai trò (roles) được phép truy cập
  allowedRoles?: string[];
  
  // Giao diện thay thế nếu người dùng không có quyền (mặc định là ẩn - trả về null)
  fallback?: React.ReactNode;
}

/**
 * Component PermissionGuard dùng để ẩn/hiện các thành phần giao diện
 * dựa trên vai trò (role) hoặc quyền (permissions) của người dùng hiện tại.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions,
  allowedRoles,
  fallback = null, // Mặc định không hiển thị gì nếu không có quyền
}) => {
  // Lấy thông tin user hiện tại từ hook
  const { user } = useAuth();

  // Nếu chưa đăng nhập, không có quyền xem
  if (!user) {
    return <>{fallback}</>;
  }

  // Kiểm tra vai trò (Role)
  // Nếu có truyền allowedRoles và role của user không nằm trong danh sách đó
  const hasRequiredRole = allowedRoles 
    ? allowedRoles.includes(user.role) 
    : true; // Nếu không yêu cầu role cụ thể thì mặc định là pass

  // Kiểm tra quyền (Permissions)
  // Nếu có yêu cầu quyền cụ thể, user phải có ÍT NHẤT MỘT quyền trong danh sách requiredPermissions
  // Bạn có thể sửa thành .every() nếu muốn yêu cầu TẤT CẢ các quyền
  const hasRequiredPermission = requiredPermissions
    ? requiredPermissions.some(permission => user.permissions.includes(permission))
    : true;

  // Nếu thỏa mãn cả điều kiện về role (nếu có) VÀ điều kiện về permission (nếu có)
  if (hasRequiredRole && hasRequiredPermission) {
    return <>{children}</>;
  }

  // Nếu không thỏa mãn, trả về giao diện dự phòng (hoặc null)
  return <>{fallback}</>;
};
