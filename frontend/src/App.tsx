import { useState } from 'react';
import { LoginPage } from './pages/auth/LoginPage';
import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';

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
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppLayout onLogout={handleLogout}>
      {({ activeTab, setActiveTab }) => (
        <AppRoutes
          activeTab={activeTab}
          onNavigate={setActiveTab}
          onLogout={handleLogout}
        />
      )}
    </AppLayout>
  );
}
