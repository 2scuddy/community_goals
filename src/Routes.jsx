import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import LandingPage from './pages/landing/LandingPage';
import DashboardHome from './pages/dashboard-home';
import LoginRegistration from './pages/login-registration';
import UserProfileSettings from './pages/user-profile-settings';
import GoalCreationManagement from './pages/goal-creation-management';
import GroupDiscoveryMatching from './pages/group-discovery-matching';
import GroupDashboardCommunication from './pages/group-dashboard-communication';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginRegistration />} />
            <Route path="/register" element={<LoginRegistration />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard-home"
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile-settings"
              element={
                <ProtectedRoute>
                  <UserProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goal-creation-management"
              element={
                <ProtectedRoute>
                  <GoalCreationManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group-discovery-matching"
              element={
                <ProtectedRoute>
                  <GroupDiscoveryMatching />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group-dashboard-communication"
              element={
                <ProtectedRoute>
                  <GroupDashboardCommunication />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;