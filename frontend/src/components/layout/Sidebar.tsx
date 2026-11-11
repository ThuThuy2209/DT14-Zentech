import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Receipt, 
  Users, 
  Wallet, 
  CalendarDays, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenProfile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'copilot', label: 'Trợ lý AI Copilot', icon: Sparkles },
    { id: 'invoices', label: 'Chứng từ & Hóa đơn', icon: Receipt },
    { id: 'customers', label: 'Khách hàng & Hợp đồng', icon: Users },
    { id: 'finance', label: 'Thu chi & Công nợ', icon: Wallet },
    { id: 'tax-calendar', label: 'Lịch nghĩa vụ thuế', icon: CalendarDays },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* 1. Logo Thương hiệu OPC SmartOffice */}
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

        {/* 2. Danh mục Menu điều hướng */}
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

      {/* 3. Khối Người dùng Anh Minh (Bấm vào xem trang cá nhân) */}
      <div className="p-3 border-t border-slate-100">
        <div 
          onClick={onOpenProfile}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors group"
          title="Bấm để xem hồ sơ cá nhân Anh Minh"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="avatar.jpg"
                alt="Anh Minh"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Anh Minh</p>
              <p className="text-[11px] text-slate-400 truncate max-w-[110px]">Minh Software (OPC)</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </aside>
  );
};