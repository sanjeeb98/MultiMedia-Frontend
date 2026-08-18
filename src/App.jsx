import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import DashboardPage from './pages/DashboardPage';
import FilesPage from './pages/FilesPage';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppRoutes() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Protected SaaS Layout Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FilesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UploadPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SearchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Root & Catch-all redirects */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
