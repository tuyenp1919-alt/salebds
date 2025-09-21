import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Users,
  Building2,
  FolderOpen,
  MessageSquare,
  BarChart3,
  FileText,
  Megaphone,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft,
  Bot,
  MapPin,
  TrendingUp,
  Calendar,
  Star,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number | string;
  color?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Khách hàng', href: '/customers', icon: Users, color: 'text-blue-600' },
  { name: 'Dự án', href: '/projects', icon: Building2, color: 'text-green-600' },
  { name: 'Bất động sản', href: '/properties', icon: FolderOpen, color: 'text-purple-600' },
  { name: 'Tương tác', href: '/interactions', icon: MessageSquare, color: 'text-orange-600' },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, color: 'text-indigo-600', badge: 'NEW' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'text-emerald-600' },
  { name: 'Báo cáo', href: '/reports', icon: FileText },
  { name: 'Marketing', href: '/marketing', icon: Megaphone, color: 'text-pink-600' },
  { name: 'Phong thủy', href: '/feng-shui', icon: MapPin, color: 'text-yellow-600' },
  { name: 'Đào tạo', href: '/training', icon: GraduationCap, color: 'text-teal-600' },
];

const quickActions: NavItem[] = [
  { name: 'Khách mới', href: '/customers/new', icon: Users },
  { name: 'Lịch hẹn', href: '/calendar', icon: Calendar },
  { name: 'Xu hướng', href: '/trends', icon: TrendingUp },
  { name: 'Yêu thích', href: '/favorites', icon: Star },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ${
        open ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">SaleBDS</h1>
                    <p className="text-xs text-gray-500">CRM & AI Assistant</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!open && (
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          {open && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-b border-gray-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {user.fullName.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Main Navigation */}
            <nav className="space-y-1 px-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      active
                        ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    title={!open ? item.name : ''}
                  >
                    <item.icon
                      className={`${
                        active ? 'text-primary-600' : item.color || 'text-gray-400'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    <AnimatePresence>
                      {open && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex-1"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {open && item.badge && (
                      <span className={`ml-auto inline-block px-2 py-1 text-xs rounded-full ${
                        item.badge === 'NEW' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 px-2"
              >
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác nhanh
                </h3>
                <nav className="mt-2 space-y-1">
                  {quickActions.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors"
                    >
                      <item.icon className="text-gray-400 mr-3 flex-shrink-0 h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 p-2">
            <Link
              to="/settings"
              className={`${
                isActive('/settings')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              title={!open ? 'Cài đặt' : ''}
            >
              <Settings className="text-gray-400 mr-3 flex-shrink-0 h-5 w-5" />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    Cài đặt
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-gray-600 hover:bg-red-50 hover:text-red-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              title={!open ? 'Đăng xuất' : ''}
            >
              <LogOut className="text-gray-400 group-hover:text-red-500 mr-3 flex-shrink-0 h-5 w-5" />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    Đăng xuất
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={onClose}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow lg:block hidden"
        >
          <ChevronLeft className={`w-4 h-4 text-gray-600 transition-transform ${open ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;