import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PermissionGuard } from '../../components/PermissionGuard';
import { ProtectedRoute } from '../../components/routes/ProtectedRoute';
import { AuthProvider } from '../../context/AuthProvider';
import { LoginPage } from './LoginPage';

describe('LoginPage và AuthContext', () => {
  it('đưa user đã đăng nhập vào ProtectedRoute', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={['ADMIN']}
                  requiredPermissions={['MANAGE_USERS']}
                />
              }
            >
              <Route
                path="/dashboard"
                element={
                  <PermissionGuard requiredPermissions={['VIEW_SALARY_REPORT']}>
                    <p>Bảng điều khiển dành cho quản trị viên</p>
                  </PermissionGuard>
                }
              />
            </Route>
            <Route path="/unauthorized" element={<p>Không có quyền truy cập</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await user.type(screen.getByPlaceholderText('••••••••'), '123456');
    await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));

    expect(await screen.findByText('Bảng điều khiển dành cho quản trị viên', {}, { timeout: 3000 }))
      .toBeInTheDocument();
    expect(screen.queryByText('Không có quyền truy cập')).not.toBeInTheDocument();
  });
});