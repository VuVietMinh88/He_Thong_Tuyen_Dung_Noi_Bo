// Interface định nghĩa cấu trúc của Token lưu trữ
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Hàm lưu token vào bộ nhớ của trình duyệt
 * @param tokens Các token nhận được từ API
 * @param rememberMe Cờ xác định có lưu vĩnh viễn (localStorage) hay chỉ lưu trong phiên (sessionStorage)
 */
export const setTokens = (tokens: AuthTokens, rememberMe: boolean = false): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('accessToken', tokens.accessToken);
  if (tokens.refreshToken) {
    storage.setItem('refreshToken', tokens.refreshToken);
  }
};

/**
 * Lấy Access Token hiện tại
 * @returns Access Token hoặc null nếu không tồn tại
 */
export const getAccessToken = (): string | null => {
  // Ưu tiên check trong sessionStorage (phiên hiện tại), sau đó mới check localStorage
  return sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
};

/**
 * Lấy Refresh Token hiện tại
 * @returns Refresh Token hoặc null nếu không tồn tại
 */
export const getRefreshToken = (): string | null => {
  return sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');
};

/**
 * Xóa sạch toàn bộ cấu trúc Token (Thực hiện khi Đăng xuất hoặc Hết hạn phiên)
 */
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};
