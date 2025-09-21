import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  SortAsc,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Eye,
  Heart,
  Phone,
  Edit,
  Trash2,
  Star,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Property, PropertyFilter, PropertySortBy } from '@/types/property';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  onAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onViewProperty: (property: Property) => void;
  onToggleFavorite?: (id: string, increment: boolean) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onViewProperty,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<PropertySortBy>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [favoriteProperties, setFavoriteProperties] = useState<Set<string>>(new Set());

  // Filter state
  const [filters, setFilters] = useState<PropertyFilter>({});

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = 
      (!filters.type?.length || filters.type.includes(property.type)) &&
      (!filters.status?.length || filters.status.includes(property.status)) &&
      (!filters.priceMin || property.price >= filters.priceMin) &&
      (!filters.priceMax || property.price <= filters.priceMax) &&
      (!filters.areaMin || property.area >= filters.areaMin) &&
      (!filters.areaMax || property.area <= filters.areaMax) &&
      (!filters.bedrooms?.length || (property.bedrooms && filters.bedrooms.includes(property.bedrooms))) &&
      (!filters.district?.length || filters.district.includes(property.district));

    return matchesSearch && matchesFilters;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'area':
        aValue = a.area;
        bValue = b.area;
        break;
      case 'created':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      default:
        return 0;
    }

    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleToggleFavorite = (propertyId: string) => {
    const isCurrentlyFavorite = favoriteProperties.has(propertyId);
    const newFavorites = new Set(favoriteProperties);
    
    if (isCurrentlyFavorite) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    
    setFavoriteProperties(newFavorites);
    onToggleFavorite?.(propertyId, !isCurrentlyFavorite);
  };

  const getPropertyTypeText = (type: Property['type']) => {
    const types: Record<Property['type'], string> = {
      apartment: 'Căn hộ',
      house: 'Nhà riêng',
      villa: 'Biệt thự',
      townhouse: 'Nhà phố',
      office: 'Văn phòng',
      shop: 'Mặt bằng',
      warehouse: 'Kho bãi',
      land: 'Đất nền',
      resort: 'Resort',
      hotel: 'Khách sạn',
    };
    return types[type] || type;
  };

  const getStatusColor = (status: Property['status']) => {
    const colors: Record<Property['status'], string> = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-orange-100 text-orange-800',
      expired: 'bg-gray-100 text-gray-800',
      draft: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: Property['status']) => {
    const statuses: Record<Property['status'], string> = {
      available: 'Có sẵn',
      sold: 'Đã bán',
      rented: 'Đã thuê',
      reserved: 'Đã đặt cọc',
      pending: 'Đang xử lý',
      expired: 'Hết hạn',
      draft: 'Nháp',
    };
    return statuses[status] || status;
  };

  const getPriorityColor = (priority: Property['priority']) => {
    const colors: Record<Property['priority'], string> = {
      urgent: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-blue-600',
      low: 'text-green-600',
    };
    return colors[priority];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Bất động sản</h1>
          <p className="text-gray-600 mt-1">
            Tổng cộng {sortedProperties.length} bất động sản
          </p>
        </div>

        <button
          onClick={onAddProperty}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm BĐS</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bất động sản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as PropertySortBy)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="created">Mới nhất</option>
              <option value="price">Giá</option>
              <option value="area">Diện tích</option>
              <option value="views">Lượt xem</option>
              <option value="priority">Ưu tiên</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SortAsc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại BĐS
                </label>
                <select
                  multiple
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, type: values as any }));
                  }}
                >
                  <option value="apartment">Căn hộ</option>
                  <option value="house">Nhà riêng</option>
                  <option value="villa">Biệt thự</option>
                  <option value="townhouse">Nhà phố</option>
                  <option value="land">Đất nền</option>
                  <option value="shop">Mặt bằng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoảng giá
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceMin: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceMax: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diện tích (m²)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      areaMin: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      areaMax: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng ngủ
                </label>
                <select
                  multiple
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                    setFilters(prev => ({ ...prev, bedrooms: values }));
                  }}
                >
                  <option value="1">1 PN</option>
                  <option value="2">2 PN</option>
                  <option value="3">3 PN</option>
                  <option value="4">4 PN</option>
                  <option value="5">5+ PN</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4">
              <button
                onClick={() => setFilters({})}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Xóa bộ lọc
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Property List */}
      {sortedProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Search className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy bất động sản
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || Object.keys(filters).length > 0
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.'
              : 'Bắt đầu bằng cách thêm bất động sản mới.'}
          </p>
          {!searchQuery && Object.keys(filters).length === 0 && (
            <div className="mt-6">
              <button
                onClick={onAddProperty}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Thêm bất động sản đầu tiên
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {sortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              viewMode={viewMode}
              isFavorite={favoriteProperties.has(property.id)}
              onView={() => onViewProperty(property)}
              onEdit={() => onEditProperty(property)}
              onDelete={() => onDeleteProperty(property.id)}
              onToggleFavorite={() => handleToggleFavorite(property.id)}
              formatPrice={formatPrice}
              getPropertyTypeText={getPropertyTypeText}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Property Card Component
interface PropertyCardProps {
  property: Property;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  formatPrice: (price: number) => string;
  getPropertyTypeText: (type: Property['type']) => string;
  getStatusColor: (status: Property['status']) => string;
  getStatusText: (status: Property['status']) => string;
  getPriorityColor: (priority: Property['priority']) => string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  viewMode,
  isFavorite,
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
  formatPrice,
  getPropertyTypeText,
  getStatusColor,
  getStatusText,
  getPriorityColor,
}) => {
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start space-x-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {property.title}
                </h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.district}
                  </span>
                  {property.bedrooms && (
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms} PN
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms} PT
                    </span>
                  )}
                  <span className="flex items-center">
                    <Maximize className="w-4 h-4 mr-1" />
                    {property.area}m²
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                  {getStatusText(property.status)}
                </span>
                <Star className={`w-4 h-4 ${getPriorityColor(property.priority)}`} />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-green-600">
                  {formatPrice(property.price)}
                </p>
                {property.pricePerSqm && (
                  <p className="text-sm text-gray-500">
                    {formatPrice(property.pricePerSqm)}/m²
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {property.views}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {property.favorites}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>Cập nhật: </span>
                {formatDistanceToNow(new Date(property.updatedAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onToggleFavorite}
                  className={`p-2 rounded-lg ${isFavorite ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600'}`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={onView}
                  className="text-blue-600 hover:text-blue-700"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={onEdit}
                  className="text-green-600 hover:text-green-700"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {/* Priority Badge */}
        {property.priority === 'urgent' && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Khẩn cấp
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm ${
            isFavorite ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Nổi bật
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900 truncate flex-1">
            {property.title}
          </h3>
          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
            {getStatusText(property.status)}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
            {getPropertyTypeText(property.type)}
          </span>
          
          <div className="flex items-center space-x-3">
            {property.bedrooms && (
              <span className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                {property.bathrooms}
              </span>
            )}
            <span className="flex items-center">
              <Maximize className="w-4 h-4 mr-1" />
              {property.area}m²
            </span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-lg font-semibold text-green-600">
            {formatPrice(property.price)}
          </p>
          {property.pricePerSqm && (
            <p className="text-sm text-gray-500">
              {formatPrice(property.pricePerSqm)}/m²
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {property.views}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {property.favorites}
            </span>
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {property.inquiries}
            </span>
          </div>

          <Star className={`w-4 h-4 ${getPriorityColor(property.priority)}`} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(property.updatedAt), {
              addSuffix: true,
              locale: vi,
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onView}
              className="text-blue-600 hover:text-blue-700"
              title="Xem chi tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="text-green-600 hover:text-green-700"
              title="Chỉnh sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyList;