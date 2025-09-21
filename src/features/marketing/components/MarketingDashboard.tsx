import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PenTool,
  Image as ImageIcon,
  Video,
  FileText,
  Share2,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Download,
  Plus,
  Zap,
  Target,
  Megaphone,
  Palette,
  Camera,
  Edit3,
  Send,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from 'lucide-react';

interface MarketingDashboardProps {
  onToolSelect?: (toolId: string) => void;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ onToolSelect }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'content' | 'design' | 'social' | 'analytics'>('all');

  const marketingTools = [
    {
      id: 'ai-content-generator',
      title: 'AI Content Generator',
      description: 'Tự động tạo nội dung bán hàng, mô tả BĐS với AI',
      category: 'content',
      icon: PenTool,
      color: 'blue',
      features: ['Mô tả sản phẩm', 'Caption social', 'Email marketing', 'Blog post'],
      stats: { used: 156, generated: 2341, rating: 4.8 }
    },
    {
      id: 'poster-designer',
      title: 'AI Poster Designer',
      description: 'Tạo poster, banner quảng cáo chuyên nghiệp',
      category: 'design',
      icon: Palette,
      color: 'purple',
      features: ['Template có sẵn', 'Custom brand', 'Auto resize', 'Xuất HD'],
      stats: { used: 89, generated: 567, rating: 4.7 }
    },
    {
      id: 'video-creator',
      title: 'Video Creator',
      description: 'Tạo video marketing từ hình ảnh và template',
      category: 'design',
      icon: Video,
      color: 'red',
      features: ['Slideshow', 'Text overlay', 'Music library', 'HD export'],
      stats: { used: 45, generated: 178, rating: 4.6 }
    },
    {
      id: 'social-scheduler',
      title: 'Social Media Scheduler',
      description: 'Lên lịch đăng bài tự động trên các nền tảng',
      category: 'social',
      icon: Calendar,
      color: 'green',
      features: ['Multi-platform', 'Auto posting', 'Best time', 'Analytics'],
      stats: { used: 234, generated: 1456, rating: 4.9 }
    },
    {
      id: 'analytics-dashboard',
      title: 'Marketing Analytics',
      description: 'Phân tích hiệu quả chiến dịch marketing',
      category: 'analytics',
      icon: TrendingUp,
      color: 'orange',
      features: ['ROI tracking', 'Engagement', 'Conversion', 'Reports'],
      stats: { used: 67, generated: 234, rating: 4.5 }
    },
    {
      id: 'lead-magnet',
      title: 'Lead Magnet Creator',
      description: 'Tạo ebook, checklist để thu hút khách hàng',
      category: 'content',
      icon: Target,
      color: 'indigo',
      features: ['PDF generator', 'Landing page', 'Form builder', 'Email sequence'],
      stats: { used: 23, generated: 89, rating: 4.4 }
    },
  ];

  const recentCampaigns = [
    {
      id: '1',
      title: 'Vinhomes Grand Park Q9 - Tháng 1',
      type: 'Facebook Ads',
      status: 'active',
      budget: 15000000,
      spent: 8500000,
      impressions: 245678,
      clicks: 3456,
      leads: 89,
      ctr: 1.41,
      cpl: 95506,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '2', 
      title: 'Căn hộ Luxury Thủ Đức',
      type: 'Google Ads',
      status: 'completed',
      budget: 12000000,
      spent: 11200000,
      impressions: 156789,
      clicks: 2134,
      leads: 56,
      ctr: 1.36,
      cpl: 200000,
      startDate: '2023-12-15',
      endDate: '2024-01-15'
    },
    {
      id: '3',
      title: 'Biệt thự Riviera An Phú', 
      type: 'Social Media',
      status: 'draft',
      budget: 8000000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      ctr: 0,
      cpl: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28'
    }
  ];

  const socialMediaStats = [
    {
      platform: 'Facebook',
      icon: Facebook,
      followers: 12456,
      growth: 8.5,
      engagement: 4.2,
      posts: 156,
      color: 'blue'
    },
    {
      platform: 'Instagram', 
      icon: Instagram,
      followers: 8934,
      growth: 12.3,
      engagement: 6.8,
      posts: 234,
      color: 'pink'
    },
    {
      platform: 'YouTube',
      icon: Youtube,
      followers: 3245,
      growth: -2.1,
      engagement: 3.4,
      posts: 45,
      color: 'red'
    },
    {
      platform: 'Website',
      icon: Globe,
      followers: 45678,
      growth: 15.7,
      engagement: 2.8,
      posts: 89,
      color: 'green'
    }
  ];

  const filteredTools = marketingTools.filter(tool => 
    activeCategory === 'all' || tool.category === activeCategory
  );

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      purple: 'text-purple-600 bg-purple-100',
      red: 'text-red-600 bg-red-100',
      green: 'text-green-600 bg-green-100',
      orange: 'text-orange-600 bg-orange-100',
      indigo: 'text-indigo-600 bg-indigo-100',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Marketing Tools</h1>
          <p className="text-gray-600 mt-1">
            Bộ công cụ marketing AI cho bất động sản
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700">
            <Zap className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Plus className="w-4 h-4" />
            <span>Tạo chiến dịch</span>
          </button>
        </div>
      </div>

      {/* Tool Categories */}
      <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm border">
        {[
          { id: 'all', label: 'Tất cả', icon: Globe },
          { id: 'content', label: 'Nội dung', icon: FileText },
          { id: 'design', label: 'Thiết kế', icon: Palette },
          { id: 'social', label: 'Social Media', icon: Share2 },
          { id: 'analytics', label: 'Phân tích', icon: TrendingUp },
        ].map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Marketing Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                setSelectedTool(tool.id);
                onToolSelect?.(tool.id);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(tool.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(tool.stats.rating) ? 'bg-yellow-400' : 'bg-gray-200'
                      } rounded-full`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">{tool.stats.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

              <div className="space-y-2 mb-4">
                {tool.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    {feature}
                  </div>
                ))}
                {tool.features.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{tool.features.length - 2} tính năng khác
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  Đã dùng: <span className="font-medium text-gray-900">{tool.stats.used}</span>
                </div>
                <div className="text-gray-500">
                  Tạo ra: <span className="font-medium text-gray-900">{tool.stats.generated}</span>
                </div>
              </div>

              <button 
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onToolSelect?.(tool.id);
                }}
              >
                Sử dụng công cụ
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Chiến dịch gần đây</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                    <p className="text-sm text-gray-500">{campaign.type}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status === 'active' ? 'Đang chạy' :
                     campaign.status === 'completed' ? 'Hoàn thành' : 'Nháp'}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Ngân sách</div>
                    <div className="font-medium">{formatCurrency(campaign.budget)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Đã chi</div>
                    <div className="font-medium text-red-600">{formatCurrency(campaign.spent)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Leads</div>
                    <div className="font-medium text-green-600">{campaign.leads}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">CTR</div>
                    <div className="font-medium">{campaign.ctr.toFixed(2)}%</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Tiến độ</span>
                    <span>{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Media</h3>
          
          <div className="space-y-4">
            {socialMediaStats.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(platform.color)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{platform.platform}</div>
                      <div className="text-sm text-gray-500">
                        {platform.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      platform.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {platform.growth >= 0 ? '+' : ''}{platform.growth}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {platform.engagement}% engage
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {socialMediaStats.reduce((sum, p) => sum + p.posts, 0)}
                </div>
                <div className="text-gray-500">Tổng bài đăng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {(socialMediaStats.reduce((sum, p) => sum + p.engagement, 0) / socialMediaStats.length).toFixed(1)}%
                </div>
                <div className="text-gray-500">Tương tác TB</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Tạo nội dung với AI</h3>
            <p className="text-blue-100">
              Để AI giúp bạn tạo nội dung marketing chuyên nghiệp trong vài giây
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors">
              <FileText className="w-4 h-4 inline mr-2" />
              Viết bài
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Tạo poster
            </button>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              <Zap className="w-4 h-4 inline mr-2" />
              Bắt đầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;