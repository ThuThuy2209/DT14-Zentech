import React, { useState, useRef, useEffect } from 'react';

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

export const CopilotView: React.FC<CopilotViewProps> = ({ onNavigate }) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'draft' | 'sent'>('draft');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Danh sách hội thoại mặc định chuẩn theo thiết kế Stitch
  const [messages, setMessages] = useState<Message[]>([
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
          text: `Dạ em đã ghi nhận yêu cầu: "${text}". Dữ liệu kế toán thời gian thực của Minh Software đang được đồng bộ và phản hồi ngay.`
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

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 text-slate-800">
      {/* 1. Header Trợ lý AI Copilot */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L14.4 7.2L20 8L15.8 12.2L17 18L12 15.2L7 18L8.2 12.2L4 8L9.6 7.2L12 2Z" />
            </svg>
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
          <button 
            type="button"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Lịch sử câu hỏi</span>
          </button>

          <button 
            type="button"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Cài đặt dữ liệu AI</span>
          </button>

          <button 
            type="button"
            onClick={handleClearChat}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
          >
            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
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
                  <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-sm font-medium leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1 mr-1">
                    <span>{msg.time}</span>
                    <span className="text-blue-500">✓✓</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-700">
                  AM
                </div>
              </div>
            );
          }

          // Trường hợp tin nhắn của AI
          return (
            <div key={msg.id} className="flex items-start space-x-3 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.4 7.2L20 8L15.8 12.2L17 18L12 15.2L7 18L8.2 12.2L4 8L9.6 7.2L12 2Z" />
                </svg>
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
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-sm">
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
                      <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm">
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
                      <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center flex-shrink-0 text-sm">
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
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
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
                          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Xem & Chỉnh sửa lời văn</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => {
                            setEmailStatus('sent');
                            alert('Đã gửi email nhắc nợ thành công tới ketoan@abc.com!');
                          }}
                          className={`flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg shadow-sm transition-colors ${
                            emailStatus === 'sent' ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
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

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3.5">
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
                          className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200 rounded-lg transition-colors"
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
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sm text-slate-800 leading-relaxed">
                    {msg.text}
                  </div>
                )}

                {/* Thanh công cụ phụ dưới tin nhắn AI */}
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pl-1">
                  <span>{msg.time}</span>
                  <button type="button" className="hover:text-slate-600" title="Sao chép">📋</button>
                  <button type="button" className="hover:text-slate-600" title="Hữu ích">👍</button>
                  <button type="button" className="hover:text-slate-600" title="Chưa hài lòng">👎</button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* 3. Khung gợi ý nhanh (Quick chips) & Input Bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 space-y-3 flex-shrink-0">
        {/* Gợi ý nhanh */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs text-slate-600 scrollbar-none">
          <span className="text-slate-400 font-medium whitespace-nowrap text-[11px]">Gợi ý nhanh:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.label)}
              className="flex items-center space-x-1.5 px-3 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-full text-slate-700 text-xs whitespace-nowrap transition-all shadow-2xs"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent px-3 py-2 shadow-inner">
          <button 
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            title="Đính kèm tài liệu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

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
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            title="Nhập bằng giọng nói"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="ml-2 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm disabled:opacity-40"
            disabled={!inputValue.trim()}
          >
            <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>

        {/* Chú thích chân trang */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Nhấn Enter để gửi, Shift + Enter để xuống dòng</span>
          <span className="flex items-center space-x-1">
            <span>🔒</span>
            <span>Dữ liệu kế toán mã hóa chuẩn bảo mật OPC</span>
          </span>
        </div>
      </div>

      {/* 4. Modal: Xem & Chỉnh sửa lời văn email nhắc nợ */}
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
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
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
                  defaultValue={`Kính gửi Ban Giám đốc & Phòng Kế toán Công ty Cổ phần ABC,\n\nMinh Software xin gửi lời chào trân trọng và lời chúc sức khỏe đến Quý công ty.\n\nTheo điều khoản Hợp đồng HĐ-02 về dịch vụ Tư vấn & Triển khai hệ thống, đợt thanh toán số 2 với số tiền 18.000.000 đ (Mười tám triệu đồng chẵn) đã đến hạn vào ngày 15/10/2026 (hiện đã quá hạn 30 ngày).\n\nKính đề nghị Quý công ty thu xếp hoàn tất thanh toán trước ngày 25/11/2026.`}
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
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
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
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Xác nhận & Gửi thư
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};