// Interface định nghĩa thông tin người dùng
export interface User {
  id: number | string;
  email: string;
  role?: string;
  fullName?: string;
}

// Interface định nghĩa Payload gửi đi khi Đăng nhập
export interface LoginRequest {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

// Interface định nghĩa kết quả trả về khi Đăng nhập thành công
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  user?: User;
}

// Interface định nghĩa Payload gửi đi khi Quên mật khẩu
export interface ForgotPasswordRequest {
  email: string;
}

// Interface định nghĩa kết quả trả về chung cho các API có message
export interface ApiMessageResponse {
  message: string;
}
