// frontend/src/services/financeService.ts
import { get, post, patch, del, upload } from '../utils/request';
import type { ApiResponse } from '../utils/request';

// ==========================================
// 1. Interfaces Khoản chi phí (Expenses)
// ==========================================
export interface ExpenseItem {
  id: number;
  category: string;
  description?: string | null;
  amount: number;
  expenseDate: string;
  dueDate?: string | null;
  status: 'PAID' | 'UNPAID' | 'CANCELLED' | string;
  documentId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseListResponse {
  items: ExpenseItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpenseStatistics {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  categoryBreakdown?: { category: string; amount: number; count: number }[];
}

export interface CreateExpensePayload {
  category: string;
  description?: string;
  amount: number;
  expenseDate: string;
  dueDate?: string;
  status?: 'PAID' | 'UNPAID' | 'CANCELLED';
  documentId?: number;
}

export interface UpdateExpensePayload extends Partial<CreateExpensePayload> {}

// ==========================================
// 2. Interfaces Tài khoản ngân hàng (Bank Accounts)
// ==========================================
export interface BankAccountItem {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string | null;
  initialBalance: number;
  currentBalance: number;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
}

export interface CreateBankAccountPayload {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  initialBalance?: number;
}

// ==========================================
// 3. Interfaces Giao dịch & Đối soát (Bank Transactions)
// ==========================================
export interface BankTransactionItem {
  id: number;
  bankAccountId: number;
  transactionDate: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT' | string; // CREDIT: Tiền vào, DEBIT: Tiền ra
  description: string;
  referenceNumber?: string | null;
  reconciliationStatus: 'UNRECONCILED' | 'RECONCILED' | 'IGNORED' | string;
}

export interface BankStatementUploadResponse {
  statementId: number;
  totalTransactions: number;
  message: string;
}

// ==========================================
// 4. API FUNCTIONS: Chi phí (Expenses)
// ==========================================

// GET /api/v1/expenses
export async function getExpenses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}): Promise<ApiResponse<ExpenseListResponse>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.category) query.append('category', params.category);
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);

  const queryString = query.toString();
  const endpoint = queryString ? `/expenses?${queryString}` : '/expenses';
  return get<ExpenseListResponse>(endpoint);
}

// GET /api/v1/expenses/statistics
export async function getExpenseStatistics(year?: number): Promise<ApiResponse<ExpenseStatistics>> {
  const endpoint = year ? `/expenses/statistics?year=${year}` : '/expenses/statistics';
  return get<ExpenseStatistics>(endpoint);
}

// POST /api/v1/expenses
export async function createExpense(payload: CreateExpensePayload): Promise<ApiResponse<ExpenseItem>> {
  return post<ExpenseItem>('/expenses', payload);
}

// PATCH /api/v1/expenses/:id
export async function updateExpense(
  id: number,
  payload: UpdateExpensePayload
): Promise<ApiResponse<ExpenseItem>> {
  return patch<ExpenseItem>(`/expenses/${id}`, payload);
}

// DELETE /api/v1/expenses/:id
export async function deleteExpense(id: number): Promise<ApiResponse<{ message: string }>> {
  return del<{ message: string }>(`/expenses/${id}`);
}

// ==========================================
// 5. API FUNCTIONS: Tài khoản & Giao dịch ngân hàng
// ==========================================

// GET /api/v1/bank-accounts
export async function getBankAccounts(): Promise<ApiResponse<{ items: BankAccountItem[]; total: number }>> {
  return get<{ items: BankAccountItem[]; total: number }>('/bank-accounts');
}

// POST /api/v1/bank-accounts
export async function createBankAccount(
  payload: CreateBankAccountPayload
): Promise<ApiResponse<BankAccountItem>> {
  return post<BankAccountItem>('/bank-accounts', payload);
}

// GET /api/v1/bank-transactions
export async function getBankTransactions(params?: {
  page?: number;
  limit?: number;
  bankAccountId?: number;
  status?: string;
}): Promise<ApiResponse<{ items: BankTransactionItem[]; total: number }>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.bankAccountId) query.append('bankAccountId', params.bankAccountId.toString());
  if (params?.status) query.append('status', params.status);

  const queryString = query.toString();
  const endpoint = queryString ? `/bank-transactions?${queryString}` : '/bank-transactions';
  return get<{ items: BankTransactionItem[]; total: number }>(endpoint);
}

// POST /api/v1/bank-statements/upload
export async function uploadBankStatement(file: File, bankAccountId: number): Promise<ApiResponse<BankStatementUploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bankAccountId', bankAccountId.toString());
  return upload<BankStatementUploadResponse>('/bank-statements/upload', formData);
}