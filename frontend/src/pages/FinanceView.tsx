import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Plus, 
  Mail, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Edit3, 
  TrendingUp,
  CreditCard,
  Building,
  RefreshCw,
  Trash2,
  Receipt,
  FileSpreadsheet,
  AlertCircle,
  FileCheck2,
  Banknote,
  CheckCheck,
  Search,
  ArrowDownLeft,
  CircleDollarSign,
  FileText
} from 'lucide-react';
import {
  getExpenses,
  getExpenseStatistics,
  createExpense,
  deleteExpense,
  getBankAccounts,
  getBankTransactions,
  type ExpenseItem,
  type ExpenseStatistics,
  type CreateExpensePayload,
  type BankAccountItem,
  type BankTransactionItem
} from '../services/financeService';

interface DebtRecord {
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

// ===== Dữ liệu cho phân hệ Đối chiếu Công nợ =====
interface PaymentEntry {
  id: string;
  date: string;
  amount: number;
  method: 'bank_transfer' | 'cash' | 'other';
  referenceNo: string; // Số chứng từ / mã giao dịch
  note: string;
  verified: boolean;   // Đã đối chiếu hợp lệ hay chưa
}

interface ReconcileRecord {
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

export const FinanceView: React.FC = () => {
  // Tab chính: 'debt' | 'reconcile' | 'expenses' | 'bank'
  const [mainTab, setMainTab] = useState<'debt' | 'reconcile' | 'expenses' | 'bank'>('debt');

  // ================= State Quản lý Công nợ (HITL) =================
  const [debtTab, setDebtTab] = useState<'all' | 'overdue' | 'in_term'>('all');
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null);

  const debts: DebtRecord[] = [
    {
      id: '1',
      avatarText: 'Hoang Gia',
      avatarBg: 'bg-rose-100 text-rose-700',
      companyName: 'Công ty TNHH Thương mại Hoàng Gia',
      taxId: '9900000001',
      city: '15 Nguyễn Trãi, P. Bến Thành, TP.HCM',
      contractCode: 'HĐ-01',
      contractName: 'Thiết kế website doanh nghiệp',
      totalValue: 8800000,
      paidValue: 8800000,
      remainingDebt: 0,
      isOverdue: false,
      dueDateText: 'Đã thanh toán',
      overdueDays: 0
    },
    {
      id: '2',
      avatarText: 'Dai Viet',
      avatarBg: 'bg-blue-100 text-blue-700',
      companyName: 'Công ty CP Công nghệ Đại Việt',
      taxId: '9900000002',
      city: '28 Điện Biên Phủ, P. Gia Định, TP.HCM',
      contractCode: 'HĐ-02',
      contractName: 'Phát triển phần mềm quản lý',
      totalValue: 16500000,
      paidValue: 8500000,
      remainingDebt: 8000000,
      isOverdue: true,
      overdueDays: 30,
      dueDateText: 'Quá hạn (Hết hạn 30 ngày - 02/12/2026)'
    },
    {
      id: '3',
      avatarText: 'Phuong Nam',
      avatarBg: 'bg-purple-100 text-purple-700',
      companyName: 'Công ty TNHH Nội thất Phương Nam',
      taxId: '9900000003',
      city: '45 Lê Văn Sỹ, P. Nhiêu Lộc, TP.HCM',
      contractCode: 'HĐ-03',
      contractName: 'Thiết kế website bán hàng',
      totalValue: 10450000,
      paidValue: 8000000,
      remainingDebt: 2450000,
      isOverdue: false,
      dueDateText: 'Trong hạn (Hạn: 05/12/2026)'
    }
  ];

  const formatVND = (num: number) => (num || 0).toLocaleString('vi-VN') + ' đ';

  const filteredDebts = debts.filter(d => {
    if (debtTab === 'overdue') return d.isOverdue;
    if (debtTab === 'in_term') return !d.isOverdue;
    return true;
  });

  const handleOpenEmailModal = (debt: DebtRecord) => {
    setSelectedDebt(debt);
    setShowEmailModal(true);
  };

  const handleSendEmail = () => {
    alert(`Đã gửi email nhắc nợ thành công tới ${selectedDebt?.companyName} qua cổng SMTP bảo mật!`);
    setShowEmailModal(false);
  };

