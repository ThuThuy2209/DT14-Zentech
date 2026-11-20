import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  History, 
  Settings, 
  Trash2, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Lock, 
  Plus, 
  Clock, 
  X, 
  Cpu, 
  FileText, 
  CreditCard, 
  Users, 
  RotateCcw,
} from 'lucide-react';

interface CopilotViewProps {
  onNavigate?: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  time: string;
  text?: string;
  type?: 'text' | 'finance_summary' | 'tax_estimate';
  data?: any;
}

interface HistorySession {
  id: string;
  title: string;
  date: string;
  category: string;
  badgeColor: string;
  messageCount: number;
  preview: string;
  messages: Message[];
}

export const CopilotView: React.FC<CopilotViewProps> = ({ onNavigate }) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'draft' | 'sent'>('draft');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // States cho 2 Modal mới
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'sources' | 'model' | 'privacy'>('sources');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Cấu hình dữ liệu AI mặc định
  const [aiSettings, setAiSettings] = useState({
    // 1. Nguồn dữ liệu kết nối
    sourceInvoices: true,
    sourceBanking: true,
    sourceCustomers: true,
    sourceTaxReports: true,
    // 2. Mô hình & Tham số
    selectedModel: 'gemini-1.5-pro',
    temperature: 0.2,
    accountingStandard: 'TT133',
    maxTokens: 2048,
    // 3. Bảo mật & HITL
    anonymizePII: true,
    requireHITL: true,
    auditLogging: true,
  });

  // Danh sách hội thoại mặc định ban đầu
  const defaultMessages: Message[] = [
    {
      id: 'm1',
      sender: 'user',
      time: '09:15',
      text: 'Tóm tắt tình hình tài chính tuần này và kiểm tra công nợ giúp tôi.'
    },
    {
      id: 'm2',
      sender: 'ai',
      time: '09:16',
      type: 'finance_summary'
    },
    {
      id: 'm3',
      sender: 'user',
      time: '09:18',
      text: 'Thuế GTGT quý 4 này ước tính phải nộp bao nhiêu?'
    },
    {
      id: 'm4',
      sender: 'ai',
      time: '09:19',
      type: 'tax_estimate'
    }
  ];

  const [messages, setMessages] = useState<Message[]>(defaultMessages);

  // Danh sách lịch sử các phiên câu hỏi
  const [chatHistory, setChatHistory] = useState<HistorySession[]>([
    {
      id: 'h1',
      title: 'Tóm tắt tình hình tài chính tuần và kiểm tra công nợ',
      date: 'Hôm nay, 09:15',
      category: 'Tài chính',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      messageCount: 4,
      preview: 'Dòng tiền khả dụng: 142.000.000 đ. Đủ chi trả vận hành trong 4 tháng tới...',
      messages: defaultMessages
    },
    {
      id: 'h2',
      title: 'Ước tính thuế GTGT Quý 4/2026 theo Mẫu 01/GTGT',
      date: 'Hôm nay, 09:18',
      category: 'Thuế eTax',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      messageCount: 2,
      preview: 'Ước tính số thuế phát sinh Quý 4 khoảng 3.500.000 đ từ 23 hóa đơn hợp lệ...',
      messages: [
        {
          id: 'h2-1',
          sender: 'user',
          time: '09:18',
          text: 'Thuế GTGT quý 4 này ước tính phải nộp bao nhiêu?'
        },
        {
          id: 'h2-2',
          sender: 'ai',
          time: '09:19',
          type: 'tax_estimate'
        }
      ]
    },
    {
      id: 'h3',
      title: 'Phân tích biên lợi nhuận hợp đồng Công ty Hoàng Gia',
      date: 'Hôm qua, 15:30',
      category: 'Hợp đồng',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      messageCount: 2,
      preview: 'Hợp đồng thiết kế website 8.800.000 đ đạt tỷ suất lợi nhuận ròng 68%...',
      messages: [
        {
          id: 'h3-1',
          sender: 'user',
          time: '15:30',
          text: 'Phân tích biên lợi nhuận hợp đồng Công ty Hoàng Gia giúp tôi.'
        },
        {
          id: 'h3-2',
          sender: 'ai',
          time: '15:31',
          text: 'Dạ anh Minh, Hợp đồng Hoàng Gia (8.800.000 đ đã VAT) có chi phí máy chủ và nhân sự trực tiếp là 2.800.000 đ. Lợi nhuận gộp đạt 5.200.000 đ (biên lợi nhuận 65%), cao hơn trung bình ngành 12%.'
        }
      ]
    },
    {
      id: 'h4',
      title: 'Rà soát 25 hóa đơn đầu vào quý 3 tìm lỗi rủi ro',
      date: '14/11/2026',
      category: 'Hóa đơn',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      messageCount: 2,
      preview: 'Phát hiện 1 hóa đơn nghi vấn trùng số từ NCC máy chủ và 1 hóa đơn sai MST...',
      messages: [
        {
          id: 'h4-1',
          sender: 'user',
          time: '10:05',
          text: 'Rà soát 25 hóa đơn đầu vào xem có hóa đơn nào bị rủi ro thuế không?'
        },
        {
          id: 'h4-2',
          sender: 'ai',
          time: '10:06',
          text: 'Hệ thống đã quét 25 hóa đơn: 23 hóa đơn hợp lệ. Phát hiện hóa đơn #000001 NCC máy chủ nghi vấn trùng số khấu trừ và hóa đơn #000025 sai lệch MST bên mua. Đã gắn cờ Cần duyệt.'
        }
      ]
    },
    {
      id: 'h5',
      title: 'Soạn thảo email đôn đốc công nợ đối tác ABC (18 triệu)',
      date: '12/11/2026',
      category: 'Công nợ',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      messageCount: 2,
      preview: 'Đã tạo bản thảo email nhắc nợ quá hạn 30 ngày với văn phong lịch sự, kiên quyết...',
      messages: [
        {
          id: 'h5-1',
          sender: 'user',
          time: '14:20',
          text: 'Soạn giúp tôi email đôn đốc công nợ Công ty ABC số tiền 18 triệu.'
        },
        {
          id: 'h5-2',
          sender: 'ai',
          time: '14:21',
          text: 'Dạ, em đã tạo sẵn thư nhắc nợ HĐ-02 gửi đến ketoan@abc.com, số tiền 18.000.000 đ, gia hạn trước ngày 20/11. Anh có thể xem lại và duyệt phát hành ngay.'
        }
      ]
    }
  ]);

  const quickPrompts = [
    { label: 'Báo cáo dòng tiền tháng này', icon: '📊' },
    { label: 'Lọc các hóa đơn chưa có mã CQT', icon: '⚡' },
    { label: 'Kiểm tra rủi ro mã số thuế đối tác', icon: '🛡️' },
    { label: 'Top chi phí tuần', icon: '💰' }
  ];

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const newMsgId = Date.now().toString();
    const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: newMsgId,
      sender: 'user',
      time: currentTime,
      text: text
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');

    // Phản hồi giả lập thông minh của AI Copilot
    setTimeout(() => {
      let aiResponse: Message;
      const lower = text.toLowerCase();

      if (lower.includes('dòng tiền') || lower.includes('chi phí')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          text: 'Dạ anh Minh, tổng dòng tiền khả dụng hiện tại là 142.000.000 đ. Chi phí vận hành tháng 11 ước tính 35.000.000 đ, tỷ lệ an toàn vốn đạt 4.0 tháng dự phòng.'
        };
      } else if (lower.includes('mã cqt') || lower.includes('hóa đơn')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          text: 'Hệ thống đã rà soát 25 hóa đơn: Có 23 hóa đơn đã được cấp mã CQT hợp lệ. Riêng hóa đơn #000001 NCC máy chủ đang chờ giải trình trùng số và hóa đơn #000025 lệch mã số thuế.'
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          text: `Dạ em đã ghi nhận yêu cầu: "${text}". Dữ liệu kế toán thời gian thực của Minh Software đang được đồng bộ và phản hồi ngay theo chuẩn Thông tư 133.`
        };
      }
      setMessages((prev) => [...prev, aiResponse]);
    }, 700);
  };

  const handleClearChat = () => {
    if (window.confirm('Bạn có chắc muốn xóa lịch sử đoạn chat phiên làm việc hiện tại?')) {
      setMessages([]);
    }
  };

  // Mở lại một phiên trong lịch sử
  const handleLoadSession = (session: HistorySession) => {
    setMessages(session.messages);
    setShowHistoryModal(false);
  };

  // Tạo cuộc trò chuyện mới
  const handleStartNewChat = () => {
    setMessages([
      {
        id: 'new-welcome',
        sender: 'ai',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        text: 'Chào anh Minh! Em là Trợ lý AI OPC SmartOffice. Phiên làm việc mới đã sẵn sàng, anh muốn em hỗ trợ đối soát sổ sách, dòng tiền hay rà soát thuế?'
      }
    ]);
    setShowHistoryModal(false);
  };

  // Xóa 1 phiên trong lịch sử
  const handleDeleteHistorySession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Lưu cài đặt AI
  const handleSaveSettings = () => {
    setSaveSuccessMsg('Đã lưu cấu hình AI Copilot thành công!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      setShowSettingsModal(false);
    }, 1200);
  };

  // Lọc danh sách lịch sử theo từ khóa
  const filteredHistory = chatHistory.filter((item) =>
    item.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.category.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 text-slate-800">
      {/* 1. Header Trợ lý AI Copilot */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Trợ lý AI OPC SmartOffice (OPC Copilot)</h2>
              <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full border border-violet-200 uppercase tracking-wider">
                v2.4 PRO
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-600 font-medium">Trực tuyến & Kết nối dữ liệu sổ sách thời gian thực</span>
              <span>•</span>
              <span>Đồng bộ 3 phút trước</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* NÚT MỞ MODAL LỊCH SỬ CÂU HỎI */}
          <button 
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Lịch sử câu hỏi</span>
            <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-600 text-[10px] rounded-full font-bold">
              {chatHistory.length}
            </span>
          </button>

          {/* NÚT MỞ MODAL CÀI ĐẶT DỮ LIỆU AI */}
          <button 
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Cài đặt dữ liệu AI</span>
          </button>

          {/* NÚT XÓA ĐOẠN CHAT HIỆN TẠI */}
          <button 
            type="button"
            onClick={handleClearChat}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Xóa đoạn chat</span>
          </button>
        </div>
      </div>

      {/* 2. Nội dung luồng trò chuyện */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Phân cách phiên làm việc */}
        <div className="flex items-center justify-center">
          <span className="bg-slate-200/80 text-slate-600 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Hôm nay • Phiên làm việc tài khóa Q4
          </span>
        </div>

        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end items-end space-x-2">
                <div className="flex flex-col items-end max-w-xl">
                  <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-none shadow-xs text-sm font-medium leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1 mr-1">
                    <span>{msg.time}</span>
                    <span className="text-blue-500 font-bold">✓✓</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0 text-xs font-bold text-blue-700">
                  AM
                </div>
              </div>
            );
          }

          // Trường hợp tin nhắn của AI
          return (
            <div key={msg.id} className="flex items-start space-x-3 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-3">
                {/* Dạng 1: Tóm tắt tài chính tuần */}
                {msg.type === 'finance_summary' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-800">
                      Dạ, chào anh Minh. Báo cáo tình hình tài chính tuần này của <strong className="text-blue-700">Minh Software</strong> như sau:
                    </p>

                    {/* Card 1: Dòng tiền */}
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 text-sm">
                        🏛️
                      </div>
                      <div>
                        <div className="text-sm font-bold text-emerald-950">
                          Dòng tiền khả dụng: <span className="text-emerald-700 text-base">142.000.000 đ</span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Trạng thái an toàn, đủ chi trả vận hành trong 4 tháng tới (Burn rate ~35tr/tháng).
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Doanh thu */}
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0 text-sm">
                        📈
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-950">
                          Doanh thu ghi nhận tuần: <span className="text-blue-700 text-base">25.000.000 đ</span>
                        </div>
                        <p className="text-xs text-blue-800 mt-0.5">
                          Ghi nhận từ 2 hợp đồng phát triển phần mềm vừa hoàn tất sprint nghiệm thu.
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Cảnh báo nợ */}
                    <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 text-sm">
                        ⚠️
                      </div>
                      <div>
                        <div className="text-sm font-bold text-rose-950">
                          Cảnh báo nợ quá hạn: <span className="text-rose-700">Công ty CP ABC</span>
                        </div>
                        <p className="text-xs text-rose-800 mt-0.5">
                          Còn nợ <strong className="text-rose-900 font-bold">18.000.000 đ</strong> đã quá hạn <strong>30 ngày</strong> (Hợp đồng HĐ-02).
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-800 pt-1">
                      Em đã tự động soạn sẵn bản nháp email nhắc nợ lịch sự nhưng kiên quyết theo quy định, anh xem và duyệt nhé:
                    </p>

                    {/* Widget Email nhắc nợ soạn tự động */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-600">✉️</span>
                          <span className="text-xs font-bold text-slate-900">
                            Bản nháp Email nhắc nợ HĐ-02 gửi ketoan@abc.com
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                          AI Draft
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Mẫu: Đối soát công nợ chuẩn thông lệ doanh nghiệp
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-700 italic leading-relaxed">
                        &quot;Kính gửi Ban Kế toán Công ty CP ABC, Minh Software xin gửi thông báo đối soát công nợ kỳ hạn tháng 10/2026 với số tiền <strong>18.000.000 đ</strong> đã đến hạn theo điều khoản Mục 4.2 HĐ-02. Kính đề nghị Quý công ty thu xếp thanh toán trước ngày 20/11 để tránh gián đoạn dịch vụ...&quot;
                      </div>

                      {/* Các nút hành động */}
                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button 
                          type="button"
                          onClick={() => setShowEmailModal(true)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                        >
                          <span>Xem &amp; Chỉnh sửa lời văn</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => {
                            setEmailStatus('sent');
                            alert('Đã gửi email nhắc nợ thành công tới ketoan@abc.com!');
                          }}
                          className={`flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors cursor-pointer ${
                            emailStatus === 'sent' ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <span>{emailStatus === 'sent' ? '✓ Đã phê duyệt & Gửi' : 'Phê duyệt & Gửi ngay'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dạng 2: Ước tính Thuế GTGT Quý 4 */}
                {msg.type === 'tax_estimate' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-800">
                      Dạ, dựa trên <strong className="text-blue-700">23 hóa đơn hợp lệ</strong> đã duyệt và doanh thu bán ra thực tế trong quý:
                    </p>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
                      {/* Grid 2 cột: Doanh thu & Thuế đầu vào */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Doanh thu chịu thuế bán ra</div>
                          <div className="text-base font-bold text-slate-900 mt-1">120.000.000 đ</div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mt-1 pt-1 border-t border-slate-200/60">
                            <span>Thuế GTGT đầu ra (10%):</span>
                            <span className="font-semibold text-blue-600">12.000.000 đ</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thuế GTGT đầu vào hợp lệ</div>
                          <div className="text-base font-bold text-emerald-700 mt-1">8.500.000 đ</div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mt-1 pt-1 border-t border-slate-200/60">
                            <span>Khấu trừ từ:</span>
                            <span className="font-semibold text-slate-700">23 hóa đơn mua vào</span>
                          </div>
                        </div>
                      </div>

                      {/* Banner số thuế phải nộp */}
                      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                          <span className="text-blue-600 text-base">📑</span>
                          <span>Số tiền thuế GTGT tạm tính Quý 4 cần nộp:</span>
                        </div>
                        <div className="text-xl font-black text-blue-700 tracking-tight">
                          3.500.000 đ
                        </div>
                      </div>

                      {/* Nút bấm liên kết sang Lịch nghĩa vụ thuế */}
                      <div className="pt-1">
                        <button 
                          type="button"
                          onClick={() => onNavigate?.('tax-calendar')}
                          className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>📄</span>
                          <span>Xem chi tiết bảng tính nháp tờ khai Quý 4</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dạng 3: Tin nhắn văn bản thông thường */}
                {(!msg.type || msg.type === 'text') && (
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs text-sm text-slate-800 leading-relaxed">
                    {msg.text}
                  </div>
                )}

                {/* Thanh công cụ phụ dưới tin nhắn AI */}
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pl-1">
                  <span>{msg.time}</span>
                  <button type="button" className="hover:text-slate-600 cursor-pointer" title="Sao chép">📋</button>
                  <button type="button" className="hover:text-slate-600 cursor-pointer" title="Hữu ích">👍</button>
                  <button type="button" className="hover:text-slate-600 cursor-pointer" title="Chưa hài lòng">👎</button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* 3. Khung gợi ý nhanh (Quick chips) & Input Bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 space-y-3 shrink-0">
        {/* Gợi ý nhanh */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs text-slate-600 scrollbar-none">
          <span className="text-slate-400 font-medium whitespace-nowrap text-[11px]">Gợi ý nhanh:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.label)}
              className="flex items-center space-x-1.5 px-3 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-full text-slate-700 text-xs whitespace-nowrap transition-all shadow-2xs cursor-pointer"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent px-3 py-2 shadow-inner">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Hỏi trợ lý AI về thuế, hóa đơn, dòng tiền, công nợ..."
            className="flex-1 bg-transparent border-none focus:outline-hidden px-3 text-sm text-slate-800 placeholder-slate-400"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="ml-2 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-xs disabled:opacity-40 cursor-pointer"
            disabled={!inputValue.trim()}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Chú thích chân trang */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Nhấn Enter để gửi tin nhắn cho AI Copilot</span>
          <span className="flex items-center space-x-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Dữ liệu tài chính mã hóa bảo mật chuẩn OPC SmartOffice</span>
          </span>
        </div>
      </div>

      {/* ========================================================
          4. MODAL: LỊCH SỬ CÂU HỎI (QUESTION HISTORY)
      ======================================================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Header Modal */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Lịch sử câu hỏi &amp; Phiên làm việc</h3>
                  <p className="text-[11px] text-slate-500">Tra cứu các câu hỏi tài chính &amp; thuế đã trao đổi với Trợ lý AI</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cuộc trò chuyện mới</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ô tìm kiếm từ khóa */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Tìm kiếm câu hỏi cũ theo từ khóa (dòng tiền, thuế, hóa đơn, công nợ...)"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Danh sách các phiên hội thoại */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs">Không tìm thấy phiên câu hỏi nào phù hợp</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadSession(item)}
                    className="pt-2.5 first:pt-0 group p-3 rounded-2xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="text-[11px] text-slate-400">• {item.messageCount} tin nhắn</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {item.preview}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={() => handleLoadSession(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Mở lại
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteHistorySession(item.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Xóa phiên này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Tổng cộng <strong>{chatHistory.length}</strong> phiên hội thoại đã được mã hóa lưu trữ
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử câu hỏi?')) {
                      setChatHistory([]);
                    }
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
                >
                  Xóa tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: CÀI ĐẶT DỮ LIỆU AI (AI DATA SETTINGS)
      ======================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cài đặt dữ liệu &amp; Cấu hình AI Copilot</h3>
                  <p className="text-[11px] text-slate-500">Kiểm soát nguồn dữ liệu sổ sách, mô hình suy luận và cơ chế bảo mật cho OPC</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thanh điều hướng Tab bên trong Cài đặt */}
            <div className="flex border-b border-slate-200 px-6 bg-slate-50/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveSettingsTab('sources')}
                className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeSettingsTab === 'sources'
                    ? 'border-blue-600 text-blue-700 bg-white font-bold rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Nguồn dữ liệu kết nối</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab('model')}
                className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeSettingsTab === 'model'
                    ? 'border-blue-600 text-blue-700 bg-white font-bold rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Mô hình &amp; Suy luận</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab('privacy')}
                className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeSettingsTab === 'privacy'
                    ? 'border-blue-600 text-blue-700 bg-white font-bold rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bảo mật &amp; HITL</span>
              </button>
            </div>

            {/* Nội dung Tab */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: NGUỒN DỮ LIỆU */}
              {activeSettingsTab === 'sources' && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                    💡 <strong>Cơ chế Zero-Leakage:</strong> AI chỉ truy cập dữ liệu nội bộ của <strong>Minh Software</strong> được cấp phép dưới đây để trả lời câu hỏi, không sử dụng dữ liệu doanh nghiệp để đào tạo mô hình công cộng.
                  </div>

                  {/* Nguồn 1: Hóa đơn & OCR */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Hóa đơn điện tử GTGT &amp; Chứng từ OCR</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Đồng bộ 25 hóa đơn mẫu, tự động trích xuất mã số thuế, tiền trước thuế, thuế suất 10%
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={aiSettings.sourceInvoices}
                        onChange={(e) => setAiSettings({ ...aiSettings, sourceInvoices: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Nguồn 2: Dòng tiền & Ngân hàng */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Tài khoản ngân hàng &amp; Dòng tiền thu chi</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Số dư khả dụng 142.000.000 đ, lịch sử giao dịch tuần để phân tích burn-rate và quỹ dự phòng
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={aiSettings.sourceBanking}
                        onChange={(e) => setAiSettings({ ...aiSettings, sourceBanking: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Nguồn 3: Khách hàng & Hợp đồng */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Danh bạ khách hàng &amp; Hợp đồng công nợ</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          12 đối tác, thông tin thanh toán quá hạn (như Công ty CP ABC nợ 18 triệu) để tự động soạn email đôn đốc
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={aiSettings.sourceCustomers}
                        onChange={(e) => setAiSettings({ ...aiSettings, sourceCustomers: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Nguồn 4: Dữ liệu tờ khai thuế eTax */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Tờ khai Mẫu 01/GTGT &amp; Lịch nộp thuế eTax</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Dữ liệu tính nháp chỉ tiêu [23], [24], [32], [40] kết nối đồng bộ cổng Thuế điện tử
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={aiSettings.sourceTaxReports}
                        onChange={(e) => setAiSettings({ ...aiSettings, sourceTaxReports: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: MÔ HÌNH & SUY LUẬN */}
              {activeSettingsTab === 'model' && (
                <div className="space-y-4">
                  {/* Lựa chọn Model LLM */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Mô hình AI vận hành Copilot
                    </label>
                    <select
                      value={aiSettings.selectedModel}
                      onChange={(e) => setAiSettings({ ...aiSettings, selectedModel: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro • Fine-tuned Kế toán &amp; Thuế Việt Nam (Khuyên dùng cho OPC)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash • Tốc độ siêu tốc (Dành cho truy vấn nhanh)</option>
                      <option value="deepseek-r1">DeepSeek R1 • Chuyên sâu giải trình pháp lý &amp; kiểm toán</option>
                    </select>
                  </div>

                  {/* Temperature slider */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Nhiệt độ sáng tạo (Temperature):</span>
                      <span className="font-mono text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md border border-blue-200">
                        {aiSettings.temperature}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={aiSettings.temperature}
                      onChange={(e) => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>0.0 (Chính xác cao cho kế toán &amp; thuế)</span>
                      <span>0.5 (Cân bằng)</span>
                      <span>1.0 (Sáng tạo văn phong)</span>
                    </div>
                  </div>

                  {/* Chuẩn kế toán áp dụng */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Chế độ kế toán &amp; Thuế áp dụng
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => setAiSettings({ ...aiSettings, accountingStandard: 'TT133' })}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          aiSettings.accountingStandard === 'TT133' 
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold' 
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <p className="font-bold">Thông tư 133/2016/TT-BTC</p>
                        <p className="text-[10px] font-normal text-slate-500 mt-0.5">Dành cho Doanh nghiệp nhỏ và vừa (SME / OPC)</p>
                      </div>

                      <div 
                        onClick={() => setAiSettings({ ...aiSettings, accountingStandard: 'TT88' })}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          aiSettings.accountingStandard === 'TT88' 
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold' 
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <p className="font-bold">Thông tư 88/2021/TT-BTC</p>
                        <p className="text-[10px] font-normal text-slate-500 mt-0.5">Dành cho Hộ kinh doanh &amp; Cá nhân kinh doanh</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BẢO MẬT & HITL */}
              {activeSettingsTab === 'privacy' && (
                <div className="space-y-3.5">
                  {/* HITL Rule */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Cơ chế Human-in-the-loop (Bắt buộc phê duyệt)</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          AI không bao giờ tự ý gửi email nhắc nợ hoặc xuất file XML thuế nếu chưa có nút xác nhận từ Anh Minh
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={aiSettings.requireHITL}
                        onChange={(e) => setAiSettings({ ...aiSettings, requireHITL: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Anonymize PII */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Ẩn danh thông tin nhạy cảm (PII Masking)</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tự động che số CCCD, tài khoản cá nhân của chủ doanh nghiệp trước khi chuyển dữ liệu vào Prompt suy luận
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={aiSettings.anonymizePII}
                        onChange={(e) => setAiSettings({ ...aiSettings, anonymizePII: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Audit Logging */}
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Nhật ký kiểm toán quyết định AI (Audit Trail)</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Lưu trữ dấu vết thời gian thực mọi phép tính toán thuế và đề xuất tài chính phục vụ đối chiếu nội bộ
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                      <input 
                        type="checkbox" 
                        checked={aiSettings.auditLogging}
                        onChange={(e) => setAiSettings({ ...aiSettings, auditLogging: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Thông báo lưu thành công */}
            {saveSuccessMsg && (
              <div className="mx-6 mb-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Footer Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setAiSettings({
                    sourceInvoices: true,
                    sourceBanking: true,
                    sourceCustomers: true,
                    sourceTaxReports: true,
                    selectedModel: 'gemini-1.5-pro',
                    temperature: 0.2,
                    accountingStandard: 'TT133',
                    maxTokens: 2048,
                    anonymizePII: true,
                    requireHITL: true,
                    auditLogging: true
                  });
                }}
                className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục mặc định</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Lưu cấu hình AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MODAL: XEM & CHỈNH SỬA EMAIL NHẮC NỢ
      ======================================================== */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">✉️</span>
                <h3 className="text-base font-bold text-slate-900">Chi tiết thư nhắc nợ đối tác</h3>
              </div>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold">Người nhận (To):</span>
                  <div className="font-bold text-slate-800">ketoan@abc.com</div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Đồng gửi (CC):</span>
                  <div className="font-bold text-slate-800">giamdoc@abc.com; minh@minhsoftware.vn</div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tiêu đề thư:</label>
                <input 
                  type="text" 
                  defaultValue="[Minh Software] Nhắc thanh toán công nợ quá hạn hợp đồng HĐ-02" 
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nội dung thư điện tử:</label>
                <textarea 
                  rows={6}
                  defaultValue={`Kính gửi Ban Giám đốc & Phòng Kế toán Công ty Cổ phần ABC,\n\nMinh Software xin gửi lời chào trân trọng và lời chúc sức khỏe đến Quý công ty.\n\nTheo điều khoản Hợp đồng HĐ-02 về dịch vụ Tư vấn & Triển khai hệ thống, đợt thanh toán số 2 với số tiền 18.000.000 đ (Mười tám triệu đồng chẵn) đã đến hạn vào ngày 15/10/2026 (hiện đã quá hạn 30 ngày).\n\nKính đề nghị Quý công ty thu xếp hoàn tất thanh toán trước ngày 20/11/2026.`}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 leading-relaxed font-sans"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800 flex items-center space-x-2">
                <span>🛡️</span>
                <span><strong>Cơ chế Human-in-the-loop:</strong> Trợ lý AI chỉ soạn thảo và đề xuất, quyết định phát hành văn bản hoàn toàn do Anh Minh phê duyệt.</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailStatus('sent');
                  alert('Đã cập nhật lời văn và gửi email nhắc nợ thành công!');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Xác nhận &amp; Gửi thư
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};