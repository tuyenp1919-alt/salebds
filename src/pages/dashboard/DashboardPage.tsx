import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building,
  TrendingUp,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Target,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  // Mock data - trong thực tế sẽ fetch từ API
  const stats = {
    totalCustomers: 245,
    totalProperties: 89,
    totalDeals: 156,
    monthlyRevenue: 2450000000,
    todayTasks: 8,
    pendingCalls: 12,
    newLeads: 24,
    conversionRate: 68,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'lead',
      message: 'Có 3 lead mới từ Facebook',
      time: '10 phút trước',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      type: 'deal',
      message: 'Deal căn hộ 3PN đã được ký hợp đồng',
      time: '1 giờ trước',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 3,
      type: 'task',
      message: 'Nhắc nhở: Gọi cho khách hàng Nguyễn Văn A',
      time: '2 giờ trước',
      icon: Phone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: 4,
      type: 'property',
      message: 'Bất động sản mới đã được thêm vào hệ thống',
      time: '3 giờ trước',
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    change?: string;
    changeType?: 'positive' | 'negative';
  }> = ({ title, value, icon: Icon, color, bgColor, change, changeType }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {typeof value === 'number' && title.includes('Revenue') 
              ? `${value.toLocaleString('vi-VN')}đ`
              : value}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Tổng quan hoạt động kinh doanh hôm nay
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng khách hàng"
            value={stats.totalCustomers}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-100"
            change="+12% từ tháng trước"
            changeType="positive"
          />
          
          <StatCard
            title="Bất động sản"
            value={stats.totalProperties}
            icon={Building}
            color="text-green-600"
            bgColor="bg-green-100"
            change="+5 BDS mới"
            changeType="positive"
          />

          <StatCard
            title="Deals hoàn thành"
            value={stats.totalDeals}
            icon={TrendingUp}
            color="text-purple-600"
            bgColor="bg-purple-100"
            change="+8% từ tháng trước"
            changeType="positive"
          />

          <StatCard
            title="Doanh thu tháng"
            value={stats.monthlyRevenue}
            icon={DollarSign}
            color="text-green-600"
            bgColor="bg-green-100"
            change="+15% từ tháng trước"
            changeType="positive"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hành động nhanh
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium">Thêm khách hàng mới</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Building className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium">Thêm bất động sản</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium">Lên lịch cuộc gọi</span>
              </button>
              
              <button className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Target className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium">Tạo chiến dịch marketing</span>
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hoạt động gần đây
            </h3>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: activity.id * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-5">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Xem tất cả hoạt động →
              </button>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nhiệm vụ hôm nay</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.todayTasks}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cuộc gọi chờ</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingCalls}</p>
              </div>
              <Phone className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lead mới</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.newLeads}</p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ chuyển đổi</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.conversionRate}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;