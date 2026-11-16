import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Download, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Calculator, 
  FileText, 
  Send, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Printer
} from 'lucide-react';

export const TaxCalendarView: React.FC = () => {
  const [currentMonth] = useState('Tháng 11, 2026');

  // Lịch tháng 11/2026 (Ngày 1 rơi vào Chủ Nhật)
  const calendarDays = [
    { day: 26, isCurrentMonth: false },
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true, isInfo: true }, // Ngày 15: Đối soát định kỳ
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true, isUrgent: true }, // Ngày 20: Hạn nộp thuế GTGT
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true, isDue: true }, // Ngày 30: Tạm nộp TNDN
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Trang */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            KỲ KÊ KHAI QUÝ 4/2026 • Chuẩn mẫu biểu eTax (TCT)
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1.5">
            Lịch Nghĩa vụ Pháp lý & Tờ khai Thuế
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống tự động theo dõi thời hạn pháp lý theo lịch thuế điện tử Việt Nam dành cho doanh nghiệp một người (OPC).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Lịch sử nộp tờ khai</span>
          </button>
          <button 
            onClick={() => alert('Đang xuất file XML định dạng chuẩn nộp eTax Tổng cục Thuế!')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file tờ khai PDF / XML cho eTax</span>
          </button>
        </div>
      </div>

      {/* 2. Phần Trên: Lịch Thuế & Thông tin Pháp lý (2 Cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái: Lịch Thuế Điện Tử (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Lịch Thuế Điện Tử</h2>
                  <p className="text-[11px] text-slate-400">Tháng 11 Năm 2026 • Giờ Hà Nội (GMT+7)</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <ChevronLeft className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700" />
                <span>{currentMonth}</span>
                <ChevronRight className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700" />
              </div>
            </div>

            {/* Bảng Lịch (Calendar Grid) */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <div key={d} className="py-1.5 font-bold text-[11px] text-slate-400">{d}</div>
              ))}
              {calendarDays.map((d, index) => (
                <div 
                  key={index} 
                  className={`py-2 text-xs rounded-xl flex flex-col items-center justify-center relative transition-colors ${
                    !d.isCurrentMonth ? 'text-slate-300' : 'text-slate-700 font-medium'
                  }`}
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full ${
                    d.isUrgent ? 'bg-rose-500 text-white font-bold ring-4 ring-rose-100' :
                    d.isDue ? 'bg-purple-600 text-white font-bold ring-4 ring-purple-100' :
                    d.isInfo ? 'border-2 border-blue-500 text-blue-600 font-bold' : ''
                  }`}>
                    {d.day}
                  </span>
                  {d.isUrgent && <span className="w-1 h-1 bg-rose-500 rounded-full mt-0.5"></span>}
                </div>
              ))}
            </div>
          </div>

          {/* 2 Banner Cảnh báo hạn nộp */}
          <div className="space-y-3">
            {/* Banner 1: Hạn 20/11 */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 font-black text-xs mt-0.5">
                !
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900">
                    Ngày 20/11/2026: Hạn nộp tờ khai &amp; tiền thuế GTGT, TNCN tháng 10
                  </h3>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full shrink-0">
                    Còn 5 ngày
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Áp dụng cho kỳ khai thuế định kỳ tháng. Hệ thống tự động tạo mã nộp tiền điện tử.
                </p>
              </div>
            </div>

            {/* Banner 2: Hạn 30/11 */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900">
                    Ngày 30/11/2026: Hạn tạm nộp thuế TNDN tạm tính Quý 4
                  </h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full shrink-0">
                    Còn 15 ngày
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Mức tạm nộp không được thấp hơn 80% tổng số thuế TNDN phải nộp cả năm quyết toán.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Thông tin Pháp lý & Tiến độ Quý 4 (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Thông tin người nộp thuế */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">THÔNG TIN PHÁP LÝ NGƯỜI NỘP THUẾ</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                eTax Đã kết nối
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-snug">Công ty TNHH Một thành viên Minh Software</p>
                <p className="text-[11px] text-slate-500 mt-0.5">MST: <span className="font-semibold text-slate-800">0319002001</span> • Cục Thuế TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] font-semibold text-slate-400">Đại diện pháp luật</span>
                <p className="font-bold text-slate-800 mt-0.5">Anh Minh (Giám đốc)</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400">Chữ ký số (USB Token / CA)</span>
                <p className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hạn dùng 2028
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Tiến độ hồ sơ Quý 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Tiến độ hồ sơ Quý 4</h2>
              <span className="text-xs font-bold text-blue-600">85% Hoàn tất</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="inline-flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Đầu ra: <strong>24/24 HĐ</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Đầu vào: <strong>23/23 HĐ</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                1 giải trình
              </span>
            </div>

            {/* AI Insight Box */}
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-[11px] text-purple-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                AI đã rà soát: Chi phí lưu trữ đám mây &amp; phần mềm tăng 12% so với Quý 3, đã tối ưu toàn bộ vào thuế GTGT khấu trừ hợp lý.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Phần Dưới: Bản nháp Tờ khai Thuế Quý 4 (Mẫu 01/GTGT) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Tờ khai */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Bản nháp Tờ khai thuế Quý 4</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI tổng hợp tự động từ sổ sách
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mẫu số: 01/GTGT (Ban hành kèm theo Thông tư số 80/2021/TT-BTC của Bộ Tài chính)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Tính toán lại</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>Xem công thức</span>
            </button>
          </div>
        </div>

        {/* Bảng Chỉ tiêu Tờ khai Thuế 01/GTGT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5 text-center w-20">CHỈ TIÊU</th>
                <th className="py-3 px-5">NỘI DUNG CHỈ TIÊU THEO MẪU 01/GTGT</th>
                <th className="py-3 px-5 text-center">THUẾ SUẤT / GHI CHÚ</th>
                <th className="py-3 px-5 text-right">GIÁ TRỊ TÍNH THUẾ (VNĐ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {/* Chỉ tiêu [22] */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-5 text-center font-mono font-bold text-slate-800">[22]</td>
                <td className="py-3 px-5">
                  <p className="font-semibold text-slate-800">Thuế GTGT còn được khấu trừ kỳ trước chuyển sang</p>
                </td>
                <td className="py-3 px-5 text-center text-slate-400 text-[11px]">Kỳ Quý 3/2026</td>
                <td className="py-3 px-5 text-right font-semibold text-slate-900">0 đ</td>
              </tr>

              {/* Chỉ tiêu [29] */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-5 text-center font-mono font-bold text-slate-800">[29]</td>
                <td className="py-3 px-5">
                  <p className="font-semibold text-slate-800">Tổng doanh thu chịu thuế GTGT bán ra</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tổng hợp từ 24 hóa đơn dịch vụ công nghệ đã phát hành</p>
                </td>
                <td className="py-3 px-5 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">Chịu thuế</span>
                </td>
                <td className="py-3 px-5 text-right font-semibold text-slate-900">120.000.000 đ</td>
              </tr>

              {/* Chỉ tiêu [32] */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-5 text-center font-mono font-bold text-slate-800">[32]</td>
                <td className="py-3 px-5">
                  <p className="font-semibold text-slate-800">Tổng thuế GTGT của hàng hóa dịch vụ bán ra</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Phát sinh trong kỳ kê khai</p>
                </td>
                <td className="py-3 px-5 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">10%</span>
                </td>
                <td className="py-3 px-5 text-right font-semibold text-slate-900">12.000.000 đ</td>
              </tr>

              {/* Chỉ tiêu [24] */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-5 text-center font-mono font-bold text-slate-800">[24]</td>
                <td className="py-3 px-5">
                  <p className="font-semibold text-slate-800">Tổng thuế GTGT đầu vào hợp lệ được khấu trừ</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Đã đối soát từ 23 hóa đơn mua vào hợp lệ</p>
                </td>
                <td className="py-3 px-5 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    23 hóa đơn
                  </span>
                </td>
                <td className="py-3 px-5 text-right font-semibold text-slate-900">8.500.000 đ</td>
              </tr>

              {/* Chỉ tiêu [40] - Kết quả cuối cùng */}
              <tr className="bg-blue-50/40 border-t-2 border-blue-200">
                <td className="py-4 px-5 text-center font-mono font-black text-blue-700 text-sm">[40]</td>
                <td className="py-4 px-5">
                  <p className="font-bold text-slate-900 text-sm">SỐ TIỀN THUẾ GTGT ƯỚC TÍNH PHẢI NỘP QUÝ 4</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Công thức: Chỉ tiêu [40] = [32] - [24] - [22]</p>
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                    PHẢI NỘP
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <span className="font-black text-xl text-blue-700">3.500.000 đ</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Ba triệu năm trăm nghìn đồng</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Khối AI Pre-tax Audit (Kiểm tra rủi ro trước khi nộp theo Luật Thuế 38/2019/QH14) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Kiểm tra rủi ro hóa đơn trước khi nộp (AI Pre-tax Audit)</h2>
              <p className="text-[11px] text-slate-400">Tự động đối chiếu quy định Luật Quản lý Thuế số 38/2019/QH14</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            3/4 Tiêu chí Đạt
          </span>
        </div>

        {/* 4 Hộp tiêu chuẩn (Lưới 2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* Tiêu chí 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Đối soát hóa đơn đầu vào</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đã đối soát <strong>23/23 hóa đơn đầu vào</strong> có mã hợp lệ Tổng cục Thuế và chữ ký số người bán nguyên vẹn.
              </p>
            </div>
          </div>

          {/* Tiêu chí 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Chứng từ thanh toán không dùng tiền mặt</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toàn bộ các khoản thanh toán trên 20 triệu đều có ủy nhiệm chi ngân hàng hợp lệ khớp số tài khoản bên bán.
              </p>
            </div>
          </div>

          {/* Tiêu chí 3: Cảnh báo hóa đơn trùng lặp */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-700">1 hóa đơn đang bị tạm dừng khấu trừ</p>
                <p className="text-[11px] text-rose-600 mt-0.5">
                  Hóa đơn <strong>#000001</strong> đang bị tạm dừng do nghi vấn trùng số từ NCC máy chủ chưa được giải trình bổ sung.
                </p>
              </div>
            </div>
            <button className="px-2 py-1 bg-white border border-rose-300 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-50 shrink-0 shadow-2xs">
              Xử lý ngay
            </button>
          </div>

          {/* Tiêu chí 4 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Tình trạng chứng thư số ký điện tử</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chữ ký số USB Token VNPT-CA còn hạn sử dụng đến năm 2028, sẵn sàng ký duyệt trực tiếp file XML nộp lên eTax.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Footer Banner Xuất file XML nộp eTax */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-800">Tự động mã hóa chuẩn XML Thuế Việt Nam</p>
            <p className="text-[11px] text-slate-500">Tương thích phần mềm HTKK và cổng Thuế điện tử thuedientu.gdt.gov.vn</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Gửi số liệu sang Trợ lý AI Copilot phân tích thêm</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors">
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Xem bản in PDF chuẩn Mẫu 01/GTGT</span>
          </button>
          <button 
            onClick={() => alert('Đã tạo thành công file XML tờ khai thuế Quý 4 chuẩn nộp Tổng cục Thuế!')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất file XML nộp eTax</span>
          </button>
        </div>
      </div>
    </div>
  );
};