import React, { useState } from 'react';
import { Lock, AtSign, Eye, EyeOff, ShieldCheck, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { login } from '../services/authService';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Gọi hàm login từ authService
    const res = await login({ email, password });

    setIsLoading(false);

    if (res.success) {
      // Đăng nhập thành công -> vào Dashboard
      if (onLoginSuccess) onLoginSuccess();
    } else {
      // Thất bại -> hiển thị thông báo lỗi
      setErrorMessage(res.message || 'Đăng nhập không thành công');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex flex-col justify-between p-6 sm:p-10 font-sans antialiased text-slate-800">
      
      {/* 1. Header trên cùng */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              OPC <span className="text-blue-600">SmartOffice</span>
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-200/50">
              Dành cho OPC
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Máy chủ Cục Thuế & eTax: <strong className="text-emerald-700 font-semibold">Sẵn sàng</strong></span>
          </div>
          <a 
            href="#support" 
            onClick={(e) => e.preventDefault()}
            className="text-slate-500 hover:text-blue-600 transition-colors hidden sm:inline-block"
          >
            Hỗ trợ kỹ thuật
          </a>
        </div>
      </header>

      {/* 2. Khối Card đăng nhập chính giữa */}
      <main className="flex-1 flex items-center justify-center my-8">
        <div className="w-full max-w-[460px] bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 transition-all">
          
          {/* Icon khóa */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          {/* Tiêu đề */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Đăng nhập OPC SmartOffice
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Văn phòng số thông minh cho doanh nghiệp một người
            </p>
          </div>

                    {/* Thông báo lỗi nếu đăng nhập thất bại */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <div>{errorMessage}</div>
                
                {/* Nút cứu cánh cho Frontend Dev khi BE/Database của bạn khác chưa sẵn sàng */}
                <button
                  type="button"
                  onClick={() => onLoginSuccess && onLoginSuccess()}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  👉 Bấm vào đây để vào thẳng Dashboard (Chế độ Demo Frontend)
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Trường Tên đăng nhập hoặc Email */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600 uppercase mb-2">
              TÊN ĐĂNG NHẬP HOẶC EMAIL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin hoặc ketoan@minhsoftware.example"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>

            {/* Trường Mật khẩu */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600 uppercase mb-2">
                MẬT KHẨU
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ & Quên mật khẩu */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-slate-600 font-medium">Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => e.preventDefault()}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Nút đăng nhập */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Đăng nhập vào hệ thống</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Banner bảo mật */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Bảo mật tài chính với cơ chế kiểm duyệt <span className="text-slate-700 font-semibold">Human-in-the-loop</span>
            </p>
          </div>

        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 pt-4 border-t border-slate-200/60">
        <div>
          © 2026 OPC SmartOffice Platform. Bản quyền thuộc <span className="text-slate-600 font-medium">Minh Software & OPC Solutions</span>.
        </div>
        <div className="flex items-center gap-6 text-slate-500">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">
            Chính sách bảo mật dữ liệu thuế
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">
            Điều khoản dịch vụ
          </a>
          <a href="#standards" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">
            Chuẩn Nghị định 123/2020/NĐ-CP
          </a>
        </div>
      </footer>

    </div>
  );
};