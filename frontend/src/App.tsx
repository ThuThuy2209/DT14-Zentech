import React, { useState } from 'react';
import { LoginView } from './pages/LoginView'; 
import { DashboardView } from './pages/DashboardView';
import { InvoiceView } from './pages/InvoiceView';
import { CustomersView } from './pages/CustomersView';
import { FinanceView } from './pages/FinanceView';
import { TaxCalendarView } from './pages/TaxCalendarView';
import { CopilotView } from './pages/CopilotView';
import { AppLayout } from './layout/AppLayout';
import { SettingsView } from './pages/SettingsView';

export default function App() {
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
            return <SettingsView />;
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