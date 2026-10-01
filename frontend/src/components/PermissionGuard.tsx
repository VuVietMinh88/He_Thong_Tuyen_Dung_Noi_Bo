import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';

export interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions?: string[];
  allowedRoles?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  children,
  requiredPermissions,
  allowedRoles,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps): React.JSX.Element => {
  const { user } = useAuth();
  const {
    hasAllPermissions,
    hasAnyPermission,
    hasAnyRole,
  } = usePermission();

  const hasRequiredRole = !allowedRoles?.length || hasAnyRole(allowedRoles);
  const hasRequiredPermissions = !requiredPermissions?.length
    || (requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions));
  const canAccess = user !== null && hasRequiredRole && hasRequiredPermissions;

  return <>{canAccess ? children : fallback}</>;
};
