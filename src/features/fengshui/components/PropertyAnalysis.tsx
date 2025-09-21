import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Home,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Wind,
  Sun,
  Droplets,
  Mountain,
  Trees,
  RefreshCw,
  Download,
  Share,
} from 'lucide-react';
import { fengShuiService } from '@/services/fengShuiService';
import { FengShuiPropertyAnalysis, FengShuiElement } from '@/types/fengshui';

const PropertyAnalysis: React.FC = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [analysis, setAnalysis] = useState<FengShuiPropertyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock property list
  const properties = [
    { id: '1', title: 'Căn hộ Vinhomes Central Park - Tòa C1', address: 'Quận Bình Thạnh, TP.HCM' },
    { id: '2', title: 'Biệt thự Thủ Đức Garden City', address: 'Thành phố Thủ Đức, TP.HCM' },
    { id: '3', title: 'Shophouse The Sun Avenue', address: 'Quận 2, TP.HCM' },
    { id: '4', title: 'Penthouse Saigon Pearl', address: 'Quận Bình Thạnh, TP.HCM' },
  ];

  const handleAnalyze = async () => {
    if (!selectedPropertyId) return;

    setIsAnalyzing(true);
    try {
      const result = await fengShuiService.analyzeProperty(selectedPropertyId, {
        includeUserCompatibility: true
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing property:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getElementColor = (element: FengShuiElement) => {
    const colors = {
      kim: '#C0C0C0',
      moc: '#228B22',
      thuy: '#0000FF',
      hoa: '#FF4500',
      tho: '#8B4513'
    };
    return colors[element];
  };

  const getElementName = (element: FengShuiElement) => {
    const names = {
      kim: 'Kim (Kim loại)',
      moc: 'Mộc (Gỗ)', 
      thuy: 'Thủy (Nước)',
      hoa: 'Hỏa (Lửa)',
      tho: 'Thổ (Đất)'
    };
    return names[element];
  };

  const getDirectionName = (direction: string) => {
    const names = {
      north: 'Bắc',
      south: 'Nam',
      east: 'Đông',
      west: 'Tây',
      northeast: 'Đông Bắc',
      northwest: 'Tây Bắc',
      southeast: 'Đông Nam',
      southwest: 'Tây Nam'
    };
    return names[direction as keyof typeof names] || direction;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Phân tích Phong thủy Bất động sản
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Đánh giá luồng khí, hướng nhà và tương thích với gia chủ dựa trên nguyên lý phong thủy cổ truyền
        </p>
      </div>

      {/* Property Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chọn bất động sản để phân tích
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => setSelectedPropertyId(property.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPropertyId === property.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-1">
                {property.title}
              </h4>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {property.address}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!selectedPropertyId || isAnalyzing}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang phân tích phong thủy...</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Bắt đầu phân tích</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Kết quả phân tích tổng thể</h3>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold ${
                  getScoreColor(analysis.analysis.overallScore)
                }`}>
                  {analysis.analysis.overallScore}
                </div>
                <div className="font-medium text-gray-900">Điểm tổng thể</div>
                <div className="text-sm text-gray-500">Trên 100 điểm</div>
              </div>

              {/* Facing Direction */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Compass className="w-8 h-8" />
                </div>
                <div className="font-medium text-gray-900">
                  {getDirectionName(analysis.analysis.facingDirection)}
                </div>
                <div className="text-sm text-gray-500">Hướng nhà</div>
              </div>

              {/* Dominant Element */}
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getElementColor(analysis.analysis.elementAnalysis.dominantElement) }}
                >
                  {analysis.analysis.elementAnalysis.dominantElement.toUpperCase()}
                </div>
                <div className="font-medium text-gray-900">
                  {getElementName(analysis.analysis.elementAnalysis.dominantElement)}
                </div>
                <div className="text-sm text-gray-500">Ngũ hành chủ đạo</div>
              </div>

              {/* Compatibility */}
              {analysis.userCompatibility && analysis.userCompatibility.length > 0 && (
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold ${
                    getScoreColor(analysis.userCompatibility[0].compatibilityScore)
                  }`}>
                    {analysis.userCompatibility[0].compatibilityScore}
                  </div>
                  <div className="font-medium text-gray-900">Phù hợp cá nhân</div>
                  <div className="text-sm text-gray-500">Với gia chủ</div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {analysis.analysis.overallScore >= 85 ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : analysis.analysis.overallScore >= 70 ? (
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {analysis.analysis.overallScore >= 85 ? 'Phong thủy rất tốt' :
                     analysis.analysis.overallScore >= 70 ? 'Phong thủy khá tốt' :
                     'Cần cải thiện phong thủy'}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {analysis.analysis.overallScore >= 85 
                      ? 'Bất động sản này có phong thủy rất tốt và phù hợp với gia chủ. Đây là lựa chọn tuyệt vời.'
                      : analysis.analysis.overallScore >= 70
                      ? 'Bất động sản có phong thủy khá tốt với một số điểm cần cải thiện nhỏ.'
                      : 'Cần có những điều chỉnh về phong thủy để tối ưu hóa năng lượng tích cực.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Flow Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Wind className="w-5 h-5 mr-2 text-blue-500" />
                Luồng năng lượng
              </h3>

              <div className="space-y-4">
                {Object.entries(analysis.analysis.energyFlow).map(([room, score]) => {
                  const roomNames = {
                    entrance: 'Cửa chính',
                    livingRoom: 'Phòng khách',
                    bedroom: 'Phòng ngủ',
                    kitchen: 'Nhà bếp',
                    bathroom: 'Nhà vệ sinh'
                  };
                  
                  return (
                    <div key={room} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {roomNames[room as keyof typeof roomNames]}
                        </span>
                        <span className="text-gray-900">{score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 85 ? 'bg-green-500' :
                            score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Element Balance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-500" />
                Cân bằng ngũ hành
              </h3>

              <div className="space-y-4">
                {Object.entries(analysis.analysis.elementAnalysis.elementBalance).map(([element, balance]) => (
                  <div key={element} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getElementColor(element as FengShuiElement) }}
                        ></div>
                        <span className="font-medium text-gray-700">
                          {getElementName(element as FengShuiElement)}
                        </span>
                      </div>
                      <span className="text-gray-900">{balance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${balance}%`,
                          backgroundColor: getElementColor(element as FengShuiElement)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Điểm mạnh
              </h3>

              <div className="space-y-3">
                {analysis.analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Điểm cần cải thiện
              </h3>

              <div className="space-y-3">
                {analysis.analysis.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-orange-800">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvements */}
          {analysis.analysis.improvements.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Gợi ý cải thiện
              </h3>

              <div className="space-y-4">
                {analysis.analysis.improvements.map((improvement) => (
                  <div key={improvement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {improvement.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {improvement.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {improvement.location}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${
                            improvement.priority === 'high' ? 'bg-red-100 text-red-600' :
                            improvement.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {improvement.priority === 'high' ? 'Ưu tiên cao' :
                             improvement.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {improvement.timeRequired}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Hướng dẫn thực hiện:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {improvement.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                      
                      {improvement.tips.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h6 className="text-xs font-medium text-gray-600 mb-1">Lưu ý:</h6>
                          <div className="text-xs text-gray-600 space-y-1">
                            {improvement.tips.map((tip, index) => (
                              <div key={index}>• {tip}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Compatibility */}
          {analysis.userCompatibility && analysis.userCompatibility.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-indigo-500" />
                Phù hợp với gia chủ
              </h3>

              {analysis.userCompatibility.map((compatibility) => (
                <div key={compatibility.userId} className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                      getScoreColor(compatibility.compatibilityScore)
                    }`}>
                      {compatibility.compatibilityScore}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Độ phù hợp cá nhân</div>
                      <div className="text-sm text-gray-500">Dựa trên thông tin phong thủy của bạn</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Recommendations */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Lợi ích
                      </h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        {compatibility.benefits.map((benefit, index) => (
                          <li key={index}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Gợi ý
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {compatibility.personalizedRecommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Risk Factors */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-medium text-orange-900 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Lưu ý
                      </h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        {compatibility.riskFactors.map((risk, index) => (
                          <li key={index}>• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Element Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-500" />
              Gợi ý theo ngũ hành
            </h3>

            <div className="space-y-3">
              {analysis.analysis.elementAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Star className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-purple-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyAnalysis;