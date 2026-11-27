import React, { useState } from 'react';
import { ShieldCheck, Bell, AlertTriangle, FileText, X } from 'lucide-react';

interface MobileTopBarProps {
  onOpenProfile?: () => void;
  onNavigate?: (tab: string) => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({ onOpenProfile, onNavigate }) => {
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Hóa đơn #000024 - Trùng lặp',
      desc: 'Nghi vấn trùng số với chứng từ Quý 3',
      urgent: true,
      tab: 'invoices',
    },
    {
      id: 'n2',
      title: 'Hóa đơn #000025 - Sai MST',
      desc: 'MST người mua không khớp 0319002001',
      urgent: true,
      tab: 'invoices',
    },
    {
      id: 'n3',
      title: 'Hạn đóng BHXH & Thuế GTGT',
      desc: 'Còn 3 ngày đến hạn nộp 20/11/2026',
      urgent: false,
      tab: 'tax-calendar',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-3 pb-2.5 shadow-2xs">
      {/* 1. Hàng thương hiệu & Thông báo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 tracking-tight">OPC SmartOffice</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                ENT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Dashboard</p>
          </div>
        </div>

        {/* Nút chuông thông báo & Avatar */}
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => setShowNotificationModal(true)}
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 relative hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          <button 
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-500/30 hover:ring-blue-600 transition-all cursor-pointer"
            title="Hồ sơ cá nhân Anh Minh"
          >
            <img 
              src="avatar.jpg" 
              alt="Anh Minh" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback nếu ảnh không tải được
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
              }}
            />
          </button>
        </div>
      </div>

      {/* 2. Hàng trạng thái (Status Pills) */}
      <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar text-[10px] font-bold">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Hôm nay, 17 Tháng 11
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          HITL GUARD: ACTIVE
        </span>
      </div>

      {/* Modal Thông báo nhanh trên Mobile */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-5 space-y-3 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Cảnh báo cần kiểm tra (3)</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {notifications.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setShowNotificationModal(false);
                    onNavigate?.(item.tab);
                  }}
                  className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      {item.urgent ? (
                        <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                      ) : (
                        <FileText className="w-3 h-3 text-blue-500 shrink-0" />
                      )}
                      <span>{item.title}</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-600">Xử lý →</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowNotificationModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
