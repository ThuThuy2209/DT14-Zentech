import React, { useState, useEffect } from 'react';
import { LoginView } from './features/auth/LoginView'; 
import { CustomersView } from './features/customers/CustomersView';
import { FinanceView } from './features/finance/FinanceView';
import { TaxCalendarView } from './features/tax/TaxCalendarView';
import { CopilotView } from './features/copilot/CopilotView';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './features/dashboard/DashboardView';
import { InvoiceView } from './features/invoices/InvoiceView';

export default function App() {
  // Kiểm tra token đã lưu trong localStorage chưa
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppLayout>
      {({ activeTab, setActiveTab }) => {
        switch (activeTab) {
          case 'dashboard':
            return <DashboardView onNavigate={setActiveTab} />;
          case 'invoices':
            return <InvoiceView />;
          case 'copilot':
            return <CopilotView onNavigate={setActiveTab} />;
          case 'customers':
            return <CustomersView />;
          case 'finance':
            return <FinanceView />;
          case 'tax-calendar':
            return <TaxCalendarView />;
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