  // ================= State Đối chiếu Công nợ =================
  const [reconcileSearch, setReconcileSearch] = useState<string>('');
  const [reconcileFilter, setReconcileFilter] = useState<'all' | 'fully_paid' | 'partial' | 'unpaid' | 'overdue'>('all');
  const [selectedReconcile, setSelectedReconcile] = useState<ReconcileRecord | null>(null);
  const [showReconcileDetail, setShowReconcileDetail] = useState<boolean>(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [reconcileMonth, setReconcileMonth] = useState<string>('11/2026');
  const [newPayment, setNewPayment] = useState<{ amount: string; method: 'bank_transfer' | 'cash' | 'other'; referenceNo: string; note: string }>({
    amount: '', method: 'bank_transfer', referenceNo: '', note: ''
  });

  const [reconcileRecords, setReconcileRecords] = useState<ReconcileRecord[]>([
    {
      id: 'R001',
      avatarText: 'Hoang Gia',
      avatarBg: 'bg-rose-100 text-rose-700',
      companyName: 'Công ty TNHH Thương mại Hoàng Gia',
      taxId: '9900000001',
      contractCode: 'HĐ-01',
      contractName: 'Thiết kế website doanh nghiệp',
      invoiceNo: 'HD-2026-0041',
      invoiceDate: '01/10/2026',
      dueDate: '01/11/2026',
      totalValue: 8800000,
      status: 'fully_paid',
      note: 'Đã thanh toán đủ 2 đợt',
      payments: [
        { id: 'P001', date: '15/10/2026', amount: 4400000, method: 'bank_transfer', referenceNo: 'FT26101512345', note: 'Đợt 1 - 50% theo HĐ', verified: true },
        { id: 'P002', date: '01/11/2026', amount: 4400000, method: 'bank_transfer', referenceNo: 'FT26110100987', note: 'Đợt 2 - Quyết toán', verified: true },
      ]
    },
    {
      id: 'R002',
      avatarText: 'ABC Corp',
      avatarBg: 'bg-blue-100 text-blue-700',
      companyName: 'Công ty CP Công nghệ Đại Việt',
      taxId: '9900000002',
      contractCode: 'HĐ-02',
      contractName: 'Phát triển phần mềm quản lý',
      invoiceNo: 'HD-2026-0042',
      invoiceDate: '01/10/2026',
      dueDate: '01/11/2026',
      totalValue: 16500000,
      status: 'overdue',
      note: 'Quá hạn 30 ngày – chưa thanh toán đủ',
      payments: [
        { id: 'P003', date: '05/10/2026', amount: 8500000, method: 'bank_transfer', referenceNo: 'FT26100588899', note: 'Tạm ứng 50%', verified: true },
      ]
    },
    {
      id: 'R003',
      avatarText: 'Phuong Nam',
      avatarBg: 'bg-purple-100 text-purple-700',
      companyName: 'Công ty TNHH Nội thất Phương Nam',
      taxId: '9900000003',
      contractCode: 'HĐ-03',
      contractName: 'Thiết kế website bán hàng',
      invoiceNo: 'HD-2026-0043',
      invoiceDate: '05/10/2026',
      dueDate: '05/12/2026',
      totalValue: 10450000,
      status: 'partial',
      note: 'Còn thiếu 1 đợt cuối',
      payments: [
        { id: 'P004', date: '10/10/2026', amount: 5000000, method: 'bank_transfer', referenceNo: 'FT26101000112', note: 'Đặt cọc', verified: true },
        { id: 'P005', date: '01/11/2026', amount: 3000000, method: 'cash', referenceNo: 'PC-2026-011', note: 'Tiền mặt lần 2', verified: true },
      ]
    },
    {
      id: 'R004',
      avatarText: 'Green Tech',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      companyName: 'Công ty CP Giải pháp Xanh',
      taxId: '9900000004',
      contractCode: 'HĐ-04',
      contractName: 'Tư vấn chuyển đổi số OPC',
      invoiceNo: 'HD-2026-0044',
      invoiceDate: '15/11/2026',
      dueDate: '15/12/2026',
      totalValue: 12000000,
      status: 'unpaid',
      payments: []
    },
  ]);

  const getPaidTotal = (record: ReconcileRecord) =>
    record.payments.reduce((s, p) => s + p.amount, 0);

  const getRemaining = (record: ReconcileRecord) =>
    record.totalValue - getPaidTotal(record);

  const getStatusBadge = (status: ReconcileRecord['status']) => {
    switch (status) {
      case 'fully_paid':
        return { label: 'Đã thanh toán đủ', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'partial':
        return { label: 'Đã một phần', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'unpaid':
        return { label: 'Chưa thanh toán', cls: 'bg-slate-50 text-slate-600 border-slate-200' };
      case 'overdue':
        return { label: 'Quá hạn', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
  };

  const filteredReconcile = reconcileRecords.filter(r => {
    const matchSearch = !reconcileSearch ||
      r.companyName.toLowerCase().includes(reconcileSearch.toLowerCase()) ||
      r.contractCode.toLowerCase().includes(reconcileSearch.toLowerCase()) ||
      r.invoiceNo.toLowerCase().includes(reconcileSearch.toLowerCase());
    const matchFilter = reconcileFilter === 'all' || r.status === reconcileFilter;
    return matchSearch && matchFilter;
  });

  const handleAddPayment = () => {
    if (!selectedReconcile || !newPayment.amount || Number(newPayment.amount) <= 0) return;
    const paidSoFar = getPaidTotal(selectedReconcile) + Number(newPayment.amount);
    const newStatus: ReconcileRecord['status'] =
      paidSoFar >= selectedReconcile.totalValue ? 'fully_paid'
      : paidSoFar > 0 ? 'partial'
      : 'unpaid';

    const updatedRecord: ReconcileRecord = {
      ...selectedReconcile,
      status: newStatus,
      payments: [...selectedReconcile.payments, {
        id: `P${Date.now()}`,
        date: new Date().toLocaleDateString('vi-VN'),
        amount: Number(newPayment.amount),
        method: newPayment.method,
        referenceNo: newPayment.referenceNo || `TM-${Date.now()}`,
        note: newPayment.note,
        verified: false,
      }],
    };

    setReconcileRecords(prev => prev.map(r => r.id === selectedReconcile.id ? updatedRecord : r));
    setSelectedReconcile(updatedRecord);
    setShowAddPaymentModal(false);
    setNewPayment({ amount: '', method: 'bank_transfer', referenceNo: '', note: '' });
    setApiNotice({ type: 'success', message: `Ghi nhận thanh toán ${Number(newPayment.amount).toLocaleString('vi-VN')} đ từ ${selectedReconcile.companyName} thành công!` });
  };

  const handleToggleVerify = (recordId: string, paymentId: string) => {
    setReconcileRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      return { ...r, payments: r.payments.map(p => p.id === paymentId ? { ...p, verified: !p.verified } : p) };
    }));
    if (selectedReconcile?.id === recordId) {
      setSelectedReconcile(prev => prev ? {
        ...prev,
        payments: prev.payments.map(p => p.id === paymentId ? { ...p, verified: !p.verified } : p)
      } : null);
    }
  };

  const reconcileSummary = {
    totalInvoices: reconcileRecords.length,
    totalValue: reconcileRecords.reduce((s, r) => s + r.totalValue, 0),
    totalPaid: reconcileRecords.reduce((s, r) => s + getPaidTotal(r), 0),
    totalRemaining: reconcileRecords.reduce((s, r) => s + getRemaining(r), 0),
    fullyPaid: reconcileRecords.filter(r => r.status === 'fully_paid').length,
    overdue: reconcileRecords.filter(r => r.status === 'overdue').length,
  };

  // ================= State Sổ chi phí (Expenses API) =================
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [expenseStats, setExpenseStats] = useState<ExpenseStatistics | null>(null);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState<boolean>(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [apiNotice, setApiNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [expenseForm, setExpenseForm] = useState<CreateExpensePayload>({
    category: 'Chi phí dịch vụ mua ngoài (TK 6427)',
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    status: 'PAID',
  });
  const [isSubmittingExpense, setIsSubmittingExpense] = useState<boolean>(false);

  // ================= State Ngân hàng (Bank Accounts & Transactions) =================
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([]);
  const [transactions, setTransactions] = useState<BankTransactionItem[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState<boolean>(false);

  // ================= Tải dữ liệu API =================
  const fetchExpensesData = useCallback(async () => {
    setIsLoadingExpenses(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        getExpenses({ page: 1, limit: 20 }),
        getExpenseStatistics(),
      ]);

      if (listRes.success && listRes.data) {
        setExpenses(listRes.data.items || []);
      }
      if (statsRes.success && statsRes.data) {
        setExpenseStats(statsRes.data);
      }
    } catch {
      setApiNotice({
        type: 'error',
        message: 'Lỗi tải dữ liệu chi phí từ Backend',
      });
    } finally {
      setIsLoadingExpenses(false);
    }
  }, []);

  const fetchBankData = useCallback(async () => {
    setIsLoadingBank(true);
    try {
      const [accRes, transRes] = await Promise.all([
        getBankAccounts(),
        getBankTransactions({ page: 1, limit: 10 }),
      ]);

      if (accRes.success && accRes.data) {
        setBankAccounts(accRes.data.items || []);
      }
      if (transRes.success && transRes.data) {
        setTransactions(transRes.data.items || []);
      }
    } catch {
      setApiNotice({
        type: 'error',
        message: 'Lỗi tải dữ liệu ngân hàng từ Backend',
      });
    } finally {
      setIsLoadingBank(false);
    }
  }, []);

  useEffect(() => {
    if (mainTab === 'expenses') fetchExpensesData();
    if (mainTab === 'bank') fetchBankData();
  }, [mainTab, fetchExpensesData, fetchBankData]);

  // Tạo khoản chi phí mới
  const handleCreateExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseForm.amount <= 0) {
      alert('Vui lòng nhập số tiền chi lớn hơn 0');
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const res = await createExpense({
        category: expenseForm.category,
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
        expenseDate: expenseForm.expenseDate,
        status: expenseForm.status,
      });

      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Ghi nhận khoản chi "${expenseForm.description || expenseForm.category}" thành công!`,
        });
        setIsExpenseModalOpen(false);
        setExpenseForm({
          category: 'Chi phí dịch vụ mua ngoài (TK 6427)',
          description: '',
          amount: 0,
          expenseDate: new Date().toISOString().split('T')[0],
          status: 'PAID',
        });
        fetchExpensesData();
      } else {
        alert(res.message || 'Ghi nhận chi phí thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi ghi nhận chi phí!');
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  // Xóa khoản chi phí
  const handleDeleteExpense = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khoản chi phí này?')) return;
    try {
      const res = await deleteExpense(id);
      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Đã xóa khoản chi phí #${id}`,
        });
        fetchExpensesData();
      } else {
        alert(res.message || 'Xóa chi phí thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi xóa chi phí!');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Trang & Các nút thao tác */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            SỔ CÁI TÀI CHÍNH TỰ ĐỘNG • Q4/2026
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1.5">
            Thu chi, Ngân hàng & Quản lý Công nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi dòng tiền vào ra, sổ chi phí, tài khoản ngân hàng và trợ lý AI nhắc nợ đối tác
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Xuất sổ phụ sao kê Excel định dạng chuẩn kế toán Việt Nam.')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất sổ phụ Excel</span>
          </button>
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo phiếu chi mới</span>
          </button>
        </div>
      </div>

      {/* Thông báo API Toast */}
      {apiNotice && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          apiNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {apiNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-semibold">{apiNotice.message}</span>
          </div>
          <button onClick={() => setApiNotice(null)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Hàng 3 Thẻ chỉ số tài chính */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Thẻ 1: Tổng phải thu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng phải thu (Receivable)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">45.000.000</span>
              <span className="text-sm font-bold text-slate-600">đ</span>
            </div>
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-3 h-3" />
                +12.4% so với tháng trước
              </span>
            </div>
          </div>
        </div>

        {/* Thẻ 2: Đã quá hạn */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/20 to-white shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Đã quá hạn (Overdue)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-rose-600">18.000.000</span>
              <span className="text-sm font-bold text-rose-600">đ</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-rose-700 font-medium">1 đối tác trễ hạn &gt; 30 ngày</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                Cần xử lý ngay
              </span>
            </div>
          </div>
        </div>

        {/* Thẻ 3: Tổng chi phí (API) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              Tổng chi phí ghi sổ (API)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">
                {formatVND(expenseStats?.totalAmount || 67000000)}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-xs text-slate-500 font-medium">
                Đã thanh toán: <strong className="text-emerald-600">{formatVND(expenseStats?.paidAmount || 55000000)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs chuyển đổi giữa 3 phân hệ */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setMainTab('debt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mainTab === 'debt' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Theo dõi Công nợ & AI Nhắc nợ</span>
        </button>

        <button
          onClick={() => setMainTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mainTab === 'expenses' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Sổ Chi phí & Phiếu chi (API)</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
            mainTab === 'expenses' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {expenses.length}
          </span>
        </button>

        <button
          onClick={() => setMainTab('bank')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mainTab === 'bank' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Tài khoản & Sao kê Ngân hàng</span>
        </button>

        <button
          onClick={() => setMainTab('reconcile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mainTab === 'reconcile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Đối chiếu Công nợ</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
            mainTab === 'reconcile' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
          }`}>
            MỚI
          </span>
        </button>
      </div>

      {/* ================= PHÂN HỆ 1: QUẢN LÝ CÔNG NỢ & NHẮC NỢ AI ================= */}
      {mainTab === 'debt' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header danh sách & Tab lọc */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Danh sách theo dõi công nợ khách hàng</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                3 đối tác
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setDebtTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  debtTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Tất cả (3)
              </button>
              <button
                onClick={() => setDebtTab('overdue')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  debtTab === 'overdue' ? 'bg-white text-rose-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Quá hạn (1)
              </button>
              <button
                onClick={() => setDebtTab('in_term')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  debtTab === 'in_term' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Trong hạn (2)
              </button>
            </div>
          </div>

          {/* Bảng công nợ */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-5">KHÁCH HÀNG & DOANH NGHIỆP</th>
                  <th className="py-3 px-5">HỢP ĐỒNG LIÊN KẾT</th>
                  <th className="py-3 px-5 text-right">GIÁ TRỊ HỢP ĐỒNG</th>
                  <th className="py-3 px-5 text-right">ĐÃ THANH TOÁN</th>
                  <th className="py-3 px-5 text-right">CÒN NỢ LẠI</th>
                  <th className="py-3 px-5 text-center">TRẠNG THÁI HẠN NỢ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDebts.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${item.isOverdue ? 'bg-rose-50/20' : ''}`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${item.avatarBg}`}>
                          {item.avatarText}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.companyName}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            MST: {item.taxId} • {item.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-blue-600">{item.contractCode}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.contractName}</p>
                    </td>
                    <td className="py-4 px-5 text-right font-semibold text-slate-800">
                      {formatVND(item.totalValue)}
                    </td>
                    <td className="py-4 px-5 text-right font-medium text-slate-600">
                      {formatVND(item.paidValue)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className={`font-extrabold text-sm ${item.isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                        {formatVND(item.remainingDebt)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {item.isOverdue ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            {item.dueDateText}
                          </span>
                          <button
                            onClick={() => handleOpenEmailModal(item)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Duyệt Email Nhắc Nợ</span>
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.dueDateText}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PHÂN HỆ ĐỐI CHIẾU CÔNG NỢ ================= */}
      {mainTab === 'reconcile' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">Đối chiếu Công nợ Cuối tháng</h2>
                </div>
                <p className="text-xs text-slate-500">Theo dõi các khoản thanh toán, gạch nợ hóa đơn/hợp đồng và xác nhận đã đối chiếu</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
                  <span>Kỳ đối chiếu:</span>
                  <select
                    value={reconcileMonth}
                    onChange={(e) => setReconcileMonth(e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer text-xs"
                  >
                    <option>11/2026</option>
                    <option>10/2026</option>
                    <option>09/2026</option>
                  </select>
                </div>
                <button
                  onClick={() => alert('Xuất Biên bản Đối chiếu Công nợ PDF / Excel chuẩn kế toán.')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Biên bản</span>
                </button>
              </div>
            </div>

            {/* 4 chỉ số tóm tắt cuối tháng */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Tổng phát sinh', value: reconcileSummary.totalValue, bg: 'bg-slate-50', cls: 'text-slate-800', icon: <CircleDollarSign className="w-4 h-4 text-slate-500" />, isCount: false },
                { label: 'Đã thu được', value: reconcileSummary.totalPaid, bg: 'bg-emerald-50', cls: 'text-emerald-700', icon: <CheckCheck className="w-4 h-4 text-emerald-500" />, isCount: false },
                { label: 'Còn phải thu', value: reconcileSummary.totalRemaining, bg: 'bg-amber-50', cls: 'text-amber-700', icon: <Banknote className="w-4 h-4 text-amber-500" />, isCount: false },
                { label: 'Quá hạn', value: reconcileSummary.overdue, bg: 'bg-rose-50', cls: 'text-rose-700', icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, isCount: true },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-xl p-3`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {s.icon}
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span>
                  </div>
                  <p className={`text-base font-extrabold ${s.cls}`}>
                    {s.isCount ? `${s.value} hóa đơn` : s.value.toLocaleString('vi-VN') + ' đ'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Thanh tìm kiếm & lọc */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm khách hàng, hợp đồng, số hóa đơn..."
                value={reconcileSearch}
                onChange={(e) => setReconcileSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
              {([
                { key: 'all', label: 'Tất cả' },
                { key: 'fully_paid', label: '✅ Đủ' },
                { key: 'partial', label: '🔶 Một phần' },
                { key: 'overdue', label: '🔴 Quá hạn' },
                { key: 'unpaid', label: '⬜ Chưa TT' },
              ] as const).map(f => (
                <button
                  key={f.key}
                  onClick={() => setReconcileFilter(f.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    reconcileFilter === f.key ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Danh sách đối chiếu */}
          <div className="space-y-3">
            {filteredReconcile.map((record) => {
              const paid = getPaidTotal(record);
              const remaining = getRemaining(record);
              const pct = Math.min(100, record.totalValue > 0 ? (paid / record.totalValue) * 100 : 0);
              const badge = getStatusBadge(record.status);

              return (
                <div key={record.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0 ${record.avatarBg}`}>
                        {record.avatarText.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-800 truncate">{record.companyName}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>
                            {badge.label}
                          </span>
                          {record.status === 'fully_paid' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded flex items-center gap-0.5">
                              <CheckCheck className="w-3 h-3" /> Đã gạch nợ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-slate-500">
                            <strong className="text-slate-700">{record.contractCode}</strong> • {record.contractName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            HĐ: <strong className="text-slate-600">{record.invoiceNo}</strong>
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
                            <span>Đã thu: <strong className="text-emerald-700">{paid.toLocaleString('vi-VN')} đ</strong></span>
                            <span>Còn: <strong className={remaining > 0 ? 'text-amber-700' : 'text-emerald-700'}>{remaining.toLocaleString('vi-VN')} đ</strong></span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                record.status === 'fully_paid' ? 'bg-emerald-500'
                                : record.status === 'overdue' ? 'bg-rose-500'
                                : 'bg-amber-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Tổng HĐ: <strong className="text-slate-700">{record.totalValue.toLocaleString('vi-VN')} đ</strong>
                            &nbsp;•&nbsp;Hạn: <strong>{record.dueDate}</strong>
                            &nbsp;•&nbsp;{record.payments.length} lần thanh toán
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setSelectedReconcile(record); setShowReconcileDetail(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Chi tiết
                      </button>
                      {record.status !== 'fully_paid' && (
                        <button
                          onClick={() => { setSelectedReconcile(record); setShowAddPaymentModal(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Ghi nhận TT
                        </button>
                      )}
                    </div>
                  </div>

                  {record.payments.length > 0 && (
                    <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/50 space-y-1.5">
                      {record.payments.slice(-2).map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.verified ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <span className="text-slate-500">{p.date}</span>
                            <span className="font-bold text-slate-800">{p.amount.toLocaleString('vi-VN')} đ</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              p.method === 'bank_transfer' ? 'bg-blue-50 text-blue-700'
                              : p.method === 'cash' ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                            }`}>
                              {p.method === 'bank_transfer' ? 'CK NH' : p.method === 'cash' ? 'Tiền mặt' : 'Khác'}
                            </span>
                            <span className="text-slate-400 hidden sm:inline">CT: {p.referenceNo}</span>
                          </div>
                          <span className={`text-[10px] font-bold ${p.verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {p.verified ? '✓ Đã đối chiếu' : '⏳ Chờ xác nhận'}
                          </span>
                        </div>
                      ))}
                      {record.payments.length > 2 && (
                        <p className="text-[10px] text-slate-400 text-center pt-0.5">+ {record.payments.length - 2} lần TT khác...</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredReconcile.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">Không tìm thấy kết quả phù hợp</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Chi tiết Đối chiếu */}
      {showReconcileDetail && selectedReconcile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
              <div>
                <h3 className="font-bold text-base text-slate-900">Chi tiết Đối chiếu Công nợ</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedReconcile.companyName} • {selectedReconcile.contractCode}</p>
              </div>
              <button onClick={() => setShowReconcileDetail(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Hóa đơn số', value: selectedReconcile.invoiceNo },
                  { label: 'Mã hợp đồng', value: selectedReconcile.contractCode },
                  { label: 'Ngày lập HĐ', value: selectedReconcile.invoiceDate },
                  { label: 'Ngày đến hạn', value: selectedReconcile.dueDate },
                  { label: 'Giá trị HĐ', value: selectedReconcile.totalValue.toLocaleString('vi-VN') + ' đ' },
                  { label: 'Mã số thuế', value: selectedReconcile.taxId },
                ].map((info, i) => (
                  <div key={i}>
                    <p className="text-slate-400 font-medium">{info.label}</p>
                    <p className="text-slate-800 font-bold mt-0.5">{info.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Tổng HĐ', v: selectedReconcile.totalValue, cls: 'text-slate-800', bg: 'bg-slate-50' },
                  { label: 'Đã thu', v: getPaidTotal(selectedReconcile), cls: 'text-emerald-700', bg: 'bg-emerald-50' },
                  { label: 'Còn lại', v: getRemaining(selectedReconcile), cls: getRemaining(selectedReconcile) > 0 ? 'text-amber-700' : 'text-emerald-700', bg: getRemaining(selectedReconcile) > 0 ? 'bg-amber-50' : 'bg-emerald-50' },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                    <p className={`text-sm font-extrabold mt-0.5 ${s.cls}`}>{s.v.toLocaleString('vi-VN')} đ</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Lịch sử các lần thanh toán</h4>
                  {selectedReconcile.status !== 'fully_paid' && (
                    <button
                      onClick={() => { setShowReconcileDetail(false); setShowAddPaymentModal(true); }}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm lần TT
                    </button>
                  )}
                </div>
                {selectedReconcile.payments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl">
                    Chưa có lần thanh toán nào được ghi nhận
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedReconcile.payments.map((p, idx) => (
                      <div key={p.id} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{p.amount.toLocaleString('vi-VN')} đ</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {p.date} • <span className={`font-semibold ${p.method === 'bank_transfer' ? 'text-blue-700' : p.method === 'cash' ? 'text-amber-700' : 'text-slate-600'}`}>
                                {p.method === 'bank_transfer' ? 'Chuyển khoản NH' : p.method === 'cash' ? 'Tiền mặt' : 'Khác'}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500">Chứng từ: <strong className="text-slate-700">{p.referenceNo}</strong></p>
                            {p.note && <p className="text-[11px] text-slate-400 italic mt-0.5">"{p.note}"</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleVerify(selectedReconcile.id, p.id)}
                          className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            p.verified ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {p.verified ? <><CheckCircle2 className="w-3 h-3" /> Đã đối chiếu</> : <><Clock className="w-3 h-3" /> Chờ xác nhận</>}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedReconcile.note && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <strong>Ghi chú:</strong> {selectedReconcile.note}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowReconcileDetail(false)} className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ghi nhận Thanh toán */}
      {showAddPaymentModal && selectedReconcile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                  Ghi nhận khoản thanh toán
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedReconcile.companyName} • {selectedReconcile.contractCode}</p>
              </div>
              <button onClick={() => setShowAddPaymentModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>Còn phải thu:</span>
                <strong className="text-sm">{getRemaining(selectedReconcile).toLocaleString('vi-VN')} đ</strong>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Số tiền thanh toán (VNĐ)</label>
                <div className="relative">
                  <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={0}
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(p => ({ ...p, amount: e.target.value }))}
                    placeholder="VD: 5000000"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Phương thức thanh toán</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { v: 'bank_transfer', label: 'CK Ngân hàng', icon: '🏦' },
                    { v: 'cash', label: 'Tiền mặt', icon: '💵' },
                    { v: 'other', label: 'Khác', icon: '📋' },
                  ] as const).map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setNewPayment(p => ({ ...p, method: opt.v }))}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        newPayment.method === opt.v ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Số chứng từ / Mã giao dịch NH</label>
                <input
                  type="text"
                  value={newPayment.referenceNo}
                  onChange={(e) => setNewPayment(p => ({ ...p, referenceNo: e.target.value }))}
                  placeholder="VD: FT26112345678 hoặc PC-2026-055"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Ghi chú (tuỳ chọn)</label>
                <input
                  type="text"
                  value={newPayment.note}
                  onChange={(e) => setNewPayment(p => ({ ...p, note: e.target.value }))}
                  placeholder="VD: Thanh toán đợt 2 theo điều khoản HĐ"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-2.5">
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAddPayment}
                disabled={!newPayment.amount || Number(newPayment.amount) <= 0}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Ghi nhận & Đối chiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PHÂN HỆ 2: SỔ CHI PHÍ (EXPENSES API) ================= */}
      {mainTab === 'expenses' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sổ theo dõi khoản chi phí phát sinh</h3>
                <p className="text-xs text-slate-500">Đồng bộ trực tiếp với module Expenses (PostgreSQL)</p>
              </div>
              <button
                onClick={() => fetchExpensesData()}
                disabled={isLoadingExpenses}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingExpenses ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">DANH MỤC CHI PHÍ</th>
                    <th className="py-3 px-4">DIỄN GIẢI NỘI DUNG</th>
                    <th className="py-3 px-4 text-right">SỐ TIỀN</th>
                    <th className="py-3 px-4 text-center">NGÀY PHÁT SINH</th>
                    <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
                    <th className="py-3 px-4 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoadingExpenses ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-xs">Đang tải danh sách chi phí...</p>
                      </td>
                    </tr>
                  ) : expenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-600">Chưa có bản ghi chi phí nào</p>
                        <p className="text-xs text-slate-400 mt-1">Bấm "Tạo phiếu chi mới" ở góc trên để ghi nhận</p>
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{exp.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{exp.category}</td>
                        <td className="py-3.5 px-4 text-slate-600">{exp.description || '—'}</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-blue-700 text-sm">
                          {formatVND(exp.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                          {new Date(exp.expenseDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {exp.status === 'PAID' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Đã chi
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Chưa chi
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Xóa khoản chi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= PHÂN HỆ 3: TÀI KHOẢN & GIAO DỊCH NGÂN HÀNG (BANK API) ================= */}
      {mainTab === 'bank' && (
        <div className="space-y-4">
          {/* Danh sách tài khoản ngân hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingBank ? (
              <div className="p-8 text-center bg-white rounded-2xl border col-span-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Đang tải dữ liệu ngân hàng...</p>
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 col-span-2 text-center text-slate-500 text-xs">
                Chưa có tài khoản ngân hàng nào trong hệ thống.
              </div>
            ) : (
              bankAccounts.map((acc) => (
                <div key={acc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700">{acc.bankName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                        {acc.status}
                      </span>
                    </div>
                    <p className="text-lg font-mono font-extrabold text-slate-900 mt-1">{acc.accountNumber}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{acc.accountHolder} • {acc.branch || 'Hội sở'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Số dư hiện tại</span>
                    <p className="text-base font-extrabold text-emerald-600 mt-0.5">{formatVND(acc.currentBalance)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bảng giao dịch ngân hàng */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Giao dịch ngân hàng & Đối soát tự động</h3>
                <p className="text-xs text-slate-500">Đối chiếu sao kê với hóa đơn bán ra / mua vào</p>
              </div>
              <button 
                onClick={() => alert('Vui lòng chọn file sao kê ngân hàng (.xlsx / .csv)')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Tải lên sao kê</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">NGÀY GD</th>
                    <th className="py-3 px-4">NỘI DUNG CHUYỂN KHOẢN</th>
                    <th className="py-3 px-4 text-right">SỐ TIỀN</th>
                    <th className="py-3 px-4 text-center">LOẠI GD</th>
                    <th className="py-3 px-4 text-center">ĐỐI SOÁT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        Chưa có giao dịch sao kê nào. Tải lên sao kê để AI tự động đối chiếu!
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {new Date(tx.transactionDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">{tx.description}</td>
                        <td className={`py-3.5 px-4 text-right font-extrabold ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.type === 'CREDIT' ? `+${formatVND(tx.amount)}` : `-${formatVND(tx.amount)}`}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {tx.type === 'CREDIT' ? 'Tiền vào' : 'Tiền ra'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {tx.reconciliationStatus === 'RECONCILED' ? '✓ Đã gạch nợ' : 'Chờ đối soát'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TẠO PHIẾU CHI MỚI (POST /api/v1/expenses) ================= */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Ghi nhận khoản chi phí mới</h3>
                  <p className="text-xs text-slate-400">Đồng bộ vào Sổ chi phí & Báo cáo thuế</p>
                </div>
              </div>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="pt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Danh mục chi phí <span className="text-rose-500">*</span>
                </label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Chi phí dịch vụ mua ngoài (TK 6427)">Chi phí dịch vụ mua ngoài (TK 6427)</option>
                  <option value="Chi phí công cụ dụng cụ (TK 6423)">Chi phí công cụ dụng cụ (TK 6423)</option>
                  <option value="Chi phí máy chủ & Hạ tầng Internet (TK 6427)">Chi phí máy chủ & Hạ tầng Internet (TK 6427)</option>
                  <option value="Chi phí bản quyền phần mềm (TK 6428)">Chi phí bản quyền phần mềm (TK 6428)</option>
                  <option value="Chi phí tiếp khách & Văn phòng (TK 6428)">Chi phí tiếp khách & Văn phòng (TK 6428)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diễn giải nội dung</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thanh toán chi phí máy chủ AWS tháng 11/2026"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số tiền chi (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={expenseForm.amount || ''}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày phát sinh</label>
                  <input
                    type="date"
                    required
                    value={expenseForm.expenseDate}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái thanh toán</label>
                <select
                  value={expenseForm.status}
                  onChange={(e) => setExpenseForm({ ...expenseForm, status: e.target.value as 'PAID' | 'UNPAID' })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="PAID">Đã thanh toán (PAID)</option>
                  <option value="UNPAID">Chưa thanh toán (UNPAID)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExpense}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {isSubmittingExpense && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingExpense ? 'Đang lưu...' : 'Ghi nhận chi phí'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DUYỆT EMAIL NHẮC NỢ (HITL) ================= */}
      {showEmailModal && selectedDebt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">Duyệt Email Nhắc Nợ</h3>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      Soạn bởi Trợ lý AI OPC SmartOffice ✨
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Tối ưu hóa văn phong trang trọng, giữ vững quan hệ đối tác B2B</p>
                </div>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">NGƯỜI NHẬN CHÍNH (TO):</span>
                  <p className="font-bold text-slate-900 mt-0.5">ketoan@abc.com</p>
                  <p className="text-[11px] text-slate-500">Ban Tài chính - Kế toán Công ty CP ABC</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ĐỒNG GỬI (CC):</span>
                  <p className="font-medium text-slate-800 mt-0.5">giamdoc@abc.com; minh@minhsoftware.vn</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">TIÊU ĐỀ THƯ:</span>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1">
                  <span className="text-xs font-bold text-slate-900">
                    [Minh Software] Nhắc thanh toán công nợ quá hạn hợp đồng {selectedDebt.contractCode}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    ✓ AI Tối ưu tỉ lệ mở thư (Open-rate 88%)
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">NỘI DUNG THƯ ĐIỆN TỬ:</span>
                  <span className="text-[10px] text-slate-400">Độ trang trọng: 9.5/10 • Thời gian gửi gợi ý: 09:30 Thứ Ba</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 space-y-3 font-sans leading-relaxed">
                  <p>Kính gửi: Ban Giám đốc & Phòng Kế toán {selectedDebt.companyName},</p>
                  <p>Lời đầu tiên, Minh Software xin gửi lời chào trân trọng và lời chúc sức khỏe đến Quý công ty.</p>
                  <p>
                    Theo điều khoản Hợp đồng <strong>{selectedDebt.contractCode}</strong> về dịch vụ {selectedDebt.contractName}, đợt thanh toán số 2 với số tiền <strong className="text-rose-600 font-bold">{formatVND(selectedDebt.remainingDebt)} (Mười tám triệu đồng chẵn)</strong> đã đến hạn thanh toán vào ngày 15/10/2026 (hiện đã quá hạn 30 ngày).
                  </p>
                  <p>
                    Để đảm bảo tiến độ bảo trì hệ thống và quyết toán sổ sách cuối năm, kính đề nghị Quý công ty thu xếp thanh toán khoản công nợ trên trước ngày <strong>25/11/2026</strong>.
                  </p>
                  
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-700">
                    <p className="font-bold text-blue-700">Thông tin chuyển khoản:</p>
                    <p>• Tên TK: CÔNG TY TNHH MTV MINH SOFTWARE</p>
                    <p>• Số TK: 102099000001 - Vietcombank CN TP.HCM</p>
                    <p>• Nội dung CK: {selectedDebt.contractCode} Cong ty ABC thanh toan dot 2</p>
                  </div>

                  <p>Trân trọng cảm ơn sự hợp tác của Quý công ty!</p>
                  <p className="font-bold text-slate-900">Đại diện Minh Software - Nguyễn Văn Minh</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Cơ chế bảo vệ Human-in-the-loop</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Email chỉ được gửi đi khi có sự phê duyệt trực tiếp của Anh Minh. AI OPC SmartOffice không bao giờ tự ý phát hành văn bản tài chính ra bên ngoài.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button 
                onClick={() => alert('Cho phép sửa trực tiếp văn bản')}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa lời văn</span>
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Phê duyệt & Gửi thư ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
