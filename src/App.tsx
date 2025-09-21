import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationHelpers } from '@/contexts/NotificationContext';

// Layout Components
import Layout from '@/components/layout/Layout';
import AuthLayout from '@/components/layout/AuthLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Auth Pages (Lazy loaded)
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// Main App Pages (Lazy loaded)
const DashboardPage = React.lazy(() => import('@/pages/dashboard/DashboardPage'));
const CustomersPage = React.lazy(() => import('@/pages/Customers'));
// const CustomerDetailsPage = React.lazy(() => import('@/pages/customers/CustomerDetailsPage'));
const PropertiesPage = React.lazy(() => import('@/pages/Properties'));
// const PropertyDetailsPage = React.lazy(() => import('@/pages/properties/PropertyDetailsPage'));
// const ProjectsPage = React.lazy(() => import('@/pages/projects/ProjectsPage'));
// const ProjectDetailsPage = React.lazy(() => import('@/pages/projects/ProjectDetailsPage'));
// const InteractionsPage = React.lazy(() => import('@/pages/interactions/InteractionsPage'));
const AnalyticsPage = React.lazy(() => import('@/pages/analytics/AnalyticsPage'));
// const ReportsPage = React.lazy(() => import('@/pages/reports/ReportsPage'));
const MarketingPage = React.lazy(() => import('@/pages/MarketingPage'));
const FengShuiPage = React.lazy(() => import('@/pages/FengShuiPage'));
// const TrainingPage = React.lazy(() => import('@/pages/training/TrainingPage'));
// const SettingsPage = React.lazy(() => import('@/pages/settings/SettingsPage'));
// const ProfilePage = React.lazy(() => import('@/pages/profile/ProfilePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect authenticated users)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { notifySuccess } = useNotificationHelpers();

  // Show welcome notification for newly authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      const lastWelcome = localStorage.getItem('last_welcome');
      const today = new Date().toDateString();
      
      if (lastWelcome !== today) {
        setTimeout(() => {
          notifySuccess(
            `Chào mừng trở lại, ${user.fullName}! 👋`,
            'Hãy bắt đầu ngày làm việc hiệu quả với SaleBDS',
            '/dashboard'
          );
          localStorage.setItem('last_welcome', today);
        }, 2000);
      }
    }
  }, [isAuthenticated, user, notifySuccess]);

  // Handle app updates
  useEffect(() => {
    const handleAppUpdate = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    };

    handleAppUpdate();
  }, []);

  return (
    <div className="App min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            </PublicRoute>
          } />
          
          <Route path="/forgot-password" element={
            <PublicRoute>
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* CRM Routes */}
          <Route path="/customers" element={
            <ProtectedRoute>
              <Layout>
                <CustomersPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Customer Details - not implemented yet */}
          {/* <Route path="/customers/:customerId" element={
            <ProtectedRoute>
              <Layout>
                <CustomerDetailsPage />
              </Layout>
            </ProtectedRoute>
          } /> */}

          {/* Properties Routes */}
          <Route path="/properties" element={
            <ProtectedRoute>
              <Layout>
                <PropertiesPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Property Details - not implemented yet */}
          {/* <Route path="/properties/:propertyId" element={
            <ProtectedRoute>
              <Layout>
                <PropertyDetailsPage />
              </Layout>
            </ProtectedRoute>
          } /> */}

          {/* Projects Routes */}
          {/* Projects - not implemented yet */}
          {/* <Route path="/projects" element={
            <ProtectedRoute>
              <Layout>
                <ProjectsPage />
              </Layout>
            </ProtectedRoute>
          } /> */}
          
          {/* Project details - not implemented yet */}
          {/* <Route path="/projects/:projectId" element={
            <ProtectedRoute>
              <Layout>
                <ProjectDetailsPage />
              </Layout>
            </ProtectedRoute>
          } /> */}

          {/* Interactions Route */}
          {/* Interactions - not implemented yet */}
          {/* <Route path="/interactions" element={
            <ProtectedRoute>
              <Layout>
                <InteractionsPage />
              </Layout>
            </ProtectedRoute>
          } /> */}

          {/* Analytics & Reports Routes */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Reports - not implemented yet */}
          {/* <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          } /> */}

          {/* Marketing Route */}
          <Route path="/marketing" element={
            <ProtectedRoute>
              <Layout>
                <MarketingPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Feng Shui Route */}
          <Route path="/feng-shui" element={
            <ProtectedRoute>
              <Layout>
                <FengShuiPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Training Route - not implemented yet */}
          {/* <Route path="/training" element={
            <ProtectedRoute>
              <Layout>
                <TrainingPage />
              </Layout>
            </ProtectedRoute>
          } /> */}

          {/* Settings & Profile Routes - not implemented yet */}
          {/* <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } /> */}

          {/* Root redirect */}
          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } />

          {/* 404 Route */}
          <Route path="*" element={
            <Layout>
              <NotFoundPage />
            </Layout>
          } />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;