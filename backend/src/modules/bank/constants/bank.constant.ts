// 1. Trạng thái đối chiếu của giao dịch ngân hàng (bảng BANK_TRANSACTIONS)
export enum ReconciliationStatus {
  UNRECONCILED = 'UNRECONCILED',
  PARTIALLY_RECONCILED = 'PARTIALLY_RECONCILED',
  RECONCILED = 'RECONCILED',
}

// 2. Trạng thái bản ghi đối chiếu (bảng BANK_RECONCILIATIONS)
export enum MatchStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

// 3. Trạng thái tài khoản ngân hàng (bảng BANK_ACCOUNTS)
export enum BankAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// 4. Chiều dòng tiền giao dịch
export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ALL = 'ALL',
}

// 5. Độ tin cậy của thuật toán gợi ý đối chiếu
export type ReconciliationConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

// Danh sách từ dừng phổ biến trong mô tả chi phí / giao dịch chuyển khoản
export const EXPENSE_STOP_WORDS = new Set([
  'tien',
  'chi',
  'phi',
  'thanh',
  'toan',
  'chuyen',
  'khoan',
  'cho',
  'mua',
  'ban',
  'thang',
  'nam',
  'quy',
  'ngay',
  'ck',
  'tt',
  'nop',
  'ung',
  'tam',
  'ho',
  'khoan',
]);

// Danh sách từ dừng phổ biến trong tên doanh nghiệp / loại hình pháp lý tại Việt Nam
export const BUSINESS_STOP_WORDS = new Set([
  'cong',
  'ty',
  'tnhh',
  'cp',
  'cpn',
  'thuong',
  'mai',
  'dich',
  'vu',
  'san',
  'xuat',
  'mtv',
  'co',
  'phan',
  'chi',
  'nhanh',
  'tap',
  'doan',
  'doanh',
  'nghiep',
  'tu',
  'nhan',
  'xnk',
  'xuat',
  'nhap',
  'khau',
  'dau',
  'tu',
  'phat',
  'trien',
  'tm',
  'dv',
  'sx',
  'xd',
  'xay',
  'dung',
  'viet',
  'nam',
  'quoc',
  'te',
  'toan',
  'cau',
]);
