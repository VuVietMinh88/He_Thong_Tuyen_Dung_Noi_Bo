import React from 'react';
import {
  AlertTriangle,
  RefreshCw,
  SearchX,
  Shield,
  UserCog,
  Edit3,
  Lock,
  Unlock,
  Clock,
} from 'lucide-react';
import type { Account, AccountRole } from '../../types/account';
import { AccountStatusBadge } from './AccountStatusBadge';

// Định nghĩa giao diện Props cho component bảng tài khoản
export interface AccountTableProps {
  accounts: Account[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  hasFiltersActive?: boolean;
  onClearFilters?: () => void;
  onEditAccount?: (account: Account) => void;
  onManageRole?: (account: Account) => void;
  onToggleStatus?: (account: Account) => void;
}

/**
 * Hàm hiển thị nhãn vai trò người dùng với màu sắc nhận diện trực quan
 */
const renderRoleBadge = (role: AccountRole): React.ReactElement => {
  const normalizedRole = (role || '').toUpperCase();

  if (normalizedRole === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
        <Shield className="w-3 h-3 text-purple-600" />
        <span>Quản trị viên</span>
      </span>
    );
  }

  if (normalizedRole === 'HR' || normalizedRole === 'HR_MANAGER') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <UserCog className="w-3 h-3 text-blue-600" />
        <span>Nhân sự (HR)</span>
      </span>
    );
  }

  if (normalizedRole === 'INTERVIEWER') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span>Phỏng vấn viên</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <span>Nhân viên</span>
    </span>
  );
};

/**
 * Component Bảng hiển thị danh sách tài khoản người dùng (Story 17 - TKNHTTDNB1-142).
 * Hỗ trợ các trạng thái: Đang tải (Skeleton), Báo lỗi (Error Retry), Dữ liệu trống (Empty State) và Dữ liệu thực tế.
 */
