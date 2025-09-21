import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Calendar, User, Building, Clock, Plus, Filter, Search } from 'lucide-react';

interface Interaction {
  id: string;
  customerId: string;
  customerName: string;
  propertyId?: string;
  propertyName?: string;
  type: 'call' | 'email' | 'meeting' | 'message';
  subject: string;
  description: string;
  outcome: 'pending' | 'completed' | 'scheduled' | 'cancelled';
  createdAt: string;
  scheduledAt?: string;
  duration?: number; // in minutes
  agentName: string;
  priority: 'low' | 'medium' | 'high';
  followUp?: string;
  tags: string[];
}

const mockInteractions: Interaction[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Nguyễn Văn An',
    propertyId: '1',
    propertyName: 'Căn hộ Vinhomes Central Park',
    type: 'call',
    subject: 'Tư vấn về giá và chính sách thanh toán',
    description: 'Khách hàng quan tâm đến căn hộ 2PN, hỏi về chính sách thanh toán và khuyến mãi hiện tại. Đã cung cấp bảng giá và lịch thanh toán.',
    outcome: 'completed',
    createdAt: '2024-01-20T14:30:00',
    duration: 25,
    agentName: 'Trần Thị Bình',
    priority: 'high',
    followUp: 'Gửi hợp đồng mẫu và lịch hẹn xem nhà',
    tags: ['mua-ban', 'tu-van-gia', 'khach-tiem-nang']
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Lê Thị Cẩm',
    type: 'email',
    subject: 'Gửi thông tin dự án mới',
    description: 'Gửi brochure và thông tin chi tiết về dự án Masteri Thảo Điền cho khách hàng đã quan tâm.',
    outcome: 'completed',
    createdAt: '2024-01-19T09:15:00',
    agentName: 'Võ Minh Đức',
    priority: 'medium',
    tags: ['marketing', 'du-an-moi', 'gui-thong-tin']
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Hoàng Minh Tuấn',
    propertyId: '2',
    propertyName: 'Nhà phố The Sun Avenue',
    type: 'meeting',
    subject: 'Hẹn xem nhà và ký hợp đồng',
    description: 'Cuộc hẹn xem nhà tại dự án The Sun Avenue và thảo luận về điều khoản hợp đồng.',
    outcome: 'scheduled',
    createdAt: '2024-01-18T16:45:00',
    scheduledAt: '2024-01-25T10:00:00',
    agentName: 'Nguyễn Thành Nam',
    priority: 'high',
    followUp: 'Chuẩn bị hợp đồng và tài liệu pháp lý',
    tags: ['xem-nha', 'hop-dong', 'khach-mua']
  },
  {
    id: '4',
    customerId: '1',
    customerName: 'Nguyễn Văn An',
    type: 'message',
    subject: 'Tin nhắn hỏi về tiến độ dự án',
    description: 'Khách hàng nhắn tin qua Zalo hỏi về tiến độ xây dựng và dự kiến bàn giao căn hộ.',
    outcome: 'completed',
    createdAt: '2024-01-17T20:30:00',
    agentName: 'Trần Thị Bình',
    priority: 'low',
    tags: ['tien-do', 'zalo', 'thac-mac']
  },
  {
    id: '5',
    customerId: '4',
    customerName: 'Phạm Thu Hà',
    type: 'call',
    subject: 'Tư vấn đầu tư bất động sản',
    description: 'Khách hàng mới, quan tâm đến việc đầu tư bất động sản cho thuê. Cần tư vấn về vị trí và lợi nhuận.',
    outcome: 'pending',
    createdAt: '2024-01-16T11:20:00',
    duration: 15,
    agentName: 'Lý Văn Công',
    priority: 'medium',
    followUp: 'Gửi báo cáo thị trường và danh sách các dự án phù hợp',
    tags: ['dau-tu', 'tu-van', 'khach-moi']
  }
];

