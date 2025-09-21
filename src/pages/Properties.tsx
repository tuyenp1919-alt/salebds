import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import PropertyList from '@/features/properties/components/PropertyList';
import { propertyService } from '@/features/properties/services/propertyService';
import { Property, PropertySearchParams } from '@/types/property';
import { LoadingSpinner } from '@/components/common';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });

  // Load properties on component mount and when search params change
  useEffect(() => {
    loadProperties();
  }, [pagination.page]);

  const loadProperties = async (params?: Partial<PropertySearchParams>) => {
    try {
      setLoading(true);
      const searchParams: PropertySearchParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'created',
        sortOrder: 'desc',
        ...params,
      };

      const response = await propertyService.getProperties(searchParams);
      
      setProperties(response.properties);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        page: response.page,
        limit: response.limit,
      }));
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Không thể tải danh sách bất động sản');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    // Mở modal thêm bất động sản mới
    // Tạm thời hiển thị thông báo
    toast.success('Tính năng thêm bất động sản đang được phát triển!');
  };

  const handleEditProperty = (property: Property) => {
    // Mở modal chỉnh sửa bất động sản
    // Tạm thời hiển thị thông báo
    toast.info(`Chỉnh sửa bất động sản: ${property.title}`);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bất động sản này?')) {
      return;
    }

    try {
      await propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Đã xóa bất động sản thành công');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Không thể xóa bất động sản');
    }
  };

  const handleViewProperty = async (property: Property) => {
    // Tăng lượt xem
    try {
      await propertyService.incrementPropertyViews(property.id);
      setProperties(prev => 
        prev.map(p => 
          p.id === property.id ? { ...p, views: p.views + 1 } : p
        )
      );
    } catch (error) {
      console.error('Error incrementing views:', error);
    }

    // Mở trang chi tiết hoặc modal
    toast.info(`Xem chi tiết: ${property.title}`);
  };

  const handleToggleFavorite = async (id: string, increment: boolean) => {
    try {
      await propertyService.togglePropertyFavorite(id, increment);
      setProperties(prev =>
        prev.map(p =>
          p.id === id
            ? {
                ...p,
                favorites: increment
                  ? p.favorites + 1
                  : Math.max(0, p.favorites - 1),
              }
            : p
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Không thể cập nhật trạng thái yêu thích');
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <PropertyList
          properties={properties}
          loading={loading}
          onAddProperty={handleAddProperty}
          onEditProperty={handleEditProperty}
          onDeleteProperty={handleDeleteProperty}
          onViewProperty={handleViewProperty}
          onToggleFavorite={handleToggleFavorite}
        />
      </motion.div>
    </div>
  );
};

export default Properties;