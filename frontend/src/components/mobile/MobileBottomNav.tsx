import React, { useRef } from 'react';
import { LayoutGrid, Sparkles, Camera, Wallet, Settings } from 'lucide-react';
import { uploadPurchaseInvoice } from '../../services/invoiceService';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadPurchaseInvoice(file);
      if (res.success) {
        alert(`Đã tải lên và bắt đầu bóc tách hóa đơn: ${file.name}`);
        setActiveTab('invoices');
      } else {
        alert(res.message || 'Lỗi khi tải ảnh hóa đơn');
      }
    } catch {
      alert('Lỗi kết nối khi gửi ảnh hóa đơn lên server!');
    } finally {
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Input ẩn để kích hoạt trực tiếp Camera điện thoại */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        className="hidden"
        onChange={handleCameraCapture}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg select-none">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* Nút 1: Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'text-blue-600 font-bold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Dashboard</span>
          </button>

          {/* Nút 2: Copilot */}
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'copilot'
                ? 'text-purple-600 font-bold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Copilot</span>
          </button>

          {/* Nút chính giữa: FLOATING ACTION BUTTON (FAB) SCAN HÓA ĐƠN */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-white active:scale-95 transition-all cursor-pointer"
              title="Chụp ảnh hóa đơn từ Camera hoặc tải file"
            >
              <Camera className="w-6 h-6" />
            </button>
            <span className="text-[10px] font-bold text-blue-600 mt-1">Scan</span>
          </div>

          {/* Nút 4: Finance (Thu chi & Công nợ) */}
          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'finance'
                ? 'text-blue-600 font-bold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Finance</span>
          </button>

          {/* Nút 5: Settings */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'text-blue-600 font-bold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
};
