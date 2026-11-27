// src/components/settings/SettingsContent.tsx
import React from 'react';
import './SettingsContent.css';

interface SettingsContentProps {
  activeTab: 'profile' | 'rules' | 'sandbox';
  setActiveTab: (v: 'profile' | 'rules' | 'sandbox') => void;
  hitlEnabled: boolean;
  setHitlEnabled: (v: boolean) => void;
  debtThreshold: number;
  setDebtThreshold: (v: number) => void;
  vatRate: string;
  setVatRate: (v: string) => void;
  reconcileFrequency: string;
  setReconcileFrequency: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  representative: string;
  setRepresentative: (v: string) => void;
  position: string;
  setPosition: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  bankAccount: string;
  setBankAccount: (v: string) => void;
  toastMessage: string | null;
  onShowToast: (msg: string) => void;
  onCopyToClipboard: (text: string) => void;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  activeTab, setActiveTab,
  hitlEnabled, setHitlEnabled,
  debtThreshold, setDebtThreshold,
  vatRate, setVatRate,
  reconcileFrequency, setReconcileFrequency,
  companyName, setCompanyName,
  representative, setRepresentative,
  position, setPosition,
  phone, setPhone,
  address, setAddress,
  email, setEmail,
  bankAccount, setBankAccount,
  toastMessage, onShowToast, onCopyToClipboard,
}) => {
  // taxCode is read-only, kept as const
  const taxCode = '0319002001';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-800 font-sans">

      {/* Toast thông báo nhanh */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-sm font-semibold animate-fade-in">
          <span>✔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Trang & Nút Hành Động */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cài đặt &amp; Cấu hình Doanh nghiệp</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý thông tin pháp lý doanh nghiệp một người, thiết lập quy tắc trợ lý AI và tích hợp cổng dịch vụ số.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onShowToast('Đã tạo bản sao lưu dữ liệu hệ thống')}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Sao lưu dữ liệu</span>
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Đã lưu tất cả các thay đổi cấu hình')}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <span>✔</span>
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </div>

      {/* 2. Thanh Tabs Điều Hướng */}
      <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center space-x-1 w-fit border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏢</span>
          <span>Hồ sơ Doanh nghiệp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rules' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>✨</span>
          <span>Quy tắc Trợ lý AI &amp; Tự động hóa</span>
          <span className="bg-violet-100 text-violet-700 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">Mới</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sandbox' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🔌</span>
          <span>Kết nối Cổng Sandbox</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
        </button>
      </div>

      {/* TAB 1: HỒ SƠ DOANH NGHIỆP */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">🏛️</div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Thông tin Pháp lý &amp; Tổ chức</h3>
                <p className="text-xs text-slate-500">Thông tin dùng để in lên biên bản bàn giao, hóa đơn và khai thuế định kỳ</p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">● Doanh nghiệp độc lập (OPC)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên công ty đăng ký kinh doanh <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🏢</span>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Mã số thuế (MST) <span className="text-rose-500">*</span></label>
                  <span className="text-[11px] font-semibold text-emerald-600">✔ Đã xác thực Tổng cục Thuế</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-mono">123</span>
                  <input type="text" readOnly value={taxCode} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 cursor-not-allowed" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">ℹ Mã số thuế dùng để AI đối chiếu hóa đơn mua vào hợp lệ &amp; hợp pháp.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Người đại diện pháp luật <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">👤</span>
                  <input type="text" value={representative} onChange={(e) => setRepresentative(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Đồng thời là người nắm giữ chữ ký số doanh nghiệp</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chức vụ đại diện</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">💼</span>
                  <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Điện thoại liên hệ giao dịch</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">📞</span>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ trụ sở chính (theo GPKD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">📍</span>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Email nhận hóa đơn &amp; thuế <span className="text-rose-500">*</span></label>
                  <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">Email nhận cảnh báo thuế</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">@</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản ngân hàng thanh toán chính</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-700 font-bold text-xs">VCB</span>
                  <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onShowToast('Đã lưu thay đổi hồ sơ doanh nghiệp!')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>✔</span>
              <span>Lưu thay đổi hồ sơ</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: QUY TẮC TRỢ LÝ AI */}
      {activeTab === 'rules' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xl">🔮</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">Cấu hình an toàn &amp; Cơ chế phê duyệt của AI OPC SmartOffice</h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">🛡️ Bảo vệ tài chính</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Thiết lập ranh giới vận hành để AI luôn đóng vai trò người đồng hành cẩn trọng</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs mt-0.5 shrink-0">🛡️</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-slate-900">Kiểm soát con người nghiêm ngặt (Human-in-the-loop)</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hitlEnabled ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {hitlEnabled ? 'Đang Bật' : 'Đang Tắt'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Bắt buộc người dùng (Anh Minh) phê duyệt thủ công trước khi gửi email nhắc nợ hoặc chính thức ghi sổ kế toán vào hệ thống. AI không bao giờ tự ý phát hành chứng từ ra bên ngoài.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHitlEnabled(!hitlEnabled)}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${hitlEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${hitlEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
                  <span>📅</span>
                  <span>Ngưỡng cảnh báo công nợ</span>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                  <input
                    type="number"
                    value={debtThreshold}
                    onChange={(e) => setDebtThreshold(Number(e.target.value))}
                    className="w-14 text-sm font-bold text-blue-600 focus:outline-hidden"
                  />
                  <span className="text-xs text-slate-500">ngày quá hạn</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">Kích hoạt AI tự động soạn thảo email nhắc nợ đối tác lịch sự khi hóa đơn trễ hạn.</p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
                  <span>%</span>
                  <span>% Thuế suất GTGT mặc định</span>
                </div>
                <select value={vatRate} onChange={(e) => setVatRate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden shadow-2xs">
                  <option>10% (Dịch vụ &amp; Sản phẩm CNTT)</option>
                  <option>8% (Thuế suất ưu đãi theo NQ)</option>
                  <option>0% (Dịch vụ phần mềm xuất khẩu)</option>
                  <option>Không chịu thuế</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">Áp dụng tính trước cho các dự án tư vấn công nghệ và phát triển phần mềm mới.</p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
                  <span>🕒</span>
                  <span>Tần suất đối soát hóa đơn</span>
                </div>
                <select value={reconcileFrequency} onChange={(e) => setReconcileFrequency(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden shadow-2xs">
                  <option>Hàng ngày lúc 08:00 sáng</option>
                  <option>Mỗi 6 tiếng một lần</option>
                  <option>Mỗi tuần một lần (Thứ Hai)</option>
                  <option>Chỉ đối soát thủ công</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">Tự động kiểm tra tính hợp pháp trên hệ thống Cục Thuế và cập nhật số dư.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onShowToast('Đã cập nhật quy tắc an toàn cho Trợ lý AI!')}
              className="px-5 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <span>✨</span>
              <span>Cập nhật quy tắc AI</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: KẾT NỐI CỔNG SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg">🕸️</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">Trạng thái tích hợp Cổng dịch vụ công &amp; Ký số (Môi trường Sandbox)</h3>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">Phiên bản 2.4.0</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Không gian kiểm thử trước khi kích hoạt giao dịch chính thức với cơ quan Thuế</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Đang kết nối lại các cổng Sandbox: TẤT CẢ SẴN SÀNG ✔')}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors whitespace-nowrap"
            >
              <span>🔄</span>
              <span>Kiểm tra lại kết nối Sandbox</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: VNPT-CA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">VNPT</span>
                  <span className="text-xs font-bold text-slate-900">Cổng ký số Sandbox</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">● Đã kết nối sẵn sàng</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500"><span>Nhà cung cấp:</span><span className="font-semibold text-slate-800">VNPT-CA Cloud</span></div>
                <div className="flex justify-between text-slate-500"><span>Mã thiết bị:</span><span className="font-mono text-slate-800">TOKEN-MINH-2026</span></div>
                <div className="flex justify-between text-slate-500"><span>Hiệu lực đến:</span><span className="font-semibold text-slate-800">15/09/2028</span></div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
                <span>✔</span><span>Chứng thư hợp chuẩn Bộ TT&amp;TT</span>
              </div>
            </div>

            {/* Card 2: Hóa đơn điện tử */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">TCT</span>
                  <span className="text-xs font-bold text-slate-900">Hóa đơn điện tử</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">● Đã kết nối Cục Thuế</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500"><span>Tiêu chuẩn:</span><span className="font-semibold text-slate-800">NĐ 123/2020/NĐ-CP</span></div>
                <div className="flex justify-between text-slate-500"><span>Mẫu số ký hiệu:</span><span className="font-mono text-slate-800">1C26TMM</span></div>
                <div className="flex justify-between text-slate-500"><span>Truyền nhận dữ liệu:</span><span className="font-semibold text-slate-800">Trực tiếp T-VAN</span></div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
                <span>✔</span><span>Đồng bộ mã cơ quan thuế tức thì</span>
              </div>
            </div>

            {/* Card 3: Hộp thư chứng từ AI */}
            <div className="bg-gradient-to-br from-violet-50/60 to-purple-50/40 border border-violet-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-violet-600">✉️</span>
                  <span className="text-xs font-bold text-violet-950">Hộp thư chứng từ AI</span>
                </div>
                <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">Tự động nhận</span>
              </div>
              <div className="text-[11px] text-violet-800">Địa chỉ chuyên dụng cho đối tác gửi vào:</div>
              <div className="flex items-center justify-between bg-white border border-violet-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <span className="text-xs font-mono text-slate-700 truncate mr-2">inbox-ai@minhsoftware.solotech...</span>
                <button
                  type="button"
                  onClick={() => onCopyToClipboard('inbox-ai@minhsoftware.solotech.vn')}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  title="Sao chép email"
                >
                  📋
                </button>
              </div>
              <p className="text-[11px] text-violet-700/80 leading-relaxed pt-1">
                Chuyển tiếp hóa đơn PDF hoặc XML vào email này để AI tự động trích xuất và đưa vào danh sách chờ duyệt.
              </p>
            </div>
          </div>

          {/* Card Webhook & API Token */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-sm mt-0.5">{'</>'}</div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">API Token Doanh Nghiệp (Developer &amp; Webhook)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Khóa API dùng để tự động đẩy dữ liệu thanh toán từ tài khoản ngân hàng hoặc cổng Stripe/PayOS</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 select-none">
                ••••••••••••••••••••••••••••••••
              </span>
              <button
                type="button"
                onClick={() => onShowToast('Đã cấp mới API Token bí mật thành công!')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                Tạo mới
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