export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasFiltersActive = false,
  onClearFilters,
  onEditAccount,
  onManageRole,
  onToggleStatus,
}) => {
  // 1. Trạng thái xảy ra lỗi khi gọi API
  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Không thể tải danh sách tài khoản</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {errorMessage || 'Đã có lỗi xảy ra trong quá trình kết nối đến máy chủ. Vui lòng thử lại.'}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#00867D] hover:bg-[#00736B] rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  // 2. Trạng thái đang tải dữ liệu (Loading Skeleton)
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-center w-44">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-3.5 w-12 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-slate-200 rounded" />
                        <div className="h-3 w-40 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-3.5 w-36 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-24 bg-slate-200 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="h-8 w-24 bg-slate-200 rounded-lg inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. Trạng thái danh sách rỗng (Không có bản ghi phù hợp)
  if (!accounts || accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Không tìm thấy tài khoản nào</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {hasFiltersActive
            ? 'Không có tài khoản nào phù hợp với bộ lọc tìm kiếm hiện tại.'
            : 'Hiện tại hệ thống chưa có tài khoản nào được ghi nhận.'}
        </p>
        {hasFiltersActive && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <span>Xóa điều kiện lọc</span>
          </button>
        )}
      </div>
    );
  }

  // 4. Trạng thái hiển thị dữ liệu bảng tài khoản thành công
  return (
    <div className="bg-white rounded-t-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 w-20">ID</th>
              <th scope="col" className="py-3.5 px-4">Họ và tên</th>
              <th scope="col" className="py-3.5 px-4">Email</th>
              <th scope="col" className="py-3.5 px-4">Vai trò</th>
              <th scope="col" className="py-3.5 px-4">Trạng thái</th>
              <th scope="col" className="py-3.5 px-4 text-center w-44">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {accounts.map((account) => {
              const firstLetter = account.fullName?.charAt(0).toUpperCase() || 'U';
              const isLocked = account.status?.toUpperCase() === 'LOCKED';

              return (
                <tr
                  key={account.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Cột 1: Mã định danh ID */}
                  <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-500">
                    {account.id}
                  </td>

                  {/* Cột 2: Họ và tên kèm Avatar rút gọn */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#00867D]/10 text-[#00867D] font-bold text-sm flex items-center justify-center shrink-0 border border-[#00867D]/20">
                        {firstLetter}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {account.fullName}
                        </p>
                        {account.lastLoginAt && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>Đăng nhập gần nhất: {new Date(account.lastLoginAt).toLocaleDateString('vi-VN')}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Cột 3: Địa chỉ Email */}
                  <td className="py-3.5 px-4 text-slate-600 font-normal">
                    {account.email}
                  </td>

                  {/* Cột 4: Vai trò người dùng (Role) */}
                  <td className="py-3.5 px-4">
                    {renderRoleBadge(account.role)}
                  </td>

                  {/* Cột 5: Trạng thái tài khoản (TKNHTTDNB1-160) */}
                  <td className="py-3.5 px-4">
                    <AccountStatusBadge status={account.status} />
                  </td>

                  {/* Cột 6: Vị trí dành riêng cho các hành động (Edit, Role, Lock/Unlock) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      {/* Nút Chỉnh sửa (TKNHTTDNB1-144) */}
                      <button
                        type="button"
                        onClick={() => onEditAccount?.(account)}
                        disabled={!onEditAccount}
                        aria-label={onEditAccount ? `Chỉnh sửa tài khoản ${account.fullName}` : 'Chỉnh sửa tài khoản (sắp ra mắt)'}
                        title={onEditAccount ? `Chỉnh sửa thông tin tài khoản ${account.fullName}` : 'Chỉnh sửa tài khoản (Tính năng sẽ phát triển ở nhiệm vụ tiếp theo)'}
                        className={`p-1.5 rounded-md border transition-colors ${
                          onEditAccount
                            ? 'text-slate-600 hover:text-[#00867D] hover:bg-emerald-50 bg-white border-slate-200 cursor-pointer shadow-2xs'
                            : 'text-slate-400 hover:text-slate-600 bg-slate-50 border-transparent hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed'
                        }`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Nút Quản lý vai trò (TKNHTTDNB1-152) */}
                      <button
                        type="button"
                        onClick={() => onManageRole?.(account)}
                        disabled={!onManageRole}
                        aria-label={
                          onManageRole
                            ? `Phân quyền vai trò cho ${account.fullName}`
                            : 'Phân quyền vai trò (sắp ra mắt)'
                        }
                        title={
                          onManageRole
                            ? `Phân quyền vai trò cho tài khoản ${account.fullName}`
                            : 'Phân quyền vai trò (Tính năng chưa kích hoạt)'
                        }
                        className={`p-1.5 rounded-md border transition-colors ${
                          onManageRole
                            ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 bg-white border-slate-200 cursor-pointer shadow-2xs'
                            : 'text-slate-400 hover:text-slate-600 bg-slate-50 border-transparent hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                      </button>

                      {/* Nút Khóa/Mở khóa (TKNHTTDNB1-161) */}
                      <button
                        type="button"
                        onClick={() => onToggleStatus?.(account)}
                        disabled={!onToggleStatus}
                        aria-label={
                          onToggleStatus
                            ? isLocked
                              ? `Mở khóa tài khoản ${account.fullName}`
                              : `Khóa tài khoản ${account.fullName}`
                            : isLocked
                            ? 'Mở khóa tài khoản (sắp ra mắt)'
                            : 'Khóa tài khoản (sắp ra mắt)'
                        }
                        title={
                          onToggleStatus
                            ? isLocked
                              ? `Mở khóa tài khoản ${account.fullName}`
                              : `Khóa tài khoản ${account.fullName}`
                            : isLocked
                            ? 'Mở khóa tài khoản (Tính năng chưa kích hoạt)'
                            : 'Khóa tài khoản (Tính năng chưa kích hoạt)'
                        }
                        className={`p-1.5 rounded-md border transition-colors ${
                          onToggleStatus
                            ? isLocked
                              ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 bg-white border-slate-200 cursor-pointer shadow-2xs'
                              : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 bg-white border-slate-200 cursor-pointer shadow-2xs'
                            : 'text-slate-400 hover:text-slate-600 bg-slate-50 border-transparent hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed'
                        }`}
                      >
                        {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
