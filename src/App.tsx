import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Public & Auth
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// EV User
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { InteractiveMapPage } from './pages/user/InteractiveMapPage';
import { FindChargersPage } from './pages/user/FindChargersPage';
import { StationDetailsPage } from './pages/user/StationDetailsPage';
import { SmartChargingPage } from './pages/user/SmartChargingPage';
import { ReservationFlowPage } from './pages/user/ReservationFlowPage';
import { ReservationConfirmationPage } from './pages/user/ReservationConfirmationPage';
import { OtpVerificationPage } from './pages/user/OtpVerificationPage';
import { ActiveChargingPage } from './pages/user/ActiveChargingPage';
import { ChargingHistoryPage } from './pages/user/ChargingHistoryPage';
import { QueueStatusPage } from './pages/user/QueueStatusPage';
import { UserProfilePage } from './pages/user/UserProfilePage';

// Station Owner
import { OwnerDashboardPage } from './pages/owner/OwnerDashboardPage';
import { ChargerManagementPage } from './pages/owner/ChargerManagementPage';
import { OwnerReservationsPage } from './pages/owner/OwnerReservationsPage';
import { LiveChargingSessionsPage } from './pages/owner/LiveChargingSessionsPage';
import { OwnerQueuePage } from './pages/owner/OwnerQueuePage';
import { OwnerAnalyticsPage } from './pages/owner/OwnerAnalyticsPage';
import { OwnerSettingsPage } from './pages/owner/OwnerSettingsPage';

// Admin
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminStationsPage } from './pages/admin/AdminStationsPage';
import { ConflictManagementPage } from './pages/admin/ConflictManagementPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* Landing & Authentication */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* EV User Ecosystem */}
            <Route path="user/dashboard" element={<UserDashboardPage />} />
            <Route path="user/stations" element={<FindChargersPage />} />
            <Route path="user/map" element={<InteractiveMapPage />} />
            <Route path="user/stations/:id" element={<StationDetailsPage />} />
            <Route path="user/smart-charging" element={<SmartChargingPage />} />
            <Route path="user/reserve" element={<ReservationFlowPage />} />
            <Route path="user/reservation/:id" element={<ReservationConfirmationPage />} />
            <Route path="user/verify-otp" element={<OtpVerificationPage />} />
            <Route path="user/active-session" element={<ActiveChargingPage />} />
            <Route path="user/history" element={<ChargingHistoryPage />} />
            <Route path="user/queue" element={<QueueStatusPage />} />
            <Route path="user/profile" element={<UserProfilePage />} />

            {/* Station Owner Ecosystem */}
            <Route path="owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="owner/chargers" element={<ChargerManagementPage />} />
            <Route path="owner/reservations" element={<OwnerReservationsPage />} />
            <Route path="owner/live-sessions" element={<LiveChargingSessionsPage />} />
            <Route path="owner/queue" element={<OwnerQueuePage />} />
            <Route path="owner/analytics" element={<OwnerAnalyticsPage />} />
            <Route path="owner/settings" element={<OwnerSettingsPage />} />

            {/* Platform Admin Ecosystem */}
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="admin/stations" element={<AdminStationsPage />} />
            <Route path="admin/conflicts" element={<ConflictManagementPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/reports" element={<AdminReportsPage />} />
            <Route path="admin/settings" element={<AdminSettingsPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
