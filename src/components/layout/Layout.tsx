import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import NotificationPanel from './NotificationPanel';
import AIFloatingButton from '@/features/ai/components/AIFloatingButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { user } = useAuth();
  const { actualTheme } = useTheme();
  const { unreadCount } = useNotifications();

  return (
    <div className={`min-h-screen bg-gray-50 ${actualTheme === 'dark' ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation 
          isOpen={mobileMenuOpen} 
          onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
            unreadNotifications={unreadCount}
          />
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6 pt-4 lg:pt-20 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        open={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* AI Floating Button */}
      <AIFloatingButton />
    </div>
  );
};

export default Layout;