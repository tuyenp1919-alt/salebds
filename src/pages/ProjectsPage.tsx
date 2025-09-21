import React, { useState, useEffect } from 'react';
import { PlusCircle, Building, MapPin, Calendar, DollarSign, Users, Eye, Edit, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  status: 'planning' | 'construction' | 'selling' | 'completed';
  startDate: string;
  expectedCompletion: string;
  totalUnits: number;
  soldUnits: number;
  averagePrice: number;
  developer: string;
  images: string[];
  amenities: string[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Vinhomes Grand Park',
    location: 'Quận 9, TP. Hồ Chí Minh',
    description: 'Khu đô thị hiện đại với đầy đủ tiện ích cao cấp, không gian sống xanh và giao thông thuận lợi.',
    status: 'selling',
    startDate: '2023-01-15',
    expectedCompletion: '2025-12-30',
    totalUnits: 500,
    soldUnits: 320,
    averagePrice: 3500000000,
    developer: 'Vingroup',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    amenities: ['Hồ bơi', 'Gym', 'Công viên', 'Trường học', 'Bệnh viện']
  },
  {
    id: '2',
    name: 'Masteri Thảo Điền',
    location: 'Quận 2, TP. Hồ Chí Minh',
    description: 'Căn hộ cao cấp view sông Sài Gòn với thiết kế hiện đại và tiện ích 5 sao.',
    status: 'construction',
    startDate: '2023-06-01',
    expectedCompletion: '2024-12-30',
    totalUnits: 300,
    soldUnits: 180,
    averagePrice: 4200000000,
    developer: 'Masteri',
    images: ['/api/placeholder/400/300'],
    amenities: ['Sky Bar', 'Infinity Pool', 'Co-working Space', 'Shopping Mall']
  },
  {
    id: '3',
    name: 'The Sun Avenue',
    location: 'Quận 2, TP. Hồ Chí Minh',
    description: 'Tổ hợp căn hộ và thương mại cao cấp tại trung tâm thành phố.',
    status: 'completed',
    startDate: '2021-03-01',
    expectedCompletion: '2023-08-30',
    totalUnits: 400,
    soldUnits: 400,
    averagePrice: 3800000000,
    developer: 'Novaland',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    amenities: ['Shopping Center', 'Food Court', 'Kids Zone', 'Business Center']
  }
];

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchProjects = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.developer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'selling':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning':
        return 'Đang lên kế hoạch';
      case 'construction':
        return 'Đang xây dựng';
      case 'selling':
        return 'Đang bán';
      case 'completed':
        return 'Hoàn thành';
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

  const calculateProgress = (soldUnits: number, totalUnits: number) => {
    return Math.round((soldUnits / totalUnits) * 100);
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Dự án</h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý các dự án bất động sản</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <PlusCircle size={20} />
          Thêm dự án mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng dự án</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <Building className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang bán</p>
              <p className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'selling').length}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng căn hộ</p>
              <p className="text-2xl font-bold text-blue-600">
                {projects.reduce((sum, p) => sum + p.totalUnits, 0)}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã bán</p>
              <p className="text-2xl font-bold text-purple-600">
                {projects.reduce((sum, p) => sum + p.soldUnits, 0)}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm dự án, vị trí, chủ đầu tư..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="planning">Đang lên kế hoạch</option>
              <option value="construction">Đang xây dựng</option>
              <option value="selling">Đang bán</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {/* Project Image */}
            <div className="h-48 bg-gray-200 relative">
              <img
                src={project.images[0] || '/api/placeholder/400/300'}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">{project.location}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ bán hàng</span>
                  <span>{calculateProgress(project.soldUnits, project.totalUnits)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${calculateProgress(project.soldUnits, project.totalUnits)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{project.soldUnits} đã bán</span>
                  <span>{project.totalUnits} tổng số</span>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Giá trung bình</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(project.averagePrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Chủ đầu tư</p>
                  <p className="font-semibold text-gray-900">{project.developer}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Eye size={16} />
                  Xem chi tiết
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit size={16} />
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Building size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy dự án</h3>
          <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc thêm dự án mới</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Thêm dự án đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;