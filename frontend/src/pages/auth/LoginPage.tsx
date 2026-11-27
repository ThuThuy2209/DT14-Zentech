// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { login } from '../../services/authService';
import { LoginForm } from '../../components/auth/LoginForm';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const res = await login({ email, password });

    setIsLoading(false);

    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMessage(res.message || 'Đăng nhập không thành công');
    }
  };

  return (
    <LoginForm
      email={email}
      onChangeEmail={setEmail}
      password={password}
      onChangePassword={setPassword}
      showPassword={showPassword}
      onToggleShowPassword={() => setShowPassword((prev) => !prev)}
      rememberMe={rememberMe}
      onChangeRememberMe={setRememberMe}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
    />
  );
};
