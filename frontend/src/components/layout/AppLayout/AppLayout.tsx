import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { MobileTopBar } from '../../mobile/MobileTopBar';
import { MobileBottomNav } from '../../mobile/MobileBottomNav';
import { VALID_TABS } from '../../../routes/routeConfig';
import './AppLayout.css';

const getInitialTab = (): string => {
  if (typeof window === 'undefined') return 'dashboard';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if ((VALID_TABS as readonly string[]).includes(path)) {
    return path;
  }
  return 'dashboard';
};

interface AppLayoutProps {
  children: (props: { activeTab: string; setActiveTab: (tab: string) => void }) => React.ReactNode;
  onLogout?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onLogout }) => {
  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const mainRef = useRef<HTMLElement | null>(null);

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined' && window.location.pathname !== `/${tab}`) {
      window.history.pushState({ tab }, '', `/${tab}`);
    }
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '');

    if (!(VALID_TABS as readonly string[]).includes(currentPath)) {
      window.history.replaceState({ tab: activeTab }, '', `/${activeTab}`);
    }

    const handlePopState = () => {
      const tabFromPath = getInitialTab();
      setActiveTabState(tabFromPath);
      if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeTab]);

  return (
    <div className="app-layout-shell flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setActiveTab('profile')}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden">
          <MobileTopBar
            onOpenProfile={() => setActiveTab('profile')}
            onNavigate={setActiveTab}
          />
        </div>

        <Header
          onUploadInvoiceClick={() => setActiveTab('invoices')}
          onNavigate={setActiveTab}
        />

        <main ref={mainRef} className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          {children({ activeTab, setActiveTab })}
        </main>

        <div className="md:hidden">
          <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Hồ sơ người dùng • Anh Minh</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src="avatar.jpg"
                  alt="Anh Minh"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Nguyễn Văn Minh</h4>
                  <p className="text-xs text-blue-600 font-semibold">Giám đốc • Minh Software Studio</p>
                  <p className="text-xs text-slate-500 mt-0.5">Doanh nghiệp một người (OPC)</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs text-slate-700 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã số thuế:</span>
                  <span className="font-semibold text-slate-900">0319002001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ trụ sở:</span>
                  <span className="font-semibold text-slate-900 text-right">Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gói bản quyền:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    OPC Enterprise v2.4
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
