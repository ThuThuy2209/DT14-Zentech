import { post } from '../../utils/http';
import type { ApiResponse } from '../../utils/http';

// Interface dữ liệu nhận từ form đăng nhập
export interface LoginPayload {
  email?: string;
  usernameOrEmail?: string;
  password: string;
}

// Interface dữ liệu Backend trả về khi đăng nhập thành công
export interface LoginData {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    status: string;
  };
  company?: any;
}

/**
 * Hàm gọi API Đăng nhập kết nối với NestJS (/api/v1/auth/login)
 */
export async function login(payload: LoginPayload): Promise<ApiResponse<LoginData>> {
  // Map email hoặc usernameOrEmail thành đúng trường Backend yêu cầu
  const requestBody = {
    usernameOrEmail: payload.usernameOrEmail || payload.email,
    password: payload.password,
  };

  const response = await post<LoginData>('/auth/login', requestBody);

  // Nếu đăng nhập thành công thì lưu token & user vào localStorage
  if (response.success && response.data) {
    const { accessToken, user, company } = response.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (company) {
      localStorage.setItem('company', JSON.stringify(company));
    }
  }

  return response;
}

/**
 * Hàm đăng xuất
 */
export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('company');
}

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}