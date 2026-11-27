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
  ChevronLeft, 
  ChevronRight,
  Printer,
  Bell,
  HeartPulse,
  Settings,
  CreditCard,
  QrCode,
  Check
} from 'lucide-react';

interface TaxCalendarViewProps {
  onNavigate?: (tab: string) => void;
}

export const TaxCalendarView: React.FC<TaxCalendarViewProps> = ({ onNavigate }) => {
  const [currentMonth] = useState('Tháng 11, 2026');
  const [selectedDay, setSelectedDay] = useState<number>(20); // Mặc định chọn ngày 20 hạn nộp thuế & bảo hiểm
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // ================= TÍNH NĂNG NHẮC ĐÓNG BẢO HIỂM (BHXH - BHYT - BHTN) =================
  // Ngày hiện tại của hệ thống (giả lập 17/11/2026 trong kịch bản đề tài OPC)
  const systemToday = 17;

  // Cấu hình nhắc đóng Bảo hiểm
  const [insuranceConfig, setInsuranceConfig] = useState({
    deadlineDay: 20, // Hạn chót đóng BHXH tháng 11 (mặc định ngày 20, có thể cấu hình)
    remindDaysBefore: 3, // Khoảng thời gian nhắc nhở: từ 3 ngày trước hạn cho đến ngày hạn
    baseSalary: 6000000, // Lương cơ sở đóng BHXH của chủ doanh nghiệp OPC / nhân viên
    employeesCount: 1, // 1 nhân sự OPC
    unitCode: 'TZ0192A', // Mã đơn vị quản lý BHXH
    agencyName: 'Bảo hiểm Xã hội TP. Hồ Chí Minh',
    bankAccount: '0071000998877 - Vietcombank CN TP.HCM',
    isPaid: false, // Trạng thái nộp: Chưa đóng / Đã đóng
    paidDate: '',
    autoRemindEnabled: true,
    notifyEmail: true,
    notifyInApp: true,
  });

  // Modal cấu hình & lịch sử bảo hiểm
  const [showInsuranceModal, setShowInsuranceModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState<string>('');

  // Tính toán số tiền bảo hiểm theo tỷ lệ pháp luật BHXH Việt Nam:
  // BHXH 25.5% (DN 17.5% + NLĐ 8%), BHYT 4.5% (DN 3% + NLĐ 1.5%), BHTN 2% (DN 1% + NLĐ 1%) = Tổng 32%
  const totalInsuranceAmount = Math.round(insuranceConfig.baseSalary * 0.32 * insuranceConfig.employeesCount);
  const employerAmount = Math.round(insuranceConfig.baseSalary * 0.215 * insuranceConfig.employeesCount);
  const employeeAmount = Math.round(insuranceConfig.baseSalary * 0.105 * insuranceConfig.employeesCount);

  // Tính khoảng cách ngày từ hôm nay đến ngày hạn
  const daysUntilInsurance = insuranceConfig.deadlineDay - systemToday; // = 3 ngày

  // Điều kiện kích hoạt nhắc nhở: chưa đóng, bật nhắc tự động, và nằm trong khoảng từ 3 ngày trước hạn cho đến ngày hạn
  const isInsuranceReminderActive = 
    !insuranceConfig.isPaid && 
    insuranceConfig.autoRemindEnabled && 
    daysUntilInsurance >= 0 && 
    daysUntilInsurance <= insuranceConfig.remindDaysBefore;

  // Lịch sử đóng BHXH các tháng trước
  const insuranceHistory = [
    {
      id: 'BH-10',
      period: 'Tháng 10/2026',
      amount: '1.920.000 đ',
      payDate: '19/10/2026 10:15',
      bankRef: 'FT2629391024',
      status: 'Cơ quan BHXH đã ghi nhận',
      agency: 'BHXH TP.HCM'
    },
    {
      id: 'BH-09',
      period: 'Tháng 09/2026',
      amount: '1.920.000 đ',
      payDate: '20/09/2026 09:30',
      bankRef: 'FT2626490192',
      status: 'Cơ quan BHXH đã ghi nhận',
      agency: 'BHXH TP.HCM'
    },
    {
      id: 'BH-08',
      period: 'Tháng 08/2026',
      amount: '1.920.000 đ',
      payDate: '18/08/2026 14:05',
      bankRef: 'FT2623110293',
      status: 'Cơ quan BHXH đã ghi nhận',
      agency: 'BHXH TP.HCM'
    }
  ];

  // Xử lý nộp tiền bảo hiểm
  const handleMarkAsPaid = () => {
    setInsuranceConfig(prev => ({
      ...prev,
      isPaid: true,
      paidDate: '17/11/2026 10:30'
    }));
    setShowPaymentModal(false);
    setPaymentSuccessNotice('Đã xác nhận nộp thành công 1.920.000 đ tiền BHXH Tháng 11/2026!');
    setTimeout(() => setPaymentSuccessNotice(''), 6000);
  };

  // Danh sách lịch sử nộp tờ khai eTax mẫu chuẩn
  const filingHistory = [
    {
      id: 'TK-01',
      formName: 'Tờ khai thuế GTGT (Mẫu 01/GTGT)',
      period: 'Kỳ Quý 3/2026',
      submitDate: '20/10/2026 09:15:32',
      txnCode: '20261020091524881',
      payableAmount: '2.800.000 đ',
      status: 'CQT đã chấp nhận',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'TK-02',
      formName: 'Tạm nộp thuế TNDN Quý 3/2026',
      period: 'Kỳ Quý 3/2026',
      submitDate: '30/10/2026 14:20:11',
      txnCode: '20261030142011204',
      payableAmount: '4.500.000 đ',
      status: 'Đã hoàn tất nộp tiền',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      id: 'TK-03',
      formName: 'Tờ khai thuế GTGT (Mẫu 01/GTGT)',
      period: 'Kỳ Quý 2/2026',
      submitDate: '20/07/2026 10:05:40',
      txnCode: '20260720100540192',
      payableAmount: '3.100.000 đ',
      status: 'CQT đã chấp nhận',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'TK-04',
      formName: 'Báo cáo tình hình sử dụng hóa đơn (BC26/AC)',
      period: 'Kỳ Quý 2/2026',
      submitDate: '20/07/2026 10:12:15',
      txnCode: '20260720101215550',
      payableAmount: '0 đ',
      status: 'CQT đã chấp nhận',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
  ];

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
    { day: 17, isCurrentMonth: true, isToday: true }, // Ngày 17: Hôm nay
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true, isUrgent: true, hasInsurance: true }, // Ngày 20: Hạn nộp thuế GTGT & Đóng BHXH
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              KỲ KÊ KHAI QUÝ 4/2026 • Chuẩn mẫu biểu eTax (TCT)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <HeartPulse className="w-3 h-3 text-amber-600" />
              Theo dõi Nghĩa vụ BHXH & BHYT
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1.5">
            Lịch Nghĩa vụ Pháp lý, Thuế &amp; Bảo hiểm
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống tự động theo dõi thời hạn pháp lý theo lịch thuế điện tử và chu kỳ đóng bảo hiểm xã hội (BHXH) Việt Nam dành cho doanh nghiệp một người (OPC).
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* NÚT MỞ CẤU HÌNH & LỊCH SỬ BẢO HIỂM (MỚI) */}
          <button 
            type="button"
            onClick={() => setShowInsuranceModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-50/80 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 shadow-xs transition-colors"
            title="Quản lý cấu hình nhắc nộp BHXH và lịch sử các kỳ"
          >
            <HeartPulse className="w-3.5 h-3.5 text-amber-600" />
            <span>Nghĩa vụ Bảo hiểm (BHXH)</span>
          </button>

          {/* NÚT MỞ MODAL LỊCH SỬ NỘP TỜ KHAI */}
          <button 
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Lịch sử nộp tờ khai</span>
          </button>

          <button 
            type="button"
            onClick={() => alert('Đang xuất file XML định dạng chuẩn nộp eTax Tổng cục Thuế!')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file tờ khai eTax</span>
          </button>
        </div>
      </div>

      {/* THÔNG BÁO XÁC NHẬN NỘP TIỀN THÀNH CÔNG NẾU CÓ */}
      {paymentSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{paymentSuccessNotice}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setPaymentSuccessNotice('')}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===================== BANNER NHẮC ĐÓNG BẢO HIỂM THÔNG MINH ===================== */}
      {isInsuranceReminderActive ? (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-sm shadow-amber-500/5 relative overflow-hidden animate-in fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    CẢNH BÁO NGHĨA VỤ PHÁP LÝ ĐẾN HẠN
                  </span>
                  <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Còn {daysUntilInsurance} ngày nữa (Hạn chót: {insuranceConfig.deadlineDay}/11/2026)
                  </span>
                  <span className="text-[10px] text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full">
                    Kích hoạt chu kỳ nhắc: Trước hạn {insuranceConfig.remindDaysBefore} ngày → Ngày hạn
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Nhắc đóng Bảo hiểm Xã hội, Y tế &amp; Thất nghiệp (BHXH - BHYT - BHTN) Tháng 11/2026
                </h2>
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  Đã bước vào khung giờ nhắc nhở trước hạn 3 ngày. Doanh nghiệp cần hoàn tất nộp tiền bảo hiểm bắt buộc số tiền <strong className="text-slate-900 font-extrabold">{totalInsuranceAmount.toLocaleString('vi-VN')} đ</strong> (cho {insuranceConfig.employeesCount} nhân sự/chủ OPC) về tài khoản <strong className="text-slate-800">{insuranceConfig.agencyName}</strong> để không bị phạt lãi chậm đóng theo quy định.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
              <button 
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Nộp tiền / Ủy nhiệm chi ngay</span>
              </button>

              <button 
                type="button"
                onClick={handleMarkAsPaid}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-amber-300 active:scale-95 text-amber-900 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã nộp</span>
              </button>

              <button 
                type="button"
                onClick={() => setShowInsuranceModal(true)}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Cài đặt thông số nhắc nhở"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : insuranceConfig.isPaid ? (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-800 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Đã hoàn tất nghĩa vụ đóng BHXH, BHYT &amp; BHTN Tháng 11/2026 ({totalInsuranceAmount.toLocaleString('vi-VN')} đ)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Xác nhận nộp lúc {insuranceConfig.paidDate || '17/11/2026 10:30'} • Mã tham chiếu kho bạc: FT2632201991 • Doanh nghiệp tuân thủ pháp luật 100%.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setInsuranceConfig(prev => ({ ...prev, isPaid: false }))}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              Hủy đánh dấu
            </button>
            <button 
              type="button"
              onClick={() => setShowInsuranceModal(true)}
              className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-emerald-700 font-bold hover:bg-emerald-50 transition-colors"
            >
              Xem lịch sử
            </button>
          </div>
        </div>
      ) : null}

      {/* 2. Phần Trên: Lịch Thuế & Thông tin Pháp lý (2 Cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cột Trái: Lịch Thuế & Bảo Hiểm Điện Tử (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Lịch Thuế &amp; Nghĩa vụ Bảo hiểm</h2>
                  <p className="text-[11px] text-slate-400">Tháng 11 Năm 2026 • Giờ Hà Nội (GMT+7)</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <ChevronLeft className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700" />
                <span>{currentMonth}</span>
                <ChevronRight className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700" />
              </div>
            </div>

            {/* Bảng Lịch (Calendar Grid) - BẤM VÀO TỪNG NGÀY ĐỂ XEM CHI TIẾT */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <div key={d} className="py-1.5 font-bold text-[11px] text-slate-400">{d}</div>
              ))}
              {calendarDays.map((d, index) => {
                const isSelected = d.isCurrentMonth && selectedDay === d.day;

                return (
                  <button 
                    key={index}
                    type="button"
                    disabled={!d.isCurrentMonth}
                    onClick={() => d.isCurrentMonth && setSelectedDay(d.day)}
                    className={`py-2 text-xs rounded-xl flex flex-col items-center justify-center relative transition-all ${
                      !d.isCurrentMonth ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 font-medium hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold ring-4 ring-blue-100 scale-110 shadow-sm'
                        : d.isUrgent
                        ? 'bg-rose-500 text-white font-bold ring-4 ring-rose-100'
                        : d.isDue
                        ? 'bg-purple-600 text-white font-bold ring-4 ring-purple-100'
                        : d.isInfo
                        ? 'border-2 border-blue-500 text-blue-600 font-bold'
                        : d.isToday
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : ''
                    }`}>
                      {d.day}
                    </span>
                    {/* Chấm tròn biểu thị nghĩa vụ */}
                    <div className="flex items-center gap-0.5 mt-1 h-1.5">
                      {d.isUrgent && !isSelected && <span className="w-1 h-1 bg-rose-500 rounded-full" title="Hạn nộp thuế GTGT & TNCN" />}
                      {d.hasInsurance && !isSelected && <span className="w-1 h-1 bg-amber-500 rounded-full" title="Hạn đóng BHXH, BHYT (Trước hạn 3 ngày)" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chú giải các loại nghĩa vụ */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Thuế GTGT, TNCN (20/11)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-amber-800">Đóng BHXH, BHYT (Trước hạn 3 ngày)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>Tạm nộp TNDN (30/11)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Hôm nay (17/11)</span>
              </div>
            </div>
          </div>

          {/* KHUNG HIỂN THỊ NGHĨA VỤ CHI TIẾT CỦA NGÀY ĐANG ĐƯỢC CHỌN TRÊN LỊCH */}
          <div className="space-y-3">
            {/* TH1: Chọn ngày 20 (CÓ CẢ THUẾ VÀ BẢO HIỂM) */}
            {selectedDay === 20 && (
              <div className="space-y-3">
                {/* 1.1 Khối Nghĩa vụ Đóng Bảo hiểm Xã hội (MỚI) */}
                <div className={`border rounded-2xl p-4 shadow-xs animate-in fade-in transition-colors ${
                  insuranceConfig.isPaid 
                    ? 'bg-emerald-50/70 border-emerald-200' 
                    : 'bg-amber-50/90 border-amber-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      insuranceConfig.isPaid ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white shadow-xs'
                    }`}>
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900">
                            Ngày 20/11/2026: Hạn đóng Bảo hiểm Xã hội, Y tế &amp; Thất nghiệp (BHXH - BHYT - BHTN)
                          </h3>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                            Mã ĐV: {insuranceConfig.unitCode}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                          insuranceConfig.isPaid 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {insuranceConfig.isPaid ? '✔ Đã hoàn thành' : `Còn ${daysUntilInsurance} ngày (Đang kích hoạt nhắc nhở)`}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-1">
                        Căn cứ theo Luật BHXH và Quyết định 595/QĐ-BHXH. Doanh nghiệp cần đóng bảo hiểm cho {insuranceConfig.employeesCount} lao động/chủ OPC với mức lương căn cứ {insuranceConfig.baseSalary.toLocaleString('vi-VN')} đ.
                      </p>

                      {/* Bảng phân bổ tỷ lệ BHXH */}
                      <div className="mt-3 bg-white/90 rounded-xl p-3 border border-amber-200/80 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">BHXH (25.5%)</span>
                            <span className="font-bold text-slate-800 text-xs">{Math.round(insuranceConfig.baseSalary * 0.255).toLocaleString('vi-VN')} đ</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">DN 17.5% + NLĐ 8%</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">BHYT (4.5%)</span>
                            <span className="font-bold text-slate-800 text-xs">{Math.round(insuranceConfig.baseSalary * 0.045).toLocaleString('vi-VN')} đ</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">DN 3% + NLĐ 1.5%</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">BHTN (2.0%)</span>
                            <span className="font-bold text-slate-800 text-xs">{Math.round(insuranceConfig.baseSalary * 0.02).toLocaleString('vi-VN')} đ</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">DN 1% + NLĐ 1%</span>
                          </div>
                          <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg">
                            <span className="text-[10px] font-bold text-amber-900 block">Tổng nộp (32%)</span>
                            <span className="font-black text-amber-900 text-xs">{totalInsuranceAmount.toLocaleString('vi-VN')} đ</span>
                            <span className="text-[9px] text-amber-700 block mt-0.5">DN: {employerAmount.toLocaleString('vi-VN')} đ | NLĐ: {employeeAmount.toLocaleString('vi-VN')} đ</span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                          <span className="text-slate-500">
                            TK nhận: <span className="font-mono font-semibold text-slate-800">{insuranceConfig.bankAccount}</span> ({insuranceConfig.agencyName})
                          </span>
                          <div className="flex items-center gap-2">
                            {!insuranceConfig.isPaid ? (
                              <>
                                <button 
                                  type="button"
                                  onClick={() => setShowPaymentModal(true)}
                                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  Tạo lệnh thanh toán
                                </button>
                                <button 
                                  type="button"
                                  onClick={handleMarkAsPaid}
                                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                                >
                                  Đánh dấu đã nộp
                                </button>
                              </>
                            ) : (
                              <span className="font-bold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã nộp ngày {insuranceConfig.paidDate || '17/11/2026'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.2 Khối Nghĩa vụ Thuế GTGT & TNCN */}
                <div className="bg-rose-50/90 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 font-black text-xs mt-0.5">
                    !
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        Ngày 20/11/2026: Hạn nộp tờ khai &amp; tiền thuế GTGT, TNCN tháng 10
                      </h3>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full shrink-0">
                        Còn 3 ngày
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Áp dụng cho kỳ khai thuế định kỳ tháng. Hệ thống tự động tạo mã nộp tiền điện tử vào Kho bạc Nhà nước.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TH2: Chọn ngày 30 */}
            {selectedDay === 30 && (
              <div className="bg-purple-50/90 border border-purple-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      Ngày 30/11/2026: Hạn tạm nộp thuế TNDN tạm tính Quý 4
                    </h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full shrink-0">
                      Còn 13 ngày
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Mức tạm nộp không được thấp hơn 80% tổng số thuế TNDN phải nộp cả năm quyết toán theo Nghị định 91/2022/NĐ-CP.
                  </p>
                </div>
              </div>
            )}

            {/* TH3: Chọn ngày 15 */}
            {selectedDay === 15 && (
              <div className="bg-blue-50/90 border border-blue-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs mt-0.5">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      Ngày 15/11/2026: Đối soát định kỳ sao kê ngân hàng &amp; công nợ đối tác
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full shrink-0">
                      Đã hoàn thành
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Đã hoàn tất đối soát 24/24 hóa đơn đầu ra và sao kê tài khoản ngân hàng Vietcombank của Minh Software.
                  </p>
                </div>
              </div>
            )}

            {/* TH4: Chọn bất kỳ ngày nào khác */}
            {selectedDay !== 20 && selectedDay !== 30 && selectedDay !== 15 && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs mt-0.5">
                  ✔
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      Ngày {selectedDay}/11/2026: Không có nghĩa vụ thuế &amp; bảo hiểm đến hạn
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full shrink-0">
                      An toàn
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Doanh nghiệp tuân thủ tốt. Dữ liệu kế toán Minh Software tiếp tục được Trợ lý AI đồng bộ tự động.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cột Phải: Thông tin Pháp lý & Tiến độ Quý 4 (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Thông tin người nộp thuế */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">THÔNG TIN PHÁP LÝ DOANH NGHIỆP</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                eTax &amp; BHXH Điện tử Kết nối
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  Công ty TNHH Một thành viên Minh Software
                </h3>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  MST: 0319002001 • Mã BHXH: {insuranceConfig.unitCode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Đại diện pháp luật</span>
                <span className="font-bold text-slate-800 text-xs">Anh Minh (Giám đốc)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Cơ quan quản lý BHXH</span>
                <span className="font-bold text-slate-800 text-xs truncate block">{insuranceConfig.agencyName}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Tiến độ hồ sơ Quý 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">Tiến độ hồ sơ Quý 4</h3>
              <span className="text-xs font-extrabold text-blue-600">85% Hoàn tất</span>
            </div>

            {/* Thanh Progress */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-500 w-[85%]"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Đầu ra</span>
                <span className="font-bold text-slate-800 text-xs text-emerald-600">14/14 HĐ</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Đầu vào</span>
                <span className="font-bold text-slate-800 text-xs text-blue-600">23/23 HĐ</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Nghi vấn</span>
                <span className="font-bold text-slate-800 text-xs text-rose-600">1 giải trình</span>
              </div>
            </div>

            {/* AI Review Banner */}
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-purple-900 leading-relaxed">
                AI đã rà soát: Chi phí lưu trữ đám mây &amp; phần mềm tăng 12% so với Quý 3, đã tối ưu toàn bộ vào thuế GTGT khấu trừ hợp lý.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bảng Nháp Tờ Khai Thuế Quý 4 (Mẫu 01/GTGT) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Bản nháp Tờ khai thuế Quý 4</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  AI tổng hợp tự động từ sổ sách
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mẫu số: 01/GTGT (Ban hành kèm theo Thông tư số 80/2021/TT-BTC của Bộ Tài chính)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => alert('Đang kích hoạt AI tính toán lại tờ khai theo hóa đơn mới nhất...')}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tính toán lại</span>
            </button>
            <button 
              type="button"
              onClick={() => alert('Công thức tính Chỉ tiêu [40] = Thuế đầu ra [32] (12.000.000 đ) - Thuế đầu vào [24] (8.500.000 đ) = 3.500.000 đ.')}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Xem công thức</span>
            </button>
          </div>
        </div>

        {/* Bảng Chỉ tiêu Thuế 01/GTGT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-16 text-center">Chỉ tiêu</th>
                <th className="py-3 px-4">Nội dung chỉ tiêu theo Mẫu 01/GTGT</th>
                <th className="py-3 px-4 text-center">Thuế suất / Ghi chú</th>
                <th className="py-3 px-4 text-right">Giá trị tính thuế (VND)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-center text-blue-600 bg-blue-50/30">[22]</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-800">Thuế GTGT còn được khấu trừ kỳ trước chuyển sang</span>
                </td>
                <td className="py-3.5 px-4 text-center text-slate-400">Kỳ Quý 3/2026</td>
                <td className="py-3.5 px-4 font-bold text-right font-mono">0 đ</td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-center text-blue-600 bg-blue-50/30">[29]</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-800">Tổng doanh thu chịu thuế GTGT bán ra</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tổng hợp từ 14 hóa đơn dịch vụ công nghệ đã phát hành</p>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium text-[10px]">Chịu thuế</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-right font-mono text-slate-900">120.000.000 đ</td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-center text-blue-600 bg-blue-50/30">[32]</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-800">Tổng thuế GTGT của hàng hóa dịch vụ bán ra</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Phát sinh trong kỳ kê khai</p>
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-blue-600">10%</td>
                <td className="py-3.5 px-4 font-bold text-right font-mono text-blue-600">12.000.000 đ</td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-center text-blue-600 bg-blue-50/30">[24]</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-800">Tổng thuế GTGT đầu vào hợp lệ được khấu trừ</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Đã đối soát từ 23 hóa đơn mua vào hợp lệ</p>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] border border-emerald-200">
                    ✔ 23 hóa đơn
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-right font-mono text-emerald-600">8.500.000 đ</td>
              </tr>

              {/* Hàng kết quả [40] nổi bật */}
              <tr className="bg-blue-50/40 border-t-2 border-blue-200">
                <td className="py-4 px-4 font-mono font-black text-center text-blue-700 text-sm bg-blue-100/50">[40]</td>
                <td className="py-4 px-4">
                  <span className="font-black text-slate-900 text-sm uppercase tracking-tight">
                    Số tiền thuế GTGT ước tính phải nộp Quý 4
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Công thức tính: Chỉ tiêu [40] = [32] - [24] - [22]</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-bold text-[10px] uppercase shadow-xs">
                    Phải nộp
                  </span>
                </td>
                <td className="py-4 px-4 font-black text-right font-mono text-blue-700 text-xl">
                  3.500.000 đ
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Ba triệu năm trăm nghìn đồng</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Khối AI Pre-tax Audit (Kiểm tra rủi ro trước khi nộp) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Kiểm tra rủi ro hóa đơn trước khi nộp (AI Pre-tax Audit)</h2>
          </div>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            ● 3/4 Tiêu chí Đạt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-slate-900">Đối soát hóa đơn đầu vào</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đã đối soát <strong>23/23 hóa đơn đầu vào</strong> có mã hợp lệ Tổng cục Thuế và chữ ký số người bán nguyên vẹn.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-slate-900">Chứng từ thanh toán không dùng tiền mặt</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toàn bộ các khoản thanh toán trên 20 triệu đều có ủy nhiệm chi ngân hàng khớp số tài khoản bên bán.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-rose-950">1 hóa đơn đang bị tạm dừng khấu trừ</p>
                <button 
                  type="button"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('invoices');
                    } else {
                      const invoicesBtn = Array.from(document.querySelectorAll('nav button')).find(
                        (btn) => btn.textContent?.includes('Chứng từ') || btn.textContent?.includes('Hóa đơn')
                      ) as HTMLButtonElement | undefined;
                      invoicesBtn?.click();
                    }
                  }}
                  className="text-[10px] font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer transition-colors"
                >
                  Xử lý ngay
                </button>
              </div>
              <p className="text-[11px] text-rose-800 mt-0.5">
                Hóa đơn #000001 đang bị tạm dừng do nghi vấn trùng số từ NCC máy chủ chưa được giải trình bổ sung.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-slate-900">Tình trạng chứng thư số ký điện tử</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chữ ký số USB Token VNPT-CA còn hạn sử dụng đến năm 2028, sẵn sàng ký duyệt trực tiếp file XML nộp lên eTax.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Footer Banner: NÚT ĐIỀU HƯỚNG SANG TRỢ LÝ COPILOT */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-800">Tự động mã hóa chuẩn XML Thuế &amp; BHXH Việt Nam</p>
            <p className="text-[11px] text-slate-500">Tương thích phần mềm HTKK, eTax thuedientu.gdt.gov.vn và cổng Dịch vụ công BHXH baohiemxahoi.gov.vn</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('copilot');
              } else {
                const copilotButton = Array.from(document.querySelectorAll('nav button')).find(
                  (btn) => btn.textContent?.includes('Copilot') || btn.textContent?.includes('Trợ lý')
                ) as HTMLButtonElement | undefined;
                copilotButton?.click();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Gửi số liệu sang Trợ lý AI Copilot phân tích thêm</span>
          </button>

          <button 
            type="button"
            onClick={() => alert('Đang mở bản xem trước PDF chuẩn Mẫu 01/GTGT theo Thông tư 80...')}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Xem bản in PDF Mẫu 01/GTGT</span>
          </button>

          <button 
            type="button"
            onClick={() => alert('Đã tạo thành công file XML tờ khai thuế Quý 4 chuẩn nộp Tổng cục Thuế!')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file XML nộp eTax</span>
          </button>
        </div>
      </div>

      {/* ===================== MODAL CẤU HÌNH & LỊCH SỬ NGHĨA VỤ BHXH ===================== */}
      {showInsuranceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <HeartPulse className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Quản lý &amp; Cài đặt Nhắc đóng Bảo hiểm (BHXH)</h3>
                  <p className="text-[11px] text-slate-500">Thiết lập tự động cảnh báo trước hạn từ 3 ngày cho Minh Software</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowInsuranceModal(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cấu hình nhắc nhở */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-amber-600" />
                <span>Cấu hình quy tắc nhắc nhở thông minh</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Ngày hạn chót đóng BHXH hàng tháng:
                  </label>
                  <select 
                    value={insuranceConfig.deadlineDay}
                    onChange={(e) => setInsuranceConfig(prev => ({ ...prev, deadlineDay: Number(e.target.value) }))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value={20}>Ngày 20 hàng tháng (Cùng kỳ thuế TNCN &amp; Lương)</option>
                    <option value={25}>Ngày 25 hàng tháng</option>
                    <option value={30}>Ngày cuối cùng của tháng (30/31 hàng tháng)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Khoảng thời gian nhắc nhở trước hạn:
                  </label>
                  <select 
                    value={insuranceConfig.remindDaysBefore}
                    onChange={(e) => setInsuranceConfig(prev => ({ ...prev, remindDaysBefore: Number(e.target.value) }))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value={3}>Nhắc trước từ 3 ngày cho đến ngày hạn (Mặc định chuẩn)</option>
                    <option value={5}>Nhắc trước từ 5 ngày cho đến ngày hạn</option>
                    <option value={7}>Nhắc trước từ 7 ngày cho đến ngày hạn</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Mức lương căn cứ đóng BHXH (VND):
                  </label>
                  <input 
                    type="number"
                    step={500000}
                    value={insuranceConfig.baseSalary}
                    onChange={(e) => setInsuranceConfig(prev => ({ ...prev, baseSalary: Number(e.target.value) }))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Lương cơ sở hiện tại: {insuranceConfig.baseSalary.toLocaleString('vi-VN')} đ</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Số lao động đóng bảo hiểm:
                  </label>
                  <input 
                    type="number"
                    min={1}
                    value={insuranceConfig.employeesCount}
                    onChange={(e) => setInsuranceConfig(prev => ({ ...prev, employeesCount: Number(e.target.value) }))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Tổng nộp hàng tháng: {totalInsuranceAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Tùy chọn thông báo */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={insuranceConfig.autoRemindEnabled}
                    onChange={(e) => setInsuranceConfig(prev => ({ ...prev, autoRemindEnabled: e.target.checked }))}
                    className="rounded text-amber-600 focus:ring-amber-500" 
                  />
                  <span className="font-medium text-slate-700">Kích hoạt banner cảnh báo tự động trên hệ thống</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={insuranceConfig.notifyEmail}
                    onChange={(e) => setInsuranceConfig(prev => ({ ...prev, notifyEmail: e.target.checked }))}
                    className="rounded text-amber-600 focus:ring-amber-500" 
                  />
                  <span className="font-medium text-slate-700">Gửi email nhắc nhở cho Giám đốc Minh</span>
                </label>
              </div>
            </div>

            {/* Bảng lịch sử nộp bảo hiểm các kỳ trước */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Lịch sử đóng BHXH các kỳ gần nhất</span>
                <span className="text-[11px] font-normal text-slate-400">Đã đối soát cổng Dịch vụ công BHXH</span>
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <th className="py-2.5 px-3">Kỳ đóng</th>
                      <th className="py-2.5 px-3">Mã GD / Ngày nộp</th>
                      <th className="py-2.5 px-3 text-right">Số tiền nộp</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {insuranceHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-800">{item.period}</span>
                          <span className="text-[10px] text-slate-400 block">{item.agency}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-slate-700 block font-semibold">{item.bankRef}</span>
                          <span className="text-[10px] text-slate-400">{item.payDate}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold font-mono text-slate-900">
                          {item.amount}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-500">Mã đơn vị: {insuranceConfig.unitCode} • Quản lý bởi BHXH TP. Hồ Chí Minh</span>
              <button
                type="button"
                onClick={() => {
                  setShowInsuranceModal(false);
                  alert('Đã lưu cấu hình nhắc nhở đóng bảo hiểm thành công!');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL THANH TOÁN BẢO HIỂM NHANH ===================== */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Lệnh chuyển khoản đóng tiền BHXH</h3>
                  <p className="text-[11px] text-slate-500">Ủy nhiệm chi ngân hàng về Kho bạc Nhà nước / BHXH TP.HCM</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowPaymentModal(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Đơn vị nộp:</span>
                <span className="font-bold text-slate-800">Công ty TNHH MTV Minh Software</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mã số thuế &amp; Mã đơn vị BHXH:</span>
                <span className="font-mono font-bold text-slate-800">0319002001 - {insuranceConfig.unitCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Đơn vị nhận:</span>
                <span className="font-semibold text-slate-800">{insuranceConfig.agencyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số tài khoản thụ hưởng:</span>
                <span className="font-mono font-bold text-blue-700">0071000998877</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ngân hàng:</span>
                <span className="font-semibold text-slate-800">Vietcombank - CN TP. Hồ Chí Minh</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Nội dung chuyển khoản (Cú pháp chuẩn BHXH):</span>
                <span className="font-mono font-bold text-amber-900 text-right">
                  NOP BHXH 11/2026 - MST 0319002001 - MADV {insuranceConfig.unitCode}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 items-baseline">
                <span className="font-bold text-slate-700">Tổng số tiền thanh toán:</span>
                <span className="text-xl font-black text-amber-600 font-mono">
                  {totalInsuranceAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800">
              <QrCode className="w-4 h-4 shrink-0 text-blue-600" />
              <span>Hệ thống tự động đồng bộ hạch toán sổ quỹ TK 3383 (Phải nộp BHXH) ngay sau khi bạn xác nhận.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleMarkAsPaid}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận đã nộp tiền</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL LỊCH SỬ NỘP TỜ KHAI ETAX ===================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">🕒</span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Lịch sử nộp tờ khai điện tử (eTax)</h3>
                  <p className="text-[11px] text-slate-500">Tra cứu các kỳ khai thuế đã gửi lên Tổng cục Thuế của Minh Software</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowHistoryModal(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Bảng danh sách tờ khai đã nộp */}
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3">Tờ khai &amp; Kỳ kê khai</th>
                    <th className="py-2.5 px-3">Mã GD / Ngày nộp</th>
                    <th className="py-2.5 px-3 text-right">Thuế phát sinh</th>
                    <th className="py-2.5 px-3 text-center">Trạng thái CQT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 block">{item.formName}</span>
                        <span className="text-[11px] text-blue-600 font-semibold">{item.period}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-slate-700 block font-medium">{item.txnCode}</span>
                        <span className="text-[10px] text-slate-400">{item.submitDate}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono text-slate-900">
                        {item.payableAmount}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-500">Dữ liệu đồng bộ trực tiếp từ cổng thuedientu.gdt.gov.vn</span>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};