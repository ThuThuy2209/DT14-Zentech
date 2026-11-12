import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './features/dashboard/DashboardView';

export default function App() {
  return (
    <AppLayout>
      {({ activeTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DashboardView />;
          case 'copilot':
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Trợ lý AI Copilot</h2>
                <p className="text-slate-500 text-xs mt-1">Đang kết nối API AI Service...</p>
              </div>
            );
          case 'invoices':
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Chứng từ & Hóa đơn</h2>
                <p className="text-slate-500 text-xs mt-1">Quản lý 25 hóa đơn mẫu và OCR...</p>
              </div>
            );
          default:
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Mô-đun đang phát triển: {activeTab}</h2>
              </div>
            );
        }
      }}
    </AppLayout>
  );
}