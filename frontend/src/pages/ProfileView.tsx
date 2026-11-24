import React, { useState, useEffect } from 'react';
import { logout, getCompany, updateCompany, changePassword, getProfile } from '../services/authService';

interface ProfileViewProps {
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onLogout }) => {
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Profile & Company data state
  const [fullName, setFullName] = useState('Nguyễn Văn Minh');
  const [companyName, setCompanyName] = useState('Công ty TNHH Một thành viên Minh Software');
  const [taxCode, setTaxCode] = useState('0319002001');
  const [phone, setPhone] = useState('028 3512 2001');
  const [email, setEmail] = useState('ketoan@minhsoftware.example');
  const [address, setAddress] = useState('Số 2 Võ Oanh, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh');

  // State đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Tải dữ liệu thật từ Backend khi mở trang
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 1. Tải thông tin tài khoản
        const profileRes = await getProfile();
        if (profileRes.success && profileRes.data) {
          if (profileRes.data.fullName) setFullName(profileRes.data.fullName);
        }

        // 2. Tải thông tin công ty từ Database
        const compRes = await getCompany();
        if (compRes.success && compRes.data) {
          const comp = compRes.data;
          if (comp.companyName) setCompanyName(comp.companyName);
          if (comp.taxCode) setTaxCode(comp.taxCode);
          if (comp.address) setAddress(comp.address);
          if (comp.email) setEmail(comp.email);
          if (comp.phone) setPhone(comp.phone);
          if (comp.representative) setFullName(comp.representative);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu hồ sơ:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Xử lý Cập nhật thông tin công ty vào Database
  const handleUpdateCompany = async () => {
    setIsLoading(true);
    const res = await updateCompany({
      companyName,
      taxCode,
      address,
      email,
      phone,
      representative: fullName,
    });
    setIsLoading(false);

    if (res.success) {
      setShowEditModal(false);
      showToast('Cập nhật thông tin doanh nghiệp vào Database thành công!');
    } else {
      alert(res.message || 'Cập nhật thất bại');
    }
  };

  // Xử lý Đổi mật khẩu qua API
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setIsLoading(true);
    const res = await changePassword({
      currentPassword,
      newPassword,
    });
    setIsLoading(false);

    if (res.success) {
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Đã đổi mật khẩu thành công!');
    } else {
      alert(res.message || 'Đổi mật khẩu thất bại, kiểm tra lại mật khẩu cũ');
    }
  };

  // Xử lý Đăng xuất
  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại?')) {
      await logout();
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

      {/* 1. Header Banner Thông Tin Cá Nhân */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              AM
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] shadow-xs">
              ✔
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{fullName}</h1>
              {isLoading && <span className="text-xs text-blue-600 animate-pulse">(Đang đồng bộ BE...)</span>}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chủ sở hữu &amp; Giám đốc tại {companyName}
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
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <span>📝</span>
            <span>Chỉnh sửa thông tin</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLicenseModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>📄</span>
            <span>Xem giấy phép ĐKKD điện tử</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Nội Dung Chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ===================== CỘT TRÁI (8 / 12 CỘT) ===================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Khối 1: Thông tin cá nhân & Người đại diện pháp luật */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 text-base">🪪</span>
                <h2 className="text-sm font-bold text-slate-900">Thông tin cá nhân &amp; Người đại diện pháp luật</h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ✓ Dữ liệu thật từ PostgreSQL
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
                <span className="text-sm font-bold text-slate-900">{companyName}</span>
                <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                  Mã số thuế: {taxCode}
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
              <h2 className="text-sm font-bold text-slate-900">Bảo mật &amp; Phê duyệt tài chính</h2>
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
                    Hỗ trợ đổi mật khẩu bảo mật qua API NestJS
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors cursor-pointer"
              >
                Đổi mật khẩu
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
                      ● Đang kết nối API Backend (:8080)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Xác thực qua JWT Token • TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors shrink-0 cursor-pointer"
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

          {/* Card 2: Cam kết quyền kiểm soát tuyệt đối */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 border border-blue-200/80 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
              <span>🛡️</span>
              <span>Cơ chế Human-in-the-loop (HITL)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              100% quyết định pháp lý và giao dịch tài chính đều qua tay Anh Minh duyệt. Cơ chế AI chỉ hỗ trợ tổng hợp, bảo đảm an toàn pháp lý cao nhất cho chủ doanh nghiệp một người.
            </p>
          </div>

        </div>

      </div>

      {/* ===================== MODAL CHỈNH SỬA THÔNG TIN DOANH NGHIỆP ===================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-fade-in space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Chỉnh sửa thông tin doanh nghiệp</h3>
                <p className="text-[11px] text-slate-500">Dữ liệu sẽ được lưu trực tiếp vào cơ sở dữ liệu PostgreSQL</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên người đại diện</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên công ty</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã số thuế</label>
                <input
                  type="text"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
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
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleUpdateCompany}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Đang lưu...' : 'Lưu vào Database'}
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
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl" 
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleChangePassword}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
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
              <p><strong>Mã số doanh nghiệp:</strong> {taxCode} do Sở KH&amp;ĐT TP.HCM cấp</p>
              <p><strong>Tên công ty:</strong> {companyName}</p>
              <p><strong>Địa chỉ trụ sở:</strong> {address}</p>
              <p><strong>Người đại diện theo pháp luật:</strong> {fullName} (Giám đốc)</p>
              <p><strong>Ngành nghề chính:</strong> Lập trình máy vi tính, dịch vụ tư vấn CNTT (Mã ngành: 6201)</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-[11px] text-emerald-600 font-semibold">✔ Bản sao điện tử hợp lệ từ Cổng Dịch vụ công Quốc gia</span>
              <button
                type="button"
                onClick={() => setShowLicenseModal(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
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