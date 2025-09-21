import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, TrendingUp, DollarSign, Users, Building, Calendar, Download, Filter, Eye } from 'lucide-react';

interface SalesReport {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'customer' | 'property' | 'agent' | 'financial';
  period: string;
  createdAt: string;
  status: 'generated' | 'generating' | 'failed';
  fileSize: string;
  format: 'pdf' | 'excel' | 'csv';
}

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

const mockReports: SalesReport[] = [
  {
    id: '1',
    title: 'Báo cáo Doanh số Tháng 1',
    description: 'Báo cáo tổng hợp doanh số bán hàng và hiệu quả kinh doanh tháng 01/2024',
    type: 'sales',
    period: '01/2024',
    createdAt: '2024-01-31T23:59:00',
    status: 'generated',
    fileSize: '2.5 MB',
    format: 'pdf'
  },
  {
    id: '2',
    title: 'Phân tích Khách hàng Quý 1',
    description: 'Phân tích hành vi, sở thích và xu hướng mua của khách hàng quý 1/2024',
    type: 'customer',
    period: 'Q1/2024',
    createdAt: '2024-01-30T15:30:00',
    status: 'generated',
    fileSize: '1.8 MB',
    format: 'excel'
  },
  {
    id: '3',
    title: 'Báo cáo Hiệu quả Nhân viên',
    description: 'Đánh giá hiệu quả bán hàng của từng nhân viên trong tháng',
    type: 'agent',
    period: '01/2024',
    createdAt: '2024-01-29T10:45:00',
    status: 'generating',
    fileSize: '-',
    format: 'pdf'
  },
  {
    id: '4',
    title: 'Thống kê Bất động sản',
    description: 'Thống kê tồn kho, số lượng bán và tỷ lệ chuyển đổi theo loại BDS',
    type: 'property',
    period: '01/2024',
    createdAt: '2024-01-28T14:20:00',
    status: 'generated',
    fileSize: '3.2 MB',
    format: 'excel'
  },
  {
    id: '5',
    title: 'Báo cáo Tài chính',
    description: 'Tổng quan doanh thu, chi phí và lợi nhuận của công ty',
    type: 'financial',
    period: 'Q1/2024',
    createdAt: '2024-01-25T09:15:00',
    status: 'failed',
    fileSize: '-',
    format: 'pdf'
  }
];

const mockMetrics: MetricData[] = [
  {
    label: 'Tổng Doanh thu',
    value: 15600000000,
    change: 12.5,
    trend: 'up',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'text-green-600'
  },
  {
    label: 'Khách hàng mới',
    value: 156,
    change: -3.2,
    trend: 'down',
    icon: <Users className="w-6 h-6" />,
    color: 'text-blue-600'
  },
  {
    label: 'BDS đã bán',
    value: 89,
    change: 8.7,
    trend: 'up',
    icon: <Building className="w-6 h-6" />,
    color: 'text-purple-600'
  },
  {
    label: 'Tỷ lệ chuyển đổi',
    value: 23.4,
    change: 1.8,
    trend: 'up',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-orange-600'
  }
];

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<SalesReport[]>([]);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
      setFilteredReports(mockReports);
      setMetrics(mockMetrics);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  }, [reports, typeFilter, statusFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <DollarSign size={16} className="text-green-500" />;
      case 'customer':
        return <Users size={16} className="text-blue-500" />;
      case 'property':
        return <Building size={16} className="text-purple-500" />;
      case 'agent':
        return <Users size={16} className="text-orange-500" />;
      case 'financial':
        return <TrendingUp size={16} className="text-red-500" />;
      default:
        return <BarChart size={16} className="text-gray-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'sales':
        return 'Doanh số';
      case 'customer':
        return 'Khách hàng';
      case 'property':
        return 'Bất động sản';
      case 'agent':
        return 'Nhân viên';
      case 'financial':
        return 'Tài chính';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generated':
        return 'Hoàn thành';
      case 'generating':
        return 'Đang tạo';
      case 'failed':
        return 'Lỗi';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-2">Phân tích dữ liệu kinh doanh và tạo báo cáo chi tiết</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <BarChart size={20} />
          Tạo báo cáo mới
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gray-50 ${metric.color}`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
                <TrendingUp size={16} className={metric.trend === 'down' ? 'rotate-180' : ''} />
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {metric.label.includes('Doanh thu') 
                  ? formatCurrency(metric.value)
                  : metric.label.includes('Tỷ lệ')
                  ? `${metric.value}%`
                  : metric.value.toLocaleString('vi-VN')
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
            <LineChart size={20} className="text-blue-500" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart size={48} className="mx-auto mb-2 opacity-50" />
              <p>Biểu đồ doanh thu sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Phân tích khách hàng</h3>
            <PieChart size={20} className="text-purple-500" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart size={48} className="mx-auto mb-2 opacity-50" />
              <p>Biểu đồ phân tích khách hàng sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Danh sách Báo cáo</h2>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tất cả loại</option>
                <option value="sales">Doanh số</option>
                <option value="customer">Khách hàng</option>
                <option value="property">Bất động sản</option>
                <option value="agent">Nhân viên</option>
                <option value="financial">Tài chính</option>
              </select>
              <select
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="generated">Hoàn thành</option>
                <option value="generating">Đang tạo</option>
                <option value="failed">Lỗi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(report.type)}
                    <span className="text-sm text-gray-600">{getTypeText(report.type)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Kỳ: {report.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Tạo: {formatDateTime(report.createdAt)}</span>
                      </div>
                      {report.status === 'generated' && (
                        <div>
                          <span>Kích thước: {report.fileSize}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Xem báo cáo"
                    >
                      <Eye size={16} />
                    </button>
                    {report.status === 'generated' && (
                      <button 
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="Tải xuống"
                      >
                        <Download size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <BarChart size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có báo cáo nào</h3>
            <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc tạo báo cáo mới</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Tạo báo cáo đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Report Templates */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Mẫu Báo cáo Có sẵn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <h3 className="font-semibold text-gray-900">Báo cáo Doanh số</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Tổng hợp doanh thu, số lượng giao dịch và hiệu quả bán hàng</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Tạo báo cáo →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Phân tích Khách hàng</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Phân tích hành vi, sở thích và xu hướng của khách hàng</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Tạo báo cáo →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-8 h-8 text-purple-500" />
              <h3 className="font-semibold text-gray-900">Thống kê BDS</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Báo cáo tình hình tồn kho và hiệu quả bán theo loại BDS</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Tạo báo cáo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;