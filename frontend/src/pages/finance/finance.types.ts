// src/pages/finance/finance.types.ts
export type MainTabType = 'debt' | 'reconcile' | 'expenses' | 'bank';
export type DebtTabType = 'all' | 'overdue' | 'in_term';
export type ReconcileFilterType = 'all' | 'fully_paid' | 'partial' | 'unpaid' | 'overdue';

export interface DebtRecord {
  id: string;
  avatarText: string;
  avatarBg: string;
  companyName: string;
  taxId: string;
  city: string;
  contractCode: string;
  contractName: string;
  totalValue: number;
  paidValue: number;
  remainingDebt: number;
  isOverdue: boolean;
  dueDateText: string;
  overdueDays?: number;
}

export interface PaymentEntry {
  id: string;
  date: string;
  amount: number;
  method: 'bank_transfer' | 'cash' | 'other';
  referenceNo: string;
  note: string;
  verified: boolean;
}

export interface ReconcileRecord {
  id: string;
  avatarText: string;
  avatarBg: string;
  companyName: string;
  taxId: string;
  contractCode: string;
  contractName: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  totalValue: number;
  payments: PaymentEntry[];
  status: 'fully_paid' | 'partial' | 'unpaid' | 'overdue';
  note?: string;
}

export interface ApiNoticeState {
  type: 'success' | 'error';
  message: string;
}
