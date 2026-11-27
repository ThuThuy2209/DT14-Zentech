import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Plus, Cpu, FileText, Mail, 
  X, ArrowRight, ShieldCheck, Users, Landmark, Zap, Sparkles, Command
} from 'lucide-react';

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

interface SearchItem {
  id: string;
  category: 'action' | 'invoice' | 'customer' | 'contract' | 'finance';
  categoryLabel: string;
  title: string;
  subtitle: string;
  targetTab: string;
  isAction?: boolean;
}

interface HeaderProps {
  onUploadInvoiceClick: () => void;
  onNavigate?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadInvoiceClick, onNavigate }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Danh mục dữ liệu tìm kiếm đa năng (Universal Search Database)
  const searchDatabase: SearchItem[] = [
    // Thao tác nhanh (Quick Actions)
    {
      id: 'act-upload',
      category: 'action',
      categoryLabel: 'Thao tác nhanh',
      title: 'Tải lên hóa đơn / chứng từ mới',
      subtitle: 'Tải tệp PDF/ảnh để AI trích xuất OCR tự động',
      targetTab: 'invoices',
      isAction: true,
    },
    {
      id: 'act-smartca',
      category: 'action',
      categoryLabel: 'Thao tác nhanh',
      title: 'Ký số hợp đồng qua VNPT SmartCA Sandbox',
      subtitle: 'Xác thực chữ ký số từ xa không cần USB Token',
      targetTab: 'customers',
    },
    {
      id: 'act-debt-email',
      category: 'action',
      categoryLabel: 'Thao tác nhanh',
      title: 'Soạn email tự động nhắc nợ quá hạn',
      subtitle: 'HITL AI: Sinh thư nhắc nợ cần người duyệt trước khi gửi',
      targetTab: 'finance',
    },
    {
      id: 'act-bank-match',
      category: 'action',
      categoryLabel: 'Thao tác nhanh',
      title: 'Đối soát sao kê ngân hàng tự động',
      subtitle: 'Quét tự động và đề xuất khớp nối giao dịch ngân hàng',
      targetTab: 'finance',
    },

    // Hóa đơn & Chứng từ
    {
      id: 'inv-000024',
      category: 'invoice',
      categoryLabel: 'Chứng từ & Hóa đơn',
      title: 'Hóa đơn #000024 - Cty TM Hoàng Gia',
      subtitle: '8.800.000 đ • Trùng lặp số hóa đơn (Cần duyệt)',
      targetTab: 'invoices',
    },
    {
      id: 'inv-000025',
      category: 'invoice',
      categoryLabel: 'Chứng từ & Hóa đơn',
      title: 'Hóa đơn #000025 - Sai mã số thuế người mua',
      subtitle: '12.500.000 đ • MST không khớp danh mục (Cần kiểm tra)',
      targetTab: 'invoices',
    },
    {
      id: 'inv-000001',
      category: 'invoice',
      categoryLabel: 'Chứng từ & Hóa đơn',
      title: 'Hóa đơn #000001 - Mua bản quyền phần mềm',
      subtitle: '15.000.000 đ • Đã thanh toán và ghi nhận chi phí',
      targetTab: 'invoices',
    },

    // Khách hàng & Hợp đồng
    {
      id: 'cust-zen',
      category: 'customer',
      categoryLabel: 'Khách hàng',
      title: 'Công ty Cổ phần Giải pháp Công nghệ ZEN',
      subtitle: 'MST: 0316889988 • Khách hàng VIP • Đã xác minh',
      targetTab: 'customers',
    },
    {
      id: 'cust-hoang-gia',
      category: 'customer',
      categoryLabel: 'Khách hàng',
      title: 'Công ty TNHH Thương mại Hoàng Gia',
      subtitle: 'MST: 0317654321 • Nhà cung cấp thiết bị văn phòng',
      targetTab: 'customers',
    },
    {
      id: 'cust-xanh',
      category: 'customer',
      categoryLabel: 'Khách hàng',
      title: 'Công ty TNHH Giải pháp Đổi mới Xanh',
      subtitle: 'MST: 0315897645 • Đối tác tiềm năng dịch vụ phần mềm',
      targetTab: 'customers',
    },
    {
      id: 'ctr-22',
      category: 'contract',
      categoryLabel: 'Hợp đồng & Báo giá',
      title: 'Hợp đồng HĐ-22/2026 - Triển khai phần mềm OPC',
      subtitle: '55.000.000 đ • Trạng thái: Chờ ký số VNPT SmartCA',
      targetTab: 'customers',
    },
    {
      id: 'quote-01',
      category: 'contract',
      categoryLabel: 'Hợp đồng & Báo giá',
      title: 'Báo giá BG-2026/01 - Dịch vụ bảo trì hệ thống',
      subtitle: '18.000.000 đ • Đã gửi email cho khách hàng',
      targetTab: 'customers',
    },

    // Tài chính & Ngân hàng
    {
      id: 'fin-vcb',
      category: 'finance',
      categoryLabel: 'Tài chính & Ngân hàng',
      title: 'Tài khoản Vietcombank (0071001234567)',
      subtitle: 'Số dư khả dụng: 142.000.000 đ • Tài khoản chính',
      targetTab: 'finance',
    },
    {
      id: 'fin-expense-server',
      category: 'finance',
      categoryLabel: 'Tài chính & Ngân hàng',
      title: 'Chi phí hạ tầng máy chủ Cloud & AI',
      subtitle: '4.500.000 đ/tháng • Chi phí định kỳ hàng tháng',
      targetTab: 'finance',
    },
  ];

  // Lọc kết quả tìm kiếm theo từ khóa
  const filteredResults = searchQuery.trim() === ''
    ? searchDatabase.slice(0, 5) // Khi chưa gõ gì: Hiện 5 gợi ý truy cập nhanh
    : searchDatabase.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Phím tắt toàn cục: Ctrl + K (hoặc Cmd + K) để mở tìm kiếm, Escape để đóng
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Đóng Search dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Click vào 1 mục tìm kiếm
  const handleSelectSearchItem = (item: SearchItem) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (item.isAction && item.id === 'act-upload') {
      onUploadInvoiceClick();
    } else if (onNavigate) {
      onNavigate(item.targetTab);
    }
  };

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
    <header className="hidden md:flex h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 items-center justify-between">
      {/* 1. Ô tìm kiếm đa năng (Spotlight Search) */}
      <div className="relative w-96" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Tìm kiếm hóa đơn, hợp đồng, khách hàng... (Ctrl+K)"
            className="w-full pl-10 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            )}
          </div>
        </div>

        {/* DROPDOWN KẾT QUẢ TÌM KIẾM (SPOTLIGHT POPUP) */}
        {isSearchOpen && (
          <div className="absolute left-0 top-full mt-2 w-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            {/* Header gợi ý */}
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {searchQuery.trim() === '' ? 'Gợi ý truy cập nhanh' : `Kết quả tìm kiếm (${filteredResults.length})`}
              </span>
              <span className="text-[10px] text-slate-400">Nhấn Esc để đóng</span>
            </div>

            {/* Danh sách kết quả */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 p-1.5">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSearchItem(item)}
                    className="p-2.5 hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.category === 'action'
                          ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
                          : item.category === 'invoice'
                          ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'
                          : item.category === 'customer'
                          ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                          : item.category === 'contract'
                          ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
                          : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                      }`}>
                        {item.category === 'action' ? (
                          <Zap className="w-4 h-4" />
                        ) : item.category === 'invoice' ? (
                          <FileText className="w-4 h-4" />
                        ) : item.category === 'customer' ? (
                          <Users className="w-4 h-4" />
                        ) : item.category === 'contract' ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : (
                          <Landmark className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                            {item.title}
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Không tìm thấy kết quả nào</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Thử tìm theo mã hóa đơn (#000024), tên khách hàng (ZEN, Hoàng Gia) hoặc hợp đồng.
                  </p>
                </div>
              )}
            </div>

            {/* Footer trợ giúp bàn phím */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-3">
              <div className="flex items-center gap-3">
                <span><kbd className="font-semibold text-slate-600">Enter</kbd> Chọn</span>
                <span><kbd className="font-semibold text-slate-600">Esc</kbd> Đóng</span>
              </div>
              <span className="text-slate-400 text-[10px]">OPC Universal Search</span>
            </div>
          </div>
        )}
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
