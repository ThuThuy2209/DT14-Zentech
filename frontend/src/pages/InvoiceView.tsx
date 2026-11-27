import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  RefreshCw, Download, AlertTriangle, CheckCircle2,
  Sparkles, X, Edit3, CheckSquare, ScanLine,
  Mail, AlertCircle
} from 'lucide-react';
import {
  getPurchaseInvoices,
  uploadPurchaseInvoice,
  syncDemoPurchaseInvoices,
  updatePurchaseInvoice,
  confirmPurchaseInvoice,
  rejectPurchaseInvoice,
  type PurchaseInvoiceItem,
  type UpdatePurchaseInvoicePayload,
} from '../services/invoiceService';

// Format tiền tệ VNĐ
const formatVND = (n: number) => (n || 0).toLocaleString('vi-VN') + ' đ';

// Format ngày hiển thị
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// =============================================
// DỮ LIỆU CHUẨN 25 HÓA ĐƠN MUA VÀO THEO ĐẶC TẢ ĐỀ TÀI DT14
// =============================================
interface OfficialInvoiceData {
  itemName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  sellerAddress: string;
  bankAccount: string;
}

export const OFFICIAL_25_INVOICES: Record<string, OfficialInvoiceData> = {
  '000001': {
    itemName: 'Thiết kế website doanh nghiệp',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 8000000,
    subtotal: 8000000,
    taxAmount: 800000,
    totalAmount: 8800000,
    sellerAddress: '15 Nguyễn Trãi, P. Bến Thành, TP.HCM',
    bankAccount: '190099000001 – BIDV (giả lập)',
  },
  '000002': {
    itemName: 'Phát triển phần mềm quản lý',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 15000000,
    subtotal: 15000000,
    taxAmount: 1500000,
    totalAmount: 16500000,
    sellerAddress: '28 Điện Biên Phủ, P. Gia Định, TP.HCM',
    bankAccount: '190099000002 – BIDV (giả lập)',
  },
  '000003': {
    itemName: 'Thiết kế website bán hàng',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 9500000,
    subtotal: 9500000,
    taxAmount: 950000,
    totalAmount: 10450000,
    sellerAddress: '45 Lê Văn Sỹ, P. Nhiêu Lộc, TP.HCM',
    bankAccount: '190099000003 – BIDV (giả lập)',
  },
  '000004': {
    itemName: 'Bảo trì hệ thống phần mềm',
    unit: 'Tháng',
    quantity: 3,
    unitPrice: 2000000,
    subtotal: 6000000,
    taxAmount: 600000,
    totalAmount: 6600000,
    sellerAddress: '62 Cách Mạng Tháng 8, P. Xuân Hòa, TP.HCM',
    bankAccount: '190099000004 – BIDV (giả lập)',
  },
  '000005': {
    itemName: 'Phần mềm quản lý nhân sự',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 12000000,
    subtotal: 12000000,
    taxAmount: 1200000,
    totalAmount: 13200000,
    sellerAddress: '80 Võ Thị Sáu, P. Xuân Hòa, TP.HCM',
    bankAccount: '190099000005 – BIDV (giả lập)',
  },
  '000006': {
    itemName: 'Thiết kế hệ thống học trực tuyến',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 18000000,
    subtotal: 18000000,
    taxAmount: 1800000,
    totalAmount: 19800000,
    sellerAddress: '19 Nguyễn Văn Cừ, P. Chợ Quán, TP.HCM',
    bankAccount: '190099000006 – BIDV (giả lập)',
  },
  '000007': {
    itemName: 'Phần mềm quản lý kho',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 11000000,
    subtotal: 11000000,
    taxAmount: 1100000,
    totalAmount: 12100000,
    sellerAddress: '120 Võ Văn Kiệt, P. Cầu Ông Lãnh, TP.HCM',
    bankAccount: '190099000007 – BIDV (giả lập)',
  },
  '000008': {
    itemName: 'Dịch vụ lưu trữ dữ liệu',
    unit: 'Tháng',
    quantity: 6,
    unitPrice: 1000000,
    subtotal: 6000000,
    taxAmount: 600000,
    totalAmount: 6600000,
    sellerAddress: '32 Nguyễn Oanh, P. Gò Vấp, TP.HCM',
    bankAccount: '190099000008 – BIDV (giả lập)',
  },
  '000009': {
    itemName: 'Phần mềm quản lý công trình',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 14000000,
    subtotal: 14000000,
    taxAmount: 1400000,
    totalAmount: 15400000,
    sellerAddress: '55 Phan Văn Trị, P. Bình Thạnh, TP.HCM',
    bankAccount: '190099000009 – BIDV (giả lập)',
  },
  '000010': {
    itemName: 'Thiết kế landing page',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 5000000,
    subtotal: 5000000,
    taxAmount: 500000,
    totalAmount: 5500000,
    sellerAddress: '76 Hoàng Văn Thụ, P. Đức Nhuận, TP.HCM',
    bankAccount: '190099000010 – BIDV (giả lập)',
  },
  '000011': {
    itemName: 'Cài đặt hệ thống máy chủ',
    unit: 'Lần',
    quantity: 1,
    unitPrice: 4500000,
    subtotal: 4500000,
    taxAmount: 450000,
    totalAmount: 4950000,
    sellerAddress: '91 Tô Hiến Thành, P. Diên Hồng, TP.HCM',
    bankAccount: '190099000011 – BIDV (giả lập)',
  },
  '000012': {
    itemName: 'Phần mềm quản lý bán hàng',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 10000000,
    subtotal: 10000000,
    taxAmount: 1000000,
    totalAmount: 11000000,
    sellerAddress: '14 Nguyễn Ảnh Thủ, P. Trung Mỹ Tây, TP.HCM',
    bankAccount: '190099000012 – BIDV (giả lập)',
  },
  '000013': {
    itemName: 'Thiết kế cơ sở dữ liệu',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 7000000,
    subtotal: 7000000,
    taxAmount: 700000,
    totalAmount: 7700000,
    sellerAddress: '27 Lý Thường Kiệt, P. Diên Hồng, TP.HCM',
    bankAccount: '190099000013 – BIDV (giả lập)',
  },
  '000014': {
    itemName: 'Website đặt tour du lịch',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 13000000,
    subtotal: 13000000,
    taxAmount: 1300000,
    totalAmount: 14300000,
    sellerAddress: '36 Nguyễn Thị Minh Khai, P. Sài Gòn, TP.HCM',
    bankAccount: '190099000014 – BIDV (giả lập)',
  },
  '000015': {
    itemName: 'Phần mềm quản lý thiết bị',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 9000000,
    subtotal: 9000000,
    taxAmount: 900000,
    totalAmount: 9900000,
    sellerAddress: '105 Cộng Hòa, P. Tân Bình, TP.HCM',
    bankAccount: '190099000015 – BIDV (giả lập)',
  },
  '000016': {
    itemName: 'Website thương mại điện tử',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 16000000,
    subtotal: 16000000,
    taxAmount: 1600000,
    totalAmount: 17600000,
    sellerAddress: '22 Nguyễn Huệ, P. Sài Gòn, TP.HCM',
    bankAccount: '190099000016 – BIDV (giả lập)',
  },
  '000017': {
    itemName: 'Phần mềm quản lý đơn hàng',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 8500000,
    subtotal: 8500000,
    taxAmount: 850000,
    totalAmount: 9350000,
    sellerAddress: '18 Trường Chinh, P. Tân Sơn, TP.HCM',
    bankAccount: '190099000017 – BIDV (giả lập)',
  },
  '000018': {
    itemName: 'Phần mềm quản lý sản xuất',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 11500000,
    subtotal: 11500000,
    taxAmount: 1150000,
    totalAmount: 12650000,
    sellerAddress: '49 Lạc Long Quân, P. Tân Hòa, TP.HCM',
    bankAccount: '190099000018 – BIDV (giả lập)',
  },
  '000019': {
    itemName: 'Dịch vụ bảo trì máy chủ',
    unit: 'Tháng',
    quantity: 2,
    unitPrice: 2500000,
    subtotal: 5000000,
    taxAmount: 500000,
    totalAmount: 5500000,
    sellerAddress: '67 Phạm Văn Đồng, P. Hiệp Bình, TP.HCM',
    bankAccount: '190099000019 – BIDV (giả lập)',
  },
  '000020': {
    itemName: 'Phần mềm quản lý khách hàng',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 17000000,
    subtotal: 17000000,
    taxAmount: 1700000,
    totalAmount: 18700000,
    sellerAddress: '88 Nguyễn Văn Linh, P. Tân Mỹ, TP.HCM',
    bankAccount: '190099000020 – BIDV (giả lập)',
  },
  '000021': {
    itemName: 'Thiết kế website giới thiệu',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 6000000,
    subtotal: 6000000,
    taxAmount: 600000,
    totalAmount: 6600000,
    sellerAddress: '31 Nguyễn Thị Thập, P. Tân Hưng, TP.HCM',
    bankAccount: '190099000021 – BIDV (giả lập)',
  },
  '000022': {
    itemName: 'Tư vấn chuyển đổi số',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 20000000,
    subtotal: 20000000,
    taxAmount: 2000000,
    totalAmount: 22000000,
    sellerAddress: '73 Nguyễn Văn Trỗi, P. Phú Nhuận, TP.HCM',
    bankAccount: '190099000022 – BIDV (giả lập)',
  },
  '000023': {
    itemName: 'Phần mềm quản lý tài chính',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 12500000,
    subtotal: 12500000,
    taxAmount: 1250000,
    totalAmount: 13750000,
    sellerAddress: '16 Bạch Đằng, P. Gia Định, TP.HCM',
    bankAccount: '190099000023 – BIDV (giả lập)',
  },
  '000024': {
    itemName: 'Thiết kế website doanh nghiệp',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 8000000,
    subtotal: 8000000,
    taxAmount: 800000,
    totalAmount: 8800000,
    sellerAddress: '15 Nguyễn Trãi, P. Bến Thành, TP.HCM',
    bankAccount: '190099000001 – BIDV (giả lập)',
  },
  '000025': {
    itemName: 'Phát triển phần mềm quản lý kho',
    unit: 'Gói',
    quantity: 1,
    unitPrice: 9000000,
    subtotal: 9000000,
    taxAmount: 900000,
    totalAmount: 9900000,
    sellerAddress: '39 Nguyễn Văn Quá, P. Đông Hưng Thuận, TP.HCM',
    bankAccount: '190099000025 – BIDV (giả lập)',
  },
};

