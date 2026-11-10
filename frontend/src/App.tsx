import React, { useState } from 'react';
import { MOCK_INVOICES, SELLER_INFO } from './mocks/mockInvoices';
import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  Users, 
  Wallet, 
  Calendar, 
  Settings, 
  Bell, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <span className="text-2xl font-black text-blue-600 tracking-tight">SoloTech</span>
            <span className="ml-2 text-xs font-semibold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">OPC</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard size={18} />
              Tổng quan
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === 'copilot' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles size={18} className="text-amber-400" />
              Trợ lý AI Copilot
            </button>

            <button
              onClick={() => setActiveTab('invoices')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === 'invoices' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText size={18} />
              Chứng từ & Hóa đơn
            </button>

            <button
              onClick={() => setActiveTab('contracts')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === 'contracts' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users size={18} />
              Khách hàng & Hợp đồng
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === 'finance' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wallet size={18} />
              Thu chi & Công nợ
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === 'compliance' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar size={18} />
              Lịch nghĩa vụ thuế
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === 'settings' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Settings size={18} />
              Cài đặt hệ thống
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              TM
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-slate-800 truncate">{SELLER_INFO.representative}</div>
              <div className="text-xs text-slate-500 truncate">Minh Software (0319002001)</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm hóa đơn, hợp đồng, khách hàng..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> HITL Guard: BẬT
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase">Doanh thu tháng</div>
              <div className="text-2xl font-black text-slate-900 mt-1">85.000.000 đ</div>
              <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                ↑ +12% so với tháng trước
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase">Số dư khả dụng</div>
              <div className="text-2xl font-black text-slate-900 mt-1">142.000.000 đ</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Vietcombank Live</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase">Công nợ cần thu</div>
              <div className="text-2xl font-black text-amber-600 mt-1">18.000.000 đ</div>
              <div className="text-xs text-red-600 font-bold mt-1">⚠️ 1 khoản nợ 30 ngày (ABC Corp)</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase">Hạn nộp thuế gần nhất</div>
              <div className="text-2xl font-black text-blue-600 mt-1">Còn 5 ngày</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Nộp thuế GTGT Quý 4</div>
            </div>
          </div>

          {/* Table: 25 Invoices */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="text-blue-600" size={20} />
                  Danh sách 25 Hóa đơn kiểm thử (Minh Software)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mô phỏng bóc tách AI OCR, tự động phát hiện 1 hóa đơn trùng (HĐ #24) và 1 hóa đơn sai MST (HĐ #25).
                </p>
              </div>
              <span className="text-xs font-mono font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                Ký hiệu: 1C26TMS | Mẫu: 01GTKT
              </span>
            </div>

            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Số HĐ</th>
                  <th className="py-3 px-4">Ngày lập</th>
                  <th className="py-3 px-4">Công ty mua</th>
                  <th className="py-3 px-4">MST trên HĐ</th>
                  <th className="py-3 px-4">Dịch vụ</th>
                  <th className="py-3 px-4 text-right">Tổng tiền</th>
                  <th className="py-3 px-4 text-center">Trạng thái AI</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_INVOICES.map((inv) => (
                  <tr 
                    key={inv.id} 
                    className={`hover:bg-slate-50/80 transition ${
                      inv.status === 'DUPLICATE' ? 'bg-red-50/50' : 
                      inv.status === 'TAX_CODE_MISMATCH' ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">{inv.issueDate}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{inv.buyer.name}</td>
                    <td className={`py-3 px-4 font-mono text-xs ${inv.status === 'TAX_CODE_MISMATCH' ? 'font-bold text-red-600 underline' : ''}`}>
                      {inv.buyer.taxCodeOnInvoice}
                    </td>
                    <td className="py-3 px-4 text-xs">{inv.serviceDescription}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {inv.totalAmount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status === 'VALID' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                          ✓ Hợp lệ
                        </span>
                      )}
                      {inv.status === 'DUPLICATE' && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold border border-red-300 animate-pulse">
                          <AlertTriangle size={12} /> Trùng HĐ #000001
                        </span>
                      )}
                      {inv.status === 'TAX_CODE_MISMATCH' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-300">
                          <AlertTriangle size={12} /> Sai MST người mua
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-600/30 hover:border-blue-600 px-3 py-1 rounded-md transition">
                        Duyệt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
