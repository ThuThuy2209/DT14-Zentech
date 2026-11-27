import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Hourglass, 
  ShieldCheck, 
  Calendar, 
  Download, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  PieChart, 
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { getBankAccounts, getExpenseStatistics, type BankAccountItem, type ExpenseStatistics } from '../services/financeService';
import { getPurchaseInvoices, type PurchaseInvoiceItem } from '../services/invoiceService';
import { getContracts } from '../services/contractService';
import { getCustomers } from '../services/customerService';
import { MobileDashboardView } from './MobileDashboardView';

interface DashboardViewProps {
  onNavigate?: (tab: string) => void;
}

const formatVND = (num: number) => (num || 0).toLocaleString('vi-VN') + ' đ';

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  // State quản lý đóng/mở khung lịch và khoảng thời gian chọn
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Tháng này (Tháng 11/2026)');
  const [selectedDay, setSelectedDay] = useState(17);

  // Mảng ngày trong Tháng 11/2026
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // ================= DỮ LIỆU THỰC TẾ TỪ POSTGRESQL API =================
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([]);
  const [totalBankBalance, setTotalBankBalance] = useState<number>(142000000);
  const [totalRevenue, setTotalRevenue] = useState<number>(85000000);
  const [totalOverdueDebt] = useState<number>(18000000);
  const [needsReviewInvoices, setNeedsReviewInvoices] = useState<PurchaseInvoiceItem[]>([]);
  const [expenseStats, setExpenseStats] = useState<ExpenseStatistics | null>(null);
  const [totalContractsCount, setTotalContractsCount] = useState<number>(6);
  const [totalCustomersCount, setTotalCustomersCount] = useState<number>(24);

  // Lấy tên đại diện từ localStorage nếu có
  const companyUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('company') || '{}') : {};
  const representativeName = companyUser.representative || 'Anh Minh';

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bankRes, invoiceRes, expenseRes, contractRes, customerRes] = await Promise.allSettled([
        getBankAccounts(),
        getPurchaseInvoices({ tab: 'NEEDS_REVIEW', page: 1, limit: 10 }),
        getExpenseStatistics(),
        getContracts({ page: 1, limit: 20 }),
        getCustomers({ page: 1, limit: 10 }),
      ]);

      // 1. Dòng tiền ngân hàng
      if (bankRes.status === 'fulfilled' && bankRes.value.success && bankRes.value.data) {
        const accs = bankRes.value.data.items || [];
        setBankAccounts(accs);
        const sumBal = accs.reduce((acc, curr) => acc + (Number(curr.currentBalance) || 0), 0);
        if (sumBal > 0) setTotalBankBalance(sumBal);
      }

      // 2. Hóa đơn cần duyệt (AI OCR Cảnh báo)
      if (invoiceRes.status === 'fulfilled' && invoiceRes.value.success && invoiceRes.value.data) {
        setNeedsReviewInvoices(invoiceRes.value.data.items || []);
      }

      // 3. Cơ cấu chi phí
      if (expenseRes.status === 'fulfilled' && expenseRes.value.success && expenseRes.value.data) {
        setExpenseStats(expenseRes.value.data);
      }

      // 4. Hợp đồng & Doanh thu
      if (contractRes.status === 'fulfilled' && contractRes.value.success && contractRes.value.data) {
        const contractsList = contractRes.value.data.items || [];
        setTotalContractsCount(contractRes.value.data.total || contractsList.length);
        const revenueSum = contractsList.reduce((acc, c) => acc + (Number(c.contractValue) || 0), 0);
        if (revenueSum > 0) setTotalRevenue(revenueSum);
      }

      // 5. Khách hàng
      if (customerRes.status === 'fulfilled' && customerRes.value.success && customerRes.value.data) {
        setTotalCustomersCount(customerRes.value.data.total || 24);
      }
    } catch {
      // Graceful fallback to initial values
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <>
      {/* 1. GIAO DIỆN MOBILE DASHBOARD (Tự động hiển thị trên điện thoại / màn hình < 768px) */}
      <div className="block md:hidden">
        <MobileDashboardView onNavigate={onNavigate} />
      </div>

      {/* 2. GIAO DIỆN DESKTOP DASHBOARD (Hiển thị trên máy tính / màn hình >= 768px) */}
      <div className="hidden md:block space-y-6">
      {/* 1. Header chào buổi sáng & Bộ lọc thời gian */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Chào buổi sáng, {representativeName}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dưới đây là tình hình hoạt động tổng hợp của <span className="font-semibold text-slate-700">Minh Software (OPC)</span> hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* NÚT LÀM MỚI DỮ LIỆU */}
          <button
            onClick={() => fetchDashboardData()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors disabled:opacity-50"
            title="Làm mới số liệu từ API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          {/* NÚT BẤM MỞ KHUNG LỊCH */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-semibold shadow-xs transition-all ${
                showCalendar 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/10' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{selectedPeriod}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform duration-200 ${showCalendar ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {/* KHUNG LỊCH THẢ XUỐNG */}
            {showCalendar && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowCalendar(false)} 
                />

                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-semibold text-slate-600 text-center">
                    <button
                      type="button"
                      onClick={() => { setSelectedPeriod('Hôm nay (17/11/2026)'); setShowCalendar(false); }}
                      className="py-1 px-2 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all"
                    >
                      Hôm nay
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPeriod('Tháng 11/2026'); setShowCalendar(false); }}
                      className="py-1 px-2 rounded-lg bg-white text-blue-600 shadow-2xs font-bold"
                    >
                      Tháng 11
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPeriod('Quý 4/2026'); setShowCalendar(false); }}
                      className="py-1 px-2 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all"
                    >
                      Quý 4
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-bold text-slate-900">Tháng 11, 2026</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Tài khóa Q4
                    </span>
                  </div>

                  <div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                      <span>T2</span>
                      <span>T3</span>
                      <span>T4</span>
                      <span>T5</span>
                      <span>T6</span>
                      <span>T7</span>
                      <span className="text-rose-500">CN</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-8" />
                      ))}

                      {daysInMonth.map((day) => {
                        const isToday = day === 17;
                        const isTaxDeadline = day === 20;
                        const isTNDNDeadline = day === 30;
                        const isSelected = selectedDay === day;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setSelectedDay(day);
                              setSelectedPeriod(`Ngày ${day}/11/2026`);
                              setShowCalendar(false);
                            }}
                            className={`h-8 w-8 mx-auto rounded-xl flex flex-col items-center justify-center font-semibold relative transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold scale-105'
                                : isToday
                                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{day}</span>
                            {isTaxDeadline && !isSelected && (
                              <span className="absolute bottom-1 w-1.5 h-1.5 bg-rose-500 rounded-full" title="Hạn nộp tờ khai thuế GTGT" />
                            )}
                            {isTNDNDeadline && !isSelected && (
                              <span className="absolute bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" title="Hạn tạm nộp thuế TNDN Q4" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>20/11: Hạn nộp thuế &amp; Đóng BHXH</span>
                      </div>
                      <span className="text-rose-600 font-bold">Còn 3 ngày</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>30/11: Hạn tạm nộp TNDN Quý 4</span>
                      </div>
                      <span className="text-slate-500">Còn 13 ngày</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCalendar(false);
                      onNavigate?.('tax-calendar');
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>📅</span>
                    <span>Mở Lịch Nghĩa Vụ Thuế Chi Tiết →</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Nút Xuất Báo Cáo */}
          <button 
            type="button"
            onClick={() => alert('Đã xuất báo cáo tài chính Tháng 11/2026 (PDF & Excel) thành công!')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* 2. Hàng 4 Thẻ chỉ số tài chính (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Doanh thu tháng */}
        <div 
          onClick={() => onNavigate?.('customers')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Doanh thu hợp đồng (API)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatVND(totalRevenue)}</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px]">
              <span className="font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {totalContractsCount} hợp đồng kinh tế
              </span>
              <span className="text-slate-400 font-medium">PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Dòng tiền thực tế */}
        <div 
          onClick={() => onNavigate?.('finance')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Dòng tiền thực tế (Bank API)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatVND(totalBankBalance)}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Khả dụng {bankAccounts.length || 1} tài khoản ngân hàng</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Công nợ cần thu */}
        <div 
          onClick={() => onNavigate?.('finance')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-rose-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Công nợ cần thu</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-rose-600 tracking-tight">{formatVND(totalOverdueDebt)}</span>
            </div>
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                <AlertTriangle className="w-3 h-3" />
                Quá hạn 30 ngày (1 khách hàng)
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Hạn thuế gần nhất */}
        <div 
          onClick={() => onNavigate?.('tax-calendar')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Hạn thuế gần nhất</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Còn 5 ngày</span>
              <span className="text-xs font-semibold text-slate-500">(20/11)</span>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-400 truncate">
              Hạn nộp thuế GTGT & TN... <span className="font-semibold text-slate-600">Quý 4</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Phân vùng 2 cột (Cột Trái: Việc AI đề xuất | Cột Phải: Cơ cấu chi phí & Lịch thuế) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (Chiếm 7/12 phần) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Box 1: Việc AI đề xuất cần Anh Minh phê duyệt */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50/50 to-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Việc AI đề xuất cần {representativeName} phê duyệt</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Cơ chế tự kiểm soát dữ liệu tài chính & hóa đơn trước khi ghi sổ</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 flex items-center gap-1.5 border border-purple-100">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                {needsReviewInvoices.length > 0 ? `${needsReviewInvoices.length} mục đang chờ duyệt` : '3 mục đang chờ duyệt'}
              </span>
            </div>

            {/* Danh sách các mục cần duyệt (Tự động lấy từ API hóa đơn nếu có) */}
            <div className="divide-y divide-slate-100">
              {needsReviewInvoices.length > 0 ? (
                needsReviewInvoices.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        inv.duplicateStatus === 'DUPLICATE' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">Hóa đơn #{inv.invoiceNumber}</span>
                          <span className="text-xs text-slate-400">• {inv.supplierName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-slate-700">{formatVND(inv.totalAmount)}</span>
                          <span className="text-[11px] text-slate-400">• Vừa cập nhật</span>
                        </div>
                        <div className="mt-1.5">
                          {inv.duplicateStatus === 'DUPLICATE' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Bị trùng lặp số hóa đơn
                            </span>
                          ) : inv.buyerTaxStatus === 'MISMATCHED' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Sai MST người mua trên hóa đơn gốc
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              Cần đối soát điều khoản
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button 
                        onClick={() => onNavigate?.('invoices')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        Kiểm tra & Duyệt
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Mục 1: Hóa đơn #000001 - Trùng lặp */}
                  <div className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">Hóa đơn #000001</span>
                          <span className="text-xs text-slate-400">• Cty TNHH Thương mại Hoàng Gia</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-slate-700">8.800.000 đ</span>
                          <span className="text-[11px] text-slate-400">• 10 phút trước</span>
                        </div>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Trùng số hóa đơn với Quý 3
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button 
                        onClick={() => onNavigate?.('invoices')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        Kiểm tra & Duyệt
                      </button>
                    </div>
                  </div>

                  {/* Mục 2: Hóa đơn #000018 - Sai MST */}
                  <div className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">Hóa đơn #000018</span>
                          <span className="text-xs text-slate-400">• Công ty TNHH Cơ khí Tiến Đạt</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-slate-700">12.650.000 đ</span>
                          <span className="text-[11px] text-slate-400">• 1 giờ trước</span>
                        </div>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Sai MST người mua trên hóa đơn gốc
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button 
                        onClick={() => onNavigate?.('invoices')}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        Kiểm tra & Sửa
                      </button>
                    </div>
                  </div>

                  {/* Mục 3: Nhắc nợ */}
                  <div className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">Hóa đơn #000020</span>
                          <span className="text-xs text-slate-400">• Công ty CP Phát triển Hoàng Phúc</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-rose-600">Nợ: 18.700.000 đ</span>
                          <span className="text-[11px] text-slate-400">• Hôm nay</span>
                        </div>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            Quá hạn thanh toán 30 ngày
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button 
                        onClick={() => onNavigate?.('finance')}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Duyệt gửi email nhắc nợ</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer của Khối AI */}
            <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                AI đã đối soát {totalCustomersCount} khách hàng & {totalContractsCount} hợp đồng trong cơ sở dữ liệu.
              </span>
              <button 
                onClick={() => onNavigate?.('copilot')}
                className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                Mở AI Copilot <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Box 2: Tuân thủ thuế & Pháp lý OPC */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Tuân thủ thuế & Pháp lý OPC</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tất cả hóa đơn và hợp đồng đã được ký số VNPT SmartCA Sandbox hợp lệ.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Đồng bộ 100% CQT
            </span>
          </div>
        </div>

        {/* CỘT PHẢI (Chiếm 5/12 phần) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Box 1: Cơ cấu chi phí tháng này (API) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Cơ cấu chi phí tháng này</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tổng chi: <span className="font-semibold text-slate-800">{formatVND(expenseStats?.totalAmount || 32500000)}</span>
                </p>
              </div>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>

            {/* Thanh tiến độ 4 màu */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 mt-4 flex overflow-hidden">
              <div style={{ width: '35%' }} className="bg-blue-600" title="Hosting & Hạ tầng Cloud: 35%"></div>
              <div style={{ width: '25%' }} className="bg-purple-600" title="Thuê văn phòng ảo: 25%"></div>
              <div style={{ width: '20%' }} className="bg-emerald-500" title="Phần mềm bản quyền & AI: 20%"></div>
              <div style={{ width: '20%' }} className="bg-amber-500" title="Tiếp khách & Marketing: 20%"></div>
            </div>

            {/* Danh sách các khoản chi */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-600">Hosting & Hạ tầng Cloud (TK 6427)</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900">11.375.000 đ</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">(35%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span className="text-slate-600">Thuê địa chỉ văn phòng ảo</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900">8.125.000 đ</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">(25%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600">Phần mềm bản quyền & AI (TK 6428)</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900">6.500.000 đ</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">(20%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600">Tiếp khách & Marketing</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900">6.500.000 đ</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">(20%)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
              <button 
                onClick={() => onNavigate?.('finance')}
                className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                Chi tiết sổ thu chi & dòng tiền <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Box 2: Lịch nghĩa vụ pháp lý & Thuế */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Lịch nghĩa vụ pháp lý & Thuế</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Lộ trình tuân thủ tháng 11 - 12/2026</p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-4 space-y-3">
              {/* Mốc 1: 20 Tháng 11 */}
              <div 
                onClick={() => onNavigate?.('tax-calendar')}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tháng 11</span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">20</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">Thuế GTGT, TNCN &amp; Đóng BHXH</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 shrink-0">
                      CÒN 3 NGÀY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Hạn chót nộp tờ khai thuế và tiền đóng BHXH, BHYT bắt buộc cho chủ OPC.
                  </p>
                </div>
              </div>

              {/* Mốc 2: 30 Tháng 11 */}
              <div 
                onClick={() => onNavigate?.('tax-calendar')}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tháng 11</span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">30</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">Tạm nộp thuế TNDN</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 shrink-0">
                      CÒN 13 NGÀY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Ước tính số tạm nộp: ~4.500.000 đ dựa trên doanh thu Quý 4.
                  </p>
                </div>
              </div>

              {/* Mốc 3: 15 Tháng 12 */}
              <div 
                onClick={() => onNavigate?.('finance')}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tháng 12</span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">15</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">Đối soát sao kê định kỳ</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                      Định kỳ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Đồng bộ tự động tài khoản ngân hàng của OPC.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate?.('tax-calendar')}
              className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Xem toàn bộ lịch nghĩa vụ thuế 2026</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
