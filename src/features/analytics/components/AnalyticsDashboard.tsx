import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Phone,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsDashboardProps {
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter' | 'year') => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Mock data - in real app would fetch from API
  const mockData = {
    overview: {
      totalRevenue: 2450000000,
      revenueGrowth: 15.2,
      totalCustomers: 245,
      customerGrowth: 8.5,
      totalProperties: 89,
      propertiesGrowth: 12.1,
      totalCalls: 1432,
      callsGrowth: -3.2,
    },
    salesPerformance: {
      labels: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6'],
      datasets: [
        {
          label: 'Doanh thu (tỷ VNĐ)',
          data: [1.2, 1.5, 1.8, 2.1, 2.3, 2.45],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    },
    customerTypes: {
      labels: ['Tiềm năng', 'Quan tâm', 'Khách hàng', 'Không hoạt động'],
      datasets: [
        {
          data: [35, 25, 30, 10],
          backgroundColor: [
            'rgba(255, 193, 7, 0.8)',
            'rgba(13, 202, 240, 0.8)',
            'rgba(25, 135, 84, 0.8)',
            'rgba(108, 117, 125, 0.8)',
          ],
          borderColor: [
            'rgba(255, 193, 7, 1)',
            'rgba(13, 202, 240, 1)',
            'rgba(25, 135, 84, 1)',
            'rgba(108, 117, 125, 1)',
          ],
          borderWidth: 2,
        },
      ],
    },
    conversionRates: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6'],
      datasets: [
        {
          label: 'Tỷ lệ chuyển đổi (%)',
          data: [65, 72, 68, 75, 82, 78],
          fill: true,
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          borderColor: 'rgba(168, 85, 247, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatGrowth = (value: number) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{value.toFixed(1)}%
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-lg p-6 border">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Tổng quan hiệu suất kinh doanh
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="quarter">3 tháng qua</option>
            <option value="year">12 tháng qua</option>
          </select>

          <button
            onClick={loadAnalyticsData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Tổng doanh thu"
          value={formatCurrency(data.overview.totalRevenue)}
          growth={data.overview.revenueGrowth}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        
        <KPICard
          title="Tổng khách hàng"
          value={data.overview.totalCustomers.toString()}
          growth={data.overview.customerGrowth}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        
        <KPICard
          title="Bất động sản"
          value={data.overview.totalProperties.toString()}
          growth={data.overview.propertiesGrowth}
          icon={Building}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        
        <KPICard
          title="Cuộc gọi"
          value={data.overview.totalCalls.toString()}
          growth={data.overview.callsGrowth}
          icon={Phone}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất bán hàng</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              <span>Theo tháng</span>
            </div>
          </div>
          <div className="h-64">
            <Bar
              data={data.salesPerformance}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}B`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Customer Types Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Phân loại khách hàng</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Pie
              data={data.customerTypes}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Rates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tỷ lệ chuyển đổi</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Line
              data={data.conversionRates}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
          <div className="space-y-4">
            {[
              { name: 'Nguyễn Văn A', sales: 850000000, deals: 12, avatar: 'A' },
              { name: 'Trần Thị B', sales: 720000000, deals: 10, avatar: 'B' },
              { name: 'Lê Minh C', sales: 650000000, deals: 9, avatar: 'C' },
              { name: 'Phạm Thị D', sales: 580000000, deals: 8, avatar: 'D' },
            ].map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {performer.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{performer.name}</div>
                    <div className="text-sm text-gray-500">{performer.deals} deals</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {formatCurrency(performer.sales)}
                  </div>
                  <div className="text-xs text-gray-500">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {[
            {
              type: 'sale',
              message: 'Hoàn thành deal căn hộ Vinhomes Central Park',
              value: '8.5 tỷ VNĐ',
              time: '2 giờ trước',
              agent: 'Nguyễn Văn A',
            },
            {
              type: 'lead',
              message: 'Lead mới từ Facebook Ads',
              value: '3 leads',
              time: '4 giờ trước',
              agent: 'Hệ thống',
            },
            {
              type: 'meeting',
              message: 'Cuộc hẹn với khách hàng Trần Thị B',
              value: 'Thành công',
              time: '6 giờ trước',
              agent: 'Lê Minh C',
            },
            {
              type: 'call',
              message: 'Tư vấn khách hàng qua điện thoại',
              value: '45 phút',
              time: '8 giờ trước',
              agent: 'Phạm Thị D',
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                  activity.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {activity.type === 'sale' ? <DollarSign className="w-5 h-5" /> :
                   activity.type === 'lead' ? <Target className="w-5 h-5" /> :
                   activity.type === 'meeting' ? <Calendar className="w-5 h-5" /> :
                   <Phone className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{activity.message}</div>
                  <div className="text-sm text-gray-500">
                    {activity.agent} • {activity.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{activity.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  growth: number;
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBg: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  growth,
  icon: Icon,
  iconColor,
  iconBg,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="text-right">
          {growth >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        <div className={`flex items-center mt-2 ${
          growth >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="text-sm font-medium">
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs tháng trước</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;