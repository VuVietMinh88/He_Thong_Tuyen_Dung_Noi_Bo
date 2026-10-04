import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, UserCheck, UserX, RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';
import type {
  Account,
  AccountPagination as PaginationType,
  AccountQueryParams,
  AccountStatus,
} from '../../../types/account';
import { accountService } from '../../../services/accountService';
import { AccountSearchBar } from '../../../components/account/AccountSearchBar';
import { AccountTable } from '../../../components/account/AccountTable';
import { AccountPagination } from '../../../components/account/AccountPagination';
import { AccountEditModal } from '../../../components/account/AccountEditModal';
import { AccountRoleModal } from '../../../components/account/AccountRoleModal';
import { AccountStatusConfirmModal } from '../../../components/account/AccountStatusConfirmModal';
import { usePermission } from '../../../hooks/usePermission';

/**
 * Trang Quản lý Danh sách tài khoản dành cho Quản trị viên (Story 17 - TKNHTTDNB1-142, TKNHTTDNB1-144, TKNHTTDNB1-150).
 * Tích hợp tìm kiếm theo từ khóa, lọc theo vai trò, lọc trạng thái, phân trang linh hoạt và chỉnh sửa thông tin tài khoản.
 */
export const AccountList: React.FC = () => {
  // Danh sách tài khoản người dùng hiện tại
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Dữ liệu phân trang
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  });

  // Trạng thái tải dữ liệu và thông báo lỗi
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Tham số truy vấn hiện tại của bảng tài khoản (TKNHTTDNB1-150)
  const [queryParams, setQueryParams] = useState<AccountQueryParams>({
    page: 1,
    size: 10,
    search: '',
    role: '',
    status: '',
  });

  // Trạng thái Form Chỉnh sửa tài khoản (TKNHTTDNB1-144)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Trạng thái Modal Phân quyền vai trò tài khoản (TKNHTTDNB1-152)
  const [selectedAccountForRole, setSelectedAccountForRole] = useState<Account | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Trạng thái Modal Khóa / Mở khóa tài khoản (TKNHTTDNB1-161)
  const [selectedAccountForStatus, setSelectedAccountForStatus] = useState<Account | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  // Kiểm tra quyền hạn của người dùng đăng nhập hiện tại
  const { hasRole, hasAnyRole } = usePermission();
  const canManageRoleAndStatus: boolean = hasRole('ADMIN') || hasAnyRole(['ADMIN']);

  // Trạng thái thông báo phản hồi thao tác người dùng (Toast Alert)
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Ref theo dõi mã thứ tự của request nhằm ngăn ngừa race-condition và gọi trùng lặp
  const requestSeqRef = useRef<number>(0);

  // Tự động đóng thông báo phản hồi sau 4 giây
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Hàm tải dữ liệu danh sách tài khoản từ API Service
  const loadAccounts = useCallback(async (params: AccountQueryParams): Promise<void> => {
    const currentSeq = ++requestSeqRef.current;

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const response = await accountService.getAccounts(params);

      // Nếu đã có một request mới hơn được phát đi, bỏ qua kết quả của request này
      if (currentSeq !== requestSeqRef.current) {
        return;
      }

      setAccounts(Array.isArray(response?.data) ? response.data : []);
      if (response?.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: unknown) {
      if (currentSeq !== requestSeqRef.current) {
        return;
      }

      setIsError(true);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Không thể kết nối đến máy chủ, vui lòng thử lại sau.');
      }
    } finally {
      if (currentSeq === requestSeqRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Gọi API mỗi khi queryParams thay đổi (chạy qua Promise microtask để tránh cảnh báo render cascading)
  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) {
        void loadAccounts(queryParams);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadAccounts, queryParams]);

  // Xử lý khi người dùng đổi từ khóa tìm kiếm (TKNHTTDNB1-150)
  const handleSearchChange = useCallback((newSearch: string): void => {
    setQueryParams((prev) => {
      if (prev.search === newSearch) {
        return prev;
      }
      return {
        ...prev,
        search: newSearch,
        page: 1, // Khi tìm kiếm từ mới, luôn quay về trang đầu tiên
      };
    });
  }, []);

  // Xử lý khi đổi vai trò lọc
  const handleRoleChange = useCallback((newRole: string): void => {
    setQueryParams((prev) => ({
      ...prev,
      role: newRole,
      page: 1,
    }));
  }, []);

  // Xử lý khi đổi trạng thái lọc
  const handleStatusChange = useCallback((newStatus: AccountStatus | ''): void => {
    setQueryParams((prev) => ({
      ...prev,
      status: newStatus,
      page: 1,
    }));
  }, []);

  // Xử lý đặt lại toàn bộ điều kiện tìm kiếm và lọc
  const handleResetFilters = useCallback((): void => {
    setQueryParams({
      page: 1,
      size: 10,
      search: '',
      role: '',
      status: '',
    });
  }, []);

  // Xử lý chuyển trang (TKNHTTDNB1-150)
  const handlePageChange = useCallback((newPage: number): void => {
    setQueryParams((prev) => {
      if (prev.page === newPage) {
        return prev;
      }
      return {
        ...prev,
        page: newPage,
      };
    });
  }, []);

  // Xử lý thay đổi số lượng bản ghi mỗi trang (TKNHTTDNB1-150)
  const handleSizeChange = useCallback((newSize: number): void => {
    setQueryParams((prev) => {
      if (prev.size === newSize) {
        return prev;
      }
      return {
        ...prev,
        size: newSize,
        page: 1,
      };
    });
  }, []);

  // Mở modal chỉnh sửa tài khoản (TKNHTTDNB1-144)
  const handleOpenEditModal = useCallback((account: Account): void => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  }, []);

  // Đóng modal chỉnh sửa tài khoản
  const handleCloseEditModal = useCallback((): void => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  }, []);

  // Xử lý sau khi cập nhật tài khoản thành công (TKNHTTDNB1-144)
  const handleEditSuccess = useCallback(
    (updatedAccount: Account, message: string): void => {
      // 1. Cập nhật tức thì vào state accounts để giao diện phản hồi mượt mà
      setAccounts((prev) =>
        prev.map((acc) =>
          String(acc.id) === String(updatedAccount.id) ? { ...acc, ...updatedAccount } : acc
        )
      );

      // 2. Hiển thị thông báo thành công cho người dùng
      setToastNotification({
        message,
        type: 'success',
      });

      // 3. Đồng bộ lại dữ liệu danh sách từ server
      void loadAccounts(queryParams);
    },
    [loadAccounts, queryParams]
  );

  // Mở modal phân quyền vai trò tài khoản (TKNHTTDNB1-152)
  const handleOpenRoleModal = useCallback((account: Account): void => {
    setSelectedAccountForRole(account);
    setIsRoleModalOpen(true);
  }, []);

  // Đóng modal phân quyền vai trò
  const handleCloseRoleModal = useCallback((): void => {
    setIsRoleModalOpen(false);
    setSelectedAccountForRole(null);
  }, []);

  // Xử lý sau khi cập nhật vai trò thành công (TKNHTTDNB1-152)
  const handleRoleSuccess = useCallback(
    (updatedAccount: Account, message: string): void => {
      setAccounts((prev) =>
        prev.map((acc) =>
          String(acc.id) === String(updatedAccount.id) ? { ...acc, ...updatedAccount } : acc
        )
      );

      setToastNotification({
        message,
        type: 'success',
      });

      void loadAccounts(queryParams);
    },
    [loadAccounts, queryParams]
  );

  // Mở modal xác nhận thay đổi trạng thái Khóa / Mở khóa tài khoản (TKNHTTDNB1-161)
  const handleOpenStatusModal = useCallback((account: Account): void => {
    setSelectedAccountForStatus(account);
    setIsStatusModalOpen(true);
  }, []);

  // Đóng modal xác nhận thay đổi trạng thái
  const handleCloseStatusModal = useCallback((): void => {
    setIsStatusModalOpen(false);
    setSelectedAccountForStatus(null);
  }, []);

  // Xử lý sau khi thay đổi trạng thái tài khoản thành công (TKNHTTDNB1-161)
  const handleStatusSuccess = useCallback(
    (updatedAccount: Account, message: string): void => {
      setAccounts((prev) =>
        prev.map((acc) =>
          String(acc.id) === String(updatedAccount.id) ? { ...acc, ...updatedAccount } : acc
        )
      );

      setToastNotification({
        message,
        type: 'success',
      });

      void loadAccounts(queryParams);
    },
    [loadAccounts, queryParams]
  );

  // Thống kê nhanh số lượng tài khoản theo dữ liệu hiện tại
  const safeAccounts: Account[] = Array.isArray(accounts) ? accounts : [];
  const activeCount: number = safeAccounts.filter((acc) => acc.status?.toUpperCase() === 'ACTIVE').length;
  const lockedCount: number = safeAccounts.filter((acc) => acc.status?.toUpperCase() === 'LOCKED').length;

  const hasFiltersActive: boolean = Boolean(
    queryParams.search?.trim() || queryParams.role || queryParams.status
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* Thông báo dạng Toast góc trên màn hình */}
      {toastNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white animate-in slide-in-from-top-3 duration-200 transition-all max-w-md border-emerald-200"
        >
          {toastNotification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-800 flex-1">
            {toastNotification.message}
          </span>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tiêu đề trang và Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Quản trị hệ thống</span>
            <span>/</span>
            <span className="text-[#00867D] font-semibold">Quản lý tài khoản</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Danh Sách Tài Khoản
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý thông tin, phân quyền vai trò và giám sát trạng thái tài khoản của toàn bộ cán bộ nhân sự.
          </p>
        </div>

        {/* Nút làm mới dữ liệu */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadAccounts(queryParams)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Thẻ thống kê tổng quan (Dashboard Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tổng số tài khoản */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tổng số tài khoản
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {pagination.totalElements}
            </p>
          </div>
        </div>

        {/* Đang hoạt động */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
              Đang hoạt động (Trang này)
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {activeCount}
            </p>
          </div>
        </div>

        {/* Đã khóa */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">
              Đã khóa (Trang này)
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {lockedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc (TKNHTTDNB1-150) */}
      <AccountSearchBar
        initialSearch={queryParams.search}
        initialRole={queryParams.role}
        initialStatus={queryParams.status}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
      />

      {/* Bảng danh sách tài khoản (TKNHTTDNB1-142, TKNHTTDNB1-144 & TKNHTTDNB1-160) */}
      <div className="shadow-xs rounded-xl">
        <AccountTable
          accounts={accounts}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={() => loadAccounts(queryParams)}
          hasFiltersActive={hasFiltersActive}
          onClearFilters={handleResetFilters}
          onEditAccount={handleOpenEditModal}
          onManageRole={canManageRoleAndStatus ? handleOpenRoleModal : undefined}
          onToggleStatus={canManageRoleAndStatus ? handleOpenStatusModal : undefined}
        />

        {/* Phân trang (TKNHTTDNB1-150) */}
        {!isLoading && !isError && accounts.length > 0 && (
          <AccountPagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
          />
        )}
      </div>

      {/* Modal Form Chỉnh sửa thông tin tài khoản (TKNHTTDNB1-144) */}
      <AccountEditModal
        isOpen={isEditModalOpen}
        account={selectedAccount}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />

      {/* Modal Phân quyền vai trò người dùng (TKNHTTDNB1-152) */}
      <AccountRoleModal
        isOpen={isRoleModalOpen}
        account={selectedAccountForRole}
        onClose={handleCloseRoleModal}
        onSuccess={handleRoleSuccess}
      />

      {/* Modal Xác nhận Khóa / Mở khóa tài khoản (TKNHTTDNB1-161) */}
      <AccountStatusConfirmModal
        isOpen={isStatusModalOpen}
        account={selectedAccountForStatus}
        onClose={handleCloseStatusModal}
        onSuccess={handleStatusSuccess}
      />
    </div>
  );
};

export default AccountList;
