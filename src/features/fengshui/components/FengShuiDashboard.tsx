import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  TrendingUp,
  User,
  Calendar,
  Sparkles,
  Home,
  Calculator,
  BarChart3,
  Star,
  Lightbulb,
  Clock,
  Target,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
} from 'lucide-react';
import { fengShuiService } from '@/services/fengShuiService';
import { FengShuiProfile, FengShuiPropertyAnalysis, LocationScore, PricePrediction } from '@/types/fengshui';

interface FengShuiDashboardProps {
  onToolSelect?: (toolId: string) => void;
}

const FengShuiDashboard: React.FC<FengShuiDashboardProps> = ({ onToolSelect }) => {
  const [profile, setProfile] = useState<FengShuiProfile | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<FengShuiPropertyAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load user's feng shui profile
      const userProfile = await fengShuiService.getProfile('user-1');
      setProfile(userProfile);

      // Load recent analyses - simulate some recent data
      const mockAnalyses = await Promise.all([
        fengShuiService.getPropertyAnalysis('1'),
        fengShuiService.getPropertyAnalysis('2'),
        fengShuiService.getPropertyAnalysis('3')
      ]);
      
      setRecentAnalyses(mockAnalyses.filter(Boolean) as FengShuiPropertyAnalysis[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tools = [
    {
      id: 'profile-setup',
      title: 'Hồ sơ Phong thủy',
      description: 'Thiết lập thông tin sinh năm để xác định mệnh và hướng tốt',
      icon: User,
      color: 'blue',
      status: profile ? 'completed' : 'pending',
      stats: profile ? { element: profile.element, kuaNumber: profile.kuaNumber } : null
    },
    {
      id: 'property-analysis',
      title: 'Phân tích Phong thủy BĐS',
      description: 'Đánh giá luồng khí, hướng nhà và tương thích với gia chủ',
      icon: Compass,
      color: 'green',
      status: recentAnalyses.length > 0 ? 'active' : 'available',
      stats: { analyzed: recentAnalyses.length, avgScore: 85 }
    },
    {
      id: 'location-scoring',
      title: 'Đánh giá Vị trí',
      description: 'Phân tích tiện ích, giao thông và tiềm năng phát triển khu vực',
      icon: MapPin,
      color: 'purple',
      status: 'available',
      stats: { locations: 12, avgScore: 78 }
    },
    {
      id: 'price-prediction',
      title: 'Dự đoán Giá',
      description: 'AI phân tích xu hướng và dự báo giá bất động sản',
      icon: TrendingUp,
      color: 'orange',
      status: 'available',
      stats: { predictions: 8, accuracy: '82%' }
    },
    {
      id: 'good-times',
      title: 'Thời điểm Tốt',
      description: 'Tư vấn ngày tốt để ký hợp đồng, chuyển nhà, tân trang',
      icon: Calendar,
      color: 'indigo',
      status: 'available',
      stats: { upcoming: 5, thisMonth: 12 }
    },
    {
      id: 'recommendations',
      title: 'Tư vấn AI',
      description: 'Gợi ý BĐS phù hợp dựa trên phong thủy và nhu cầu',
      icon: Sparkles,
      color: 'pink',
      status: 'new',
      stats: { matches: 24, compatibility: '94%' }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'new': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      pink: 'text-pink-600 bg-pink-100',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getElementInfo = (element: string) => {
    const elementInfo = {
      kim: { name: 'Kim (Kim loại)', color: '#C0C0C0', traits: ['Kiên định', 'Trách nhiệm'] },
      moc: { name: 'Mộc (Gỗ)', color: '#228B22', traits: ['Sáng tạo', 'Linh hoạt'] },
      thuy: { name: 'Thủy (Nước)', color: '#0000FF', traits: ['Thông minh', 'Thích nghi'] },
      hoa: { name: 'Hỏa (Lửa)', color: '#FF4500', traits: ['Nhiệt tình', 'Lãnh đạo'] },
      tho: { name: 'Thổ (Đất)', color: '#8B4513', traits: ['Ổn định', 'Đáng tin cậy'] }
    };
    return elementInfo[element as keyof typeof elementInfo] || elementInfo.kim;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Phong thủy & Phân tích Vị trí</h1>
          <p className="text-gray-600 mt-1">
            Phân tích phong thủy thông minh và dự đoán xu hướng bất động sản
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700">
            <Sparkles className="w-4 h-4" />
            <span>Phân tích mới</span>
          </button>
        </div>
      </div>

      {/* Profile Overview */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                  style={{ backgroundColor: getElementInfo(profile.element).color }}
                >
                  {profile.element.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mệnh {getElementInfo(profile.element).name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Số Kua: {profile.kuaNumber} | Sinh năm: {profile.birthYear}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Hướng tốt</div>
                  <div className="font-semibold text-gray-900">
                    {profile.luckyDirections.slice(0, 2).map(d => {
                      const directionNames = {
                        north: 'Bắc', south: 'Nam', east: 'Đông', west: 'Tây',
                        northeast: 'Đông Bắc', northwest: 'Tây Bắc', 
                        southeast: 'Đông Nam', southwest: 'Tây Nam'
                      };
                      return directionNames[d as keyof typeof directionNames];
                    }).join(', ')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500">Màu sắc may mắn</div>
                  <div className="flex items-center space-x-1 mt-1">
                    {profile.luckyColors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500">Tính cách</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {getElementInfo(profile.element).traits.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onToolSelect?.('profile-setup')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              Cập nhật <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onToolSelect?.(tool.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(tool.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tool.status)}`}>
                  {tool.status === 'completed' ? 'Hoàn thành' :
                   tool.status === 'active' ? 'Đang dùng' :
                   tool.status === 'pending' ? 'Chờ thiết lập' :
                   tool.status === 'new' ? 'Mới' : 'Có sẵn'}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

              {tool.stats && (
                <div className="space-y-2 mb-4">
                  {Object.entries(tool.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500 capitalize">
                        {key === 'element' ? 'Mệnh' :
                         key === 'kuaNumber' ? 'Số Kua' :
                         key === 'analyzed' ? 'Đã phân tích' :
                         key === 'avgScore' ? 'Điểm TB' :
                         key === 'locations' ? 'Vị trí' :
                         key === 'predictions' ? 'Dự đoán' :
                         key === 'accuracy' ? 'Độ chính xác' :
                         key === 'upcoming' ? 'Sắp tới' :
                         key === 'thisMonth' ? 'Tháng này' :
                         key === 'matches' ? 'Gợi ý' :
                         key === 'compatibility' ? 'Phù hợp' : key}
                      </span>
                      <span className="font-medium text-gray-900">
                        {typeof value === 'string' ? value : 
                         key === 'element' ? getElementInfo(value as string).name :
                         value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                {tool.status === 'pending' ? 'Thiết lập ngay' :
                 tool.status === 'new' ? 'Khám phá' : 'Sử dụng'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Analyses */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Phân tích gần đây</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </button>
          </div>

          {recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.slice(0, 3).map((analysis, index) => (
                <div key={analysis.propertyId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        analysis.analysis.overallScore >= 85 ? 'bg-green-100 text-green-600' :
                        analysis.analysis.overallScore >= 70 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {analysis.analysis.overallScore >= 85 ? <CheckCircle className="w-5 h-5" /> :
                         analysis.analysis.overallScore >= 70 ? <AlertTriangle className="w-5 h-5" /> :
                         <Info className="w-5 h-5" />}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">BĐS #{analysis.propertyId}</h4>
                      <div className="text-sm text-gray-500 flex items-center space-x-4">
                        <span>Hướng: {analysis.analysis.facingDirection}</span>
                        <span>Điểm: {analysis.analysis.overallScore}/100</span>
                        <span>{new Date(analysis.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có phân tích nào</h4>
              <p className="text-gray-500 mb-4">Bắt đầu phân tích phong thủy cho bất động sản đầu tiên</p>
              <button 
                onClick={() => onToolSelect?.('property-analysis')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Phân tích ngay
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Feng Shui Quick Tips */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Mẹo Phong thủy
            </h3>
            
            <div className="space-y-3">
              {profile && (
                <>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Hướng tốt nhất</div>
                    <div className="text-sm text-blue-700">
                      {profile.luckyDirections[0] === 'north' ? 'Bắc' :
                       profile.luckyDirections[0] === 'south' ? 'Nam' :
                       profile.luckyDirections[0] === 'east' ? 'Đông' :
                       profile.luckyDirections[0] === 'west' ? 'Tây' :
                       profile.luckyDirections[0] === 'northeast' ? 'Đông Bắc' :
                       profile.luckyDirections[0] === 'northwest' ? 'Tây Bắc' :
                       profile.luckyDirections[0] === 'southeast' ? 'Đông Nam' :
                       'Tây Nam'} - Đặt bàn làm việc theo hướng này
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-900">Màu may mắn</div>
                    <div className="text-sm text-green-700">
                      Sử dụng {profile.element === 'kim' ? 'màu trắng, vàng' :
                              profile.element === 'moc' ? 'màu xanh lá' :
                              profile.element === 'thuy' ? 'màu đen, xanh dương' :
                              profile.element === 'hoa' ? 'màu đỏ, cam' :
                              'màu vàng, nâu'} trong trang trí
                    </div>
                  </div>
                </>
              )}
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-900">Thời gian tốt</div>
                <div className="text-sm text-purple-700">
                  Tháng 3-4 là thời điểm lý tưởng để mua nhà
                </div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Thị trường
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Xu hướng giá</span>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+7.2%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thời gian bán TB</span>
                <span className="text-sm font-medium text-gray-900">45 ngày</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ thành công</span>
                <span className="text-sm font-medium text-gray-900">68%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Dự báo tháng tới</div>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900">Tăng 2-3%</div>
                <div className="text-xs text-gray-600">Dựa trên phân tích AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Phân tích Phong thủy với AI</h3>
            <p className="text-indigo-100">
              Kết hợp phong thủy truyền thống với trí tuệ nhân tạo để đưa ra quyết định tốt nhất
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onToolSelect?.('property-analysis')}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
            >
              <Compass className="w-4 h-4 inline mr-2" />
              Phân tích BĐS
            </button>
            <button 
              onClick={() => onToolSelect?.('recommendations')}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Tư vấn AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FengShuiDashboard;