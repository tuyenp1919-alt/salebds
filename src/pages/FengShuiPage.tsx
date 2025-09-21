import React, { useState } from 'react';
import FengShuiDashboard from '../features/fengshui/components/FengShuiDashboard';
import PropertyAnalysis from '../features/fengshui/components/PropertyAnalysis';
import { 
  ArrowLeft,
  Home,
  Compass,
  MapPin,
  TrendingUp,
  Calendar,
  Sparkles,
  User,
} from 'lucide-react';

type FengShuiView = 'dashboard' | 'profile-setup' | 'property-analysis' | 'location-scoring' | 'price-prediction' | 'good-times' | 'recommendations';

const FengShuiPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<FengShuiView>('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile-setup', label: 'Hồ sơ Phong thủy', icon: User },
    { id: 'property-analysis', label: 'Phân tích BĐS', icon: Compass },
    { id: 'location-scoring', label: 'Đánh giá Vị trí', icon: MapPin },
    { id: 'price-prediction', label: 'Dự đoán Giá', icon: TrendingUp },
    { id: 'good-times', label: 'Thời điểm Tốt', icon: Calendar },
    { id: 'recommendations', label: 'Tư vấn AI', icon: Sparkles },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <FengShuiDashboard onToolSelect={handleToolSelect} />;
      case 'property-analysis':
        return <PropertyAnalysis />;
      case 'profile-setup':
        return <ProfileSetupPlaceholder />;
      case 'location-scoring':
        return <LocationScoringPlaceholder />;
      case 'price-prediction':
        return <PricePredictionPlaceholder />;
      case 'good-times':
        return <GoodTimesPlaceholder />;
      case 'recommendations':
        return <RecommendationsPlaceholder />;
      default:
        return <FengShuiDashboard onToolSelect={handleToolSelect} />;
    }
  };

  const handleToolSelect = (toolId: string) => {
    setCurrentView(toolId as FengShuiView);
  };

  const getCurrentViewLabel = () => {
    const item = navigationItems.find(item => item.id === currentView);
    return item ? item.label : 'Phong thủy & Vị trí';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {currentView !== 'dashboard' && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Quay lại</span>
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                {getCurrentViewLabel()}
              </h1>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Phong thủy</span>
              {currentView !== 'dashboard' && (
                <>
                  <span>/</span>
                  <span className="text-gray-900">{getCurrentViewLabel()}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

// Placeholder components for other tools
const ProfileSetupPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Thiết lập Hồ sơ Phong thủy</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Nhập thông tin sinh năm, giới tính để xác định mệnh và hướng tốt cho bạn.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Tính toán số Kua cá nhân</li>
            <li>• Xác định ngũ hành (mệnh)</li>
            <li>• Hướng tốt và hướng xấu</li>
            <li>• Màu sắc và số may mắn</li>
            <li>• Tính cách và hướng nghiệp</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const LocationScoringPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Đánh giá Vị trí</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Phân tích toàn diện về vị trí bất động sản dựa trên nhiều yếu tố.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Giao thông và tiếp cận</li>
            <li>• Tiện ích xung quanh</li>
            <li>• Môi trường sống</li>
            <li>• Tiềm năng đầu tư</li>
            <li>• Điểm tổng thể và ranking</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PricePredictionPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Dự đoán Giá</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        AI phân tích xu hướng và dự báo giá bất động sản trong tương lai.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Dự đoán giá 1-5 năm</li>
            <li>• Phân tích yếu tố ảnh hưởng</li>
            <li>• So sánh với BĐS tương tự</li>
            <li>• Đánh giá rủi ro đầu tư</li>
            <li>• Khuyến nghị mua/bán/giữ</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const GoodTimesPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Thời điểm Tốt</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Tư vấn ngày tốt để ký hợp đồng, chuyển nhà, tân trang theo phong thủy.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ngày tốt ký hợp đồng</li>
            <li>• Thời điểm chuyển nhà</li>
            <li>• Lịch tân trang, sửa chữa</li>
            <li>• Ngày khai trương, mở bán</li>
            <li>• Lịch cá nhân hóa theo mệnh</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RecommendationsPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Tư vấn AI</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Gợi ý bất động sản phù hợp dựa trên phong thủy cá nhân và nhu cầu.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Matching BĐS theo mệnh</li>
            <li>• Phân tích độ phù hợp</li>
            <li>• Đánh giá rủi ro và lợi ích</li>
            <li>• Kế hoạch hành động</li>
            <li>• Tư vấn mua/thuê/đầu tư</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default FengShuiPage;