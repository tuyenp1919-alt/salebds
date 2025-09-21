import React, { useState } from 'react';
import MarketingDashboard from '../features/marketing/components/MarketingDashboard';
import AIContentGenerator from '../features/marketing/components/AIContentGenerator';
import { 
  ArrowLeft,
  Home,
  PenTool,
  Palette,
  Video,
  Calendar,
  TrendingUp,
  Target,
} from 'lucide-react';

type MarketingView = 'dashboard' | 'content-generator' | 'poster-designer' | 'video-creator' | 'social-scheduler' | 'analytics' | 'lead-magnet';

const MarketingPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<MarketingView>('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'content-generator', label: 'AI Content Generator', icon: PenTool },
    { id: 'poster-designer', label: 'Poster Designer', icon: Palette },
    { id: 'video-creator', label: 'Video Creator', icon: Video },
    { id: 'social-scheduler', label: 'Social Scheduler', icon: Calendar },
    { id: 'analytics', label: 'Marketing Analytics', icon: TrendingUp },
    { id: 'lead-magnet', label: 'Lead Magnet', icon: Target },
  ];

  const handleToolSelect = (toolId: string) => {
    switch (toolId) {
      case 'ai-content-generator':
        setCurrentView('content-generator');
        break;
      case 'poster-designer':
        setCurrentView('poster-designer');
        break;
      case 'video-creator':
        setCurrentView('video-creator');
        break;
      case 'social-scheduler':
        setCurrentView('social-scheduler');
        break;
      case 'analytics-dashboard':
        setCurrentView('analytics');
        break;
      case 'lead-magnet':
        setCurrentView('lead-magnet');
        break;
      default:
        console.log('Tool not implemented:', toolId);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <MarketingDashboard onToolSelect={handleToolSelect} />;
      case 'content-generator':
        return <AIContentGenerator />;
      case 'poster-designer':
        return <PosterDesignerPlaceholder />;
      case 'video-creator':
        return <VideoCreatorPlaceholder />;
      case 'social-scheduler':
        return <SocialSchedulerPlaceholder />;
      case 'analytics':
        return <MarketingAnalyticsPlaceholder />;
      case 'lead-magnet':
        return <LeadMagnetPlaceholder />;
      default:
        return <MarketingDashboard onToolSelect={handleToolSelect} />;
    }
  };

  const getCurrentViewLabel = () => {
    const item = navigationItems.find(item => item.id === currentView);
    return item ? item.label : 'Marketing Tools';
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
              <span>Marketing</span>
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
const PosterDesignerPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Poster Designer</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Tính năng tạo poster, banner quảng cáo chuyên nghiệp với AI đang được phát triển.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Template poster có sẵn</li>
            <li>• Tùy chỉnh brand identity</li>
            <li>• Auto resize cho nhiều platform</li>
            <li>• Xuất file HD quality</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const VideoCreatorPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Creator</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Công cụ tạo video marketing từ hình ảnh và template đang được phát triển.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Slideshow từ hình ảnh BĐS</li>
            <li>• Text overlay và animations</li>
            <li>• Music library tích hợp</li>
            <li>• Export video HD</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SocialSchedulerPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media Scheduler</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Hệ thống lên lịch đăng bài tự động trên các nền tảng xã hội đang được phát triển.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Đăng đa nền tảng (FB, IG, Twitter)</li>
            <li>• Lên lịch tự động</li>
            <li>• Gợi ý thời gian tốt nhất</li>
            <li>• Analytics tương tác</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MarketingAnalyticsPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Analytics</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Dashboard phân tích hiệu quả chiến dịch marketing chi tiết đang được phát triển.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• ROI tracking chi tiết</li>
            <li>• Engagement analysis</li>
            <li>• Conversion reporting</li>
            <li>• Export báo cáo PDF</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const LeadMagnetPlaceholder: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Magnet Creator</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Công cụ tạo ebook, checklist để thu hút khách hàng tiềm năng đang được phát triển.
      </p>
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Tính năng sắp có:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• PDF generator tự động</li>
            <li>• Landing page builder</li>
            <li>• Form capture leads</li>
            <li>• Email sequence automation</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default MarketingPage;