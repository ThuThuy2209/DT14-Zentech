import React, { useState } from 'react';
import { logout } from '../services/authService';

interface ProfileViewProps {
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate, onLogout }) => {
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile data state
  const [fullName, setFullName] = useState('Nguyễn Văn Minh');
  const [phone, setPhone] = useState('028 3512 2001');
  const [email, setEmail] = useState('ketoan@minhsoftware.example');
  const [address, setAddress] = useState('Số 2 Võ Oanh, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại?')) {
      logout();
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-800 font-sans">
      
      {/* Toast thông báo nhanh */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-sm font-semibold animate-fade-in">
          <span>✔</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Banner Thông Tin Cá Nhân Anh Minh */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <img
              src="avatar.jpg"
              alt="Nguyễn Văn Minh"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100 shadow-md"
              onError={(e) => {
                // Fallback nếu chưa có file ảnh avatar.jpg
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback avatar nếu ảnh bị lỗi */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              NM
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] shadow-xs">
              ✔
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nguyễn Văn Minh (Anh Minh)</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chủ sở hữu & Giám đốc tại Minh Software
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
                ● Chủ doanh nghiệp một người (OPC)
              </span>
              <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-3 py-0.5 rounded-full border border-violet-200 flex items-center space-x-1">
                <span>✨</span>
                <span>Trợ lý AI Copilot đang kích hoạt</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors"
          >
            <span>📝</span>
            <span>Chỉnh sửa thông tin</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLicenseModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <span>📄</span>
            <span>Xem giấy phép ĐKKD điện tử</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Nội Dung Chính: Cột Trái (Hồ Sơ & Bảo Mật) & Cột Phải (Năng Suất & Quyền Lực) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ===================== CỘT TRÁI (8 / 12 CỘT) ===================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Khối 1: Thông tin cá nhân & Người đại diện pháp luật */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 text-base">🪪</span>
                <h2 className="text-sm font-bold text-slate-900">Thông tin cá nhân & Người đại diện pháp luật</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Dữ liệu chuẩn hóa cấp Nhà nước
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">HỌ VÀ TÊN ĐẦY ĐỦ</label>
                <div className="text-sm font-bold text-slate-900">{fullName}</div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CHỨC DANH PHÁP NHÂN</label>
                <div className="text-sm font-bold text-slate-900">Người đại diện theo pháp luật kiêm Giám đốc</div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">SỐ CCCD / MÃ ĐỊNH DANH CÁ NHÂN</label>
                <div className="text-sm font-bold font-mono text-slate-900">07909500****</div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ● Đã xác thực điện tử qua VNeID
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">SỐ ĐIỆN THOẠI LIÊN LẠC</label>
                <div className="text-sm font-bold text-slate-900">{phone}</div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">THƯ ĐIỆN TỬ CÔNG TÁC</label>
                <div className="text-sm font-bold text-slate-900">{email}</div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">PHÁP NHÂN TRỰC THUỘC</label>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">Công ty TNHH MTV Minh Software</span>
                <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                  Mã số thuế: 0319002001
                </span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ĐỊA CHỈ TRỤ SỞ CÔNG TÁC CHÍNH</label>
              <div className="text-sm font-medium text-slate-800 leading-relaxed">{address}</div>
            </div>
          </div>

          {/* Khối 2: Bảo mật & Phê duyệt tài chính */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <span className="text-blue-600 text-base">🛡️</span>
              <h2 className="text-sm font-bold text-slate-900">Bảo mật & Phê duyệt tài chính</h2>
            </div>

            {/* Mật khẩu */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-start space-x-3">
                <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-mono text-sm shrink-0">
                  •••
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Mật khẩu tài khoản quản trị</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Đổi lần cuối cách đây 20 ngày • Độ mạnh: <span className="text-emerald-700 font-semibold">Tối ưu</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors"
              >
                Đổi mật khẩu
              </button>
            </div>

            {/* Xác thực 2 lớp 2FA */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-start space-x-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm shrink-0">
                  📱
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-slate-900">Xác thực hai lớp (2FA)</h4>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                      ● Đang BẬT qua Google Authenticator
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-lg">
                    Bắt buộc sử dụng mã OTP khi phê duyệt xuất tiền ngân hàng hoặc ký số hợp đồng thương mại điện tử.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Mã QR cấu hình 2FA đã được tạo lại')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors shrink-0"
              >
                Cấu hình lại
              </button>
            </div>

            {/* Phiên làm việc */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-start space-x-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0">
                  💻
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-slate-900">Phiên làm việc hiện tại</h4>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full">
                      ● Trực tuyến
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Trình duyệt Chrome trên máy tính Windows • TP. Hồ Chí Minh • IP Nội bộ tin cậy: 118.69.182.***
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors shrink-0"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* ===================== CỘT PHẢI (4 / 12 CỘT) ===================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Chỉ số năng suất OPC */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">CHỈ SỐ NĂNG SUẤT OPC</span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Mục tiêu BRD
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">Thời gian dôi dư nhờ Trợ lý AI</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-4xl font-black text-blue-600 tracking-tight">2.8</span>
                <span className="text-2xl font-bold text-blue-600">Ngày</span>
                <span className="text-xs text-slate-400 font-medium ml-1">tiết kiệm / tháng</span>
              </div>
            </div>

            {/* Thanh tiến độ */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Làm thủ tục hành chính</span>
                <span className="text-blue-600">Giảm 88%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[88%] transition-all duration-500"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                <span>Trước đây: 3.5 ngày</span>
                <span>Hiện tại: 4.5 giờ / tháng</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px]">
                <span>✔</span>
                <span>Đạt tiêu chuẩn kiểm định KPI01 SoloTech</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                AI tự động bóc tách hoá đơn GTGT, tính nháp bảng kê thuế tạm tính và chủ động soạn thảo email nhắc nợ định kỳ.
              </p>
            </div>
          </div>

          {/* Card 2: Quyền điều hành của Anh Minh */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3.5">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quyền điều hành của Anh Minh</h3>
              <span className="text-sm">👤⚙️</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span>📑</span>
                  <span className="text-slate-600">Hóa đơn đã kiểm tra</span>
                </div>
                <span className="font-bold text-slate-900">24 (100% duyệt)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span>🖋️</span>
                  <span className="text-slate-600">Hợp đồng đang giám sát</span>
                </div>
                <span className="font-bold text-slate-900">05 hợp đồng</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span>💰</span>
                  <span className="text-slate-600">Doanh thu kiểm soát</span>
                </div>
                <span className="font-bold text-blue-600">85.000.000 đ</span>
              </div>
            </div>
          </div>

          {/* Card 3: Cam kết quyền kiểm soát tuyệt đối */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 border border-blue-200/80 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
              <span>🛡️</span>
              <span>Cam kết quyền kiểm soát tuyệt đối</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              100% quyết định pháp lý và giao dịch tài chính đều qua tay Anh Minh duyệt. Cơ chế AI chỉ hỗ trợ tổng hợp, bảo đảm an toàn pháp lý cao nhất cho chủ doanh nghiệp một người.
            </p>
          </div>

        </div>

      </div>

      {/* ===================== MODAL CHỈNH SỬA THÔNG TIN ===================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-fade-in space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Chỉnh sửa thông tin cá nhân</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại liên lạc</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email công tác</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  showToast('Đã lưu thông tin cá nhân thành công!');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL ĐỔI MẬT KHẨU ===================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-fade-in space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Đổi mật khẩu tài khoản quản trị</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input type="password" placeholder="••••••••••••" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
                <input type="password" placeholder="Tối thiểu 6 ký tự" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" placeholder="Nhập lại mật khẩu mới" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  showToast('Đã đổi mật khẩu thành công!');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL GIẤY PHÉP ĐKKD ĐIỆN TỬ ===================== */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-8 animate-fade-in space-y-5">
            <div className="text-center border-b pb-4 border-slate-200">
              <p className="text-xs uppercase font-bold text-slate-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="text-[11px] font-semibold text-slate-400">Độc lập - Tự do - Hạnh phúc</p>
              <h3 className="text-base font-bold text-blue-900 mt-2 uppercase">GIẤY CHỨNG NHẬN ĐĂNG KÝ DOANH NGHIỆP</h3>
              <p className="text-xs text-slate-600">CÔNG TY TRÁCH NHIỆM HỮU HẠN MỘT THÀNH VIÊN</p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p><strong>Mã số doanh nghiệp:</strong> 0319002001 do Sở KH&ĐT TP.HCM cấp</p>
              <p><strong>Tên công ty:</strong> CÔNG TY TNHH MỘT THÀNH VIÊN MINH SOFTWARE</p>
              <p><strong>Địa chỉ trụ sở:</strong> Số 2 Võ Oanh, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh</p>
              <p><strong>Người đại diện theo pháp luật:</strong> NGUYỄN VĂN MINH (Giám đốc)</p>
              <p><strong>Ngành nghề chính:</strong> Lập trình máy vi tính, dịch vụ tư vấn CNTT (Mã ngành: 6201)</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-[11px] text-emerald-600 font-semibold">✔ Bản sao điện tử hợp lệ từ Cổng Dịch vụ công Quốc gia</span>
              <button
                type="button"
                onClick={() => setShowLicenseModal(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
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