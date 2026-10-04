import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type AuthUser } from '../context/AuthContext';
import { AuthProvider } from '../context/AuthProvider';
import { usePermission } from '../hooks/usePermission';
import { PermissionGuard, type PermissionGuardProps } from './PermissionGuard';

const testUser: AuthUser = {
  id: 'user-1',
  name: 'Người dùng kiểm thử',
  role: 'HR',
  permissions: ['VIEW_REPORT', 'EDIT_PROFILE'],
};

const PermissionChecks = (): React.JSX.Element => {
  const {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
  } = usePermission();

  return (
    <div>
      <span data-testid="single-permission">{String(hasPermission('VIEW_REPORT'))}</span>
      <span data-testid="all-permissions">
        {String(hasAllPermissions(['VIEW_REPORT', 'EDIT_PROFILE']))}
      </span>
      <span data-testid="some-permission">
        {String(hasAnyPermission(['DELETE_USER', 'VIEW_REPORT']))}
      </span>
      <span data-testid="exact-role">{String(hasRole('HR'))}</span>
      <span data-testid="allowed-role">{String(hasAnyRole(['ADMIN', 'HR']))}</span>
    </div>
  );
};

const renderGuard = (
  props: Omit<PermissionGuardProps, 'children'>,
  user: AuthUser | null = testUser,
): void => {
  render(
    <AuthProvider user={user}>
      <PermissionGuard {...props}>
        <span>Nội dung được bảo vệ</span>
      </PermissionGuard>
    </AuthProvider>,
  );
};

describe('usePermission', () => {
  it('kiểm tra quyền đơn, tập quyền và vai trò', () => {
    render(
      <AuthProvider user={testUser}>
        <PermissionChecks />
      </AuthProvider>,
    );

    expect(screen.getByTestId('single-permission')).toHaveTextContent('true');
    expect(screen.getByTestId('all-permissions')).toHaveTextContent('true');
    expect(screen.getByTestId('some-permission')).toHaveTextContent('true');
    expect(screen.getByTestId('exact-role')).toHaveTextContent('true');
    expect(screen.getByTestId('allowed-role')).toHaveTextContent('true');
  });
});

describe('PermissionGuard', () => {
  it('hiển thị nội dung khi khớp vai trò và tất cả quyền yêu cầu', () => {
    renderGuard({
      allowedRoles: ['ADMIN', 'HR'],
      requiredPermissions: ['VIEW_REPORT', 'EDIT_PROFILE'],
      requireAll: true,
    });

    expect(screen.getByText('Nội dung được bảo vệ')).toBeInTheDocument();
  });

  it('hiển thị fallback khi thiếu một quyền trong chế độ requireAll', () => {
    renderGuard({
      requiredPermissions: ['VIEW_REPORT', 'DELETE_USER'],
      requireAll: true,
      fallback: <span>Không đủ quyền</span>,
    });

    expect(screen.getByText('Không đủ quyền')).toBeInTheDocument();
    expect(screen.queryByText('Nội dung được bảo vệ')).not.toBeInTheDocument();
  });

  it('ẩn nội dung khi người dùng chưa đăng nhập', () => {
    renderGuard({}, null);

    expect(screen.queryByText('Nội dung được bảo vệ')).not.toBeInTheDocument();
  });
});