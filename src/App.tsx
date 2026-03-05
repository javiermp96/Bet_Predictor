import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ValueBetsPage } from './pages/ValueBetsPage';
import { TrendsPage } from './pages/TrendsPage';
import { HistoryPage } from './pages/HistoryPage';
import { UpcomingMatchesPage } from './pages/UpcomingMatchesPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (Need user session) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="value-bets" element={<ValueBetsPage />} />
              <Route path="trends" element={<TrendsPage />} />
              <Route path="upcoming" element={<UpcomingMatchesPage />} />
              <Route path="results" element={<HistoryPage />} />
            </Route>
          </Route>

          {/* Admin Protected Route */}
          <Route element={<AdminRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route path="admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
