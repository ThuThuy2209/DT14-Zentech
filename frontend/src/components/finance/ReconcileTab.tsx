// src/components/finance/ReconcileTab.tsx
import React from 'react';
import {
  FileCheck2,
  Download,
  RefreshCw,
  Sparkles,
  CheckCheck,
  CircleDollarSign,
  Banknote,
  AlertTriangle,
  Search,
  FileText,
  ArrowDownLeft,
  X,
  Plus,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import type { AutoMatchSuggestion, ReconciliationItem } from '../../services/financeService';
import type { ReconcileFilterType, ReconcileRecord } from '../../pages/finance/finance.types';
import './ReconcileTab.css';

interface ReconcileTabProps {
  reconcileMonth: string;
  onChangeMonth: (month: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  autoMatchSuggestions: AutoMatchSuggestion[];
  apiReconcileItems: ReconciliationItem[];
  onConfirmAutoMatch: (
    transactionId: number,
    suggestion: AutoMatchSuggestion['suggestions'][number]
  ) => void;
  onRollbackReconciliation: (id: number) => void;
  summary: {
    totalInvoices: number;
    totalValue: number;
    totalPaid: number;
    totalRemaining: number;
    fullyPaid: number;
    overdue: number;
  };
  search: string;
  onChangeSearch: (value: string) => void;
  filter: ReconcileFilterType;
  onChangeFilter: (filter: ReconcileFilterType) => void;
  records: ReconcileRecord[];
  selectedReconcile: ReconcileRecord | null;
  showDetailModal: boolean;
  onOpenDetail: (record: ReconcileRecord) => void;
  onCloseDetail: () => void;
  showAddPaymentModal: boolean;
  onOpenAddPayment: (record: ReconcileRecord) => void;
  onCloseAddPayment: () => void;
  newPayment: {
    amount: string;
    method: 'bank_transfer' | 'cash' | 'other';
    referenceNo: string;
    note: string;
  };
  onChangeNewPayment: (
    updater: (prev: {
      amount: string;
      method: 'bank_transfer' | 'cash' | 'other';
      referenceNo: string;
      note: string;
    }) => {
      amount: string;
      method: 'bank_transfer' | 'cash' | 'other';
      referenceNo: string;
      note: string;
    }
  ) => void;
  onAddPayment: () => void;
  onToggleVerify: (recordId: string, paymentId: string) => void;
  getPaidTotal: (record: ReconcileRecord) => number;
  getRemaining: (record: ReconcileRecord) => number;
}

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

export const ReconcileTab: React.FC<ReconcileTabProps> = ({
  reconcileMonth,
  onChangeMonth,
  isLoading,
  onRefresh,
  autoMatchSuggestions,
  apiReconcileItems,
  onConfirmAutoMatch,
  onRollbackReconciliation,
  summary,
  search,
  onChangeSearch,
  filter,
  onChangeFilter,
  records,
  selectedReconcile,
  showDetailModal,
  onOpenDetail,
  onCloseDetail,
  showAddPaymentModal,
  onOpenAddPayment,
  onCloseAddPayment,
  newPayment,
  onChangeNewPayment,
  onAddPayment,
  onToggleVerify,
  getPaidTotal,
  getRemaining,
}) => {
  return (
    <>
      <div className="space-y-5 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Đối chiếu Công nợ Cuối tháng</h2>
              </div>
              <p className="text-xs text-slate-500">
                Theo dõi các khoản thanh toán, gạch nợ hóa đơn/hợp đồng và xác nhận đã đối chiếu
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
                <span>Kỳ đối chiếu:</span>
                <select
                  value={reconcileMonth}
                  onChange={(e) => onChangeMonth(e.target.value)}
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
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Đang tải...' : 'Làm mới'}</span>
              </button>
            </div>
          </div>

          {autoMatchSuggestions.length > 0 && (
            <div className="mt-3 p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold text-blue-900">
                  Đề xuất đối chiếu tự động ({autoMatchSuggestions.length} giao dịch)
                </span>
              </div>
              <div className="space-y-2">
                {autoMatchSuggestions.map((item) => (
                  <div
                    key={item.transactionId}
                    className="bg-white p-3 rounded-lg border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        GD #{item.transactionId} • {item.transactionAmount.toLocaleString('vi-VN')} đ
                      </p>
                      <p className="text-[11px] text-slate-500">{item.transactionDescription}</p>
                      {item.suggestions?.[0] && (
                        <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                          Gợi ý: {item.suggestions[0].description} (Khớp {item.suggestions[0].matchScore}%)
                        </p>
                      )}
                    </div>
                    {item.suggestions?.[0] && (
                      <button
                        onClick={() => onConfirmAutoMatch(item.transactionId, item.suggestions[0])}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                      >
                        Xác nhận gạch nợ
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {apiReconcileItems.length > 0 && (
            <div className="mt-3 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCheck className="w-4 h-4 shrink-0" />
                <span>Lịch sử đối chiếu đã ghi nhận trên hệ thống ({apiReconcileItems.length})</span>
              </div>
              <div className="reconcile-history-list space-y-1.5">
                {apiReconcileItems.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">
                        #{rec.id} (GD #{rec.transactionId})
                      </span>
                      <span className="mx-2 text-slate-300">|</span>
                      <span className="font-bold text-emerald-700">
                        {rec.matchedAmount.toLocaleString('vi-VN')} đ
                      </span>
                      {rec.note && <span className="text-slate-500 ml-2">• {rec.note}</span>}
                    </div>
                    <button
                      onClick={() => onRollbackReconciliation(rec.id)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      Hủy đối chiếu
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4 chỉ số tóm tắt cuối tháng */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Tổng phát sinh', value: summary.totalValue, bg: 'bg-slate-50', cls: 'text-slate-800', icon: <CircleDollarSign className="w-4 h-4 text-slate-500" />, isCount: false },
              { label: 'Đã thu được', value: summary.totalPaid, bg: 'bg-emerald-50', cls: 'text-emerald-700', icon: <CheckCheck className="w-4 h-4 text-emerald-500" />, isCount: false },
              { label: 'Còn phải thu', value: summary.totalRemaining, bg: 'bg-amber-50', cls: 'text-amber-700', icon: <Banknote className="w-4 h-4 text-amber-500" />, isCount: false },
              { label: 'Quá hạn', value: summary.overdue, bg: 'bg-rose-50', cls: 'text-rose-700', icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, isCount: true },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-xl p-3`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {s.icon}
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span>
                </div>
                <p className={`text-base font-extrabold ${s.cls}`}>
                  {s.isCount ? `${s.value} hóa đơn` : `${s.value.toLocaleString('vi-VN')} đ`}
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
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
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
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => onChangeFilter(f.key)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === f.key ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách đối chiếu */}
        <div className="space-y-3">
          {records.map((record) => {
            const paid = getPaidTotal(record);
            const remaining = getRemaining(record);
            const pct = Math.min(100, record.totalValue > 0 ? (paid / record.totalValue) * 100 : 0);
            const badge = getStatusBadge(record.status);

            return (
              <div
                key={record.id}
                className="reconcile-record-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0 ${record.avatarBg}`}
                    >
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
                          <span>
                            Đã thu: <strong className="text-emerald-700">{paid.toLocaleString('vi-VN')} đ</strong>
                          </span>
                          <span>
                            Còn:{' '}
                            <strong className={remaining > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                              {remaining.toLocaleString('vi-VN')} đ
                            </strong>
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              record.status === 'fully_paid'
                                ? 'bg-emerald-500'
                                : record.status === 'overdue'
                                  ? 'bg-rose-500'
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
                      onClick={() => onOpenDetail(record)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Chi tiết
                    </button>
                    {record.status !== 'fully_paid' && (
                      <button
                        onClick={() => onOpenAddPayment(record)}
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
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              p.verified ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          />
                          <span className="text-slate-500">{p.date}</span>
                          <span className="font-bold text-slate-800">{p.amount.toLocaleString('vi-VN')} đ</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              p.method === 'bank_transfer'
                                ? 'bg-blue-50 text-blue-700'
                                : p.method === 'cash'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                            }`}
                          >
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
                      <p className="text-[10px] text-slate-400 text-center pt-0.5">
                        + {record.payments.length - 2} lần TT khác...
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {records.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">Không tìm thấy kết quả phù hợp</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Chi tiết Đối chiếu */}
      {showDetailModal && selectedReconcile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
              <div>
                <h3 className="font-bold text-base text-slate-900">Chi tiết Đối chiếu Công nợ</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedReconcile.companyName} • {selectedReconcile.contractCode}
                </p>
              </div>
              <button
                onClick={onCloseDetail}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
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
                  { label: 'Giá trị HĐ', value: `${selectedReconcile.totalValue.toLocaleString('vi-VN')} đ` },
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
                  {
                    label: 'Còn lại',
                    v: getRemaining(selectedReconcile),
                    cls: getRemaining(selectedReconcile) > 0 ? 'text-amber-700' : 'text-emerald-700',
                    bg: getRemaining(selectedReconcile) > 0 ? 'bg-amber-50' : 'bg-emerald-50',
                  },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                    <p className={`text-sm font-extrabold mt-0.5 ${s.cls}`}>{s.v.toLocaleString('vi-VN')} đ</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Lịch sử các lần thanh toán
                  </h4>
                  {selectedReconcile.status !== 'fully_paid' && (
                    <button
                      onClick={() => {
                        onCloseDetail();
                        onOpenAddPayment(selectedReconcile);
                      }}
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
                      <div
                        key={p.id}
                        className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{p.amount.toLocaleString('vi-VN')} đ</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {p.date} •{' '}
                              <span
                                className={`font-semibold ${
                                  p.method === 'bank_transfer'
                                    ? 'text-blue-700'
                                    : p.method === 'cash'
                                      ? 'text-amber-700'
                                      : 'text-slate-600'
                                }`}
                              >
                                {p.method === 'bank_transfer'
                                  ? 'Chuyển khoản NH'
                                  : p.method === 'cash'
                                    ? 'Tiền mặt'
                                    : 'Khác'}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Chứng từ: <strong className="text-slate-700">{p.referenceNo}</strong>
                            </p>
                            {p.note && <p className="text-[11px] text-slate-400 italic mt-0.5">&quot;{p.note}&quot;</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => onToggleVerify(selectedReconcile.id, p.id)}
                          className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            p.verified
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {p.verified ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Đã đối chiếu
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> Chờ xác nhận
                            </>
                          )}
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
              <button
                onClick={onCloseDetail}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
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
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedReconcile.companyName} • {selectedReconcile.contractCode}
                </p>
              </div>
              <button
                onClick={onCloseAddPayment}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>Còn phải thu:</span>
                <strong className="text-sm">{getRemaining(selectedReconcile).toLocaleString('vi-VN')} đ</strong>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Số tiền thanh toán (VNĐ)
                </label>
                <div className="relative">
                  <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={0}
                    value={newPayment.amount}
                    onChange={(e) => onChangeNewPayment((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="VD: 5000000"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { v: 'bank_transfer', label: 'CK Ngân hàng', icon: '🏦' },
                    { v: 'cash', label: 'Tiền mặt', icon: '💵' },
                    { v: 'other', label: 'Khác', icon: '📋' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => onChangeNewPayment((p) => ({ ...p, method: opt.v }))}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        newPayment.method === opt.v
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Số chứng từ / Mã giao dịch NH
                </label>
                <input
                  type="text"
                  value={newPayment.referenceNo}
                  onChange={(e) => onChangeNewPayment((p) => ({ ...p, referenceNo: e.target.value }))}
                  placeholder="VD: FT26112345678 hoặc PC-2026-055"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Ghi chú (tuỳ chọn)
                </label>
                <input
                  type="text"
                  value={newPayment.note}
                  onChange={(e) => onChangeNewPayment((p) => ({ ...p, note: e.target.value }))}
                  placeholder="VD: Thanh toán đợt 2 theo điều khoản HĐ"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-2.5">
              <button
                onClick={onCloseAddPayment}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={onAddPayment}
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
    </>
  );
};
