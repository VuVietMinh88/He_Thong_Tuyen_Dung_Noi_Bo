import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken } from './tokenStorage';

// Interface định nghĩa cấu trúc dữ liệu lỗi trả về từ API.
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

// Hàm xóa toàn bộ token và thông tin người dùng khỏi cả localStorage và sessionStorage.
const clearAuthData = (): void => {
  clearTokens();
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
};

// Hàm thay thế URL hiện tại để tránh quay lại trang lỗi bằng nút Back của trình duyệt.
const redirectTo = (path: '/login' | '/unauthorized'): void => {
  const currentPath: string = window.location.pathname;

  if (currentPath !== path) {
    window.location.replace(path);
  }
};

// Khởi tạo instance axios dùng chung cho toàn bộ ứng dụng.
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn token vào mọi request trước khi gửi đi.
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token: string | null = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// Bắt lỗi xác thực và điều hướng theo mã trạng thái phản hồi từ API.
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode: number | undefined = error.response?.status;

    if (statusCode === 401) {
      clearAuthData();
      redirectTo('/login');
    } else if (statusCode === 403) {
      redirectTo('/unauthorized');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
