import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthProvider';
import type { AuthUser } from '../../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

const authenticatedUser: AuthUser = {
  id: 'user-1',
  name: 'Người dùng kiểm thử',
  role: 'HR',
  permissions: ['VIEW_REPORT'],
};

describe('ProtectedRoute', () => {
  it('chuyển người chưa đăng nhập đến đường dẫn mặc định', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route
              path="/private"
              element={<ProtectedRoute><p>Nội dung riêng tư</p></ProtectedRoute>}
            />
            <Route path="/unauthorized" element={<p>Không được phép</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText('Không được phép')).toBeInTheDocument();
    expect(screen.queryByText('Nội dung riêng tư')).not.toBeInTheDocument();
  });

  it('chuyển người thiếu vai trò đến redirectPath tùy chỉnh', () => {
    render(
      <AuthProvider user={authenticatedUser}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route
              path="/private"
              element={
                <ProtectedRoute
                  allowedRoles={['ADMIN']}
                  redirectPath="/forbidden"
                >
                  <p>Nội dung riêng tư</p>
                </ProtectedRoute>
              }
            />
            <Route path="/forbidden" element={<p>Không đủ vai trò</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText('Không đủ vai trò')).toBeInTheDocument();
  });

  it('render children khi user có đủ quyền', () => {
    render(
      <AuthProvider user={authenticatedUser}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route
              path="/private"
              element={
                <ProtectedRoute requiredPermissions={['VIEW_REPORT']}>
                  <p>Quyền truy cập hợp lệ</p>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText('Quyền truy cập hợp lệ')).toBeInTheDocument();
  });

  it('chuyển hướng nếu user chỉ có một phần quyền được yêu cầu', () => {
    render(
      <AuthProvider user={authenticatedUser}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route
              path="/private"
              element={
                <ProtectedRoute
                  requiredPermissions={['VIEW_REPORT', 'EDIT_USER']}
                  redirectPath="/forbidden"
                >
                  <p>Nội dung riêng tư</p>
                </ProtectedRoute>
              }
            />
            <Route path="/forbidden" element={<p>Thiếu quyền yêu cầu</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText('Thiếu quyền yêu cầu')).toBeInTheDocument();
    expect(screen.queryByText('Nội dung riêng tư')).not.toBeInTheDocument();
  });

  it('render Outlet khi bảo vệ nested route', () => {
    render(
      <AuthProvider user={authenticatedUser}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['HR']} />}>
              <Route path="/private" element={<p>Nested route hợp lệ</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText('Nested route hợp lệ')).toBeInTheDocument();
  });
});