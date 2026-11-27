// src/components/finance/FinanceHeader.tsx
import React from 'react';
import {
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  Receipt,
  Building,
  FileCheck2,
} from 'lucide-react';
import type { ExpenseStatistics } from '../../services/financeService';
import type { ApiNoticeState, MainTabType } from '../../pages/finance/finance.types';
import './FinanceHeader.css';

interface FinanceHeaderProps {
  mainTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  expenseStats: ExpenseStatistics | null;
  expensesCount: number;
  apiNotice: ApiNoticeState | null;
  onDismissNotice: () => void;
  onOpenCreateExpense: () => void;
  onExportExcel: () => void;
  formatVND: (num: number) => string;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  mainTab,
  onChangeTab,
  expenseStats,
  expensesCount,
  apiNotice,
  onDismissNotice,
  onOpenCreateExpense,
  onExportExcel,
  formatVND,
}) => {
  return (
    <>
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
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất sổ phụ Excel</span>
          </button>
          <button
            onClick={onOpenCreateExpense}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo phiếu chi mới</span>
          </button>
        </div>
      </div>

      {/* Thông báo API Toast */}
      {apiNotice && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            apiNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {apiNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-semibold">{apiNotice.message}</span>
          </div>
          <button onClick={onDismissNotice} className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Hàng 3 Thẻ chỉ số tài chính */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="finance-header-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
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

        <div className="finance-header-card bg-white p-5 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/20 to-white shadow-sm relative overflow-hidden">
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

        <div className="finance-header-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
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

      {/* Tabs chuyển đổi giữa các phân hệ */}
      <div className="finance-tab-bar flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => onChangeTab('debt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            mainTab === 'debt' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Theo dõi Công nợ & AI Nhắc nợ</span>
        </button>

        <button
          onClick={() => onChangeTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            mainTab === 'expenses' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Sổ Chi phí & Phiếu chi (API)</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
              mainTab === 'expenses' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {expensesCount}
          </span>
        </button>

        <button
          onClick={() => onChangeTab('bank')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            mainTab === 'bank' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Tài khoản & Sao kê Ngân hàng</span>
        </button>

        <button
          onClick={() => onChangeTab('reconcile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            mainTab === 'reconcile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Đối chiếu Công nợ</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
              mainTab === 'reconcile' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            }`}
          >
            MỚI
          </span>
        </button>
      </div>
    </>
  );
};
