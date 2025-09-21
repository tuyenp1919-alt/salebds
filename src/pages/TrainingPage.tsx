import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Search, PlayCircle, Download, CheckCircle, Clock, Tag, User, Award } from 'lucide-react';

interface TrainingResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'document' | 'course';
  duration?: number; // minutes
  author: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  progress?: number; // 0-100
  publishedAt: string;
}

const mockResources: TrainingResource[] = [
  {
    id: '1',
    title: 'Kỹ năng Chốt Sale BĐS Chuyên Nghiệp',
    description: 'Tổng hợp các kỹ thuật chốt sale hiệu quả cho nhân viên kinh doanh bất động sản.',
    type: 'course',
    duration: 180,
    author: 'Nguyễn Minh Tuấn',
    level: 'advanced',
    tags: ['sale', 'closing', 'kỹ năng mềm'],
    progress: 40,
    publishedAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Quy trình Pháp lý trong Giao dịch BĐS',
    description: 'Hiểu rõ các thủ tục pháp lý bắt buộc trong quá trình mua bán nhà đất.',
    type: 'article',
    author: 'Luật sư Trần Lan',
    level: 'intermediate',
    tags: ['pháp lý', 'hợp đồng', 'thủ tục'],
    publishedAt: '2024-01-05'
  },
  {
    id: '3',
    title: 'Kỹ năng Tư vấn qua Điện thoại',
    description: 'Các tips và scripts giúp tăng tỷ lệ chuyển đổi qua điện thoại.',
    type: 'video',
    duration: 25,
    author: 'Trung tâm Đào tạo SaleBDS',
    level: 'beginner',
    tags: ['call', 'tư vấn', 'kịch bản'],
    progress: 100,
    publishedAt: '2023-12-28'
  },
  {
    id: '4',
    title: 'Mẫu Hợp đồng Mua bán Căn hộ',
    description: 'File mẫu hợp đồng chuẩn, có thể tải về và chỉnh sửa theo nhu cầu.',
    type: 'document',
    author: 'Phòng Pháp chế',
    level: 'intermediate',
    tags: ['mẫu', 'hợp đồng', 'document'],
    publishedAt: '2024-01-12'
  }
];

const TrainingPage: React.FC = () => {
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<TrainingResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      setResources(mockResources);
      setFilteredResources(mockResources);
      setIsLoading(false);
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(r => r.level === levelFilter);
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, typeFilter, levelFilter]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'article':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Bài viết</span>;
      case 'video':
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Video</span>;
      case 'document':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Tài liệu</span>;
      case 'course':
        return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Khóa học</span>;
      default:
        return null;
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return level;
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tài liệu Đào tạo</h1>
          <p className="text-gray-600 mt-2">Tổng hợp tài liệu, video và khóa học dành cho Sales BĐS</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề, mô tả, tác giả, tag..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              <option value="article">Bài viết</option>
              <option value="video">Video</option>
              <option value="document">Tài liệu</option>
              <option value="course">Khóa học</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((r) => (
          <div key={r.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{r.title}</h3>
              {getTypeBadge(r.type)}
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{r.description}</p>

            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{r.author}</span>
              </div>
              {r.duration && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{r.duration} phút</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Award size={14} />
                <span>{getLevelText(r.level)}</span>
              </div>
            </div>

            {typeof r.progress === 'number' && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>{r.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${r.progress}%` }}></div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {r.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {(r.type === 'video' || r.type === 'course') && (
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem">
                    <PlayCircle size={18} />
                  </button>
                )}
                {r.type === 'document' && (
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Tải xuống">
                    <Download size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có tài liệu</h3>
          <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc thêm tài liệu mới</p>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;