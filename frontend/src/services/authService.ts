import { get, post, patch } from '../utils/request';
import type { ApiResponse } from '../utils/request';

// Interface nhận từ form đăng nhập
export interface LoginPayload {
  email?: string;
  usernameOrEmail?: string;
  password: string;
}

// Interface Backend trả về khi đăng nhập
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

// Interface thông tin công ty
export interface CompanyData {
  id?: number;
  companyName: string;
  taxCode: string;
  address?: string;
  email?: string;
  phone?: string;
  representative?: string;
}

/**
 * 1. Đăng nhập (/api/v1/auth/login)
 */
export async function login(payload: LoginPayload): Promise<ApiResponse<LoginData>> {
  const requestBody = {
    usernameOrEmail: payload.usernameOrEmail || payload.email,
    password: payload.password,
  };

  const response = await post<LoginData>('/auth/login', requestBody);

  if (response.success && response.data) {
    const { accessToken, user, company } = response.data;
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    if (company) localStorage.setItem('company', JSON.stringify(company));
  }

  return response;
}

/**
 * 2. Đăng xuất (/api/v1/auth/logout)
 */
export async function logout(): Promise<void> {
  try {
    await post('/auth/logout');
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  }
}

/**
 * 3. Lấy thông tin tài khoản hiện tại (/api/v1/auth/me)
 */
export async function getProfile(): Promise<ApiResponse<any>> {
  return get('/auth/me');
}

/**
 * 4. Đổi mật khẩu (/api/v1/auth/change-password)
 */
export async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
  return post('/auth/change-password', payload);
}

/**
 * 5. Lấy thông tin doanh nghiệp (/api/v1/auth/company)
 */
export async function getCompany(): Promise<ApiResponse<CompanyData>> {
  return get<CompanyData>('/auth/company');
}

/**
 * 6. Cập nhật thông tin doanh nghiệp (/api/v1/auth/company)
 */
export async function updateCompany(payload: Partial<CompanyData>): Promise<ApiResponse<CompanyData>> {
  return patch<CompanyData>('/auth/company', payload);
}

/**
 * 7. Kiểm tra trạng thái đăng nhập
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}