// src/components/finance/DebtTab.tsx
import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Mail,
  Sparkles,
  ShieldCheck,
  X,
  Edit3,
  Send,
} from 'lucide-react';
import type { DebtRecord, DebtTabType } from '../../pages/finance/finance.types';
import './DebtTab.css';

interface DebtTabProps {
  debts: DebtRecord[];
  debtTab: DebtTabType;
  onChangeDebtTab: (tab: DebtTabType) => void;
  selectedDebt: DebtRecord | null;
  showEmailModal: boolean;
  onOpenEmailModal: (debt: DebtRecord) => void;
  onCloseEmailModal: () => void;
  onSendEmail: () => void;
  formatVND: (num: number) => string;
}

export const DebtTab: React.FC<DebtTabProps> = ({
  debts,
  debtTab,
  onChangeDebtTab,
  selectedDebt,
  showEmailModal,
  onOpenEmailModal,
  onCloseEmailModal,
  onSendEmail,
  formatVND,
}) => {
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Danh sách theo dõi công nợ khách hàng</h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
              3 đối tác
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onChangeDebtTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                debtTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tất cả (3)
            </button>
            <button
              onClick={() => onChangeDebtTab('overdue')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                debtTab === 'overdue' ? 'bg-white text-rose-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Quá hạn (1)
            </button>
            <button
              onClick={() => onChangeDebtTab('in_term')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                debtTab === 'in_term' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Trong hạn (2)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5">KHÁCH HÀNG & DOANH NGHIỆP</th>
                <th className="py-3 px-5">HỢP ĐỒNG LIÊN KẾT</th>
                <th className="py-3 px-5 text-right">GIÁ TRỊ HỢP ĐỒNG</th>
                <th className="py-3 px-5 text-right">ĐÃ THANH TOÁN</th>
                <th className="py-3 px-5 text-right">CÒN NỢ LẠI</th>
                <th className="py-3 px-5 text-center">TRẠNG THÁI HẠN NỢ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {debts.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors ${item.isOverdue ? 'debt-row-overdue' : ''}`}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${item.avatarBg}`}>
                        {item.avatarText}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.companyName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          MST: {item.taxId} • {item.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-bold text-blue-600">{item.contractCode}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.contractName}</p>
                  </td>
                  <td className="py-4 px-5 text-right font-semibold text-slate-800">
                    {formatVND(item.totalValue)}
                  </td>
                  <td className="py-4 px-5 text-right font-medium text-slate-600">
                    {formatVND(item.paidValue)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={`font-extrabold text-sm ${item.isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatVND(item.remainingDebt)}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {item.isOverdue ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          {item.dueDateText}
                        </span>
                        <button
                          onClick={() => onOpenEmailModal(item)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Duyệt Email Nhắc Nợ</span>
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.dueDateText}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Duyệt Email Nhắc Nợ */}
      {showEmailModal && selectedDebt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">Duyệt Email Nhắc Nợ</h3>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      Soạn bởi Trợ lý AI OPC SmartOffice ✨
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Tối ưu hóa văn phong trang trọng, giữ vững quan hệ đối tác B2B</p>
                </div>
              </div>
              <button onClick={onCloseEmailModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">NGƯỜI NHẬN CHÍNH (TO):</span>
                  <p className="font-bold text-slate-900 mt-0.5">ketoan@abc.com</p>
                  <p className="text-[11px] text-slate-500">Ban Tài chính - Kế toán Công ty CP ABC</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ĐỒNG GỬI (CC):</span>
                  <p className="font-medium text-slate-800 mt-0.5">giamdoc@abc.com; minh@minhsoftware.vn</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">TIÊU ĐỀ THƯ:</span>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1">
                  <span className="text-xs font-bold text-slate-900">
                    [Minh Software] Nhắc thanh toán công nợ quá hạn hợp đồng {selectedDebt.contractCode}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    ✓ AI Tối ưu tỉ lệ mở thư (Open-rate 88%)
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">NỘI DUNG THƯ ĐIỆN TỬ:</span>
                  <span className="text-[10px] text-slate-400">Độ trang trọng: 9.5/10 • Thời gian gửi gợi ý: 09:30 Thứ Ba</span>
                </div>
                <div className="debt-email-preview p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 space-y-3 font-sans">
                  <p>Kính gửi: Ban Giám đốc & Phòng Kế toán {selectedDebt.companyName},</p>
                  <p>Lời đầu tiên, Minh Software xin gửi lời chào trân trọng và lời chúc sức khỏe đến Quý công ty.</p>
                  <p>
                    Theo điều khoản Hợp đồng <strong>{selectedDebt.contractCode}</strong> về dịch vụ {selectedDebt.contractName}, đợt thanh toán số 2 với số tiền <strong className="text-rose-600 font-bold">{formatVND(selectedDebt.remainingDebt)} (Mười tám triệu đồng chẵn)</strong> đã đến hạn thanh toán vào ngày 15/10/2026 (hiện đã quá hạn 30 ngày).
                  </p>
                  <p>
                    Để đảm bảo tiến độ bảo trì hệ thống và quyết toán sổ sách cuối năm, kính đề nghị Quý công ty thu xếp thanh toán khoản công nợ trên trước ngày <strong>25/11/2026</strong>.
                  </p>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-700">
                    <p className="font-bold text-blue-700">Thông tin chuyển khoản:</p>
                    <p>• Tên TK: CÔNG TY TNHH MTV MINH SOFTWARE</p>
                    <p>• Số TK: 102099000001 - Vietcombank CN TP.HCM</p>
                    <p>• Nội dung CK: {selectedDebt.contractCode} Cong ty ABC thanh toan dot 2</p>
                  </div>

                  <p>Trân trọng cảm ơn sự hợp tác của Quý công ty!</p>
                  <p className="font-bold text-slate-900">Đại diện Minh Software - Nguyễn Văn Minh</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Cơ chế bảo vệ Human-in-the-loop</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Email chỉ được gửi đi khi có sự phê duyệt trực tiếp của Anh Minh. AI OPC SmartOffice không bao giờ tự ý phát hành văn bản tài chính ra bên ngoài.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => alert('Cho phép sửa trực tiếp văn bản')}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa lời văn</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onCloseEmailModal}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={onSendEmail}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Phê duyệt & Gửi thư ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
