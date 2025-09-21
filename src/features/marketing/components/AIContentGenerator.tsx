import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PenTool,
  FileText,
  MessageSquare,
  Mail,
  Instagram,
  Facebook,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Home,
  Building,
  Car,
  Zap,
  Check,
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
}

const AIContentGenerator: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [contentType, setContentType] = useState<string>('description');
  const [tone, setTone] = useState<string>('professional');
  const [platform, setPlatform] = useState<string>('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Mock property data
  const properties: Property[] = [
    {
      id: '1',
      title: 'Căn hộ cao cấp Vinhomes Central Park',
      type: 'Căn hộ',
      price: 4500000000,
      location: 'Quận Bình Thạnh, TP.HCM',
      area: 85,
      bedrooms: 2,
      bathrooms: 2,
      features: ['View sông', 'Nội thất cao cấp', 'Hồ bơi', 'Gym', 'Siêu thị']
    },
    {
      id: '2',
      title: 'Biệt thự Garden Villa Thủ Đức',
      type: 'Biệt thự',
      price: 12000000000,
      location: 'Thủ Đức, TP.HCM',
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      features: ['Sân vườn riêng', 'Garage 2 xe', 'Bảo vệ 24/7', 'Gần trường quốc tế']
    },
    {
      id: '3',
      title: 'Shophouse The Sun Avenue',
      type: 'Shophouse',
      price: 8500000000,
      location: 'Quận 2, TP.HCM',
      area: 120,
      features: ['Mặt tiền rộng', 'Vị trí đắc địa', 'Lưu lượng khách cao', 'Gần Metro']
    }
  ];

  const contentTypes = [
    { id: 'description', label: 'Mô tả sản phẩm', icon: FileText },
    { id: 'social_caption', label: 'Caption Social Media', icon: MessageSquare },
    { id: 'email', label: 'Email Marketing', icon: Mail },
    { id: 'blog_post', label: 'Bài viết blog', icon: PenTool },
    { id: 'ad_copy', label: 'Quảng cáo trả phí', icon: Target },
  ];

  const toneOptions = [
    { id: 'professional', label: 'Chuyên nghiệp', description: 'Trang trọng, uy tín' },
    { id: 'friendly', label: 'Thân thiện', description: 'Gần gũi, dễ tiếp cận' },
    { id: 'luxury', label: 'Sang trọng', description: 'Đẳng cấp, cao cấp' },
    { id: 'urgent', label: 'Khẩn cấp', description: 'Tạo cảm giác khan hiếm' },
  ];

  const platformOptions = [
    { id: 'general', label: 'Tổng quát', icon: FileText },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'email', label: 'Email', icon: Mail },
  ];

  const generateContent = async () => {
    if (!selectedProperty) return;

    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      let content = '';
      
      switch (contentType) {
        case 'description':
          content = generatePropertyDescription(selectedProperty, tone);
          break;
        case 'social_caption':
          content = generateSocialCaption(selectedProperty, tone, platform);
          break;
        case 'email':
          content = generateEmailContent(selectedProperty, tone);
          break;
        case 'blog_post':
          content = generateBlogPost(selectedProperty, tone);
          break;
        case 'ad_copy':
          content = generateAdCopy(selectedProperty, tone);
          break;
        default:
          content = generatePropertyDescription(selectedProperty, tone);
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2000);
  };

  const generatePropertyDescription = (property: Property, tone: string) => {
    const toneTexts = {
      professional: `🏢 **${property.title}** - Cơ hội đầu tư vàng không thể bỏ qua!

📍 **Vị trí:** ${property.location}
📐 **Diện tích:** ${property.area}m² ${property.bedrooms ? `| ${property.bedrooms} phòng ngủ` : ''} ${property.bathrooms ? `| ${property.bathrooms} phòng tắm` : ''}
💰 **Giá:** ${(property.price / 1000000000).toFixed(1)} tỷ VNĐ

✨ **Tiện ích nổi bật:**
${property.features.map(feature => `• ${feature}`).join('\n')}

🔥 **Tại sao chọn ${property.title}?**
- Vị trí đắc địa, giao thông thuận lợi
- Thiết kế hiện đại, tiện ích đầy đủ
- Tiềm năng tăng giá cao trong tương lai
- Hỗ trợ vay ngân hàng lên đến 70%

📞 **Liên hệ ngay:** 0909.XXX.XXX để được tư vấn chi tiết và xem nhà thực tế!

#BatDongSan #DauTu #${property.type.replace(/\s/g, '')}`,

      friendly: `🏡 Chào bạn! Mình có một căn ${property.type.toLowerCase()} siêu đẹp muốn giới thiệu đến bạn nè! 

✨ **${property.title}**
📍 Tọa lạc tại ${property.location} - vị trí cực kỳ thuận lợi luôn!
📐 Diện tích: ${property.area}m² rộng rãi ${property.bedrooms ? `, có ${property.bedrooms} phòng ngủ` : ''} ${property.bathrooms ? `và ${property.bathrooms} phòng tắm` : ''}
💵 Giá chỉ: ${(property.price / 1000000000).toFixed(1)} tỷ - giá quá hợp lý!

🎯 **Điểm cộng của căn này:**
${property.features.map(feature => `🔸 ${feature}`).join('\n')}

Thật sự mà nói, với mức giá này thì rất khó tìm được căn tương tự đâu bạn ơi! Bạn có muốn mình hẹn thời gian dẫn đi xem không? 

Inbox mình hoặc gọi trực tiếp: 0909.XXX.XXX nhé! 🤝`,

      luxury: `🌟 **EXCLUSIVE PROPERTY** - Đẳng cấp thượng lưu chỉ dành cho giới tinh hoa

👑 **${property.title}**
Một tác phẩm kiến trúc đỉnh cao tại ${property.location}

🏛️ **Thông số kỹ thuật:**
• Diện tích: ${property.area}m² được thiết kế tối ưu
${property.bedrooms ? `• ${property.bedrooms} phòng ngủ master với thiết kế riêng tư` : ''}
${property.bathrooms ? `• ${property.bathrooms} phòng tắm được ốp đá marble cao cấp` : ''}
• Giá trị đầu tư: ${(property.price / 1000000000).toFixed(1)} tỷ VNĐ

💎 **Đặc quyền độc tôn:**
${property.features.map(feature => `⚜️ ${feature}`).join('\n')}

🎯 Chỉ dành cho những khách hàng có tầm nhìn xa và đẳng cấp thương gia thực thụ.

📞 **Private Banking Hotline:** 0909.XXX.XXX
*Chỉ phục vụ tối đa 10 khách hàng VIP*`,

      urgent: `🚨 **HOT! SIÊU HOT!** - Cơ hội cuối cùng sở hữu ${property.title}!

⏰ **CHỈ CÒN 3 NGÀY** để quyết định - sau đó giá sẽ tăng 200-300 triệu!

🔥 **${property.title}**
📍 ${property.location} - VỊ TRÍ VÀNG hiếm có!
📐 ${property.area}m² ${property.bedrooms ? `| ${property.bedrooms}PN` : ''} ${property.bathrooms ? `| ${property.bathrooms}WC` : ''}
💰 **GIÁ ƯU ĐÃI:** chỉ ${(property.price / 1000000000).toFixed(1)} tỷ (GIÁ GỐC: ${((property.price + 300000000) / 1000000000).toFixed(1)} tỷ)

⚡ **LÝ DO PHẢI MUA NGAY:**
${property.features.map(feature => `🎯 ${feature}`).join('\n')}

🚨 **Chính sách đặc biệt:**
• Giữ chỗ chỉ 50 triệu
• Ưu đãi 2% cho khách mua trong tuần
• Hỗ trợ vay 0% lãi suất tháng đầu

📞 **Hotline đặt chỗ:** 0909.XXX.XXX 
⚠️ *Sau 22h hôm nay, giá sẽ tăng KHÔNG THƯƠNG LƯỢNG!*`
    };

    return toneTexts[tone as keyof typeof toneTexts] || toneTexts.professional;
  };

  const generateSocialCaption = (property: Property, tone: string, platform: string) => {
    if (platform === 'instagram') {
      return `✨ ${property.title} ✨

📍 ${property.location}
💰 ${(property.price / 1000000000).toFixed(1)} tỷ VNĐ
📐 ${property.area}m²

${property.features.slice(0, 3).map(feature => `🔸 ${feature}`).join('\n')}

#realestate #property #investment #hochiminh #apartment #luxury #home #dream #lifestyle #architecture`;
    }
    
    if (platform === 'facebook') {
      return `🏡 Ai đang tìm ${property.type.toLowerCase()} đẹp tại ${property.location}? Đây rồi! 

${property.title} với giá siêu hấp dẫn chỉ ${(property.price / 1000000000).toFixed(1)} tỷ!

Inbox ngay để được tư vấn chi tiết nhé! 📩`;
    }

    return generatePropertyDescription(property, tone);
  };

  const generateEmailContent = (property: Property, tone: string) => {
    return `Subject: Đặc biệt dành riêng cho bạn - ${property.title}

Kính chào Anh/Chị,

Tôi là [Tên], chuyên viên tư vấn bất động sản. Hôm nay tôi có niềm vui được giới thiệu đến Anh/Chị một sản phẩm đặc biệt:

🏢 ${property.title}
📍 Vị trí: ${property.location}
💰 Giá: ${(property.price / 1000000000).toFixed(1)} tỷ VNĐ
📐 Diện tích: ${property.area}m²

Điểm nổi bật:
${property.features.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

Tôi tin rằng đây sẽ là lựa chọn phù hợp với nhu cầu của Anh/Chị. Để được tư vấn chi tiết hơn, Anh/Chị vui lòng liên hệ:

📞 Hotline: 0909.XXX.XXX
📧 Email: [email]

Trân trọng,
[Tên của bạn]
[Công ty]`;
  };

  const generateBlogPost = (property: Property, tone: string) => {
    return `# Khám phá ${property.title} - Định nghĩa mới về cuộc sống hiện đại

Trong bối cảnh thị trường bất động sản ngày càng sôi động, việc tìm kiếm một không gian sống lý tưởng trở nên quan trọng hơn bao giờ hết. Hôm nay, chúng tôi xin giới thiệu đến bạn ${property.title} - một dự án đáng chú ý tại ${property.location}.

## Vị trí đắc địa

Tọa lạc tại ${property.location}, dự án sở hữu vị trí vô cùng thuận lợi với hệ thống giao thông kết nối linh hoạt đến các khu vực trung tâm thành phố.

## Thiết kế và tiện ích

Với diện tích ${property.area}m², mỗi căn hộ được thiết kế tối ưu để mang lại không gian sống thoải mái và tiện nghi:

${property.features.map(feature => `- ${feature}`).join('\n')}

## Giá trị đầu tư

Với mức giá ${(property.price / 1000000000).toFixed(1)} tỷ VNĐ, dự án không chỉ mang lại giá trị an cư mà còn là cơ hội đầu tư sinh lời bền vững.

## Kết luận

${property.title} không chỉ là nơi an cư mà còn là biểu tượng của phong cách sống hiện đại, tiện nghi và đẳng cấp.

*Để biết thêm chi tiết, vui lòng liên hệ: 0909.XXX.XXX*`;
  };

  const generateAdCopy = (property: Property, tone: string) => {
    return `🎯 ${property.title}
💰 Chỉ ${(property.price / 1000000000).toFixed(1)} tỷ - Cơ hội không thể bỏ lỡ!

✅ ${property.location} - Vị trí đắc địa
✅ ${property.area}m² - Diện tích lý tưởng
✅ ${property.features.slice(0, 3).join(' • ')}

👆 Nhấn để xem chi tiết và đặt lịch tham quan!

📞 Hotline: 0909.XXX.XXX`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI Content Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tạo nội dung marketing chuyên nghiệp cho bất động sản chỉ trong vài giây với AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Property Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn bất động sản
            </h3>
            <div className="space-y-3">
              {properties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedProperty?.id === property.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {property.title}
                  </h4>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-3 h-3" />
                      <span>{formatCurrency(property.price)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Home className="w-3 h-3" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Loại nội dung
            </h3>
            <div className="space-y-2">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => setContentType(type.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      contentType === type.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{type.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phong cách
            </h3>
            <div className="space-y-2">
              {toneOptions.map((toneOption) => (
                <div
                  key={toneOption.id}
                  onClick={() => setTone(toneOption.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    tone === toneOption.id
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  } border`}
                >
                  <div className="font-medium">{toneOption.label}</div>
                  <div className="text-sm text-gray-500">
                    {toneOption.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {platformOptions.map((platformOption) => {
                const Icon = platformOption.icon;
                return (
                  <div
                    key={platformOption.id}
                    onClick={() => setPlatform(platformOption.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors text-sm ${
                      platform === platformOption.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{platformOption.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={!selectedProperty || isGenerating}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang tạo nội dung...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tạo nội dung với AI</span>
              </>
            )}
          </button>
        </div>

        {/* Content Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Nội dung được tạo
              </h3>
              {generatedContent && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(generatedContent)}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Đã copy!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-gray-600 mb-2">AI đang phân tích và tạo nội dung...</div>
                <div className="text-sm text-gray-500">Vui lòng đợi trong giây lát</div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {Math.floor(Math.random() * 20) + 80}%
                    </div>
                    <div className="text-xs text-gray-600">Engagement Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {generatedContent.length}
                    </div>
                    <div className="text-xs text-gray-600">Ký tự</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {generatedContent.split(' ').length}
                    </div>
                    <div className="text-xs text-gray-600">Từ</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Zap className="w-16 h-16 mb-4 text-gray-300" />
                <div className="text-lg font-medium mb-2">Chưa có nội dung</div>
                <div className="text-sm text-center max-w-md">
                  Chọn bất động sản và nhấn "Tạo nội dung với AI" để bắt đầu tạo nội dung marketing chuyên nghiệp
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator;