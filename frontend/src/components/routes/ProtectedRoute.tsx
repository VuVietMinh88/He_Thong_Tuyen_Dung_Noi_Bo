import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';

export interface ProtectedRouteProps {
	allowedRoles?: string[];
	requiredPermissions?: string[];
	redirectPath?: string;
	children?: ReactNode;
}

export const ProtectedRoute = ({
	allowedRoles,
	requiredPermissions,
	redirectPath = '/unauthorized',
	children,
}: ProtectedRouteProps): React.JSX.Element => {
	const location = useLocation();
	const {
		isAuthenticated,
		hasAnyRole,
		hasAllPermissions,
	} = usePermission();

	const hasAllowedRole = !allowedRoles?.length || hasAnyRole(allowedRoles);
	const hasRequiredPermission = !requiredPermissions?.length
		|| hasAllPermissions(requiredPermissions);

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location }}
			/>
		);
	}

	if (!hasAllowedRole || !hasRequiredPermission) {
		return (
			<Navigate
				to={redirectPath}
				replace
				state={{ from: location }}
			/>
		);
	}

	return <>{children ?? <Outlet />}</>;
};
