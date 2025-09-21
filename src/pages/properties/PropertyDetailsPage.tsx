import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Trash2, MapPin, Home, DollarSign, 
  Maximize, Calendar, Eye, Heart, Share2, Building,
  Bed, Bath, Car, Trees, Award, FileText 
} from 'lucide-react';
import { Property } from '@/types';
import { propertyService } from '@/features/properties/services/propertyService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const PropertyDetailsPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (propertyId) {
      loadProperty(propertyId);
    }
  }, [propertyId]);

  const loadProperty = async (id: string) => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Không thể tải thông tin bất động sản');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!property || !window.confirm('Bạn có chắc chắn muốn xóa bất động sản này?')) return;
    
    try {
      await propertyService.deleteProperty(property.id);
      toast.success('Đã xóa bất động sản thành công');
      navigate('/properties');
    } catch (error) {
      toast.error('Không thể xóa bất động sản');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!property) return <div>Không tìm thấy bất động sản</div>;

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const defaultImages = [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    'https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=800',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800'
  ];

  const images = property.images?.length > 0 ? property.images : defaultImages;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/properties"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                {property.status === 'available' ? 'Đang bán' :
                 property.status === 'pending' ? 'Đang giao dịch' :
                 property.status === 'sold' ? 'Đã bán' : 'Đã cho thuê'}
              </span>
              <span className="text-gray-500 text-sm">
                Mã BĐS: {property.code}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/properties/${property.id}/edit`)}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              <img 
                src={images[selectedImage]} 
                alt={property.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/80 backdrop-blur rounded-lg hover:bg-white">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur rounded-lg hover:bg-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-2 p-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-1 h-20 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Maximize className="w-5 h-5" />
                <span>{property.area} m²</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Bed className="w-5 h-5" />
                <span>{property.bedrooms || 0} phòng ngủ</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Bath className="w-5 h-5" />
                <span>{property.bathrooms || 0} phòng tắm</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Home className="w-5 h-5" />
                <span>{property.type}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Mô tả</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {property.description || 'Chưa có mô tả'}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Hướng nhà</p>
                <p className="font-medium">{property.direction || 'Chưa xác định'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pháp lý</p>
                <p className="font-medium">{property.legal || 'Sổ đỏ chính chủ'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nội thất</p>
                <p className="font-medium">{property.furniture || 'Cơ bản'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tầng</p>
                <p className="font-medium">{property.floor || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Vị trí
            </h2>
            <p className="text-gray-700 mb-4">{property.address}</p>
            
            {/* Map Placeholder */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Bản đồ sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>

        {/* Right Column - Price & Contact */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Giá bán</p>
              <p className="text-3xl font-bold text-blue-600">
                {property.price.toLocaleString('vi-VN')} VNĐ
              </p>
              {property.pricePerM2 && (
                <p className="text-sm text-gray-500 mt-1">
                  {property.pricePerM2.toLocaleString('vi-VN')} VNĐ/m²
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Liên hệ ngay
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Đặt lịch xem nhà
              </button>
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Người đăng</p>
                <p className="font-medium">{property.owner?.name || 'Admin'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Điện thoại</p>
                <p className="font-medium">{property.owner?.phone || '0123456789'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-sm">{property.owner?.email || 'admin@salebds.com'}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Tiện ích</h3>
            <div className="space-y-2">
              {property.features?.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <Award className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              )) || (
                <p className="text-gray-500 text-sm">Chưa có thông tin</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Thống kê</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Lượt xem</span>
                <span className="font-medium">{property.views || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Lượt thích</span>
                <span className="font-medium">{property.likes || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Ngày đăng</span>
                <span className="font-medium">
                  {new Date(property.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;