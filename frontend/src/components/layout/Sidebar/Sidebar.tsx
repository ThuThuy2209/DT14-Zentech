import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Receipt,
  Users,
  Wallet,
  CalendarDays,
  Settings,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';
import { logout } from '../../../services/authService';
import './Sidebar.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenProfile, onLogout }) => {
  const [showLogoutMenu, setShowLogoutMenu] = useState<boolean>(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLogoutMenu(false);
      }
    };
    if (showLogoutMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutMenu]);

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'invoices', label: 'Chứng từ & Hóa đơn', icon: Receipt },
    { id: 'customers', label: 'Khách hàng & Hợp đồng', icon: Users },
    { id: 'finance', label: 'Thu chi & Công nợ', icon: Wallet },
    { id: 'tax-calendar', label: 'Lịch nghĩa vụ thuế', icon: CalendarDays },
    { id: 'copilot', label: 'Trợ lý AI Copilot', icon: Sparkles },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  const handleConfirmLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <aside className="layout-sidebar hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between h-screen sticky top-0 z-30 select-none">
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">OPC</span>
                <span className="text-base font-semibold text-blue-600">SmartOffice</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Dành cho OPC • v2.4</p>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-100 relative" ref={menuRef}>
          {showLogoutMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">Anh Minh</p>
                <p className="text-[11px] text-slate-500 truncate">minh@software.opc • Giám đốc</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowLogoutMenu(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Xem hồ sơ cá nhân</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLogoutMenu(false);
                  setActiveTab('settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Cài đặt hệ thống</span>
              </button>

              <div className="my-1 border-t border-slate-100"></div>

              <button
                type="button"
                onClick={() => {
                  setShowLogoutMenu(false);
                  setShowLogoutConfirmModal(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group">
            <div
              onClick={onOpenProfile}
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              title="Bấm để xem hồ sơ cá nhân Anh Minh"
            >
              <div className="relative shrink-0">
                <img
                  src="avatar.jpg"
                  alt="Anh Minh"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">Anh Minh</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[110px]">Minh Software (OPC)</p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowLogoutMenu((prev) => !prev);
              }}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                showLogoutMenu
                  ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-200'
                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50/80'
              }`}
              title="Bấm vào để hiện menu đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {showLogoutConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-rose-50/50">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Xác nhận đăng xuất</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi <strong className="text-slate-700">OPC SmartOffice</strong> không? Phiên làm việc của bạn sẽ được kết thúc an toàn.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirmModal(false)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-colors shadow-sm shadow-rose-600/30 cursor-pointer"
              >
                Đăng xuất ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
