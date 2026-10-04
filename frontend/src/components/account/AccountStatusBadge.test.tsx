import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccountStatusBadge } from './AccountStatusBadge';

describe('AccountStatusBadge Component (TKNHTTDNB1-160)', () => {
  it('1. Hiển thị nhãn Hoạt động khi trạng thái là ACTIVE', () => {
    render(<AccountStatusBadge status="ACTIVE" />);
    expect(screen.getByTestId('status-badge-active')).toBeInTheDocument();
    expect(screen.getByText('Hoạt động')).toBeInTheDocument();
  });

  it('2. Hiển thị nhãn Đã khóa khi trạng thái là LOCKED', () => {
    render(<AccountStatusBadge status="LOCKED" />);
    expect(screen.getByTestId('status-badge-locked')).toBeInTheDocument();
    expect(screen.getByText('Đã khóa')).toBeInTheDocument();
  });

  it('3. Mặc định hiển thị Đã khóa khi trạng thái không hợp lệ hoặc rỗng', () => {
    render(<AccountStatusBadge status="" />);
    expect(screen.getByTestId('status-badge-locked')).toBeInTheDocument();
  });
});
