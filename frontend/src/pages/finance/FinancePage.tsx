// src/pages/finance/FinancePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  getExpenses,
  getExpenseStatistics,
  createExpense,
  deleteExpense,
  getBankAccounts,
  getBankTransactions,
  uploadBankStatement,
  getBankStatements,
  deleteBankStatement,
  getReconciliationHistory,
  confirmReconciliation,
  deleteReconciliation,
  getAutoMatch,
  type ExpenseItem,
  type ExpenseStatistics,
  type CreateExpensePayload,
  type BankAccountItem,
  type BankTransactionItem,
  type BankStatementItem,
  type ReconciliationItem,
  type AutoMatchSuggestion,
} from '../../services/financeService';
import type {
  ApiNoticeState,
  DebtRecord,
  DebtTabType,
  MainTabType,
  ReconcileFilterType,
  ReconcileRecord,
} from './finance.types';
import { FinanceHeader } from '../../components/finance/FinanceHeader';
import { DebtTab } from '../../components/finance/DebtTab';
import { ReconcileTab } from '../../components/finance/ReconcileTab';
import { ExpensesTab } from '../../components/finance/ExpensesTab';
import { BankTab } from '../../components/finance/BankTab';

export const FinancePage: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTabType>('debt');
  const [apiNotice, setApiNotice] = useState<ApiNoticeState | null>(null);

  const formatVND = (num: number) => `${(num || 0).toLocaleString('vi-VN')} đ`;

  // ================= 1. State Quản lý Công nợ =================
  const [debtTab, setDebtTab] = useState<DebtTabType>('all');
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
      overdueDays: 0,
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
      dueDateText: 'Quá hạn (Hết hạn 30 ngày - 02/12/2026)',
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
      dueDateText: 'Trong hạn (Hạn: 05/12/2026)',
    },
  ];

  const filteredDebts = debts.filter((d) => {
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

  // ================= 2. State Đối chiếu Công nợ =================
  const [reconcileSearch, setReconcileSearch] = useState<string>('');
  const [reconcileFilter, setReconcileFilter] = useState<ReconcileFilterType>('all');
  const [selectedReconcile, setSelectedReconcile] = useState<ReconcileRecord | null>(null);
  const [showReconcileDetail, setShowReconcileDetail] = useState<boolean>(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [reconcileMonth, setReconcileMonth] = useState<string>('11/2026');
  const [newPayment, setNewPayment] = useState<{
    amount: string;
    method: 'bank_transfer' | 'cash' | 'other';
    referenceNo: string;
    note: string;
  }>({
    amount: '',
    method: 'bank_transfer',
    referenceNo: '',
    note: '',
  });
  const [isLoadingReconcile, setIsLoadingReconcile] = useState<boolean>(false);
  const [autoMatchSuggestions, setAutoMatchSuggestions] = useState<AutoMatchSuggestion[]>([]);
  const [apiReconcileItems, setApiReconcileItems] = useState<ReconciliationItem[]>([]);

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
      ],
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
      ],
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
      ],
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
      payments: [],
    },
  ]);

  const getPaidTotal = (record: ReconcileRecord) => record.payments.reduce((s, p) => s + p.amount, 0);
  const getRemaining = (record: ReconcileRecord) => record.totalValue - getPaidTotal(record);

  const filteredReconcile = reconcileRecords.filter((r) => {
    const matchSearch =
      !reconcileSearch ||
      r.companyName.toLowerCase().includes(reconcileSearch.toLowerCase()) ||
      r.contractCode.toLowerCase().includes(reconcileSearch.toLowerCase()) ||
      r.invoiceNo.toLowerCase().includes(reconcileSearch.toLowerCase());
    const matchFilter = reconcileFilter === 'all' || r.status === reconcileFilter;
    return matchSearch && matchFilter;
  });

  const reconcileSummary = {
    totalInvoices: reconcileRecords.length,
    totalValue: reconcileRecords.reduce((s, r) => s + r.totalValue, 0),
    totalPaid: reconcileRecords.reduce((s, r) => s + getPaidTotal(r), 0),
    totalRemaining: reconcileRecords.reduce((s, r) => s + getRemaining(r), 0),
    fullyPaid: reconcileRecords.filter((r) => r.status === 'fully_paid').length,
    overdue: reconcileRecords.filter((r) => r.status === 'overdue').length,
  };

  // ================= 3. State Sổ chi phí (Expenses API) =================
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [expenseStats, setExpenseStats] = useState<ExpenseStatistics | null>(null);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState<boolean>(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState<boolean>(false);
  const [expenseForm, setExpenseForm] = useState<CreateExpensePayload>({
    category: 'Chi phí dịch vụ mua ngoài (TK 6427)',
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    status: 'PAID',
  });

  // ================= 4. State Ngân hàng & Sao kê =================
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([]);
  const [transactions, setTransactions] = useState<BankTransactionItem[]>([]);
  const [bankStatements, setBankStatements] = useState<BankStatementItem[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadAccountId, setUploadAccountId] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadingStatement, setIsUploadingStatement] = useState<boolean>(false);

  // ================= 5. Fetch API Functions =================
  const fetchExpensesData = useCallback(async () => {
    setIsLoadingExpenses(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        getExpenses({ page: 1, limit: 20 }),
        getExpenseStatistics(),
      ]);
      if (listRes.success && listRes.data) setExpenses(listRes.data.items || []);
      if (statsRes.success && statsRes.data) setExpenseStats(statsRes.data);
    } catch {
      setApiNotice({ type: 'error', message: 'Lỗi tải dữ liệu chi phí từ Backend' });
    } finally {
      setIsLoadingExpenses(false);
    }
  }, []);

  const fetchBankData = useCallback(async () => {
    setIsLoadingBank(true);
    try {
      const [accRes, transRes, stmtRes] = await Promise.all([
        getBankAccounts(),
        getBankTransactions({ page: 1, limit: 20 }),
        getBankStatements(),
      ]);
      if (accRes.success && accRes.data) {
        const items = accRes.data.items || [];
        setBankAccounts(items);
        if (items.length > 0 && !uploadAccountId) {
          setUploadAccountId(items[0].id.toString());
        }
      }
      if (transRes.success && transRes.data) setTransactions(transRes.data.items || []);
      if (stmtRes.success && stmtRes.data) setBankStatements(stmtRes.data.items || []);
    } catch {
      setApiNotice({ type: 'error', message: 'Lỗi tải dữ liệu ngân hàng từ Backend' });
    } finally {
      setIsLoadingBank(false);
    }
  }, [uploadAccountId]);

  const fetchReconcileData = useCallback(async () => {
    setIsLoadingReconcile(true);
    try {
      const [histRes, autoRes] = await Promise.all([
        getReconciliationHistory({ page: 1, limit: 50 }),
        getAutoMatch(),
      ]);
      if (histRes.success && histRes.data) setApiReconcileItems(histRes.data.items || []);
      if (autoRes.success && autoRes.data) setAutoMatchSuggestions(autoRes.data || []);
    } catch {
      setApiNotice({ type: 'error', message: 'Không thể tải lịch sử đối chiếu từ Backend' });
    } finally {
      setIsLoadingReconcile(false);
    }
  }, []);

  useEffect(() => {
    if (mainTab === 'expenses') fetchExpensesData();
    if (mainTab === 'bank') fetchBankData();
    if (mainTab === 'reconcile') fetchReconcileData();
  }, [mainTab, fetchExpensesData, fetchBankData, fetchReconcileData]);

  // ================= 6. Action Handlers =================
  const handleAddPayment = async () => {
    if (!selectedReconcile || !newPayment.amount || Number(newPayment.amount) <= 0) return;
    const paidSoFar = getPaidTotal(selectedReconcile) + Number(newPayment.amount);
    const newStatus: ReconcileRecord['status'] =
      paidSoFar >= selectedReconcile.totalValue ? 'fully_paid' : paidSoFar > 0 ? 'partial' : 'unpaid';

    const transactionId = Number(selectedReconcile.id.replace('R', '')) || 0;
    if (transactionId > 0) {
      try {
        const res = await confirmReconciliation({
          transactionId,
          matchedAmount: Number(newPayment.amount),
          note: newPayment.note || `${newPayment.method} - ${newPayment.referenceNo}`,
        });
        if (!res.success) {
          setApiNotice({ type: 'error', message: res.message || 'Xác nhận đối chiếu thất bại' });
          return;
        }
        fetchReconcileData();
      } catch {
        setApiNotice({ type: 'error', message: 'Lỗi kết nối khi xác nhận đối chiếu!' });
        return;
      }
    }

    const updatedRecord: ReconcileRecord = {
      ...selectedReconcile,
      status: newStatus,
      payments: [
        ...selectedReconcile.payments,
        {
          id: `P${Date.now()}`,
          date: new Date().toLocaleDateString('vi-VN'),
          amount: Number(newPayment.amount),
          method: newPayment.method,
          referenceNo: newPayment.referenceNo || `TM-${Date.now()}`,
          note: newPayment.note,
          verified: false,
        },
      ],
    };

    setReconcileRecords((prev) => prev.map((r) => (r.id === selectedReconcile.id ? updatedRecord : r)));
    setSelectedReconcile(updatedRecord);
    setShowAddPaymentModal(false);
    setNewPayment({ amount: '', method: 'bank_transfer', referenceNo: '', note: '' });
    setApiNotice({
      type: 'success',
      message: `Ghi nhận thanh toán ${Number(newPayment.amount).toLocaleString('vi-VN')} đ từ ${selectedReconcile.companyName} thành công!`,
    });
  };

  const handleToggleVerify = async (recordId: string, paymentId: string) => {
    const record = reconcileRecords.find((r) => r.id === recordId);
    const payment = record?.payments.find((p) => p.id === paymentId);

    if (payment?.verified) {
      const reconcileId = Number(paymentId.replace('P', ''));
      if (reconcileId > 0) {
        try {
          await deleteReconciliation(reconcileId);
          fetchReconcileData();
        } catch {
          // Tiếp tục toggle local
        }
      }
    }

    setReconcileRecords((prev) =>
      prev.map((r) =>
        r.id !== recordId
          ? r
          : { ...r, payments: r.payments.map((p) => (p.id === paymentId ? { ...p, verified: !p.verified } : p)) }
      )
    );
    if (selectedReconcile?.id === recordId) {
      setSelectedReconcile((prev) =>
        prev
          ? { ...prev, payments: prev.payments.map((p) => (p.id === paymentId ? { ...p, verified: !p.verified } : p)) }
          : null
      );
    }
  };

  const handleConfirmAutoMatch = async (
    transactionId: number,
    suggestion: AutoMatchSuggestion['suggestions'][number]
  ) => {
    try {
      const res = await confirmReconciliation({
        transactionId,
        documentId: suggestion.documentId,
        contractId: suggestion.contractId,
        matchedAmount: suggestion.amount,
        note: `Đối chiếu tự động: ${suggestion.description}`,
      });
      if (res.success) {
        setApiNotice({ type: 'success', message: 'Đã xác nhận đối chiếu và gạch nợ thành công!' });
        fetchReconcileData();
      } else {
        setApiNotice({ type: 'error', message: res.message || 'Xác nhận đối chiếu thất bại' });
      }
    } catch {
      setApiNotice({ type: 'error', message: 'Lỗi kết nối khi xác nhận đối chiếu!' });
    }
  };

  const handleRollbackReconciliation = async (id: number) => {
    if (!window.confirm('Bạn có muốn hủy kết quả đối chiếu này (rollback)?')) return;
    try {
      const res = await deleteReconciliation(id);
      if (res.success) {
        setApiNotice({ type: 'success', message: 'Đã hủy kết quả đối chiếu thành công!' });
        fetchReconcileData();
      } else {
        setApiNotice({ type: 'error', message: res.message || 'Hủy đối chiếu thất bại' });
      }
    } catch {
      setApiNotice({ type: 'error', message: 'Lỗi kết nối khi hủy đối chiếu!' });
    }
  };

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

  const handleDeleteExpense = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khoản chi phí này?')) return;
    try {
      const res = await deleteExpense(id);
      if (res.success) {
        setApiNotice({ type: 'success', message: `Đã xóa khoản chi phí #${id}` });
        fetchExpensesData();
      } else {
        alert(res.message || 'Xóa chi phí thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi xóa chi phí!');
    }
  };

  const handleUploadStatementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAccountId) {
      setApiNotice({ type: 'error', message: 'Vui lòng chọn tài khoản ngân hàng và file sao kê!' });
      return;
    }
    setIsUploadingStatement(true);
    try {
      const res = await uploadBankStatement(uploadFile, uploadAccountId);
      if (res.success) {
        setApiNotice({
          type: 'success',
          message: res.data?.message || 'Tải lên file sao kê thành công! Hệ thống đã bóc tách giao dịch.',
        });
        setShowUploadModal(false);
        setUploadFile(null);
        fetchBankData();
      } else {
        setApiNotice({ type: 'error', message: res.message || 'Tải lên sao kê thất bại' });
      }
    } catch {
      setApiNotice({ type: 'error', message: 'Lỗi kết nối khi tải lên file sao kê!' });
    } finally {
      setIsUploadingStatement(false);
    }
  };

  const handleDeleteStatement = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đợt sao kê này?')) return;
    try {
      const res = await deleteBankStatement(id);
      if (res.success) {
        setApiNotice({ type: 'success', message: 'Đã xóa đợt sao kê!' });
        fetchBankData();
      } else {
        setApiNotice({ type: 'error', message: res.message || 'Xóa sao kê thất bại' });
      }
    } catch {
      setApiNotice({ type: 'error', message: 'Lỗi kết nối khi xóa sao kê!' });
    }
  };

  return (
    <div className="space-y-6">
      <FinanceHeader
        mainTab={mainTab}
        onChangeTab={setMainTab}
        expenseStats={expenseStats}
        expensesCount={expenses.length}
        apiNotice={apiNotice}
        onDismissNotice={() => setApiNotice(null)}
        onOpenCreateExpense={() => setIsExpenseModalOpen(true)}
        onExportExcel={() => alert('Xuất sổ phụ sao kê Excel định dạng chuẩn kế toán Việt Nam.')}
        formatVND={formatVND}
      />

      {mainTab === 'debt' && (
        <DebtTab
          debts={filteredDebts}
          debtTab={debtTab}
          onChangeDebtTab={setDebtTab}
          selectedDebt={selectedDebt}
          showEmailModal={showEmailModal}
          onOpenEmailModal={handleOpenEmailModal}
          onCloseEmailModal={() => setShowEmailModal(false)}
          onSendEmail={handleSendEmail}
          formatVND={formatVND}
        />
      )}

      {mainTab === 'reconcile' && (
        <ReconcileTab
          reconcileMonth={reconcileMonth}
          onChangeMonth={setReconcileMonth}
          isLoading={isLoadingReconcile}
          onRefresh={fetchReconcileData}
          autoMatchSuggestions={autoMatchSuggestions}
          apiReconcileItems={apiReconcileItems}
          onConfirmAutoMatch={handleConfirmAutoMatch}
          onRollbackReconciliation={handleRollbackReconciliation}
          summary={reconcileSummary}
          search={reconcileSearch}
          onChangeSearch={setReconcileSearch}
          filter={reconcileFilter}
          onChangeFilter={setReconcileFilter}
          records={filteredReconcile}
          selectedReconcile={selectedReconcile}
          showDetailModal={showReconcileDetail}
          onOpenDetail={(record) => {
            setSelectedReconcile(record);
            setShowReconcileDetail(true);
          }}
          onCloseDetail={() => setShowReconcileDetail(false)}
          showAddPaymentModal={showAddPaymentModal}
          onOpenAddPayment={(record) => {
            setSelectedReconcile(record);
            setShowAddPaymentModal(true);
          }}
          onCloseAddPayment={() => setShowAddPaymentModal(false)}
          newPayment={newPayment}
          onChangeNewPayment={setNewPayment}
          onAddPayment={handleAddPayment}
          onToggleVerify={handleToggleVerify}
          getPaidTotal={getPaidTotal}
          getRemaining={getRemaining}
        />
      )}

      {mainTab === 'expenses' && (
        <ExpensesTab
          expenses={expenses}
          isLoading={isLoadingExpenses}
          onRefresh={fetchExpensesData}
          onDeleteExpense={handleDeleteExpense}
          isModalOpen={isExpenseModalOpen}
          onCloseModal={() => setIsExpenseModalOpen(false)}
          expenseForm={expenseForm}
          onChangeExpenseForm={setExpenseForm}
          onSubmitExpense={handleCreateExpenseSubmit}
          isSubmitting={isSubmittingExpense}
          formatVND={formatVND}
        />
      )}

      {mainTab === 'bank' && (
        <BankTab
          bankAccounts={bankAccounts}
          transactions={transactions}
          bankStatements={bankStatements}
          isLoading={isLoadingBank}
          showUploadModal={showUploadModal}
          onOpenUploadModal={() => setShowUploadModal(true)}
          onCloseUploadModal={() => setShowUploadModal(false)}
          uploadAccountId={uploadAccountId}
          onChangeUploadAccountId={setUploadAccountId}
          uploadFile={uploadFile}
          onChangeUploadFile={setUploadFile}
          isUploadingStatement={isUploadingStatement}
          onSubmitUpload={handleUploadStatementSubmit}
          onDeleteStatement={handleDeleteStatement}
          formatVND={formatVND}
        />
      )}
    </div>
  );
};
