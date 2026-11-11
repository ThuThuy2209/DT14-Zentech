import React from 'react';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  return (
    <AppLayout>
      {({ activeTab }) => (
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đang chọn tab: {activeTab}</h1>
          <p className="text-slate-500 mt-2">Khung AppLayout đã chạy hoàn hảo! Sẵn sàng ráp nội dung Dashboard vào đây.</p>
        </div>
      )}
    </AppLayout>
  );
}