import { get, post, patch, del } from '../utils/request';
import type { ApiResponse } from '../utils/request';

export interface CustomerItem {
  id: number;
  customerName: string;
  taxCode: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  contactPerson: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  _count?: {
    quotations: number;
    contracts: number;
    salesInvoices: number;
  };
}

export interface CustomerListResponse {
  items: CustomerItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerFilterParams {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
}

export interface CreateCustomerPayload {
  customerName: string;
  taxCode?: string;
  address?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCustomerPayload extends Partial<CreateCustomerPayload> {}

/**
 * 1. Lấy danh sách khách hàng (có tìm kiếm, lọc trạng thái, phân trang)
 * GET /api/v1/customers
 */
export async function getCustomers(
  params?: CustomerFilterParams
): Promise<ApiResponse<CustomerListResponse>> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());

  const queryString = query.toString();
  const endpoint = queryString ? `/customers?${queryString}` : '/customers';
  return get<CustomerListResponse>(endpoint);
}

/**
 * 2. Lấy chi tiết khách hàng theo ID
 * GET /api/v1/customers/:id
 */
export async function getCustomerById(id: number): Promise<ApiResponse<CustomerItem>> {
  return get<CustomerItem>(`/customers/${id}`);
}

/**
 * 3. Tạo mới khách hàng
 * POST /api/v1/customers
 */
export async function createCustomer(
  payload: CreateCustomerPayload
): Promise<ApiResponse<CustomerItem>> {
  return post<CustomerItem>('/customers', payload);
}

/**
 * 4. Cập nhật thông tin khách hàng
 * PATCH /api/v1/customers/:id
 */
export async function updateCustomer(
  id: number,
  payload: UpdateCustomerPayload
): Promise<ApiResponse<CustomerItem>> {
  return patch<CustomerItem>(`/customers/${id}`, payload);
}

/**
 * 5. Xóa hoặc ngừng hoạt động khách hàng
 * DELETE /api/v1/customers/:id
 */
export async function deleteCustomer(
  id: number
): Promise<ApiResponse<{ isSoftDeleted: boolean }>> {
  return del<{ isSoftDeleted: boolean }>(`/customers/${id}`);
}