import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { AccountStatus } from '../../types/account';

export interface AccountSearchBarProps {
  initialSearch?: string;
  initialRole?: string;
  initialStatus?: AccountStatus | '';
  onSearchChange: (search: string) => void;
  onRoleChange: (role: string) => void;
  onStatusChange: (status: AccountStatus | '') => void;
  onResetFilters: () => void;
}

/**
 * Component thanh tìm kiếm và bộ lọc tài khoản (TKNHTTDNB1-150).
 * Cho phép tìm kiếm theo Họ tên, Email với cơ chế debounce 350ms nhằm hạn chế gọi API liên tục.
 */
export const AccountSearchBar: React.FC<AccountSearchBarProps> = ({
  initialSearch = '',
  initialRole = '',
  initialStatus = '',
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onResetFilters,
}) => {
  // State cục bộ lưu trữ từ khóa trong khi người dùng gõ
  const [searchValue, setSearchValue] = useState<string>(initialSearch);
  const [prevInitialSearch, setPrevInitialSearch] = useState<string>(initialSearch);

  // Điều chỉnh state khi prop initialSearch thay đổi từ bên ngoài
  if (initialSearch !== prevInitialSearch) {
    setPrevInitialSearch(initialSearch);
    setSearchValue(initialSearch);
  }

  // Debounce gọi callback tìm kiếm để tối ưu hóa hiệu năng và tránh gọi API dư thừa
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== initialSearch) {
        onSearchChange(searchValue);
      }
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, initialSearch, onSearchChange]);

  // Xóa nội dung tìm kiếm
  const handleClearSearch = (): void => {
    setSearchValue('');
    onSearchChange('');
  };

  const hasActiveFilters = Boolean(
    searchValue.trim() || initialRole || initialStatus
  );

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Ô nhập tìm kiếm Họ tên / Email */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            role="searchbox"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm tài khoản theo họ tên hoặc email..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05998B]/20 focus:border-[#05998B] transition-all"
          />

          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              title="Xóa tìm kiếm"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bộ lọc theo Vai trò và Trạng thái */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          {/* Lọc theo Vai trò */}
          <div className="relative min-w-[140px]">
            <select
              aria-label="Lọc theo vai trò"
              value={initialRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full text-xs font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#05998B]/20 focus:border-[#05998B] cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
              <option value="HR">Nhân sự (HR)</option>
              <option value="INTERVIEWER">Phỏng vấn viên</option>
              <option value="EMPLOYEE">Nhân viên (EMPLOYEE)</option>
            </select>
          </div>

          {/* Lọc theo Trạng thái */}
          <div className="relative min-w-[150px]">
            <select
              aria-label="Lọc theo trạng thái"
              value={initialStatus}
              onChange={(e) => onStatusChange(e.target.value as AccountStatus | '')}
              className="w-full text-xs font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#05998B]/20 focus:border-[#05998B] cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </div>

          {/* Nút đặt lại tất cả bộ lọc khi có điều kiện lọc đang bật */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-lg border border-slate-200 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
