import React, { useState } from 'react';
import {
  Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  RefreshCw, Download, AlertTriangle, CheckCircle2,
  Sparkles, X, Edit3, CheckSquare, ScanLine, Layers
} from 'lucide-react';

// =============================================
// DỮ LIỆU 25 HÓA ĐƠN MẪU (theo file Word của Đạt)
// =============================================
const invoices = [
  { id: 1, so: '000001', ngay: '01/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH TM Hoàng Gia', mstMua: '9900000001', dichVu: 'Thiết kế website doanh nghiệp', truocThue: 8000000, thue: 800000, tong: 8800000, trangThai: 'can_duyet', loi: 'trung_lap' },
  { id: 2, so: '000002', ngay: '02/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Công nghệ Đại Việt', mstMua: '9900000002', dichVu: 'Phát triển phần mềm quản lý', truocThue: 15000000, thue: 1500000, tong: 16500000, trangThai: 'hop_le', loi: null },
  { id: 3, so: '000003', ngay: '02/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Nội thất Phương Nam', mstMua: '9900000003', dichVu: 'Thiết kế website bán hàng', truocThue: 9500000, thue: 950000, tong: 10450000, trangThai: 'hop_le', loi: null },
  { id: 4, so: '000004', ngay: '03/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Dịch vụ An Khang', mstMua: '9900000004', dichVu: 'Bảo trì hệ thống phần mềm', truocThue: 6000000, thue: 600000, tong: 6600000, trangThai: 'hop_le', loi: null },
  { id: 5, so: '000005', ngay: '03/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Đầu tư Thành Công', mstMua: '9900000005', dichVu: 'Phần mềm quản lý nhân sự', truocThue: 12000000, thue: 1200000, tong: 13200000, trangThai: 'hop_le', loi: null },
  { id: 6, so: '000006', ngay: '04/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Giáo dục Ánh Dương', mstMua: '9900000006', dichVu: 'Thiết kế hệ thống học trực tuyến', truocThue: 18000000, thue: 1800000, tong: 19800000, trangThai: 'hop_le', loi: null },
  { id: 7, so: '000007', ngay: '04/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Logistics Đông Nam', mstMua: '9900000007', dichVu: 'Phần mềm quản lý kho', truocThue: 11000000, thue: 1100000, tong: 12100000, trangThai: 'hop_le', loi: null },
  { id: 8, so: '000008', ngay: '05/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Thương mại Hưng Phát', mstMua: '9900000008', dichVu: 'Dịch vụ lưu trữ dữ liệu', truocThue: 6000000, thue: 600000, tong: 6600000, trangThai: 'hop_le', loi: null },
  { id: 9, so: '000009', ngay: '05/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Xây dựng Minh Long', mstMua: '9900000009', dichVu: 'Phần mềm quản lý công trình', truocThue: 14000000, thue: 1400000, tong: 15400000, trangThai: 'hop_le', loi: null },
  { id: 10, so: '000010', ngay: '06/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Truyền thông Sao Mai', mstMua: '9900000010', dichVu: 'Thiết kế landing page', truocThue: 5000000, thue: 500000, tong: 5500000, trangThai: 'hop_le', loi: null },
  { id: 11, so: '000011', ngay: '06/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Thiết bị Việt Nhật', mstMua: '9900000011', dichVu: 'Cài đặt hệ thống máy chủ', truocThue: 4500000, thue: 450000, tong: 4950000, trangThai: 'hop_le', loi: null },
  { id: 12, so: '000012', ngay: '07/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Thực phẩm Gia Hân', mstMua: '9900000012', dichVu: 'Phần mềm quản lý bán hàng', truocThue: 10000000, thue: 1000000, tong: 11000000, trangThai: 'hop_le', loi: null },
  { id: 13, so: '000013', ngay: '07/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Dược phẩm Tâm An', mstMua: '9900000013', dichVu: 'Thiết kế cơ sở dữ liệu', truocThue: 7000000, thue: 700000, tong: 7700000, trangThai: 'hop_le', loi: null },
  { id: 14, so: '000014', ngay: '08/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Du lịch Biển Xanh', mstMua: '9900000014', dichVu: 'Website đặt tour du lịch', truocThue: 13000000, thue: 1300000, tong: 14300000, trangThai: 'hop_le', loi: null },
  { id: 15, so: '000015', ngay: '08/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Điện tử Hoàng Nam', mstMua: '9900000015', dichVu: 'Phần mềm quản lý thiết bị', truocThue: 9000000, thue: 900000, tong: 9900000, trangThai: 'hop_le', loi: null },
  { id: 16, so: '000016', ngay: '09/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Thời trang Bella', mstMua: '9900000016', dichVu: 'Website thương mại điện tử', truocThue: 16000000, thue: 1600000, tong: 17600000, trangThai: 'hop_le', loi: null },
  { id: 17, so: '000017', ngay: '09/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Nông sản Việt', mstMua: '9900000017', dichVu: 'Phần mềm quản lý đơn hàng', truocThue: 8500000, thue: 850000, tong: 9350000, trangThai: 'hop_le', loi: null },
  { id: 18, so: '000018', ngay: '10/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Cơ khí Tiến Đạt', mstMua: '9900000018', dichVu: 'Phần mềm quản lý sản xuất', truocThue: 11500000, thue: 1150000, tong: 12650000, trangThai: 'hop_le', loi: null },
  { id: 19, so: '000019', ngay: '10/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Dịch vụ Bảo Minh', mstMua: '9900000019', dichVu: 'Dịch vụ bảo trì máy chủ', truocThue: 5000000, thue: 500000, tong: 5500000, trangThai: 'hop_le', loi: null },
  { id: 20, so: '000020', ngay: '11/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Phát triển Hoàng Phúc', mstMua: '9900000020', dichVu: 'Phần mềm quản lý khách hàng', truocThue: 17000000, thue: 1700000, tong: 18700000, trangThai: 'hop_le', loi: null },
  { id: 21, so: '000021', ngay: '11/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Thương mại Kim Ngân', mstMua: '9900000021', dichVu: 'Thiết kế website giới thiệu', truocThue: 6000000, thue: 600000, tong: 6600000, trangThai: 'hop_le', loi: null },
  { id: 22, so: '000022', ngay: '12/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH Giải pháp Số Việt', mstMua: '9900000022', dichVu: 'Tư vấn chuyển đổi số', truocThue: 20000000, thue: 2000000, tong: 22000000, trangThai: 'hop_le', loi: null },
  { id: 23, so: '000023', ngay: '12/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty CP Đầu tư Phú Thành', mstMua: '9900000023', dichVu: 'Phần mềm quản lý tài chính', truocThue: 12500000, thue: 1250000, tong: 13750000, trangThai: 'hop_le', loi: null },
  { id: 24, so: '000001', ngay: '01/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH TM Hoàng Gia', mstMua: '9900000001', dichVu: 'Thiết kế website doanh nghiệp', truocThue: 8000000, thue: 800000, tong: 8800000, trangThai: 'can_duyet', loi: 'trung_lap' },
  { id: 25, so: '000025', ngay: '13/11/2026', kyHieu: '1C26TMS', nguoiMua: 'Công ty TNHH XNK Thành Đạt', mstMua: '9999999999', dichVu: 'Phát triển phần mềm quản lý kho', truocThue: 9000000, thue: 900000, tong: 9900000, trangThai: 'can_duyet', loi: 'sai_mst' },
];

