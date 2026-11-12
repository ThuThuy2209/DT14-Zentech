import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './features/dashboard/DashboardView';
import { InvoiceView } from './features/invoices/InvoiceView';

export default function App() {
  return (
    <AppLayout>
      {({ activeTab, setActiveTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DashboardView onNavigate={setActiveTab} />;
          case 'invoices':
            return <InvoiceView />;
          case 'copilot':
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Trợ lý AI Copilot</h2>
                <p className="text-slate-500 text-xs mt-1">Đang kết nối AI Service tại port 5000...</p>
              </div>
            );
          case 'customers':
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Khách hàng & Hợp đồng</h2>
                <p className="text-slate-500 text-xs mt-1">Đang phát triển...</p>
              </div>
            );
          case 'finance':
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Thu chi & Công nợ</h2>
                <p className="text-slate-500 text-xs mt-1">Đang phát triển...</p>
              </div>
            );
          case 'tax-calendar':
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Lịch nghĩa vụ thuế</h2>
                <p className="text-slate-500 text-xs mt-1">Đang phát triển...</p>
              </div>
            );
          case 'settings':
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Cài đặt hệ thống</h2>
                <p className="text-slate-500 text-xs mt-1">Đang phát triển...</p>
              </div>
            );
          default:
            return (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-lg font-bold text-slate-800">Mô-đun đang phát triển</h2>
              </div>
            );
        }
      }}
    </AppLayout>
  );
}