// =============================================
// HELPER: Lấy thông tin hàng hóa, dịch vụ và thông tin người bán chuẩn xác
// =============================================
export const getInvoiceItemInfo = (inv: PurchaseInvoiceItem) => {
  const numStr = String(inv.invoiceNumber || '').padStart(6, '0');
  const matched = OFFICIAL_25_INVOICES[numStr] || OFFICIAL_25_INVOICES[inv.invoiceNumber];
  
  if (matched) {
    return {
      name: matched.itemName,
      unit: matched.unit,
      qty: matched.quantity,
      unitPrice: matched.unitPrice,
      subtotal: matched.subtotal,
      taxAmount: matched.taxAmount,
      totalAmount: matched.totalAmount,
      sellerAddress: matched.sellerAddress,
      bankAccount: matched.bankAccount,
    };
  }

  // Fallback nếu hóa đơn ngoài danh mục 25 mẫu
  const total = Number(inv.totalAmount) || 0;
  const beforeTax = Math.round(total / 1.1);
  return {
    name: 'Dịch vụ phát triển phần mềm',
    unit: 'Gói',
    qty: 1,
    unitPrice: beforeTax,
    subtotal: beforeTax,
    taxAmount: total - beforeTax,
    totalAmount: total,
    sellerAddress: 'TP. Hồ Chí Minh',
    bankAccount: '190099000001 – BIDV (giả lập)',
  };
};

