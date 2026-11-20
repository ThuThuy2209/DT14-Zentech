import { API_BASE_URL } from '../constants/api';

// Định dạng dữ liệu phản hồi chuẩn theo CONTRIBUTING.md của nhóm
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
}

/**
 * Hàm tiện ích gọi POST API dùng chung cho toàn bộ dự án
 * @param endpoint Đường dẫn API (ví dụ: '/auth/login')
 * @param body Dữ liệu gửi lên server (object)
 */
export async function post<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  // Tự động lấy token nếu người dùng đã đăng nhập
  const token = localStorage.getItem('accessToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ghép URL: bỏ dấu / thừa nếu có
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
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
    console.error(`[POST Error] ${url}:`, error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ Backend (Port 8080). Vui lòng thử lại!',
      errorCode: 'NETWORK_ERROR',
      data: null as any,
    };
  }
}