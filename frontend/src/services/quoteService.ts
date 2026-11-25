import { get, post, patch, del, upload } from '../utils/request';
import type { ApiResponse } from '../utils/request';

// ==========================================
// 1. Interfaces Dịch vụ (Services)
// ==========================================
export interface ServiceItem {
  id: number;
  serviceCode: string;
  serviceName: string;
  category: string;
  unitPrice: number;
  unit: string;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
}

export interface CreateServicePayload {
  serviceCode?: string;
  serviceName: string;
  category: string;
  unitPrice: number;
  unit?: string;
  description?: string;
}

// ==========================================
// 2. Interfaces Báo giá (Quotes)
// ==========================================
export interface QuotationItem {
  id: number;
  quotationCode: string;
  customerId: number;
  customer?: {
    id: number;
    customerName: string;
    taxCode: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED' | string;
  validUntil: string;
  createdAt: string;
  items?: {
    serviceId: number;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface CreateQuotePayload {
  customerId: number;
  validUntil: string;
  notes?: string;
  items: {
    serviceId: number;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
}

// ==========================================
// 3. Interfaces Nghiệm thu (Acceptance)
// ==========================================
export interface AcceptanceRecordItem {
  id: number;
  contractId: number;
  acceptanceCode: string;
  acceptanceDate: string;
  milestoneName: string;
  percentage: number;
  amount: number;
  status: 'DRAFT' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | string;
  evidenceFilePath?: string | null;
  createdAt: string;
}

// ==========================================
// 4. API FUNCTIONS: Dịch vụ (Services)
// ==========================================

export async function getServices(search?: string): Promise<ApiResponse<ServiceItem[]>> {
  const endpoint = search ? `/services?search=${encodeURIComponent(search)}` : '/services';
  return get<ServiceItem[]>(endpoint);
}

export async function createService(payload: CreateServicePayload): Promise<ApiResponse<ServiceItem>> {
  return post<ServiceItem>('/services', payload);
}

export async function updateService(id: number, payload: Partial<CreateServicePayload>): Promise<ApiResponse<ServiceItem>> {
  return patch<ServiceItem>(`/services/${id}`, payload);
}

export async function deleteService(id: number): Promise<ApiResponse<{ message: string }>> {
  return del<{ message: string }>(`/services/${id}`);
}

// ==========================================
// 5. API FUNCTIONS: Báo giá (Quotes)
// ==========================================

export async function getQuotes(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<QuotationItem[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);

  const queryString = query.toString();
  const endpoint = queryString ? `/quotes?${queryString}` : '/quotes';
  return get<QuotationItem[]>(endpoint);
}

export async function createQuote(payload: CreateQuotePayload): Promise<ApiResponse<QuotationItem>> {
  return post<QuotationItem>('/quotes', payload);
}

export async function sendQuoteEmail(id: number): Promise<ApiResponse<{ message: string }>> {
  return post<{ message: string }>(`/quotes/${id}/send`);
}

export async function convertQuoteToContract(id: number): Promise<ApiResponse<{ contractId: number; message: string }>> {
  return post<{ contractId: number; message: string }>(`/quotes/${id}/convert-to-contract`);
}

// ==========================================
// 6. API FUNCTIONS: Nghiệm thu (Acceptance)
// ==========================================

export async function getAcceptances(contractId?: number): Promise<ApiResponse<AcceptanceRecordItem[]>> {
  const endpoint = contractId ? `/acceptances?contractId=${contractId}` : '/acceptances';
  return get<AcceptanceRecordItem[]>(endpoint);
}

export async function createAcceptance(payload: {
  contractId: number;
  milestoneName: string;
  percentage: number;
  amount: number;
  acceptanceDate: string;
}): Promise<ApiResponse<AcceptanceRecordItem>> {
  return post<AcceptanceRecordItem>('/acceptances', payload);
}

export async function uploadAcceptanceEvidence(acceptanceId: number, file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append('file', file);
  return upload<any>(`/acceptances/${acceptanceId}/evidence`, formData);
}
