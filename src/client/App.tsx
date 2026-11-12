import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/shell/AppShell';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { ActivityPage } from '@/pages/ActivityPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';

function BootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-3">
        <div className="skeleton h-4 w-24 rounded-md" />
        <div className="skeleton h-10 w-full rounded-md" />
        <div className="skeleton h-10 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

function AuthedRoutes() {
  const { booting, token } = useAuth();

  if (booting) return <BootScreen />;
  if (!token) return <LoginPage />;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/:subject/:activity" element={<ActivityPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AuthedRoutes />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
