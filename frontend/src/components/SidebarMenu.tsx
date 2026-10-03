import type { ReactElement, ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BriefcaseBusiness,
  FileText,
  House,
  Settings,
  ShieldCheck,
  Users,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';

export interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
  requiredPermissions: string[];
  allowedRoles: string[];
}

export interface SidebarMenuProps {
  isCollapsed?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Trang Chủ',
    path: '/',
    icon: <House className="h-5 w-5" />,
    requiredPermissions: [],
    allowedRoles: [],
  },
  {
    label: 'Quản Lý Tài Khoản',
    path: '/admin/accounts',
    icon: <UserCheck className="h-5 w-5" />,
    requiredPermissions: [],
    allowedRoles: ['ADMIN'],
  },
  {
    label: 'Quản Lý Nhân Sự',
    path: '/employees',
    icon: <Users className="h-5 w-5" />,
    requiredPermissions: [],
    allowedRoles: ['ADMIN', 'HR'],
  },
  {
    label: 'Duyệt Tuyển Dụng',
    path: '/recruitment',
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    requiredPermissions: ['APPROVE_RECRUITMENT'],
    allowedRoles: [],
  },
  {
    label: 'Báo Cáo Lương',
    path: '/reports/salary',
    icon: <FileText className="h-5 w-5" />,
    requiredPermissions: ['VIEW_SALARY_REPORT'],
    allowedRoles: ['ADMIN'],
  },
  {
    label: 'Cài Đặt Bảo Mật',
    path: '/settings/security',
    icon: <ShieldCheck className="h-5 w-5" />,
    requiredPermissions: [],
    allowedRoles: [],
  },
  {
    label: 'Cấu Hình Hệ Thống',
    path: '/settings/system',
    icon: <Settings className="h-5 w-5" />,
    requiredPermissions: [],
    allowedRoles: ['ADMIN'],
  },
];

export const SidebarMenu = ({ isCollapsed = false }: SidebarMenuProps): ReactElement => {
  /*
   * Lấy vị trí URL hiện tại để xác định menu nào đang active.
   * Việc này giúp UI làm nổi bật đúng mục đang được chọn thay vì chỉ dựa vào class mặc định của NavLink.
   */
  const location = useLocation();

  /*
   * Lấy thông tin người dùng từ AuthContext để hiển thị phần footer và kiểm tra trạng thái đăng nhập.
   * Dùng hook usePermission để tái sử dụng logic quyền đã được chuẩn hóa trong toàn bộ ứng dụng.
   */
  const { user } = useAuth();
  const { hasAnyPermission, hasAnyRole } = usePermission();

  /*
   * Hàm kiểm tra xem mục menu có được phép hiển thị hay không.
   * Điều kiện tính toán dựa trên 2 tiêu chí: vai trò và quyền.
   * Nếu mảng quyền hoặc vai trò rỗng, điều đó đồng nghĩa với không có ràng buộc bổ sung.
   */
  const canAccessMenuItem = (item: MenuItem): boolean => {
    if (!user) {
      return false;
    }

    const hasRoleAccess: boolean =
      item.allowedRoles.length === 0 || hasAnyRole(item.allowedRoles);

    const hasPermissionAccess: boolean =
      item.requiredPermissions.length === 0 ||
      hasAnyPermission(item.requiredPermissions);

    return hasRoleAccess && hasPermissionAccess;
  };

  /*
   * Lọc danh sách menu theo quyền thực tế của người dùng hiện tại.
   * Mỗi mục không đủ điều kiện sẽ không được render hoàn toàn, đúng theo yêu cầu ẩn/hiện menu theo quyền.
   */
  const visibleMenuItems: MenuItem[] = MENU_ITEMS.filter(canAccessMenuItem);

  /*
   * Kiểm tra mục nào đang active dựa trên pathname.
   * Nếu đang ở trang con của một route cha thì vẫn highlight đúng mục cha tương ứng.
   */
  const isMenuActive = (item: MenuItem): boolean => {
    if (location.pathname === item.path) {
      return true;
    }

    return location.pathname.startsWith(`${item.path}/`);
  };

  return (
    <aside
      className={`flex h-full flex-col border-r border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/*
       * Phần header của sidebar, hiển thị tên hệ thống hoặc chữ rút gọn khi menu đang thu gọn.
       * Thiết kế này mang lại cảm giác hiện đại nhưng vẫn tối ưu không gian trên màn hình.
       */}
      <div className="flex h-16 items-center justify-center border-b border-slate-200 bg-slate-50">
        <span
          className={`truncate font-bold text-blue-600 transition-all duration-300 ${
            isCollapsed ? 'text-xs tracking-wide' : 'text-xl'
          }`}
        >
          {isCollapsed ? 'HRM' : 'HRM System'}
        </span>
      </div>

      {/*
       * Khu vực danh sách menu chính.
       * Mỗi mục sẽ được filter trước khi render để đảm bảo không có mục nào bị hiển thị sai quyền.
       */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1.5 px-3">
          {visibleMenuItems.map((item) => {
            const active: boolean = isMenuActive(item);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={({ isActive }) => {
                    const isCurrentActive: boolean = isActive || active;

                    return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                      isCurrentActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`;
                  }}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/*
       * Phần footer hiển thị thông tin người dùng đang đăng nhập.
       * Chỉ render khi sidebar đang mở rộng để không làm rối layout compact mode.
       */}
      {!isCollapsed && user && (
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
