import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Phone, Mail, MapPin, Calendar, DollarSign, Tag, User, Building, Star } from 'lucide-react';
import { Customer } from '@/types';
import { customerService } from '@/features/customers/services/customerService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const CustomerDetailsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    }
  }, [customerId]);

  const loadCustomer = async (id: string) => {
    try {
      setLoading(true);
      const data = await customerService.getCustomerById(id);
      setCustomer(data);
    } catch (error) {
      console.error('Error loading customer:', error);
      toast.error('Không thể tải thông tin khách hàng');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer || !window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;
    
    try {
      await customerService.deleteCustomer(customer.id);
      toast.success('Đã xóa khách hàng thành công');
      navigate('/customers');
    } catch (error) {
      toast.error('Không thể xóa khách hàng');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!customer) return <div>Không tìm thấy khách hàng</div>;

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      potential: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/customers"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="w-8 h-8" />
              {customer.fullName}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
              <span className="text-gray-500 text-sm">
                ID: #{customer.id}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/customers/${customer.id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              
              {customer.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin bổ sung</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nguồn khách hàng</p>
                <p className="font-medium">{customer.source}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">
                  {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Lần liên hệ cuối</p>
                <p className="font-medium">
                  {customer.lastContactedAt ? 
                    formatDistanceToNow(new Date(customer.lastContactedAt), { addSuffix: true, locale: vi }) :
                    'Chưa liên hệ'
                  }
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {customer.tags?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  )) || <span className="text-gray-400">Không có</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Ghi chú</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thống kê</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tổng giao dịch</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Giá trị giao dịch</span>
                <span className="font-semibold">0 VNĐ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Lần tương tác</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Hành động nhanh</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Gọi điện
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Gửi email
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Lên lịch hẹn
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
            <p className="text-gray-500 text-sm">Chưa có hoạt động nào</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;