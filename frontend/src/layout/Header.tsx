import React from 'react';
import { Search, Bell, Plus, Cpu } from 'lucide-react';

interface HeaderProps {
  onUploadInvoiceClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadInvoiceClick }) => {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between">
      {/* 1. Ô tìm kiếm đa năng */}
      <div className="relative w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm hóa đơn, hợp đồng, khách hàng..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 2. Khu vực trạng thái AI + Thông báo + Nút tải hóa đơn */}
      <div className="flex items-center gap-4">
        {/* Badge Trạng thái AI */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>Hệ thống AI: Hoạt động</span>
        </div>

        {/* Chuông thông báo (Có số 3 đỏ như thiết kế) */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Nút chính: Tải lên hóa đơn */}
        <button
          onClick={onUploadInvoiceClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tải lên hóa đơn</span>
        </button>
      </div>
    </header>
  );
};