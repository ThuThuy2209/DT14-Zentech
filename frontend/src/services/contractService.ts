import { get, post, patch, del } from '../utils/request';
import type { ApiResponse } from '../utils/request';

// ==========================================
// 1. Interfaces Hợp đồng kinh tế (Contracts)
// ==========================================
export interface ContractSigner {
  id: number;
  contractId: number;
  signerName: string;
  signerEmail: string;
  signerRole: string;
  signingOrder: number;
  signingStatus: 'PENDING' | 'SIGNED' | 'REJECTED' | string;
  signedAt?: string | null;
}

export interface ContractItem {
  id: number;
  contractCode: string;
  contractName: string;
  customerId: number;
  customer?: {
    id: number;
    customerName: string;
    phone?: string | null;
    email?: string | null;
    taxCode?: string | null;
  } | null;
  contractValue: number;
  startDate?: string | null;
  endDate?: string | null;
  contractContent?: string | null;
  status: 'DRAFT' | 'PENDING_SIGN' | 'SIGNING' | 'SIGNED' | 'REJECTED' | 'EXPIRED' | 'TERMINATED' | string;
  createdAt: string;
  updatedAt: string;
  signers?: ContractSigner[];
  _count?: {
    signers: number;
    signatureRequests: number;
    acceptanceRecords: number;
    salesInvoices: number;
  };
}

export interface ContractListResponse {
  items: ContractItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterContractParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: number;
}

export interface CreateContractPayload {
  customerId: number;
  contractName: string;
  contractCode?: string;
  contractValue: number;
  startDate?: string;
  endDate?: string;
  contractContent?: string;
  status?: string;
  templateVersionId?: number;
}

export interface UpdateContractPayload extends Partial<CreateContractPayload> {}

export interface SigningStatusResponse {
  contractId: number;
  status: string;
  transactionId?: string;
  events?: {
    eventType: string;
    eventStatus: string;
    eventMessage: string;
    eventTime: string;
  }[];
}

// ==========================================
// 2. API FUNCTIONS: Hợp đồng (Contracts)
// ==========================================

/**
 * 1. Xem danh sách hợp đồng (có tìm kiếm, lọc trạng thái, phân trang)
 * GET /api/v1/contracts
 */
export async function getContracts(
  params?: FilterContractParams
): Promise<ApiResponse<ContractListResponse>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.customerId) query.append('customerId', params.customerId.toString());

  const queryString = query.toString();
  const endpoint = queryString ? `/contracts?${queryString}` : '/contracts';
  return get<ContractListResponse>(endpoint);
}

/**
 * 2. Xem chi tiết 1 hợp đồng
 * GET /api/v1/contracts/:id
 */
export async function getContractById(id: number): Promise<ApiResponse<ContractItem>> {
  return get<ContractItem>(`/contracts/${id}`);
}

/**
 * 3. Tạo hợp đồng mới
 * POST /api/v1/contracts
 */
export async function createContract(
  payload: CreateContractPayload
): Promise<ApiResponse<ContractItem>> {
  return post<ContractItem>('/contracts', payload);
}

/**
 * 4. Cập nhật thông tin hợp đồng
 * PATCH /api/v1/contracts/:id
 */
export async function updateContract(
  id: number,
  payload: UpdateContractPayload
): Promise<ApiResponse<ContractItem>> {
  return patch<ContractItem>(`/contracts/${id}`, payload);
}

/**
 * 5. Xóa hợp đồng
 * DELETE /api/v1/contracts/:id
 */
export async function deleteContract(id: number): Promise<ApiResponse<{ message: string }>> {
  return del<{ message: string }>(`/contracts/${id}`);
}

/**
 * 6. Ký số Sandbox (VNPT SmartCA Sandbox)
 * POST /api/v1/contracts/:id/sign-sandbox
 */
export async function signContractSandbox(
  id: number
): Promise<ApiResponse<{ message: string; transactionId?: string }>> {
  return post<{ message: string; transactionId?: string }>(`/contracts/${id}/sign-sandbox`);
}

/**
 * 7. Xem tiến trình ký số Sandbox
 * GET /api/v1/contracts/:id/signing-status
 */
export async function getContractSigningStatus(
  id: number
): Promise<ApiResponse<SigningStatusResponse>> {
  return get<SigningStatusResponse>(`/contracts/${id}/signing-status`);
}

/**
 * 8. Lấy danh sách mẫu hợp đồng
 * GET /api/v1/contracts/templates
 */
export async function getContractTemplates(): Promise<ApiResponse<any>> {
  return get<any>('/contracts/templates');
}
