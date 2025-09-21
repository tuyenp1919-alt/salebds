import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Download,
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  DollarSign,
  TrendingUp,
  Home,
  Building,
  Warehouse,
  RefreshCw,
  Grid3X3,
  List,
  Heart,
  Share2,
  MoreHorizontal,
  Camera,
  Video,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { api } from '@/services/api';
import { formatDate, formatCurrency, formatNumber, debounce } from '@/utils';
import type { Property, FilterState } from '@/types';
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '@/constants';

interface PropertiesPageProps {}

export const PropertiesPage: React.FC<PropertiesPageProps> = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(25);
  const [filters, setFilters] = React.useState<FilterState>({});
  const [selectedProperties, setSelectedProperties] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = React.useState(false);
  const [deletePropertyId, setDeletePropertyId] = React.useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch properties query
  const {
    data: propertiesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['properties', page, limit, filters],
    queryFn: () => api.properties.getProperties({ page, limit, filters }),
    staleTime: 1000 * 60 * 5,
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: (propertyId: string) => api.properties.deleteProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setDeletePropertyId(null);
    },
    onError: (error) => {
      console.error('Failed to delete property:', error);
    },
  });

  // Debounced search
  const debouncedSearch = React.useCallback(
    debounce((searchTerm: string) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPage(1);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: prev.status === status ? undefined : status 
    }));
    setPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({ 
      ...prev, 
      type: prev.type === type ? undefined : type 
    }));
    setPage(1);
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === propertiesData?.data.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(propertiesData?.data.map(p => p.id) || []);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    setDeletePropertyId(propertyId);
  };

  const confirmDeleteProperty = () => {
    if (deletePropertyId) {
      deletePropertyMutation.mutate(deletePropertyId);
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'single-family': return Home;
      case 'condo': return Building;
      case 'townhouse': return Home;
      case 'multi-family': return Building;
      case 'commercial': return Warehouse;
      case 'industrial': return Warehouse;
      default: return Home;
    }
  };

  const properties = propertiesData?.data || [];
  const pagination = propertiesData?.pagination;

  // Property Grid Card Component
  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const TypeIcon = getPropertyTypeIcon(property.type);
    
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
            {property.images.length > 0 ? (
              <img 
                src={property.images[0].url} 
                alt={property.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <Home className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Property Status Badge */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={property.status} />
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Image Count */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs flex items-center">
              <Camera className="w-3 h-3 mr-1" />
              {property.images.length}
            </div>
          )}
          
          {/* Virtual Tour */}
          {property.virtualTour && (
            <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs flex items-center">
              <Video className="w-3 h-3 mr-1" />
              360°
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 truncate pr-2">{property.title}</h3>
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.8</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(property.price, 'VND')}
            </p>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{property.address}, {property.city}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TypeIcon className="w-4 h-4 mr-1" />
              <span>
                {PROPERTY_TYPES.find(t => t.value === property.type)?.label || property.type}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.squareFeet} m²</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-xs text-gray-500">
              Đăng {property.daysOnMarket} ngày trước
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDeleteProperty(property.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bất động sản</h1>
          <p className="text-gray-600">
            Quản lý danh sách bất động sản và theo dõi hiệu quả kinh doanh
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm bất động sản
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bất động sản..."
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary text-primary-foreground' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              {selectedProperties.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedProperties.length} đã chọn
                  </span>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa ({selectedProperties.length})
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Loại hình</label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((type) => (
                      <Badge
                        key={type.value}
                        variant={filters.type === type.value ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleTypeFilter(type.value)}
                      >
                        <span className="mr-1">{type.icon}</span>
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Trạng thái</label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_STATUSES.map((status) => (
                      <Badge
                        key={status.value}
                        variant={filters.status === status.value ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleStatusFilter(status.value)}
                      >
                        {status.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Giá (VND)</label>
                  <div className="space-y-2">
                    <Input type="number" placeholder="Từ" />
                    <Input type="number" placeholder="Đến" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Diện tích (m²)</label>
                  <div className="space-y-2">
                    <Input type="number" placeholder="Từ" />
                    <Input type="number" placeholder="Đến" />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="w-full">
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng BDS</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang bán</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã bán</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.status === 'sold').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trung bình/tháng</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-xs text-gray-500">ngày</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Display */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
            <Button onClick={() => refetch()}>Thử lại</Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProperties.length === properties.length && properties.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Bất động sản</TableHead>
                  <TableHead>Loại hình</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Thông số</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => {
                  const TypeIcon = getPropertyTypeIcon(property.type);
                  
                  return (
                    <TableRow key={property.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property.id)}
                          onChange={() => handleSelectProperty(property.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                            {property.images.length > 0 ? (
                              <img 
                                src={property.images[0].url} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-500">MLS: {property.mlsNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <TypeIcon className="w-4 h-4 mr-2 text-gray-600" />
                          <span className="text-sm">
                            {PROPERTY_TYPES.find(t => t.value === property.type)?.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-blue-600">
                          {formatCurrency(property.price, 'VND')}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{property.city}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed className="w-3 h-3 mr-1" />
                            {property.bedrooms}
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-3 h-3 mr-1" />
                            {property.bathrooms}
                          </div>
                          <div className="flex items-center">
                            <Square className="w-3 h-3 mr-1" />
                            {property.squareFeet}m²
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={property.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(property.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {((page - 1) * limit) + 1} đến {Math.min(page * limit, pagination.total)} của {pagination.total} bất động sản
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Trước
            </Button>
            <span className="text-sm">
              Trang {page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePropertyId} onOpenChange={() => setDeletePropertyId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bất động sản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bất động sản này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePropertyId(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteProperty}
              loading={deletePropertyMutation.isPending}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};