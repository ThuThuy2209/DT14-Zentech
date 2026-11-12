import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Plus, 
  Mail, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Edit3, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  Building2
} from 'lucide-react';

interface DebtRecord {
  id: string;
  avatarText: string;
  avatarBg: string;
  companyName: string;
  taxId: string;
  city: string;
  contractCode: string;
  contractName: string;
  totalValue: number;
  paidValue: number;
  remainingDebt: number;
  isOverdue: boolean;
  dueDateText: string;
  overdueDays?: number;
}

export const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'overdue' | 'in_term'>('all');
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null);

  // Dữ liệu công nợ khớp với thiết kế Stitch và các hợp đồng
  const [debts, setDebts] = useState<DebtRecord[]>([
    {
      id: '1',
      avatarText: 'ABC',
      avatarBg: 'bg-rose-100 text-rose-700',
      companyName: 'Công ty Cổ phần ABC',
      taxId: '0108392104',
      city: 'Hà Nội',
      contractCode: 'HĐ-02',
      contractName: 'Dự án CRM Tùy biến',
      totalValue: 30000000,
      paidValue: 12000000,
      remainingDebt: 18000000,
      isOverdue: true,
      dueDateText: 'Quá hạn 30 ngày (Hạn: 15/10/2026)',
      overdueDays: 30
    },
    {
      id: '2',
      avatarText: 'GPV',
      avatarBg: 'bg-blue-100 text-blue-700',
      companyName: 'Công ty TNHH Giải Pháp Việt',
      taxId: '0319482711',
      city: 'TP. HCM',
      contractCode: 'HĐ-05',
      contractName: 'Nâng cấp bảo mật cổng API',
      totalValue: 45000000,
      paidValue: 30000000,
      remainingDebt: 15000000,
      isOverdue: false,
      dueDateText: 'Trong hạn (Còn 10 ngày - 28/11/2026)'
    },
    {
      id: '3',
      avatarText: 'NA',
      avatarBg: 'bg-purple-100 text-purple-700',
      companyName: 'Doanh nghiệp Tư nhân Nam An',
      taxId: '3502847193',
      city: 'Đà Nẵng',
      contractCode: 'HĐ-08',
      contractName: 'Bảo trì hệ thống ERP định kỳ',
      totalValue: 20000000,
      paidValue: 8000000,
      remainingDebt: 12000000,
      isOverdue: false,
      dueDateText: 'Trong hạn (Hạn: 05/12/2026)'
    }
  ]);

  const formatVND = (num: number) => num.toLocaleString('vi-VN') + ' đ';

  // Lọc theo tab
  const filteredDebts = debts.filter(d => {
    if (activeTab === 'overdue') return d.isOverdue;
    if (activeTab === 'in_term') return !d.isOverdue;
    return true;
  });

  // Mở modal email nhắc nợ
  const handleOpenEmailModal = (debt: DebtRecord) => {
    setSelectedDebt(debt);
    setShowEmailModal(true);
  };

  // Gửi email nhắc nợ
  const handleSendEmail = () => {
    alert(`Đã gửi email nhắc nợ thành công tới ${selectedDebt?.companyName} qua cổng SMTP bảo mật!`);
    setShowEmailModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Trang & Các nút thao tác */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            SỔ CÁI TÀI CHÍNH TỰ ĐỘNG • Q4/2026
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1.5">
            Thu chi & Quản lý Công nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi dòng tiền vào ra, phát hiện công nợ chậm thanh toán và tự động kích hoạt trợ lý AI thu hồi vốn.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất sổ phụ Excel</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo phiếu thu/chi mới</span>
          </button>
        </div>
      </div>

      {/* 2. Hàng 3 Thẻ chỉ số tài chính */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Thẻ 1: Tổng phải thu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng phải thu (Receivable)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">45.000.000</span>
              <span className="text-sm font-bold text-slate-600">đ</span>
            </div>
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-3 h-3" />
                +12.4% so với tháng trước
              </span>
            </div>
          </div>
        </div>

        {/* Thẻ 2: Đã quá hạn (Overdue) */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/20 to-white shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Đã quá hạn (Overdue)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-rose-600">18.000.000</span>
              <span className="text-sm font-bold text-rose-600">đ</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-rose-700 font-medium">1 đối tác trễ hạn &gt; 30 ngày</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                Cần xử lý ngay
              </span>
            </div>
          </div>
        </div>

        {/* Thẻ 3: Đã thu trong tháng */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Đã thu trong tháng
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">67.000.000</span>
              <span className="text-sm font-bold text-slate-600">đ</span>
            </div>
            <div className="mt-2.5">
              <span className="text-xs text-slate-500 font-medium">
                <span className="text-emerald-600 font-bold">Đạt 94%</span> kế hoạch dòng tiền Q4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bảng theo dõi công nợ khách hàng */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header danh sách & Tab lọc */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Danh sách theo dõi công nợ khách hàng</h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
              3 đối tác
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tất cả (3)
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overdue' ? 'bg-white text-rose-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Quá hạn (1)
            </button>
            <button
              onClick={() => setActiveTab('in_term')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'in_term' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Trong hạn (2)
            </button>
          </div>
        </div>

        {/* Bảng công nợ */}
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
              {filteredDebts.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${item.isOverdue ? 'bg-rose-50/20' : ''}`}
                >
                  {/* Cột 1: Khách hàng */}
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

                  {/* Cột 2: Hợp đồng */}
                  <td className="py-4 px-5">
                    <span className="font-bold text-blue-600">{item.contractCode}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.contractName}</p>
                  </td>

                  {/* Cột 3: Giá trị hợp đồng */}
                  <td className="py-4 px-5 text-right font-semibold text-slate-800">
                    {formatVND(item.totalValue)}
                  </td>

                  {/* Cột 4: Đã thanh toán */}
                  <td className="py-4 px-5 text-right font-medium text-slate-600">
                    {formatVND(item.paidValue)}
                  </td>

                  {/* Cột 5: Còn nợ lại */}
                  <td className="py-4 px-5 text-right">
                    <span className={`font-extrabold text-sm ${item.isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatVND(item.remainingDebt)}
                    </span>
                  </td>

                  {/* Cột 6: Trạng thái & Nút thao tác */}
                  <td className="py-4 px-5 text-center">
                    {item.isOverdue ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          {item.dueDateText}
                        </span>
                        <button
                          onClick={() => handleOpenEmailModal(item)}
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

      {/* 4. MODAL DUYỆT EMAIL NHẮC NỢ (Y hệt ảnh Stitch số 2 của bạn) */}
      {showEmailModal && selectedDebt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
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
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin người nhận TO & CC */}
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

              {/* Tiêu đề thư */}
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

              {/* Nội dung thư điện tử */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">NỘI DUNG THƯ ĐIỆN TỬ:</span>
                  <span className="text-[10px] text-slate-400">Độ trang trọng: 9.5/10 • Thời gian gửi gợi ý: 09:30 Thứ Ba</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 space-y-3 font-sans leading-relaxed">
                  <p>Kính gửi: Ban Giám đốc & Phòng Kế toán {selectedDebt.companyName},</p>
                  <p>Lời đầu tiên, Minh Software xin gửi lời chào trân trọng và lời chúc sức khỏe đến Quý công ty.</p>
                  <p>
                    Theo điều khoản Hợp đồng <strong>{selectedDebt.contractCode}</strong> về dịch vụ {selectedDebt.contractName}, đợt thanh toán số 2 với số tiền <strong className="text-rose-600 font-bold">{formatVND(selectedDebt.remainingDebt)} (Mười tám triệu đồng chẵn)</strong> đã đến hạn thanh toán vào ngày 15/10/2026 (hiện đã quá hạn 30 ngày).
                  </p>
                  <p>
                    Để đảm bảo tiến độ bảo trì hệ thống và quyết toán sổ sách cuối năm, kính đề nghị Quý công ty thu xếp thanh toán khoản công nợ trên trước ngày <strong>25/11/2026</strong>.
                  </p>
                  
                  {/* Hộp thông tin tài khoản ngân hàng */}
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

              {/* Hộp bảo vệ Human-in-the-loop */}
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

            {/* Các nút hành động */}
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
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleSendEmail}
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
    </div>
  );
};