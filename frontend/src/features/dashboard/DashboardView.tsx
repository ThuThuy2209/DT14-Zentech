import React from 'react';
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
  ChevronDown
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header chào buổi sáng & Bộ lọc thời gian */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Chào buổi sáng, Anh Minh! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dưới đây là tình hình hoạt động của <span className="font-semibold text-slate-700">Minh Software</span> hôm nay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Tháng này (Tháng 11/2026)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* 2. Hàng 4 Thẻ chỉ số tài chính (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Doanh thu tháng */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Doanh thu tháng này</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">85.000.000</span>
              <span className="text-sm font-bold text-slate-600">đ</span>
            </div>
            <div className="mt-2.5">
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                ↑ +12% so với tháng trước
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Dòng tiền thực tế */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Dòng tiền thực tế</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">142.000.000</span>
              <span className="text-sm font-bold text-slate-600">đ</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Khả dụng tại ngân hàng</span>
              <span className="text-slate-400 font-medium">(Runway ~ 4.4 tháng)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Công nợ cần thu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-rose-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Công nợ cần thu</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-rose-600 tracking-tight">18.000.000</span>
              <span className="text-sm font-bold text-rose-600">đ</span>
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
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
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
                  <h2 className="text-sm font-bold text-slate-900">Việc AI đề xuất cần Anh Minh phê duyệt</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Cơ chế tự kiểm soát dữ liệu tài chính & hóa đơn trước khi lưu ký</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 flex items-center gap-1.5 border border-purple-100">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                3 mục đang chờ duyệt
              </span>
            </div>

            {/* Danh sách 3 mục cần duyệt */}
            <div className="divide-y divide-slate-100">
              {/* Mục 1: Hóa đơn #000001 - Trùng lặp */}
              <div className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Hóa đơn #000001</span>
                      <span className="text-xs text-slate-400">• Cty TNHH TM Hoàng Gia</span>
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
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                    Bỏ qua
                  </button>
                  <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all">
                    Kiểm tra & Duyệt
                  </button>
                </div>
              </div>

              {/* Mục 2: Hóa đơn #000025 - Sai MST */}
              <div className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Hóa đơn #000025</span>
                      <span className="text-xs text-slate-400">• Công ty Thành Đạt</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-slate-700">15.400.000 đ</span>
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
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                    Bỏ qua
                  </button>
                  <button className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all">
                    Kiểm tra & Sửa
                  </button>
                </div>
              </div>

              {/* Mục 3: Nhắc nợ Công ty CP ABC */}
              <div className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Công ty CP ABC</span>
                      <span className="text-xs text-slate-400">• Hợp đồng Dev Ops #HD-109</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-rose-600">Nợ: 18.000.000 đ</span>
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
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                    Xem chi tiết nợ
                  </button>
                  <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Duyệt gửi email nhắc nợ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer của Khối AI */}
            <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                AI đã quét 42 chứng từ trong tuần, phát hiện 3 vấn đề cần sự can thiệp của Anh Minh.
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] flex items-center gap-1">
                Xem nhật ký quét AI <ArrowRight className="w-3 h-3" />
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
                  Tất cả 12 hóa đơn đầu ra Quý 4 đã được ký số và gửi tự động lên Tổng cục Thuế.
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
          {/* Box 1: Cơ cấu chi phí tháng này */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Cơ cấu chi phí tháng này</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tổng chi: <span className="font-semibold text-slate-800">32.500.000 đ</span>
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

            {/* Danh sách 4 khoản chi */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-600">Hosting & Hạ tầng Cloud</span>
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
                  <span className="text-slate-600">Phần mềm bản quyền & AI</span>
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
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1">
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
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tháng 11</span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">20</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">Thuế GTGT...</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 shrink-0">
                      CÒN 5 NGÀY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Hạn chót nộp tờ khai và nộp tiền vào Kho bạc Nhà nước.
                  </p>
                </div>
              </div>

              {/* Mốc 2: 30 Tháng 11 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tháng 11</span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">30</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">Tạm nộp th...</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 shrink-0">
                      CÒN 15 NGÀY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Ước tính số tạm nộp: ~4.200.000 đ dựa trên doanh...
                  </p>
                </div>
              </div>

              {/* Mốc 3: 15 Tháng 12 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Tháng 12</span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">15</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">Đối soát sao kê n...</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                      Định kỳ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Đồng bộ tự động tài khoản VCB & Techcombank của OPC.
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Đồng bộ vào Google Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};