// src/components/dashboard/MobileDashboardView.tsx
import React, { useRef, useState } from 'react';
import {
  TrendingUp,
  Landmark,
  Camera,
  FileText,
  CheckCircle2,
  Phone,
  ChevronRight,
  Zap,
  Mail,
  ShieldCheck,
  RefreshCw,
  Hourglass,
} from 'lucide-react';
import { uploadPurchaseInvoice } from '../../services/invoiceService';
import './MobileDashboardView.css';

interface MobileDashboardViewProps {
  onNavigate?: (tab: string) => void;
}

export const MobileDashboardView: React.FC<MobileDashboardViewProps> = ({ onNavigate }) => {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadPurchaseInvoice(file);
      if (res.success) {
        setUploadNotice(`Đã tải lên và bóc tách AI thành công: ${file.name}`);
        setTimeout(() => setUploadNotice(''), 5000);
        onNavigate?.('invoices');
      } else {
        alert(res.message || 'Lỗi tải hóa đơn');
      }
    } catch {
      alert('Lỗi kết nối khi gửi ảnh hóa đơn lên server!');
    } finally {
      setIsUploading(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.xml"
        className="hidden"
        onChange={handleFileUpload}
      />

      {uploadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            SOLO-ENTERPRISE HUB
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Xin chào, Minh Software
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('copilot')}
          className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs hover:bg-blue-100 transition-colors"
          title="Kích hoạt AI Assistant"
        >
          <Zap className="w-4 h-4 fill-blue-600" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            EXECUTIVE METRICS
          </span>
          <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5">
            Trượt để xem →
          </span>
        </div>

        <div className="mobile-dashboard-scroll flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          <div
            onClick={() => onNavigate?.('customers')}
            className="min-w-[210px] flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm snap-start cursor-pointer hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">DOANH THU THÁNG</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                +12%
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900 leading-none">$3,500</span>
              <p className="text-[11px] text-slate-500 font-medium mt-1">~85,000,000 đ</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center gap-1 text-[10px] text-slate-400">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>vs tháng trước ($3,120)</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate?.('finance')}
            className="min-w-[210px] flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm snap-start cursor-pointer hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">SỐ DƯ KHẢ DỤNG</span>
              <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <Landmark className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900 leading-none">$5,800</span>
              <p className="text-[11px] text-slate-500 font-medium mt-1">~141,800,000 đ</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-50">
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Healthy Runway (5.2m)
              </span>
            </div>
          </div>

          <div
            onClick={() => onNavigate?.('finance')}
            className="min-w-[210px] flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm snap-start cursor-pointer hover:border-rose-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CÔNG NỢ CẦN THU</span>
              <div className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                <Hourglass className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-rose-600 leading-none">18.000.000 đ</span>
              <p className="text-[11px] text-slate-500 font-medium mt-1">1 đối tác trễ hạn</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-50">
              <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                Quá hạn 30 ngày (ABC Corp)
              </span>
            </div>
          </div>

          <div
            onClick={() => onNavigate?.('tax-calendar')}
            className="min-w-[210px] flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm snap-start cursor-pointer hover:border-amber-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">HẠN THUẾ &amp; BHXH</span>
              <div className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-slate-900 leading-none">Còn 3 ngày</span>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Hạn nộp: 20/11/2026</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-50">
              <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                Đã kích hoạt nhắc nhở
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-slate-900">Nhận diện hóa đơn tức thì</h2>
          </div>
          <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
            OCR v4.2
          </span>
        </div>

        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          <span>{isUploading ? 'Đang bóc tách AI...' : 'Chụp hóa đơn từ Camera'}</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Hoặc tải lên tập tin PDF / XML e-Invoice</span>
        </button>

        <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Tự động trích xuất mã số thuế • Hỗ trợ VN-Invoice XML</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900">Cần phê duyệt (HITL)</h2>
            <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
              2 Chờ duyệt
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('invoices')}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
          >
            Lịch sử duyệt
          </button>
        </div>

        <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Hóa đơn #HD01 - Trùng...</h3>
              </div>
            </div>
            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
              99.4% Hash Match
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Nhà cung cấp <strong className="text-slate-800">CloudCorp ($650)</strong> khớp nội dung băm với chứng từ <span className="font-mono font-semibold text-slate-700">#INV-2024-08</span> đã thanh toán.
          </p>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Đã ký số Sandbox VNPT-CA
            </span>
            <span className="text-slate-400">• Giai đoạn 1: Bàn giao PO</span>
          </div>

          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-blue-600 rounded-full"></div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <a
              href="tel:0909123456"
              className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1"
            >
              <Phone className="w-2.5 h-2.5" />
              <span>Gọi</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate?.('invoices')}
              className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-semibold"
            >
              Chi tiết
            </button>
            <button
              type="button"
              onClick={() => alert('Đã bỏ qua cảnh báo này.')}
              className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[10px] font-semibold"
            >
              Bỏ qua
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('invoices')}
              className="py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs truncate"
            >
              Kiểm tra
            </button>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 truncate max-w-[160px]">
                  ABC Corp - Thu nợ quá hạn...
                </h3>
              </div>
            </div>
            <span className="text-[9px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded">
              URGENT
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Khoản thanh toán mốc Milestone 2 <strong className="text-rose-600">$750 USD</strong> chưa tất toán. Agent nhắc nợ tự động đã soạn email lịch sự.
          </p>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Đã ký số Sandbox VNPT-CA
            </span>
            <span className="text-slate-400">• Tiến độ: Giai đoạn 2 (60%)</span>
          </div>

          <div className="p-2 bg-blue-50/60 border border-blue-200/60 rounded-lg text-[10px] text-blue-900">
            <span>Bản thảo: &quot;Kính gửi Kế toán ABC... Tối ưu 10:00 sáng&quot;</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <a
              href="tel:0918002001"
              className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1"
            >
              <Phone className="w-2.5 h-2.5" />
              <span>Gọi</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate?.('finance')}
              className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-semibold"
            >
              Chi tiết
            </button>
            <button
              type="button"
              onClick={() => alert('Đã hoãn lịch nhắc nợ thêm 3 ngày.')}
              className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[10px] font-semibold"
            >
              Hoãn 3d
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('finance')}
              className="py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center justify-center gap-1"
            >
              <span>Xem &amp; Gửi</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900">Khách hàng &amp; Hợp đồng</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            5 Đang thực hiện • 24 Đối tác
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">HĐ mới nhất</span>
            <span className="text-xs font-black text-blue-700">30.000.000 đ</span>
          </div>
          <h3 className="text-xs font-bold text-slate-800">Cty CP Giải pháp CN ABC</h3>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Đã ký số Sandbox VNPT-CA
            </span>
            <span className="text-slate-400">• Tiến độ: Giai đoạn 1 (60%)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-center">
            <div className="p-2 bg-white rounded-lg border border-slate-100">
              <span className="text-base font-extrabold text-blue-600 block">5</span>
              <span className="text-[10px] text-slate-400">Hợp đồng hoạt động</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-100">
              <span className="text-base font-extrabold text-emerald-600 block">18</span>
              <span className="text-[10px] text-slate-400">Đã tất toán</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="tel:0908889999"
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>Gọi nhanh</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate?.('customers')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Xem chi tiết &amp; tất cả HĐ</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Tác vụ AI chạy ngầm</span>
          </h2>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ● 3 Đang chạy
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mx-auto block mb-1"></span>
            <span className="font-bold text-slate-800 text-[11px] block">Đối soát VCB</span>
            <span className="text-[10px] text-emerald-600 font-semibold">100% khớp</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-rose-500 mx-auto block mb-1"></span>
            <span className="font-bold text-slate-800 text-[11px] block">Dunning Tracker</span>
            <span className="text-[10px] text-rose-600 font-semibold">1 Cần HITL</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 mx-auto block mb-1"></span>
            <span className="font-bold text-slate-800 text-[11px] block">Giám sát Thuế</span>
            <span className="text-[10px] text-blue-600 font-semibold">TT88 OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
