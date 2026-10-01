import axios from 'axios';
import type { LoginRequest, LoginResponse, ForgotPasswordRequest, ApiMessageResponse } from '../types/auth';

// Khởi tạo instance axios với cấu hình cơ bản
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000, // Tự động ngắt nếu không phản hồi sau 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm Interceptor để tự động đính kèm Token vào request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Các hàm call API liên quan đến xác thực (Login, Forgot Password)
export const authService = {
  // Hàm xử lý Đăng nhập
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
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

  // Hàm xử lý Quên mật khẩu
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiMessageResponse> => {
    const response = await apiClient.post<ApiMessageResponse>('/auth/forgot-password', data);
    return response.data;
  },

  // Hàm Đăng xuất
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('currentUser');
  }
};
