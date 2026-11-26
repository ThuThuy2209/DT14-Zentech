import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, Cpu, FileText, AlertTriangle, CheckCircle2, Mail, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'invoice_duplicate' | 'invoice_tax' | 'debt_overdue' | 'contract_sign';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  targetTab: string;
  priority: 'high' | 'medium' | 'info';
}

interface HeaderProps {
  onUploadInvoiceClick: () => void;
  onNavigate?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadInvoiceClick, onNavigate }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // Danh sách thông báo thực tế dựa trên các chứng từ và cảnh báo của hệ thống
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'invoice_duplicate',
      title: 'Hóa đơn #000024 bị trùng lặp',
      description: 'Phát hiện số hóa đơn trùng lặp từ Công ty TNHH TM Hoàng Gia.',
      time: '10 phút trước',
      isRead: false,
      targetTab: 'invoices',
      priority: 'high',
    },
    {
      id: 'notif-2',
      type: 'invoice_tax',
      title: 'Hóa đơn #000025 sai MST người mua',
      description: 'MST 9999999999 không khớp với danh mục khách hàng đã xác minh.',
      time: '45 phút trước',
      isRead: false,
      targetTab: 'invoices',
      priority: 'high',
    },
    {
      id: 'notif-3',
      type: 'debt_overdue',
      title: 'Công nợ quá hạn 30 ngày',
      description: 'Cty CP Phát triển Hoàng Phúc chưa thanh toán đợt 2 (18.700.000 đ).',
      time: '2 giờ trước',
      isRead: false,
      targetTab: 'finance',
      priority: 'medium',
    },
    {
      id: 'notif-4',
      type: 'contract_sign',
      title: 'Hợp đồng HĐ-22/2026 chờ ký số',
      description: 'Biên bản nghiệm thu đợt 1 đã sẵn sàng ký đối soát VNPT SmartCA.',
      time: 'Hôm nay',
      isRead: true,
      targetTab: 'customers',
      priority: 'info',
    },
  ]);

  // Đếm số lượng thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Click vào 1 thông báo
  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setIsNotificationOpen(false);
    if (onNavigate) {
      onNavigate(notif.targetTab);
    }
  };

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

        {/* Chuông thông báo (Có dropdown tương tác và số lượng thật) */}
        <div className="relative" ref={notificationRef}>
          <button 
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer ${
              isNotificationOpen ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500/20' : ''
            }`}
            title="Xem danh sách thông báo & cảnh báo"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN MENU THÔNG BÁO */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* Header của Popup */}
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">Thông báo & Cảnh báo</h3>
                  {unreadCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                      {unreadCount} mới
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Đã đọc hết
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>

              {/* Danh sách thông báo */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                      !notif.isRead ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    {/* Icon tương ứng với loại thông báo */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.priority === 'high' 
                        ? 'bg-rose-50 text-rose-600' 
                        : notif.priority === 'medium'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {notif.type === 'invoice_duplicate' || notif.type === 'invoice_tax' ? (
                        <FileText className="w-4 h-4" />
                      ) : notif.type === 'debt_overdue' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>

                    {/* Nội dung thông báo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs truncate ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {notif.description}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer của Popup */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationOpen(false);
                    if (onNavigate) onNavigate('dashboard');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem tất cả cảnh báo trên Tổng quan</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nút chính: Tải lên hóa đơn */}
        <button
          onClick={onUploadInvoiceClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tải lên hóa đơn</span>
        </button>
      </div>
    </header>
  );
};