const InteractionsPage: React.FC = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setInteractions(mockInteractions);
      setFilteredInteractions(mockInteractions);
      setIsLoading(false);
    };

    fetchInteractions();
  }, []);

  useEffect(() => {
    let filtered = interactions;

    if (searchTerm) {
      filtered = filtered.filter(interaction =>
        interaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(interaction => interaction.type === typeFilter);
    }

    if (outcomeFilter !== 'all') {
      filtered = filtered.filter(interaction => interaction.outcome === outcomeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(interaction => interaction.priority === priorityFilter);
    }

    setFilteredInteractions(filtered);
  }, [interactions, searchTerm, typeFilter, outcomeFilter, priorityFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone size={16} className="text-blue-500" />;
      case 'email':
        return <Mail size={16} className="text-green-500" />;
      case 'meeting':
        return <Calendar size={16} className="text-purple-500" />;
      case 'message':
        return <MessageCircle size={16} className="text-orange-500" />;
      default:
        return <MessageCircle size={16} className="text-gray-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'call':
        return 'Cuộc gọi';
      case 'email':
        return 'Email';
      case 'meeting':
        return 'Cuộc hẹn';
      case 'message':
        return 'Tin nhắn';
      default:
        return type;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeText = (outcome: string) => {
    switch (outcome) {
      case 'pending':
        return 'Đang chờ';
      case 'completed':
        return 'Hoàn thành';
      case 'scheduled':
        return 'Đã lên lịch';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return outcome;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return priority;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử Tương tác</h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý tất cả các tương tác với khách hàng</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          Thêm tương tác
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng tương tác</p>
              <p className="text-2xl font-bold text-gray-900">{interactions.length}</p>
            </div>
            <MessageCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cuộc gọi</p>
              <p className="text-2xl font-bold text-blue-600">
                {interactions.filter(i => i.type === 'call').length}
              </p>
            </div>
            <Phone className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cuộc hẹn</p>
              <p className="text-2xl font-bold text-purple-600">
                {interactions.filter(i => i.type === 'meeting').length}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ưu tiên cao</p>
              <p className="text-2xl font-bold text-red-600">
                {interactions.filter(i => i.priority === 'high').length}
              </p>
            </div>
            <Clock className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng, chủ đề, nhân viên..."
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
              <option value="call">Cuộc gọi</option>
              <option value="email">Email</option>
              <option value="meeting">Cuộc hẹn</option>
              <option value="message">Tin nhắn</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ</option>
              <option value="completed">Hoàn thành</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Tất cả ưu tiên</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactions List */}
      <div className="space-y-4">
        {filteredInteractions.map((interaction) => (
          <div key={interaction.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(interaction.type)}
                  <span className="text-sm text-gray-600">{getTypeText(interaction.type)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{interaction.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{interaction.customerName}</span>
                    </div>
                    {interaction.propertyName && (
                      <div className="flex items-center gap-1">
                        <Building size={14} />
                        <span>{interaction.propertyName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatDateTime(interaction.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium ${getPriorityColor(interaction.priority)}`}>
                  {getPriorityText(interaction.priority)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOutcomeColor(interaction.outcome)}`}>
                  {getOutcomeText(interaction.outcome)}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{interaction.description}</p>

            {interaction.scheduledAt && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Calendar size={16} />
                  <span className="font-medium">Lịch hẹn: {formatDateTime(interaction.scheduledAt)}</span>
                </div>
              </div>
            )}

            {interaction.followUp && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                <p className="text-yellow-800 font-medium mb-1">Theo dõi:</p>
                <p className="text-yellow-700">{interaction.followUp}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Nhân viên: <span className="font-medium">{interaction.agentName}</span>
                </span>
                {interaction.duration && (
                  <span className="text-sm text-gray-600">
                    Thời gian: <span className="font-medium">{interaction.duration} phút</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {interaction.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInteractions.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có tương tác nào</h3>
          <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc thêm tương tác mới</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Thêm tương tác đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractionsPage;