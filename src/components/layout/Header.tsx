import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  User,
  Settings,
  LogOut,
  Plus,
  MessageCircle,
  Phone,
  Calendar,
  MoreHorizontal,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  unreadNotifications: number;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onNotificationClick,
  unreadNotifications,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const { user, logout } = useAuth();
  const { theme, actualTheme, setTheme } = useTheme();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(userMenuRef, () => setUserMenuOpen(false));
  useOnClickOutside(themeMenuRef, () => setThemeMenuOpen(false));
  useOnClickOutside(quickActionsRef, () => setQuickActionsOpen(false));

  const themeOptions = [
    { key: 'light', label: 'Sáng', icon: Sun },
    { key: 'dark', label: 'Tối', icon: Moon },
    { key: 'auto', label: 'Tự động', icon: Monitor },
  ];

  const quickActions = [
    { name: 'Khách hàng mới', href: '/customers/new', icon: Plus, color: 'text-blue-600' },
    { name: 'Cuộc gọi', href: '/interactions/call', icon: Phone, color: 'text-green-600' },
    { name: 'Tin nhắn', href: '/interactions/message', icon: MessageCircle, color: 'text-purple-600' },
    { name: 'Lịch hẹn', href: '/calendar', icon: Calendar, color: 'text-orange-600' },
  ];

  const getThemeIcon = () => {
    const ThemeIcon = themeOptions.find(opt => opt.key === theme)?.icon || Monitor;
    return <ThemeIcon className="w-5 h-5" />;
  };

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative">
            <div className={`flex items-center transition-all duration-300 ${
              searchOpen ? 'w-80' : 'w-10'
            }`}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Tìm kiếm khách hàng, dự án, BĐS..."
                    className="ml-2 flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    autoFocus
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Thao tác nhanh"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {quickActionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      to={action.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setQuickActionsOpen(false)}
                    >
                      <action.icon className={`w-4 h-4 mr-3 ${action.color}`} />
                      {action.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title={`Theme: ${theme}`}
            >
              {getThemeIcon()}
            </button>

            <AnimatePresence>
              {themeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {themeOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setTheme(option.key as any);
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                        theme === option.key
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <option.icon className="w-4 h-4 mr-3" />
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.fullName.charAt(0)}
                </span>
              </div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-400 capitalize mt-1">{user?.role}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Hồ sơ cá nhân
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>

                    <hr className="my-2" />

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;