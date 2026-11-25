import { get, post, patch, upload } from '../utils/request';
import type { ApiResponse } from '../utils/request';

// ==========================================
// 1. Types dành cho Hóa đơn mua vào (Purchase Invoices / OCR)
// ==========================================
export interface PurchaseInvoiceDocument {
  id: number;
  documentName: string;
  filePath: string;
  fileType: string;
  fileSize: number | null;
}

export interface PurchaseInvoiceItem {
  id: number;
  supplierName: string;
  invoiceNumber: string;
  sellerTaxCode: string | null;
  buyerTaxCode: string | null;
  invoiceDate: string;
  dueDate: string | null;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  duplicateStatus: 'VALID' | 'DUPLICATE' | string;
  buyerTaxStatus: 'MATCHED' | 'MISMATCHED' | string;
  ocrStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | string;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'REJECTED' | string;
  documentId: number | null;
  document?: PurchaseInvoiceDocument | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseInvoiceListResponse {
  items: PurchaseInvoiceItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  tabCounts: {
    all: number;
    needsReview: number;
    valid: number;
    rejected: number;
  };
}

export interface FilterPurchaseInvoiceParams {
  tab?: 'ALL' | 'NEEDS_REVIEW' | 'VALID' | 'REJECTED';
  search?: string;
  page?: number;
  limit?: number;
  duplicateStatus?: string;
  buyerTaxStatus?: string;
}

export interface UpdatePurchaseInvoicePayload {
  supplierName?: string;
  invoiceNumber?: string;
  sellerTaxCode?: string;
  buyerTaxCode?: string;
  invoiceDate?: string;
  dueDate?: string;
  totalAmount?: number;
  duplicateStatus?: string;
  buyerTaxStatus?: string;
}

// ==========================================
// 2. Types dành cho Hóa đơn bán ra (Sales Invoices)
// ==========================================
export interface SalesInvoiceItem {
  id: number;
  invoiceNumber: string;
  invoiceCode: string;
  invoiceDate: string;
  customerId: number;
  customer?: {
    id: number;
    customerName: string;
    taxCode: string | null;
    address: string | null;
  };
  totalBeforeTax: number;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  status: 'DRAFT' | 'ISSUED' | 'CANCELLED' | string;
  paymentStatus: 'UNPAID' | 'PAID' | 'PARTIAL' | string;
  serviceDescription?: string;
  createdAt: string;
}

export interface SalesInvoiceListResponse {
  items: SalesInvoiceItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==========================================
// 3. API Hóa đơn mua vào (Purchase Invoices & OCR)
// ==========================================

/**
 * Lấy danh sách hóa đơn mua vào (theo Tab giao diện: ALL, NEEDS_REVIEW, VALID, REJECTED)
 * GET /api/v1/purchase-invoices
 */
export async function getPurchaseInvoices(
  params?: FilterPurchaseInvoiceParams
): Promise<ApiResponse<PurchaseInvoiceListResponse>> {
  const query = new URLSearchParams();
  if (params?.tab) query.append('tab', params.tab);
  if (params?.search) query.append('search', params.search);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.duplicateStatus) query.append('duplicateStatus', params.duplicateStatus);
  if (params?.buyerTaxStatus) query.append('buyerTaxStatus', params.buyerTaxStatus);

  const queryString = query.toString();
  const endpoint = queryString ? `/purchase-invoices?${queryString}` : '/purchase-invoices';
  return get<PurchaseInvoiceListResponse>(endpoint);
}

/**
 * Xem chi tiết 1 hóa đơn mua vào (cho màn hình chia đôi Split-View)
 * GET /api/v1/purchase-invoices/:id
 */
export async function getPurchaseInvoiceById(id: number): Promise<ApiResponse<PurchaseInvoiceItem>> {
  return get<PurchaseInvoiceItem>(`/purchase-invoices/${id}`);
}

/**
 * Tải lên tệp hóa đơn (PDF / JPG / PNG) để AI bóc tách OCR
 * POST /api/v1/purchase-invoices/upload
 */
export async function uploadPurchaseInvoice(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append('file', file);
  return upload<any>('/purchase-invoices/upload', formData);
}

/**
 * Đồng bộ 25 hóa đơn mẫu từ email (kịch bản kiểm thử SRS)
 * POST /api/v1/purchase-invoices/sync-demo
 */
export async function syncDemoPurchaseInvoices(): Promise<ApiResponse<any>> {
  return post<any>('/purchase-invoices/sync-demo');
}

/**
 * Chỉnh sửa thông tin bóc tách của hóa đơn đầu vào
 * PATCH /api/v1/purchase-invoices/:id
 */
export async function updatePurchaseInvoice(
  id: number,
  payload: UpdatePurchaseInvoicePayload
): Promise<ApiResponse<PurchaseInvoiceItem>> {
  return patch<PurchaseInvoiceItem>(`/purchase-invoices/${id}`, payload);
}

/**
 * Phê duyệt / xác nhận hóa đơn đầu vào ghi sổ
 * POST /api/v1/purchase-invoices/:id/confirm
 */
export async function confirmPurchaseInvoice(id: number): Promise<ApiResponse<PurchaseInvoiceItem>> {
  return post<PurchaseInvoiceItem>(`/purchase-invoices/${id}/confirm`);
}

/**
 * Từ chối hóa đơn đầu vào (trùng lặp hoặc sai thông tin)
 * POST /api/v1/purchase-invoices/:id/reject
 */
export async function rejectPurchaseInvoice(
  id: number,
  reason?: string
): Promise<ApiResponse<PurchaseInvoiceItem>> {
  return post<PurchaseInvoiceItem>(`/purchase-invoices/${id}/reject`, {
    reason: reason || 'Hóa đơn trùng lặp hoặc sai thông tin thuế',
  });
}

// ==========================================
// 4. API Hóa đơn bán ra (Sales Invoices)
// ==========================================

/**
 * Tra cứu & danh sách hóa đơn bán ra
 * GET /api/v1/sales-invoices
 */
export async function getSalesInvoices(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<ApiResponse<SalesInvoiceListResponse>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);

  const queryString = query.toString();
  const endpoint = queryString ? `/sales-invoices?${queryString}` : '/sales-invoices';
  return get<SalesInvoiceListResponse>(endpoint);
}

/**
 * Lập hóa đơn bán ra mới
 * POST /api/v1/sales-invoices
 */
export async function createSalesInvoice(payload: any): Promise<ApiResponse<SalesInvoiceItem>> {
  return post<SalesInvoiceItem>('/sales-invoices', payload);
}

/**
 * Phát hành chính thức hóa đơn bán ra
 * POST /api/v1/sales-invoices/:id/issue
 */
export async function issueSalesInvoice(id: number): Promise<ApiResponse<SalesInvoiceItem>> {
  return post<SalesInvoiceItem>(`/sales-invoices/${id}/issue`);
}

/**
 * Hủy hóa đơn bán ra
 * POST /api/v1/sales-invoices/:id/cancel
 */
export async function cancelSalesInvoice(id: number): Promise<ApiResponse<SalesInvoiceItem>> {
  return post<SalesInvoiceItem>(`/sales-invoices/${id}/cancel`);
}
