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
export async function uploadBankStatement(file: File, accountId: number | string): Promise<ApiResponse<BankStatementUploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('accountId', accountId.toString());
  return upload<BankStatementUploadResponse>('/bank-statements/upload', formData);
}

// ==========================================
// 6. Interfaces Bank Statements
// ==========================================
export interface BankStatementItem {
  id: number;
  bankAccountId: number;
  fileName: string;
  uploadedAt: string;
  totalTransactions: number;
  status: string;
}

// ==========================================
// 7. Interfaces Bank Reconciliations
// ==========================================
export interface ReconciliationItem {
  id: number;
  transactionId: number;
  documentId?: number | null;
  contractId?: number | null;
  matchedAmount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | string;
  confirmedAt?: string | null;
  note?: string | null;
  transaction?: BankTransactionItem;
}

export interface AutoMatchSuggestion {
  transactionId: number;
  transactionAmount: number;
  transactionDate: string;
  transactionDescription: string;
  suggestions: {
    documentId?: number;
    contractId?: number;
    matchScore: number;
    description: string;
    amount: number;
  }[];
}

export interface ConfirmReconciliationPayload {
  transactionId: number;
  documentId?: number;
  contractId?: number;
  matchedAmount: number;
  note?: string;
}

// ==========================================
// 8. API FUNCTIONS: Bank Statements
// ==========================================

// GET /api/v1/bank-statements
export async function getBankStatements(): Promise<ApiResponse<{ items: BankStatementItem[]; total: number }>> {
  return get<{ items: BankStatementItem[]; total: number }>('/bank-statements');
}

// GET /api/v1/bank-statements/:id
export async function getBankStatementById(id: number): Promise<ApiResponse<BankStatementItem>> {
  return get<BankStatementItem>(`/bank-statements/${id}`);
}

// DELETE /api/v1/bank-statements/:id
export async function deleteBankStatement(id: number): Promise<ApiResponse<{ message: string }>> {
  return del<{ message: string }>(`/bank-statements/${id}`);
}

// ==========================================
// 9. API FUNCTIONS: Bank Reconciliations
// ==========================================

// GET /api/v1/bank-reconciliations/auto-match
export async function getAutoMatch(): Promise<ApiResponse<AutoMatchSuggestion[]>> {
  return get<AutoMatchSuggestion[]>('/bank-reconciliations/auto-match');
}

// GET /api/v1/bank-reconciliations/suggest/:transactionId
export async function getSuggestMatch(transactionId: number): Promise<ApiResponse<AutoMatchSuggestion>> {
  return get<AutoMatchSuggestion>(`/bank-reconciliations/suggest/${transactionId}`);
}

// POST /api/v1/bank-reconciliations/confirm
export async function confirmReconciliation(payload: ConfirmReconciliationPayload): Promise<ApiResponse<ReconciliationItem>> {
  return post<ReconciliationItem>('/bank-reconciliations/confirm', payload);
}

// DELETE /api/v1/bank-reconciliations/:id
export async function deleteReconciliation(id: number): Promise<ApiResponse<{ message: string }>> {
  return del<{ message: string }>(`/bank-reconciliations/${id}`);
}

// GET /api/v1/bank-reconciliations
export async function getReconciliationHistory(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<ApiResponse<{ items: ReconciliationItem[]; total: number }>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.status) query.append('status', params.status);
  const queryString = query.toString();
  const endpoint = queryString ? `/bank-reconciliations?${queryString}` : '/bank-reconciliations';
  return get<{ items: ReconciliationItem[]; total: number }>(endpoint);
}