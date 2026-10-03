import { useAuth } from '../context/AuthContext';

export interface UsePermissionResult {
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const usePermission = (): UsePermissionResult => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean =>
    user?.permissions.includes(permission) ?? false;

  const hasAllPermissions = (permissions: string[]): boolean =>
    permissions.every(hasPermission);

  const hasAnyPermission = (permissions: string[]): boolean =>
    permissions.some(hasPermission);

  const hasRole = (role: string): boolean => user?.role === role;

  const hasAnyRole = (roles: string[]): boolean => roles.some(hasRole);

  return {
    isAuthenticated: user !== null,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
  };
};