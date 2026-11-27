// src/pages/settings/SettingsPage.tsx
import React, { useState } from 'react';
import { SettingsContent } from '../../components/settings/SettingsContent';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'rules' | 'sandbox'>('rules');
  const [hitlEnabled, setHitlEnabled] = useState(true);
  const [debtThreshold, setDebtThreshold] = useState(30);
  const [vatRate, setVatRate] = useState('10% (Dịch vụ & Sản phẩm CNTT)');
  const [reconcileFrequency, setReconcileFrequency] = useState('Hàng ngày lúc 08:00 sáng');
  const [companyName, setCompanyName] = useState('Công ty TNHH Một thành viên Minh Software');
  const [representative, setRepresentative] = useState('Nguyễn Văn Minh');
  const [position, setPosition] = useState('Giám đốc');
  const [phone, setPhone] = useState('028 3512 2001');
  const [address, setAddress] = useState('Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM');
  const [email, setEmail] = useState('ketoan@minhsoftware.example');
  const [bankAccount, setBankAccount] = useState('102099000001 - Vietcombank CN TP.HCM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép: ${text}`);
  };

  return (
    <SettingsContent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      hitlEnabled={hitlEnabled}
      setHitlEnabled={setHitlEnabled}
      debtThreshold={debtThreshold}
      setDebtThreshold={setDebtThreshold}
      vatRate={vatRate}
      setVatRate={setVatRate}
      reconcileFrequency={reconcileFrequency}
      setReconcileFrequency={setReconcileFrequency}
      companyName={companyName}
      setCompanyName={setCompanyName}
      representative={representative}
      setRepresentative={setRepresentative}
      position={position}
      setPosition={setPosition}
      phone={phone}
      setPhone={setPhone}
      address={address}
      setAddress={setAddress}
      email={email}
      setEmail={setEmail}
      bankAccount={bankAccount}
      setBankAccount={setBankAccount}
      toastMessage={toastMessage}
      onShowToast={showToast}
      onCopyToClipboard={copyToClipboard}
    />
  );
};
