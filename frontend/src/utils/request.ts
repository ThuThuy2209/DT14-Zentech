import { API_BASE_URL } from '../constants/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
}

/**
 * Hàm gọi API tổng quát tự động đính kèm Token đăng nhập
 */
export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || `Lỗi máy chủ (${response.status})`,
        errorCode: resData.errorCode || `HTTP_${response.status}`,
        data: null as any,
      };
    }

    return resData;
  } catch (error: any) {
    console.error(`[API Error] ${url}:`, error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ Backend (Port 8080). Vui lòng đảm bảo backend đang chạy!',
      errorCode: 'NETWORK_ERROR',
      data: null as any,
    };
  }
}

// Các hàm tiện ích dùng cho toàn bộ dự án
export const get = <T = any>(endpoint: string) => request<T>(endpoint, { method: 'GET' });
export const post = <T = any>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
export const patch = <T = any>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
export const put = <T = any>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
export const del = <T = any>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' });