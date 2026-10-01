import axiosClient from '../utils/axiosClient';
import type { LoginRequest, LoginResponse, ForgotPasswordRequest, ApiMessageResponse } from '../types/auth';

// Các hàm gọi API liên quan đến xác thực như đăng nhập, quên mật khẩu và đăng xuất.
export const authService = {
  // Hàm xử lý đăng nhập và lưu token/user theo lựa chọn "ghi nhớ đăng nhập".
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/auth/login', data);
    const responseData = response.data;
    
    if (responseData.accessToken) {
      if (data.rememberMe) {
        localStorage.setItem('accessToken', responseData.accessToken);
        if (responseData.user) {
          localStorage.setItem('currentUser', JSON.stringify(responseData.user));
        }
      } else {
        sessionStorage.setItem('accessToken', responseData.accessToken);
        if (responseData.user) {
          sessionStorage.setItem('currentUser', JSON.stringify(responseData.user));
        }
      }
    }
    
    return responseData;
  },

  // Hàm xử lý yêu cầu quên mật khẩu.
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiMessageResponse> => {
    const response = await axiosClient.post<ApiMessageResponse>('/auth/forgot-password', data);
    return response.data;
  },

  // Hàm đăng xuất, xóa token và thông tin người dùng khỏi cả hai bộ nhớ.
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('currentUser');
  }
};