const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' đ';

// =============================================
// COMPONENT: Render hóa đơn HTML bên trái
// =============================================
const InvoiceDocument: React.FC<{ inv: typeof invoices[0] }> = ({ inv }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 font-serif text-xs shadow-sm min-h-full">
    {/* Header hóa đơn */}
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white font-black text-sm">MS</div>
          <div>
            <p className="font-bold text-blue-800 text-[11px] leading-tight">CÔNG TY TNHH MTV</p>
            <p className="font-bold text-blue-800 text-[11px] leading-tight">MINH SOFTWARE</p>
          </div>
        </div>
      </div>
      <div className="text-right text-[10px] text-slate-500 leading-relaxed">
        <p>Mẫu số: <span className="font-semibold text-slate-800">01GTKT</span></p>
        <p>Ký hiệu: <span className="font-semibold text-slate-800">1C26TMS</span></p>
        <p>Số: <span className="font-bold text-blue-700">{inv.so}</span></p>
      </div>
    </div>

    <div className="text-center mb-4 border-t border-b border-slate-200 py-3">
      <h2 className="font-bold text-sm text-slate-900 uppercase">HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h2>
      <p className="text-[10px] text-slate-500 mt-0.5">(Tiền điện tử)</p>
      <p className="text-[10px] text-slate-600 mt-1">Ngày {inv.ngay.replace(/\//g, ' tháng ').replace(' tháng ', ' ').replace(' tháng ', ' năm ')}</p>
    </div>

    {/* Thông tin người bán */}
    <table className="w-full text-[10px] mb-3">
      <tbody>
        <tr><td className="text-slate-500 w-32 py-0.5">Đơn vị bán hàng:</td><td className="font-bold text-slate-900">CÔNG TY TNHH MTV MINH SOFTWARE</td></tr>
        <tr><td className="text-slate-500 py-0.5">Mã số thuế:</td><td className="font-semibold">0319002001</td></tr>
        <tr><td className="text-slate-500 py-0.5">Địa chỉ:</td><td>Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM</td></tr>
      </tbody>
    </table>

    <div className="border-t border-dashed border-slate-200 my-2" />

    {/* Thông tin người mua */}
    <table className="w-full text-[10px] mb-3">
      <tbody>
        <tr><td className="text-slate-500 w-32 py-0.5">Đơn vị mua hàng:</td><td className={`font-bold ${inv.loi === 'trung_lap' ? 'text-rose-700' : 'text-slate-900'}`}>{inv.nguoiMua.toUpperCase()}</td></tr>
        <tr>
          <td className="text-slate-500 py-0.5">Mã số thuế:</td>
          <td className={`font-semibold ${inv.loi === 'sai_mst' ? 'text-rose-600 font-bold' : ''}`}>
            {inv.mstMua}
            {inv.loi === 'sai_mst' && <span className="ml-1 text-rose-500 text-[9px]">⚠ Không khớp</span>}
          </td>
        </tr>
        <tr><td className="text-slate-500 py-0.5">Hình thức TT:</td><td>Chuyển khoản (TM/CK)</td></tr>
      </tbody>
    </table>

    {/* Bảng chi tiết hàng hóa */}
    <table className="w-full text-[9px] border border-slate-300 mb-3">
      <thead>
        <tr className="bg-slate-50">
          <th className="border border-slate-300 p-1 text-center">STT</th>
          <th className="border border-slate-300 p-1 text-left">Tên hàng hóa, dịch vụ</th>
          <th className="border border-slate-300 p-1 text-center">ĐVT</th>
          <th className="border border-slate-300 p-1 text-center">SL</th>
          <th className="border border-slate-300 p-1 text-right">Đơn giá</th>
          <th className="border border-slate-300 p-1 text-right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-slate-300 p-1 text-center">1</td>
          <td className="border border-slate-300 p-1">{inv.dichVu}</td>
          <td className="border border-slate-300 p-1 text-center">Gói</td>
          <td className="border border-slate-300 p-1 text-center">1</td>
          <td className="border border-slate-300 p-1 text-right">{inv.truocThue.toLocaleString('vi-VN')}</td>
          <td className="border border-slate-300 p-1 text-right">{inv.truocThue.toLocaleString('vi-VN')}</td>
        </tr>
      </tbody>
    </table>

    {/* Tổng tiền */}
    <div className="text-[10px] text-right space-y-1 mb-3">
      <div className="flex justify-between"><span className="text-slate-500">Cộng tiền hàng (chưa có thuế GTGT):</span><span className="font-semibold">{formatVND(inv.truocThue)}</span></div>
      <div className="flex justify-between"><span className="text-slate-500">Thuế suất GTGT 10% | Tiền thuế GTGT:</span><span className="font-semibold">{formatVND(inv.thue)}</span></div>
      <div className="flex justify-between font-bold text-blue-700 text-xs border-t border-slate-200 pt-1">
        <span>Tổng cộng tiền thanh toán:</span>
        <span>{formatVND(inv.tong)}</span>
      </div>
    </div>

    {/* Chữ ký điện tử */}
    <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[9px] text-emerald-700">
      <p className="font-bold">✓ KÝ BỞI: MINH SOFTWARE</p>
      <p>Ký điện tử hợp lệ bởi Minh Software</p>
      <p>Thời gian ký: {inv.ngay} 09:14:22 GMT+7</p>
    </div>
  </div>
);

// =============================================
// COMPONENT: Panel AI trích xuất bên phải
// =============================================
const InvoiceExtracted: React.FC<{
  inv: typeof invoices[0];
  onAccept: () => void;
  onReject: () => void;
}> = ({ inv, onAccept, onReject }) => {
  const isTrungLap = inv.loi === 'trung_lap';
  const isSaiMST = inv.loi === 'sai_mst';
  const hasError = isTrungLap || isSaiMST;

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Cảnh báo lỗi (chỉ hiện khi có lỗi) */}
      {hasError && (
        <div className={`rounded-xl p-3.5 border ${isTrungLap ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isTrungLap ? 'text-rose-600' : 'text-amber-600'}`} />
            <div>
              <p className={`text-xs font-bold ${isTrungLap ? 'text-rose-700' : 'text-amber-700'}`}>
                {isTrungLap ? `CẢNH BÁO: PHÁT HIỆN HÓA ĐƠN TRÙNG SỐ ${inv.so}` : 'CẢNH BÁO: SAI MÃ SỐ THUẾ NGƯỜI MUA'}
              </p>
              <p className={`text-[11px] mt-1 ${isTrungLap ? 'text-rose-600' : 'text-amber-600'}`}>
                {isTrungLap
                  ? `Trùng với chứng từ đã ghi sổ ngày ${inv.ngay} bởi hệ thống kế toán. Vui lòng đối chiếu mã tra cứu và ngày xuất hóa đơn trước khi phê duyệt ghi sổ.`
                  : `MST trên hóa đơn (9999999999) không khớp với MST đã xác minh trong danh mục khách hàng (9900000025). Cần kiểm tra và cập nhật trước khi ghi sổ.`}
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
          <span className={`font-bold ${hasError ? 'text-rose-600' : 'text-emerald-600'}`}>{hasError ? '72%' : '99.4%'}</span>
        </div>
        <span className="text-[10px] text-slate-400">Mô hình OCR chuyên sâu Thuế Việt Nam</span>
      </div>

      {/* Các trường dữ liệu được trích xuất */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm flex-1">
        {/* Dòng 1: Số hóa đơn + Ký hiệu */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Số hóa đơn</label>
              {isTrungLap
                ? <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Bị trùng lặp</span>
                : <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Chính xác</span>
              }
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-bold ${isTrungLap ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
              <span>{inv.so}</span>
              {isTrungLap && <AlertTriangle className="w-4 h-4 text-rose-500 ml-auto" />}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Ký hiệu hóa đơn</label>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Khớp 100%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900">
              <span>{inv.kyHieu}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>
          </div>
        </div>

        {/* Dòng 2: Ngày lập + Mã tra cứu */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Ngày lập hóa đơn</label>
              <span className="text-[9px] font-bold text-emerald-600">Chính xác</span>
            </div>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
              {inv.ngay}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Mã tra cứu hóa đơn</label>
              <span className="text-[9px] text-blue-600 font-semibold">Tổng cục Thuế</span>
            </div>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
              HD-2026-MG{String(inv.id).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Đơn vị bán hàng */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Đơn vị bán hàng</label>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Đã xác minh OPC</span>
          </div>
          <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
            Công ty TNHH MTV Minh Software
          </div>
        </div>

        {/* MST bán + MST mua */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Mã số thuế bán</label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono font-semibold text-slate-900">
              0319002001
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Mã số thuế mua</label>
            <div className={`px-3 py-2 rounded-lg border text-xs font-mono font-semibold flex items-center justify-between ${isSaiMST ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
              <span>{inv.mstMua}</span>
              {isSaiMST && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
            </div>
          </div>
        </div>

        {/* Đơn vị mua hàng */}
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Đơn vị mua hàng</label>
          <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
            {inv.nguoiMua}
          </div>
        </div>

        {/* Tài chính */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Tiền trước thuế</label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
              {formatVND(inv.truocThue)}
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
              {formatVND(inv.thue)}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Tổng tiền thanh toán</label>
            <div className="px-3 py-2 rounded-lg border-2 border-blue-200 bg-blue-50 text-sm font-extrabold text-blue-700">
              {formatVND(inv.tong)}
              <span className="block text-[9px] font-normal text-blue-500 mt-0.5">Đã bao gồm 10% VAT</span>
            </div>
          </div>
        </div>

        {/* Phân loại chi phí */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Phân loại chi phí / Doanh thu</label>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              AI gợi ý chuẩn xác
            </span>
          </div>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option>Dịch vụ Website / Phần mềm (TK 5113 – Doanh thu dịch vụ)</option>
            <option>Phần mềm bản quyền (TK 5113)</option>
            <option>Dịch vụ bảo trì (TK 5114)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1.5">
            * Tự động hạch toán vào Sổ Nhật ký Chung và Lịch khai thuế Quý 4/2026.
          </p>
        </div>
      </div>

      {/* 3 nút hành động cuối trang */}
      <div className="flex gap-2">
        <button
          onClick={onReject}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Từ chối hóa đơn</span>
        </button>
        <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Sửa dữ liệu</span>
        </button>
        <button
          onClick={onAccept}
          className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
        >
          <CheckSquare className="w-3.5 h-3.5" />
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
  const [activeFilter, setActiveFilter] = useState<'tat_ca' | 'can_duyet' | 'hop_le' | 'tu_choi'>('can_duyet');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accepted, setAccepted] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  // Lọc danh sách hóa đơn theo tab đang chọn
  const filtered = invoices.filter(inv => {
    if (activeFilter === 'tat_ca') return true;
    if (activeFilter === 'can_duyet') return inv.trangThai === 'can_duyet' && !accepted.includes(inv.id) && !rejected.includes(inv.id);
    if (activeFilter === 'hop_le') return inv.trangThai === 'hop_le' || accepted.includes(inv.id);
    if (activeFilter === 'tu_choi') return rejected.includes(inv.id);
    return true;
  });

  const current = filtered[currentIndex] ?? invoices[0];
  const total = filtered.length;

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(total - 1, i + 1));

  const handleAccept = () => {
    setAccepted(prev => [...prev, current.id]);
    if (currentIndex >= filtered.length - 1) setCurrentIndex(0);
  };

  const handleReject = () => {
    setRejected(prev => [...prev, current.id]);
    if (currentIndex >= filtered.length - 1) setCurrentIndex(0);
  };

  const canDuyetCount = invoices.filter(inv =>
    inv.trangThai === 'can_duyet' && !accepted.includes(inv.id) && !rejected.includes(inv.id)
  ).length;

  const tabs = [
    { key: 'tat_ca', label: 'Tất cả', count: 25 },
    { key: 'can_duyet', label: 'Cần duyệt', count: canDuyetCount, urgent: true },
    { key: 'hop_le', label: 'Hợp lệ', count: 23 + accepted.length },
    { key: 'tu_choi', label: 'Từ chối', count: rejected.length },
  ] as const;

  return (
    <div className="space-y-4">
      {/* 1. Vùng Upload kéo thả */}
      <div className="bg-white border-2 border-dashed border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
          <Upload className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-sm font-bold text-slate-800">
            Kéo thả file ảnh hoặc PDF hóa đơn GTGT vào đây để AI tự động bóc tách
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Hỗ trợ định dạng PDF, JPG, PNG, XML hóa đơn điện tử theo chuẩn Tổng cục Thuế Việt Nam (Nghị định 123/2020/NĐ-CP)
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-100">
            <Sparkles className="w-3 h-3" /> AI OCR v2.4
          </span>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-colors">
            <Download className="w-3.5 h-3.5 rotate-180" />
            Chọn file từ máy tính
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-colors">
            <Layers className="w-3.5 h-3.5" />
            Quét hàng loạt
          </button>
        </div>
      </div>

      {/* 2. Thanh Tab lọc + điều hướng hóa đơn */}
      <div className="flex items-center justify-between">
        {/* Tabs lọc bên trái */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveFilter(tab.key); setCurrentIndex(0); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeFilter === tab.key
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

        {/* Điều hướng hóa đơn bên phải */}
        {total > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Đang đối chiếu: <span className="text-blue-600 font-bold">01GTKT-{current.kyHieu}-{current.so}</span></span>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-semibold text-slate-700">{currentIndex + 1} / {total}</span>
              <button
                onClick={handleNext}
                disabled={currentIndex >= total - 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. SPLIT-VIEW: Panel Trái (hóa đơn) | Panel Phải (AI trích xuất) */}
      {total > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Panel TRÁI: Hóa đơn gốc */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Toolbar panel trái */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-500 font-medium ml-1">Trang 1/1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Bản gốc điện tử hợp lệ
                </span>
                <button className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-800 font-medium px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
                  <Download className="w-3 h-3" />
                  Tải file gốc
                </button>
              </div>
            </div>

            {/* Nội dung hóa đơn */}
            <div className="p-4 overflow-y-auto max-h-[600px]">
              <InvoiceDocument inv={current} />
            </div>
          </div>

          {/* Panel PHẢI: AI trích xuất */}
          <div className="overflow-y-auto max-h-[680px] pr-1">
            <InvoiceExtracted inv={current} onAccept={handleAccept} onReject={handleReject} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ScanLine className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">Không có hóa đơn nào trong mục này</p>
          <p className="text-slate-400 text-xs mt-1">Thử chọn tab khác hoặc tải lên hóa đơn mới.</p>
        </div>
      )}
    </div>
  );
};