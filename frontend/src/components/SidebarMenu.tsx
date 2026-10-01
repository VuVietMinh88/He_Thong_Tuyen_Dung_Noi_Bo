import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  Settings, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Định nghĩa cấu trúc cho mỗi mục trong Menu
export interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  // Các quyền bắt buộc (tuỳ chọn)
  requiredPermissions?: string[];
  // Các vai trò được phép (tuỳ chọn)
  allowedRoles?: string[];
}

// Danh sách các mục Menu mẫu
const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Trang Chủ',
    path: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Quản Lý Nhân Sự',
    path: '/employees',
    icon: <Users className="w-5 h-5" />,
    // Chỉ ADMIN hoặc HR mới thấy
    allowedRoles: ['ADMIN', 'HR'],
  },
  {
    label: 'Duyệt Tuyển Dụng',
    path: '/recruitment',
    icon: <Briefcase className="w-5 h-5" />,
    // Cần có quyền APPROVE_RECRUITMENT
    requiredPermissions: ['APPROVE_RECRUITMENT'],
  },
  {
    label: 'Báo Cáo Lương',
    path: '/reports/salary',
    icon: <FileText className="w-5 h-5" />,
    // Phải là ADMIN và có quyền xem báo cáo lương
    allowedRoles: ['ADMIN'],
    requiredPermissions: ['VIEW_SALARY_REPORT'],
  },
  {
    label: 'Cài Đặt Bảo Mật',
    path: '/settings/security',
    icon: <ShieldCheck className="w-5 h-5" />,
    // Mọi người dùng đã đăng nhập đều có thể vào cài đặt cá nhân
  },
  {
    label: 'Cấu Hình Hệ Thống',
    path: '/settings/system',
    icon: <Settings className="w-5 h-5" />,
    // Chỉ ADMIN tối cao mới thấy
    allowedRoles: ['ADMIN'],
  }
];

export interface SidebarMenuProps {
  // Có thể thêm prop để toggle thu gọn menu nếu cần thiết
  isCollapsed?: boolean;
}

/**
 * Component SidebarMenu hiển thị thanh điều hướng bên trái.
 * Tự động lọc các mục menu theo quyền của người dùng hiện tại.
 */
export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isCollapsed = false }) => {
  // Lấy thông tin user hiện tại (đã giả lập trong useAuth)
  const { user } = useAuth();

  // Hàm kiểm tra xem user có quyền xem một MenuItem hay không
  const canAccessMenuItem = (item: MenuItem): boolean => {
    // Nếu chưa đăng nhập, không cho xem menu (hoặc có thể cho xem các trang public)
    if (!user) return false;

    // Kiểm tra vai trò
    const hasRole = item.allowedRoles 
      ? item.allowedRoles.includes(user.role) 
      : true;

    // Kiểm tra quyền cụ thể
    const hasPermission = item.requiredPermissions
      ? item.requiredPermissions.some(p => user.permissions.includes(p))
      : true;

    // Cần thoả mãn cả 2 điều kiện (nếu có)
    return hasRole && hasPermission;
  };

  // Lọc ra các menu hợp lệ cho user hiện hành
  const authorizedMenuItems = MENU_ITEMS.filter(canAccessMenuItem);

  return (
    <aside className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Phần Header của Sidebar (Logo) */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <span className={`font-bold text-blue-600 truncate transition-all ${isCollapsed ? 'text-xs' : 'text-xl'}`}>
          {isCollapsed ? 'HRM' : 'HRM System'}
        </span>
      </div>

      {/* Danh sách Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {authorizedMenuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                // NavLink hỗ trợ thuộc tính isActive để đổi class khi đang ở trang đó
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium' // Trạng thái Active
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Trạng thái bình thường / Hover
                  }`
                }
                title={isCollapsed ? item.label : undefined}
              >
                {/* Render Icon */}
                <span className="flex-shrink-0">{item.icon}</span>
                
                {/* Render Label, ẩn đi nếu menu đang bị thu gọn */}
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Phần Footer của Sidebar (Thông tin User thu gọn) */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
