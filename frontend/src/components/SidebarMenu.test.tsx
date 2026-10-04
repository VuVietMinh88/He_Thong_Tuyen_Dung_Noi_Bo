import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SidebarMenu } from './SidebarMenu';
import * as AuthContextModule from '../context/AuthContext';

// Mock hook useAuth để giả lập các ngữ cảnh quyền khác nhau
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(AuthContextModule.useAuth);

// Hàm tiện ích bọc component trong Router vì NavLink cần nằm trong Router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SidebarMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Hiển thị đúng menu cho quyền ADMIN', () => {
    // Giả lập ADMIN có đầy đủ quyền
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        name: 'Admin User',
        role: 'ADMIN',
        permissions: ['APPROVE_RECRUITMENT', 'VIEW_SALARY_REPORT'],
      },
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithRouter(<SidebarMenu />);
    
    // Admin thấy đủ 6 menu item
    expect(screen.getByText('Trang Chủ')).toBeInTheDocument();
    expect(screen.getByText('Quản Lý Nhân Sự')).toBeInTheDocument();
    expect(screen.getByText('Duyệt Tuyển Dụng')).toBeInTheDocument();
    expect(screen.getByText('Báo Cáo Lương')).toBeInTheDocument();
    expect(screen.getByText('Cài Đặt Bảo Mật')).toBeInTheDocument();
    expect(screen.getByText('Cấu Hình Hệ Thống')).toBeInTheDocument();
  });

  it('2. Ẩn menu Báo Cáo Lương và Cấu Hình với nhân viên thường (EMPLOYEE)', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '2',
        name: 'Normal Emp',
        role: 'EMPLOYEE',
        permissions: [], // Không có quyền đặc biệt
      },
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithRouter(<SidebarMenu />);
    
    expect(screen.getByText('Trang Chủ')).toBeInTheDocument();
    expect(screen.getByText('Cài Đặt Bảo Mật')).toBeInTheDocument();
    
    // Các menu bị ẩn do thiếu role/permission
    expect(screen.queryByText('Quản Lý Nhân Sự')).not.toBeInTheDocument();
    expect(screen.queryByText('Báo Cáo Lương')).not.toBeInTheDocument();
    expect(screen.queryByText('Cấu Hình Hệ Thống')).not.toBeInTheDocument();
    expect(screen.queryByText('Duyệt Tuyển Dụng')).not.toBeInTheDocument();
  });

  it('3. HR có thể thấy Quản Lý Nhân Sự nhưng không thấy Cấu Hình Hệ Thống', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '3',
        name: 'HR User',
        role: 'HR',
        permissions: ['APPROVE_RECRUITMENT'], // HR có quyền duyệt tuyển dụng
      },
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithRouter(<SidebarMenu />);
    
    expect(screen.getByText('Trang Chủ')).toBeInTheDocument();
    expect(screen.getByText('Quản Lý Nhân Sự')).toBeInTheDocument();
    expect(screen.getByText('Duyệt Tuyển Dụng')).toBeInTheDocument(); // Do có quyền
    
    // HR không phải ADMIN nên không thấy Cấu hình
    expect(screen.queryByText('Cấu Hình Hệ Thống')).not.toBeInTheDocument();
    expect(screen.queryByText('Báo Cáo Lương')).not.toBeInTheDocument();
  });

  it('4. Giao diện thu gọn (isCollapsed = true) sẽ ẩn label chữ', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'A', role: 'ADMIN', permissions: [] },
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithRouter(<SidebarMenu isCollapsed={true} />);
    
    // Không còn chữ 'Trang Chủ'
    expect(screen.queryByText('Trang Chủ')).not.toBeInTheDocument();
    
    // Title thu gọn thay đổi từ 'HRM System' sang 'HRM'
    expect(screen.getByText('HRM')).toBeInTheDocument();
    expect(screen.queryByText('HRM System')).not.toBeInTheDocument();
  });
});
