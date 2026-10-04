import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { AccountPagination as PaginationType } from '../../types/account';

// Định nghĩa giao diện Props cho thanh phân trang tài khoản
export interface AccountPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

/**
 * Component thanh điều hướng phân trang cho danh sách tài khoản (TKNHTTDNB1-150).
 * Cung cấp chọn số bản ghi mỗi trang (5, 10, 20, 50), nút trang trước/sau, về đầu/về cuối.
 */
export const AccountPagination: React.FC<AccountPaginationProps> = ({
  pagination,
  onPageChange,
  onSizeChange,
}) => {
  const { page, size, totalElements, totalPages } = pagination;

  // Tính toán phạm vi số thứ tự bản ghi đang hiển thị
  const startItem: number = totalElements === 0 ? 0 : (page - 1) * size + 1;
  const endItem: number = Math.min(page * size, totalElements);

  // Tạo danh sách các số trang cần hiển thị xung quanh trang hiện tại
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers: number[] = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-slate-200 text-sm rounded-b-xl">
      {/* Thông tin số lượng hiển thị và bộ chọn kích thước trang */}
      <div className="flex items-center gap-3 text-slate-500 text-xs sm:text-sm">
        <span>
          Hiển thị <span className="font-semibold text-slate-900">{startItem}</span> -{' '}
          <span className="font-semibold text-slate-900">{endItem}</span> trong tổng số{' '}
          <span className="font-semibold text-slate-900">{totalElements}</span> tài khoản
        </span>

        <span className="hidden sm:inline-block text-slate-300">|</span>

        {/* Dropdown chọn số lượng bản ghi hiển thị trên mỗi trang */}
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline-block">Hiển thị</span>
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            aria-label="Chọn số bản ghi trên mỗi trang"
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#00867D] cursor-pointer"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
        </div>
      </div>

      {/* Cụm nút bấm điều hướng trang */}
      <div className="flex items-center gap-1">
        {/* Nút về trang đầu tiên */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          title="Trang đầu tiên"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Nút lùi về trang trước */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Trang trước"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Các số trang cụ thể */}
        {pageNumbers.map((pageNum) => {
          const isCurrentPage = pageNum === page;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all ${
                isCurrentPage
                  ? 'bg-[#00867D] text-white shadow-2xs'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Nút sang trang kế tiếp */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          title="Trang sau"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Nút đến trang cuối cùng */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          title="Trang cuối cùng"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
