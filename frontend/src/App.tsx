import { useState } from 'react';
import { LoginView } from './pages/LoginView'; 
import { DashboardView } from './pages/DashboardView';
import { InvoiceView } from './pages/InvoiceView';
import { CustomersView } from './pages/CustomersView';
import { FinanceView } from './pages/FinanceView';
import { TaxCalendarView } from './pages/TaxCalendarView';
import { CopilotView } from './pages/CopilotView';
import { AppLayout } from './layout/AppLayout';
import { SettingsView } from './pages/SettingsView';
import { ProfileView } from './pages/ProfileView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/');
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  
  return (
    <AppLayout onLogout={handleLogout}>
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
            return <TaxCalendarView onNavigate={setActiveTab}/>;
          case 'settings':
            return <SettingsView />;
          case 'profile':
            return <ProfileView onNavigate={setActiveTab} onLogout={handleLogout} />;
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