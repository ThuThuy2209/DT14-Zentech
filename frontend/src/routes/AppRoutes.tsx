// src/routes/AppRoutes.tsx
import React from 'react';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { InvoicesPage } from '../pages/invoices/InvoicesPage';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { FinancePage } from '../pages/finance/FinancePage';
import { TaxCalendarPage } from '../pages/tax-calendar/TaxCalendarPage';
import { CopilotPage } from '../pages/copilot/CopilotPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';

interface AppRoutesProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  activeTab,
  onNavigate,
  onLogout,
}) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardPage onNavigate={onNavigate} />;
    case 'invoices':
      return <InvoicesPage />;
    case 'copilot':
      return <CopilotPage onNavigate={onNavigate} />;
    case 'customers':
      return <CustomersPage />;
    case 'finance':
      return <FinancePage />;
    case 'tax-calendar':
      return <TaxCalendarPage onNavigate={onNavigate} />;
    case 'settings':
      return <SettingsPage />;
    case 'profile':
      return <ProfilePage onNavigate={onNavigate} onLogout={onLogout} />;
    default:
      return (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <h2 className="text-lg font-bold text-slate-800">Mô-đun đang phát triển</h2>
        </div>
      );
  }
};