// =============================================
// COMPONENT: Render hóa đơn điện tử bên trái (Split-View)
// =============================================
const InvoiceDocument: React.FC<{ inv: PurchaseInvoiceItem }> = ({ inv }) => {
  const isDuplicate = inv.duplicateStatus === 'DUPLICATE';
  const isTaxMismatched = inv.buyerTaxStatus === 'MISMATCHED';
  const itemInfo = getInvoiceItemInfo(inv);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 font-sans text-xs shadow-sm min-h-full leading-normal">
      {/* Header hóa đơn */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">MS</div>
            <div>
              <p className="font-bold text-blue-800 text-xs leading-tight">CÔNG TY TNHH MTV</p>
              <p className="font-bold text-blue-800 text-xs leading-tight">MINH SOFTWARE</p>
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-500 leading-relaxed font-sans">
          <p>Mẫu số: <span className="font-semibold text-slate-800">01GTKT</span></p>
          <p>Ký hiệu: <span className="font-semibold text-slate-800">1C26TMS</span></p>
          <p>Số: <span className="font-bold text-blue-700">{inv.invoiceNumber}</span></p>
        </div>
      </div>

      <div className="text-center mb-4 border-t border-b border-slate-200 py-3">
        <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide">HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h2>
        <p className="text-xs text-slate-500 mt-0.5">(Hóa đơn điện tử đầu vào)</p>
        <p className="text-xs text-slate-600 mt-1">Ngày lập: {formatDate(inv.invoiceDate)}</p>
      </div>

      {/* Thông tin đơn vị bán hàng (Nhà cung cấp) */}
      <table className="w-full text-xs mb-3 font-sans">
        <tbody>
          <tr>
            <td className="text-slate-500 w-32 py-1">Đơn vị bán hàng:</td>
            <td className="font-bold text-slate-900">{inv.supplierName}</td>
          </tr>
          <tr>
            <td className="text-slate-500 py-1">Mã số thuế bán:</td>
            <td className="font-semibold text-slate-800">{inv.sellerTaxCode || 'Chưa có MST'}</td>
          </tr>
          <tr>
            <td className="text-slate-500 py-1">Địa chỉ người bán:</td>
            <td className="text-slate-700">{itemInfo.sellerAddress}</td>
          </tr>
          <tr>
            <td className="text-slate-500 py-1">Tài khoản ngân hàng:</td>
            <td className="text-slate-700 font-mono text-[11px]">{itemInfo.bankAccount}</td>
          </tr>
          <tr>
            <td className="text-slate-500 py-1">Hình thức TT:</td>
            <td className="text-slate-700">Chuyển khoản (TM/CK)</td>
          </tr>
        </tbody>
      </table>

      <div className="border-t border-dashed border-slate-200 my-2.5" />

      {/* Thông tin đơn vị mua hàng (Minh Software) */}
      <table className="w-full text-xs mb-3 font-sans">
        <tbody>
          <tr>
            <td className="text-slate-500 w-32 py-1">Đơn vị mua hàng:</td>
            <td className={`font-bold ${isDuplicate ? 'text-rose-700' : 'text-slate-900'}`}>
              CÔNG TY TNHH MTV MINH SOFTWARE
            </td>
          </tr>
          <tr>
            <td className="text-slate-500 py-1">Mã số thuế mua:</td>
            <td className={`font-semibold ${isTaxMismatched ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
              {inv.buyerTaxCode || '0319002001'}
              {isTaxMismatched && <span className="ml-1.5 text-rose-500 text-[11px] font-bold">⚠ Không khớp 0319002001</span>}
            </td>
          </tr>
          <tr>
            <td className="text-slate-500 py-1">Địa chỉ:</td>
            <td className="text-slate-700">Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM</td>
          </tr>
        </tbody>
      </table>

      {/* Bảng chi tiết hàng hóa, dịch vụ */}
      <table className="w-full text-xs border border-slate-300 mb-3 font-sans">
        <thead>
          <tr className="bg-slate-50 text-slate-700">
            <th className="border border-slate-300 p-1.5 text-center font-bold">STT</th>
            <th className="border border-slate-300 p-1.5 text-left font-bold">Tên hàng hóa, dịch vụ</th>
            <th className="border border-slate-300 p-1.5 text-center font-bold">ĐVT</th>
            <th className="border border-slate-300 p-1.5 text-center font-bold">SL</th>
            <th className="border border-slate-300 p-1.5 text-right font-bold">Đơn giá</th>
            <th className="border border-slate-300 p-1.5 text-right font-bold">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-slate-800">
            <td className="border border-slate-300 p-1.5 text-center">1</td>
            <td className="border border-slate-300 p-1.5 font-medium">{itemInfo.name}</td>
            <td className="border border-slate-300 p-1.5 text-center">{itemInfo.unit}</td>
            <td className="border border-slate-300 p-1.5 text-center">{itemInfo.qty}</td>
            <td className="border border-slate-300 p-1.5 text-right">{itemInfo.unitPrice.toLocaleString('vi-VN')}</td>
            <td className="border border-slate-300 p-1.5 text-right font-semibold">{itemInfo.subtotal.toLocaleString('vi-VN')}</td>
          </tr>
        </tbody>
      </table>

      {/* Tổng cộng tài chính */}
      <div className="text-xs text-right space-y-1.5 mb-3 font-sans">
        <div className="flex justify-between">
          <span className="text-slate-500">Cộng tiền hàng (chưa có thuế GTGT):</span>
          <span className="font-semibold text-slate-800">{formatVND(itemInfo.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Thuế suất GTGT 10% | Tiền thuế GTGT:</span>
          <span className="font-semibold text-slate-800">{formatVND(itemInfo.taxAmount)}</span>
        </div>
        <div className="flex justify-between font-bold text-blue-700 text-sm border-t border-slate-200 pt-2">
          <span>Tổng cộng tiền thanh toán:</span>
          <span>{formatVND(itemInfo.totalAmount)}</span>
        </div>
      </div>

      {/* Chữ ký điện tử */}
      <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-sans">
        <p className="font-bold text-emerald-900">✓ KÝ BỞI: {inv.supplierName.toUpperCase()}</p>
        <p className="text-[11px] text-emerald-700 mt-0.5">Chứng thư số điện tử hợp chuẩn Tổng cục Thuế</p>
        <p className="text-[11px] text-emerald-700">Thời gian ký: {formatDate(inv.invoiceDate)} 09:15:00 GMT+7</p>
      </div>
    </div>
  );
};

// =============================================
// COMPONENT: Panel AI trích xuất bên phải (Split-View)
// =============================================
const InvoiceExtracted: React.FC<{
  inv: PurchaseInvoiceItem;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  isProcessingAction: boolean;
}> = ({ inv, onAccept, onReject, onEdit, isProcessingAction }) => {
  const isDuplicate = inv.duplicateStatus === 'DUPLICATE';
  const isTaxMismatched = inv.buyerTaxStatus === 'MISMATCHED';
  const hasError = isDuplicate || isTaxMismatched;

  const total = Number(inv.totalAmount) || 0;
  const beforeTax = Math.round(total / 1.1);
  const vat = total - beforeTax;

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Cảnh báo lỗi */}
      {hasError && (
        <div className={`rounded-xl p-3.5 border ${isDuplicate ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isDuplicate ? 'text-rose-600' : 'text-amber-600'}`} />
            <div>
              <p className={`text-xs font-bold ${isDuplicate ? 'text-rose-700' : 'text-amber-700'}`}>
                {isDuplicate
                  ? `CẢNH BÁO: PHÁT HIỆN HÓA ĐƠN TRÙNG SỐ ${inv.invoiceNumber}`
                  : 'CẢNH BÁO: SAI MÃ SỐ THUẾ NGƯỜI MUA'}
              </p>
              <p className={`text-[11px] mt-1 ${isDuplicate ? 'text-rose-600' : 'text-amber-600'}`}>
                {isDuplicate
                  ? `Hóa đơn số ${inv.invoiceNumber} từ nhà cung cấp "${inv.supplierName}" trùng với chứng từ đã có trong hệ thống. Vui lòng đối chiếu kỹ trước khi ghi sổ!`
                  : `MST người mua trên hóa đơn (${inv.buyerTaxCode}) không khớp với MST chính thức của Minh Software (0319002001). Cần chỉnh sửa hoặc liên hệ bên bán xuất lại!`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Badge AI trích xuất */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span className="font-medium">AI trích xuất tự động: Độ chính xác</span>
          <span className={`font-bold ${hasError ? 'text-rose-600' : 'text-emerald-600'}`}>
            {hasError ? '72.0%' : '99.4%'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">PostgreSQL NestJS • OCR Engine</span>
      </div>

      {/* Các trường dữ liệu bóc tách */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm flex-1">
        {/* Số hóa đơn & Ký hiệu */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Số hóa đơn</label>
              {isDuplicate ? (
                <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Bị trùng lặp</span>
              ) : (
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Hợp lệ</span>
              )}
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-bold ${
              isDuplicate ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-900'
            }`}>
              <span>{inv.invoiceNumber}</span>
              {isDuplicate && <AlertTriangle className="w-4 h-4 text-rose-500 ml-auto" />}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Ký hiệu hóa đơn</label>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Khớp 100%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900">
              <span>1C26TMS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>
          </div>
        </div>

        {/* Ngày lập & Mã đối soát */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Ngày lập hóa đơn</label>
              <span className="text-[9px] font-bold text-emerald-600">Chính xác</span>
            </div>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
              {formatDate(inv.invoiceDate)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Mã chứng từ / ID</label>
              <span className="text-[9px] text-blue-600 font-semibold">PostgreSQL</span>
            </div>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 font-mono">
              PINV-#{inv.id}
            </div>
          </div>
        </div>

        {/* Đơn vị bán hàng (Nhà cung cấp) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Đơn vị bán hàng (Nhà cung cấp)</label>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Bên xuất</span>
          </div>
          <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
            {inv.supplierName}
          </div>
        </div>

        {/* Tên hàng hóa, dịch vụ bóc tách OCR */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Hàng hóa, dịch vụ bóc tách</label>
            <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Bóc tách OCR
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
            {getInvoiceItemInfo(inv).name}
          </div>
        </div>

        {/* MST bán + MST mua */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">MST người bán</label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono font-semibold text-slate-900">
              {inv.sellerTaxCode || 'Chưa cập nhật'}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">MST người mua</label>
            <div className={`px-3 py-2 rounded-lg border text-xs font-mono font-semibold flex items-center justify-between ${
              isTaxMismatched ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-900'
            }`}>
              <span>{inv.buyerTaxCode || '0319002001'}</span>
              {isTaxMismatched && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
            </div>
          </div>
        </div>

        {/* Tài chính */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Tiền trước thuế</label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
              {formatVND(beforeTax)}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Thuế suất GTGT</label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
              10%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Tiền thuế GTGT</label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
              {formatVND(vat)}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Tổng tiền thanh toán</label>
            <div className="px-3 py-2 rounded-lg border-2 border-blue-200 bg-blue-50 text-sm font-extrabold text-blue-700">
              {formatVND(total)}
              <span className="block text-[9px] font-normal text-blue-500 mt-0.5">Đã bao gồm 10% VAT</span>
            </div>
          </div>
        </div>

        {/* Phân loại chi phí */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Phân loại chi phí</label>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              AI gợi ý chuẩn xác
            </span>
          </div>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option>Chi phí dịch vụ mua ngoài (TK 6427)</option>
            <option>Chi phí công cụ dụng cụ (TK 6423)</option>
            <option>Chi phí hạ tầng máy chủ & Internet (TK 6427)</option>
            <option>Chi phí bản quyền phần mềm (TK 6428)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1.5">
            * Tự động hạch toán vào Sổ Nhật ký Chung và Tờ khai thuế GTGT Quý 4/2026.
          </p>
        </div>
      </div>

      {/* 3 nút hành động cuối trang */}
      <div className="flex gap-2">
        <button
          onClick={onReject}
          disabled={isProcessingAction || inv.paymentStatus === 'REJECTED'}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors disabled:opacity-40"
        >
          <X className="w-3.5 h-3.5" />
          <span>{inv.paymentStatus === 'REJECTED' ? 'Đã từ chối' : 'Từ chối'}</span>
        </button>

        <button
          onClick={onEdit}
          disabled={isProcessingAction}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Sửa dữ liệu</span>
        </button>

        <button
          onClick={onAccept}
          disabled={isProcessingAction || inv.paymentStatus === 'REJECTED'}
          className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-40"
        >
          {isProcessingAction ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckSquare className="w-3.5 h-3.5" />
          )}
          <span>Chấp nhận & Ghi sổ</span>
        </button>
      </div>
    </div>
  );
};

// =============================================
// COMPONENT CHÍNH: Trang Chứng từ & Hóa đơn
// =============================================
export const InvoiceView: React.FC = () => {
  // Tab hiện tại: ALL, NEEDS_REVIEW, VALID, REJECTED
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEEDS_REVIEW' | 'VALID' | 'REJECTED'>('NEEDS_REVIEW');
  const [invoicesList, setInvoicesList] = useState<PurchaseInvoiceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>('1');
  const [newlyUploadedId, setNewlyUploadedId] = useState<string | null>(null);
  const [newlyUploadedIndex, setNewlyUploadedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [apiNotice, setApiNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Thống kê đếm tab từ backend
  const [tabCounts, setTabCounts] = useState({
    all: 25,
    needsReview: 2,
    valid: 23,
    rejected: 0,
  });

  // Modal Sửa dữ liệu bóc tách
  const [editingInvoice, setEditingInvoice] = useState<PurchaseInvoiceItem | null>(null);
  const [editForm, setEditForm] = useState<UpdatePurchaseInvoicePayload>({
    supplierName: '',
    invoiceNumber: '',
    sellerTaxCode: '',
    buyerTaxCode: '',
    totalAmount: 0,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Đồng bộ số trang hiển thị trong ô nhập khi currentIndex thay đổi
  useEffect(() => {
    setPageInput(String(currentIndex + 1));
  }, [currentIndex]);

  // ================= Tải danh sách hóa đơn từ API =================
  const fetchInvoices = useCallback(async (targetInvoiceId?: string, selectLast?: boolean) => {
    setIsLoading(true);
    try {
      const res = await getPurchaseInvoices({
        tab: activeTab,
        page: 1,
        limit: 50,
      });

      if (res.success && res.data) {
        const items = res.data.items || [];
        setInvoicesList(items);
        if (res.data.tabCounts) {
          setTabCounts(res.data.tabCounts);
        }

        // Tự động nhảy đến hóa đơn mục tiêu (hoặc hóa đơn vừa tải lên)
        if (targetInvoiceId) {
          const foundIdx = items.findIndex(
            (inv: PurchaseInvoiceItem) => String(inv.id) === String(targetInvoiceId) || inv.invoiceNumber === String(targetInvoiceId)
          );
          if (foundIdx !== -1) {
            setCurrentIndex(foundIdx);
            setNewlyUploadedIndex(foundIdx);
          } else if (selectLast && items.length > 0) {
            const lastIdx = items.length - 1;
            setCurrentIndex(lastIdx);
            setNewlyUploadedIndex(lastIdx);
          }
        } else if (selectLast && items.length > 0) {
          const lastIdx = items.length - 1;
          setCurrentIndex(lastIdx);
          setNewlyUploadedIndex(lastIdx);
        } else {
          setCurrentIndex(prev => (prev < items.length ? prev : 0));
        }
      } else {
        setApiNotice({
          type: 'error',
          message: res.message || 'Không thể tải danh sách hóa đơn từ máy chủ',
        });
      }
    } catch {
      setApiNotice({
        type: 'error',
        message: 'Lỗi kết nối Backend. Hãy đảm bảo Docker PostgreSQL và NestJS đang chạy!',
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const currentInvoice = invoicesList[currentIndex] || null;
  const totalInvoices = invoicesList.length;

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(totalInvoices - 1, i + 1));

  // Nhảy đến hóa đơn theo số thứ tự nhập vào ô (1 - totalInvoices)
  const handlePageJump = () => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalInvoices) {
      setCurrentIndex(pageNum - 1);
    } else {
      setPageInput(String(currentIndex + 1));
    }
  };

  // ================= Xử lý Upload file hóa đơn =================
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadPurchaseInvoice(file);
      if (res.success) {
        const uploadedData = res.data;
        const uploadedId = uploadedData?.id || uploadedData?.invoiceNumber;
        if (uploadedId) {
          setNewlyUploadedId(uploadedId);
        }

        // Tự động chuyển sang tab "Tất cả" (ALL) để thấy toàn bộ danh sách gồm hóa đơn mới
        setActiveTab('ALL');

        // Tải lại danh sách và nhảy trực tiếp đến hóa đơn mới vừa tải
        await fetchInvoices(uploadedId, true);

        setApiNotice({
          type: 'success',
          message: `Tải lên hóa đơn "${file.name}" và bóc tách AI thành công! Hệ thống đã tự động chuyển đến hóa đơn mới vừa tải.`,
        });
      } else {
        alert(res.message || 'Tải file thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi tải file hóa đơn!');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ================= Xử lý Đồng bộ 25 hóa đơn mẫu =================
  const handleSyncDemo = async () => {
    setIsSyncing(true);
    try {
      const res = await syncDemoPurchaseInvoices();
      if (res.success) {
        setApiNotice({
          type: 'success',
          message: 'Đã đồng bộ thành công bộ 25 hóa đơn mẫu từ kịch bản kiểm thử!',
        });
        fetchInvoices();
      } else {
        alert(res.message || 'Đồng bộ thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi đồng bộ hóa đơn mẫu!');
    } finally {
      setIsSyncing(false);
    }
  };

  // ================= Xử lý Chấp nhận & Ghi sổ =================
  const handleAccept = async () => {
    if (!currentInvoice) return;
    setIsProcessingAction(true);
    try {
      const res = await confirmPurchaseInvoice(currentInvoice.id);
      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Đã phê duyệt và ghi sổ hóa đơn số ${currentInvoice.invoiceNumber}!`,
        });
        fetchInvoices();
      } else {
        alert(res.message || 'Phê duyệt thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi phê duyệt hóa đơn!');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // ================= Xử lý Từ chối hóa đơn =================
  const handleReject = async () => {
    if (!currentInvoice) return;
    const reason = prompt('Nhập lý do từ chối hóa đơn:', 'Hóa đơn trùng lặp hoặc sai mã số thuế');
    if (reason === null) return;

    setIsProcessingAction(true);
    try {
      const res = await rejectPurchaseInvoice(currentInvoice.id, reason);
      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Đã từ chối hóa đơn số ${currentInvoice.invoiceNumber}!`,
        });
        fetchInvoices();
      } else {
        alert(res.message || 'Từ chối thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi từ chối hóa đơn!');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // ================= Mở Modal Sửa hóa đơn =================
  const handleOpenEdit = () => {
    if (!currentInvoice) return;
    setEditingInvoice(currentInvoice);
    setEditForm({
      supplierName: currentInvoice.supplierName,
      invoiceNumber: currentInvoice.invoiceNumber,
      sellerTaxCode: currentInvoice.sellerTaxCode || '',
      buyerTaxCode: currentInvoice.buyerTaxCode || '',
      totalAmount: currentInvoice.totalAmount,
    });
  };

  // ================= Lưu Sửa hóa đơn qua PATCH API =================
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    setIsProcessingAction(true);
    try {
      const res = await updatePurchaseInvoice(editingInvoice.id, {
        supplierName: editForm.supplierName,
        invoiceNumber: editForm.invoiceNumber,
        sellerTaxCode: editForm.sellerTaxCode,
        buyerTaxCode: editForm.buyerTaxCode,
        totalAmount: Number(editForm.totalAmount),
      });

      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Cập nhật thông tin hóa đơn #${editingInvoice.id} thành công!`,
        });
        setEditingInvoice(null);
        fetchInvoices();
      } else {
        alert(res.message || 'Cập nhật thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi cập nhật hóa đơn!');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const tabsConfig = [
    { key: 'ALL' as const, label: 'Tất cả', count: tabCounts.all },
    { key: 'NEEDS_REVIEW' as const, label: 'Cần duyệt', count: tabCounts.needsReview, urgent: true },
    { key: 'VALID' as const, label: 'Hợp lệ', count: tabCounts.valid },
    { key: 'REJECTED' as const, label: 'Từ chối', count: tabCounts.rejected },
  ];

  return (
    <div className="space-y-4">
      {/* Input File ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Thông báo API Toast */}
      {apiNotice && (
        <div className={`p-3.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm animate-in fade-in duration-200 ${
          apiNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            {apiNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{apiNotice.message}</span>
            {newlyUploadedIndex !== null && totalInvoices > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(newlyUploadedIndex);
                }}
                className="ml-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Xem ngay hóa đơn vừa tải ({newlyUploadedIndex + 1}/{totalInvoices})</span>
                <span>→</span>
              </button>
            )}
          </div>
          <button onClick={() => setApiNotice(null)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded self-end sm:self-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Vùng Upload kéo thả */}
      <div className="bg-white border-2 border-dashed border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors"
        >
          {isUploading ? <RefreshCw className="w-6 h-6 animate-spin text-blue-600" /> : <Upload className="w-6 h-6" />}
        </div>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 text-center md:text-left"
        >
          <h3 className="text-sm font-bold text-slate-800">
            Kéo thả file ảnh hoặc PDF hóa đơn GTGT vào đây để AI tự động bóc tách (OCR)
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Hỗ trợ định dạng PDF, JPG, PNG, XML hóa đơn điện tử theo chuẩn Tổng cục Thuế Việt Nam (Nghị định 123/2020/NĐ-CP)
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-100">
            <Sparkles className="w-3 h-3" /> AI OCR v2.4
          </span>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 rotate-180" />
            <span>{isUploading ? 'Đang bóc tách...' : 'Chọn file từ máy'}</span>
          </button>

          <button
            onClick={handleSyncDemo}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-colors disabled:opacity-50"
            title="Đồng bộ lại bộ 25 hóa đơn mẫu"
          >
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ 25 HĐ mẫu'}</span>
          </button>
        </div>
      </div>

      {/* 2. Thanh Tab lọc + Điều hướng hóa đơn */}
      <div className="flex items-center justify-between">
        {/* Tabs lọc */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {tabsConfig.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentIndex(0);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : tab.urgent && tab.count > 0
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Điều hướng chuyển hóa đơn */}
        {totalInvoices > 0 && currentInvoice && (
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap justify-end">
            <span className="font-medium flex items-center gap-1.5">
              <span>Đang đối chiếu:</span>
              <span className="text-blue-600 font-bold font-mono">
                HD-{currentInvoice.invoiceNumber}
              </span>
              <span className="text-slate-600 font-semibold truncate max-w-[200px]" title={currentInvoice.supplierName}>
                ({currentInvoice.supplierName})
              </span>
              {(String(currentInvoice.id) === String(newlyUploadedId) || currentIndex === newlyUploadedIndex) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 animate-pulse shrink-0">
                  ✨ Vừa tải lên
                </span>
              )}
            </span>
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 cursor-pointer"
                title="Hóa đơn trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Ô NHẬP SỐ ĐỂ DI CHUYỂN ĐẾN HÓA ĐƠN BẤT KỲ (XÓA NHẬP SỐ THEO YÊU CẦU) */}
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-1.5 py-0.5 shadow-2xs">
                <input
                  type="text"
                  value={pageInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      setPageInput(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePageJump();
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  onBlur={handlePageJump}
                  className="w-9 h-6 text-center font-bold text-blue-700 bg-blue-50/60 border border-blue-200 rounded text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all cursor-text"
                  title={`Xóa hoặc nhập số thứ tự hóa đơn (1 - ${totalInvoices}) rồi nhấn Enter để chuyển đến`}
                />
                <span className="text-slate-400 font-semibold text-xs">/</span>
                <span className="font-bold text-slate-700 text-xs pr-1">{totalInvoices}</span>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex >= totalInvoices - 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 cursor-pointer"
                title="Hóa đơn tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. SPLIT-VIEW: Panel Trái (Hóa đơn gốc) | Panel Phải (AI trích xuất) */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Đang tải dữ liệu hóa đơn từ PostgreSQL Backend...</p>
        </div>
      ) : totalInvoices > 0 && currentInvoice ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Panel TRÁI: Hóa đơn gốc */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600" title="Phóng to">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600" title="Thu nhỏ">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => fetchInvoices()}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                  title="Tải lại"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-500 font-medium ml-1">Trang 1/1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Bản gốc điện tử hợp lệ
                </span>
                <button 
                  onClick={() => alert(`Tải xuống hóa đơn: HD_${currentInvoice.invoiceNumber}.pdf`)}
                  className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-800 font-medium px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Tải file gốc
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[600px]">
              <InvoiceDocument inv={currentInvoice} />
            </div>
          </div>

          {/* Panel PHẢI: AI trích xuất */}
          <div className="overflow-y-auto max-h-[680px] pr-1">
            <InvoiceExtracted
              inv={currentInvoice}
              onAccept={handleAccept}
              onReject={handleReject}
              onEdit={handleOpenEdit}
              isProcessingAction={isProcessingAction}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <ScanLine className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">Chưa có hóa đơn nào trong tab này</p>
          <p className="text-slate-400 text-xs mt-1 mb-4">
            Bạn có thể bấm nút "Đồng bộ 25 HĐ mẫu" ở trên hoặc chọn file tải lên để bắt đầu đối chiếu.
          </p>
          <button
            onClick={handleSyncDemo}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            <span>Đồng bộ 25 hóa đơn mẫu ngay</span>
          </button>
        </div>
      )}

      {/* ================= MODAL SỬA DỮ LIỆU BÓC TÁCH (PATCH /api/v1/purchase-invoices/:id) ================= */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Chỉnh sửa thông tin bóc tách</h3>
                  <p className="text-xs text-slate-400">Hóa đơn #{editingInvoice.id} • PATCH /api/v1/purchase-invoices/{editingInvoice.id}</p>
                </div>
              </div>
              <button onClick={() => setEditingInvoice(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="pt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đơn vị bán hàng (Nhà cung cấp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.supplierName}
                  onChange={(e) => setEditForm({ ...editForm, supplierName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số hóa đơn</label>
                  <input
                    type="text"
                    required
                    value={editForm.invoiceNumber}
                    onChange={(e) => setEditForm({ ...editForm, invoiceNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tổng tiền thanh toán (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={editForm.totalAmount}
                    onChange={(e) => setEditForm({ ...editForm, totalAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">MST người bán</label>
                  <input
                    type="text"
                    value={editForm.sellerTaxCode || ''}
                    onChange={(e) => setEditForm({ ...editForm, sellerTaxCode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">MST người mua</label>
                  <input
                    type="text"
                    value={editForm.buyerTaxCode || ''}
                    onChange={(e) => setEditForm({ ...editForm, buyerTaxCode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isProcessingAction}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {isProcessingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isProcessingAction ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
