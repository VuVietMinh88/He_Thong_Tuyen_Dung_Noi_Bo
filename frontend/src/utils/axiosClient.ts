import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Interface định nghĩa cấu trúc dữ liệu lỗi trả về từ API.
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

// Danh sách khóa dữ liệu xác thực cần xóa khi phiên hết hạn hoặc token không hợp lệ.
const AUTH_STORAGE_KEYS: string[] = ['accessToken', 'refreshToken', 'currentUser'];

// Hàm xóa toàn bộ token và thông tin người dùng khỏi cả localStorage và sessionStorage.
const clearAuthData = (): void => {
  const storageList: Storage[] = [localStorage, sessionStorage];

  storageList.forEach((storage: Storage) => {
    AUTH_STORAGE_KEYS.forEach((key: string) => {
      storage.removeItem(key);
    });
  });
};

// Hàm điều hướng an toàn về trang đăng nhập khi phiên hết hạn.
const redirectToLogin = (): void => {
  const currentPath: string = window.location.pathname;

  if (currentPath !== '/login') {
    window.location.href = '/login';
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
    const token: string | null = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// Bắt toàn bộ lỗi từ API và xử lý khi phản hồi trả về 401 Unauthorized.
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode: number | undefined = error.response?.status;

    if (statusCode === 401) {
      clearAuthData();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
