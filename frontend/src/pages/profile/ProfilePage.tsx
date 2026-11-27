// src/pages/profile/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { logout, getCompany, updateCompany, changePassword, getProfile } from '../../services/authService';
import { ProfileContent } from '../../components/profile/ProfileContent';

interface ProfilePageProps {
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState('Nguyễn Văn Minh');
  const [companyName, setCompanyName] = useState('Công ty TNHH Một thành viên Minh Software');
  const [taxCode, setTaxCode] = useState('0319002001');
  const [phone, setPhone] = useState('028 3512 2001');
  const [email, setEmail] = useState('ketoan@minhsoftware.example');
  const [address, setAddress] = useState('Số 2 Võ Oanh, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const profileRes = await getProfile();
        if (profileRes.success && profileRes.data) {
          if (profileRes.data.fullName) setFullName(profileRes.data.fullName);
        }
        const compRes = await getCompany();
        if (compRes.success && compRes.data) {
          const comp = compRes.data;
          if (comp.companyName) setCompanyName(comp.companyName);
          if (comp.taxCode) setTaxCode(comp.taxCode);
          if (comp.address) setAddress(comp.address);
          if (comp.email) setEmail(comp.email);
          if (comp.phone) setPhone(comp.phone);
          if (comp.representative) setFullName(comp.representative);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu hồ sơ:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateCompany = async () => {
    setIsLoading(true);
    const res = await updateCompany({ companyName, taxCode, address, email, phone, representative: fullName });
    setIsLoading(false);
    if (res.success) {
      setShowEditModal(false);
      showToast('Cập nhật thông tin doanh nghiệp vào Database thành công!');
    } else {
      alert(res.message || 'Cập nhật thất bại');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }
    setIsLoading(true);
    const res = await changePassword({ currentPassword, newPassword });
    setIsLoading(false);
    if (res.success) {
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Đã đổi mật khẩu thành công!');
    } else {
      alert(res.message || 'Đổi mật khẩu thất bại, kiểm tra lại mật khẩu cũ');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại?')) {
      await logout();
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <ProfileContent
      fullName={fullName}
      setFullName={setFullName}
      companyName={companyName}
      setCompanyName={setCompanyName}
      taxCode={taxCode}
      setTaxCode={setTaxCode}
      phone={phone}
      setPhone={setPhone}
      email={email}
      setEmail={setEmail}
      address={address}
      setAddress={setAddress}
      isLoading={isLoading}
      toastMsg={toastMsg}
      showEditModal={showEditModal}
      setShowEditModal={setShowEditModal}
      showPasswordModal={showPasswordModal}
      setShowPasswordModal={setShowPasswordModal}
      showLicenseModal={showLicenseModal}
      setShowLicenseModal={setShowLicenseModal}
      currentPassword={currentPassword}
      setCurrentPassword={setCurrentPassword}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      onUpdateCompany={handleUpdateCompany}
      onChangePassword={handleChangePassword}
      onLogout={handleLogout}
    />
  );
};
