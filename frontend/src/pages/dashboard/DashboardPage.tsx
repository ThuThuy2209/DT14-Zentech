// src/pages/dashboard/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  getBankAccounts,
  getExpenseStatistics,
  type BankAccountItem,
  type ExpenseStatistics,
} from '../../services/financeService';
import { getPurchaseInvoices, type PurchaseInvoiceItem } from '../../services/invoiceService';
import { getContracts } from '../../services/contractService';
import { getCustomers } from '../../services/customerService';
import { DashboardContent } from '../../components/dashboard/DashboardContent';

interface DashboardPageProps {
  onNavigate?: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Tháng này (Tháng 11/2026)');
  const [selectedDay, setSelectedDay] = useState(17);
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([]);
  const [totalBankBalance, setTotalBankBalance] = useState<number>(142000000);
  const [totalRevenue, setTotalRevenue] = useState<number>(85000000);
  const [totalOverdueDebt] = useState<number>(18000000);
  const [needsReviewInvoices, setNeedsReviewInvoices] = useState<PurchaseInvoiceItem[]>([]);
  const [expenseStats, setExpenseStats] = useState<ExpenseStatistics | null>(null);
  const [totalContractsCount, setTotalContractsCount] = useState<number>(6);
  const [totalCustomersCount, setTotalCustomersCount] = useState<number>(24);

  const companyUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('company') || '{}') : {};
  const representativeName = companyUser.representative || 'Anh Minh';

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bankRes, invoiceRes, expenseRes, contractRes, customerRes] = await Promise.allSettled([
        getBankAccounts(),
        getPurchaseInvoices({ tab: 'NEEDS_REVIEW', page: 1, limit: 10 }),
        getExpenseStatistics(),
        getContracts({ page: 1, limit: 20 }),
        getCustomers({ page: 1, limit: 10 }),
      ]);

      if (bankRes.status === 'fulfilled' && bankRes.value.success && bankRes.value.data) {
        const accs = bankRes.value.data.items || [];
        setBankAccounts(accs);
        const sumBal = accs.reduce((acc, curr) => acc + (Number(curr.currentBalance) || 0), 0);
        if (sumBal > 0) setTotalBankBalance(sumBal);
      }

      if (invoiceRes.status === 'fulfilled' && invoiceRes.value.success && invoiceRes.value.data) {
        setNeedsReviewInvoices(invoiceRes.value.data.items || []);
      }

      if (expenseRes.status === 'fulfilled' && expenseRes.value.success && expenseRes.value.data) {
        setExpenseStats(expenseRes.value.data);
      }

      if (contractRes.status === 'fulfilled' && contractRes.value.success && contractRes.value.data) {
        const contractsList = contractRes.value.data.items || [];
        setTotalContractsCount(contractRes.value.data.total || contractsList.length);
        const revenueSum = contractsList.reduce((acc, c) => acc + (Number(c.contractValue) || 0), 0);
        if (revenueSum > 0) setTotalRevenue(revenueSum);
      }

      if (customerRes.status === 'fulfilled' && customerRes.value.success && customerRes.value.data) {
        setTotalCustomersCount(customerRes.value.data.total || 24);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardContent
      onNavigate={onNavigate}
      representativeName={representativeName}
      isLoading={isLoading}
      onRefresh={fetchDashboardData}
      showCalendar={showCalendar}
      onToggleCalendar={setShowCalendar}
      selectedPeriod={selectedPeriod}
      onChangePeriod={setSelectedPeriod}
      selectedDay={selectedDay}
      onSelectDay={setSelectedDay}
      daysInMonth={daysInMonth}
      totalRevenue={totalRevenue}
      totalContractsCount={totalContractsCount}
      totalBankBalance={totalBankBalance}
      bankAccounts={bankAccounts}
      totalOverdueDebt={totalOverdueDebt}
      needsReviewInvoices={needsReviewInvoices}
      totalCustomersCount={totalCustomersCount}
      expenseStats={expenseStats}
    />
  );
};
