import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/features/home/HomePage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { PublicRoute } from '@/components/common/PublicRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & User Dashboard */}
        <Route path="/" element={<HomePage />} />

        {/* Guest-only Auth Routes (redirects to / if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
