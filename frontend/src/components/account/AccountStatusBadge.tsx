import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import type { AccountStatus } from '../../types/account';

// Định nghĩa giao diện Props cho component AccountStatusBadge
export interface AccountStatusBadgeProps {
  status: AccountStatus | string;
  className?: string;
}

/**
 * Component hiển thị nhãn trạng thái tài khoản (TKNHTTDNB1-160).
 * Màu sắc tuân theo chuẩn Design System:
 * - ACTIVE: Xanh lục tươi sáng, biểu thị tài khoản đang hoạt động.
 * - LOCKED: Đỏ hồng cảnh báo, biểu thị tài khoản đã bị khóa.
 */
export const AccountStatusBadge: React.FC<AccountStatusBadgeProps> = ({ status, className = '' }) => {
  const normalizedStatus = (status || '').toUpperCase();
  const isActive = normalizedStatus === 'ACTIVE';

  if (isActive) {
    return (
      <span
        data-testid="status-badge-active"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>Hoạt động</span>
      </span>
    );
  }

  return (
    <span
      data-testid="status-badge-locked"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs ${className}`}
    >
      <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
      <span>Đã khóa</span>
    </span>
  );
};
