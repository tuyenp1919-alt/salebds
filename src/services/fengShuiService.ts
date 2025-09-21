import {
  FengShuiElement,
  Direction,
  FengShuiProfile,
  FengShuiPropertyAnalysis,
  LocationScore,
  PricePrediction,
  FengShuiRecommendation,
  FengShuiCalculation,
  FengShuiImprovement,
  LocationInsight,
  MarketTrend,
  PriceFactor,
  PricePoint,
} from '@/types/fengshui';

// Feng Shui calculation utilities
export const fengShuiCalculations: FengShuiCalculation = {
  yearToElement: (year: number): FengShuiElement => {
    const lastDigit = year % 10;
    switch (lastDigit) {
      case 0:
      case 1:
        return 'kim';
      case 2:
      case 3:
        return 'thuy';
      case 4:
      case 5:
        return 'moc';
      case 6:
      case 7:
        return 'hoa';
      case 8:
      case 9:
        return 'tho';
      default:
        return 'kim';
    }
  },

  calculateKuaNumber: (birthYear: number, gender: 'male' | 'female'): number => {
    const yearSum = birthYear
      .toString()
      .split('')
      .map(Number)
      .reduce((sum, digit) => sum + digit, 0);
    
    let singleDigit = yearSum;
    while (singleDigit > 9) {
      singleDigit = singleDigit
        .toString()
        .split('')
        .map(Number)
        .reduce((sum, digit) => sum + digit, 0);
    }

    if (gender === 'male') {
      const kua = 11 - singleDigit;
      return kua === 5 ? 2 : kua > 9 ? kua - 9 : kua;
    } else {
      const kua = 4 + singleDigit;
      return kua === 5 ? 8 : kua > 9 ? kua - 9 : kua;
    }
  },

  getDirections: (kuaNumber: number) => {
    const directionMappings: Record<number, { lucky: Direction[]; unlucky: Direction[] }> = {
      1: {
        lucky: ['north', 'south', 'east', 'southeast'],
        unlucky: ['west', 'northwest', 'northeast', 'southwest']
      },
      2: {
        lucky: ['southwest', 'northwest', 'west', 'northeast'],
        unlucky: ['east', 'southeast', 'south', 'north']
      },
      3: {
        lucky: ['east', 'north', 'south', 'southeast'],
        unlucky: ['west', 'southwest', 'northwest', 'northeast']
      },
      4: {
        lucky: ['southeast', 'east', 'south', 'north'],
        unlucky: ['west', 'northwest', 'southwest', 'northeast']
      },
      6: {
        lucky: ['west', 'northeast', 'southwest', 'northwest'],
        unlucky: ['east', 'southeast', 'south', 'north']
      },
      7: {
        lucky: ['northwest', 'southwest', 'northeast', 'west'],
        unlucky: ['east', 'north', 'south', 'southeast']
      },
      8: {
        lucky: ['northeast', 'west', 'northwest', 'southwest'],
        unlucky: ['east', 'southeast', 'north', 'south']
      },
      9: {
        lucky: ['south', 'southeast', 'east', 'north'],
        unlucky: ['west', 'northeast', 'northwest', 'southwest']
      }
    };

    return directionMappings[kuaNumber] || directionMappings[1];
  },

  elementRelations: {
    enhancing: {
      kim: 'thuy',
      thuy: 'moc',
      moc: 'hoa',
      hoa: 'tho',
      tho: 'kim'
    },
    weakening: {
      kim: 'tho',
      thuy: 'kim',
      moc: 'thuy',
      hoa: 'moc',
      tho: 'hoa'
    },
    conflicting: {
      kim: 'moc',
      moc: 'tho',
      tho: 'thuy',
      thuy: 'hoa',
      hoa: 'kim'
    }
  },

  elementColors: {
    kim: ['#C0C0C0', '#FFD700', '#FFFFFF', '#F5F5DC'],
    thuy: ['#000080', '#0000FF', '#000000', '#4169E1'],
    moc: ['#008000', '#228B22', '#32CD32', '#7CFC00'],
    hoa: ['#FF0000', '#DC143C', '#FF4500', '#FF69B4'],
    tho: ['#8B4513', '#D2691E', '#F4A460', '#DEB887']
  },

  elementNumbers: {
    kim: [6, 7],
    thuy: [1],
    moc: [3, 4],
    hoa: [9],
    tho: [2, 5, 8]
  }
};

// Mock data for development
const mockFengShuiProfiles: FengShuiProfile[] = [
  {
    userId: 'user-1',
    birthYear: 1990,
    birthMonth: 3,
    birthDay: 15,
    gender: 'male',
    element: 'kim',
    kuaNumber: 2,
    luckyDirections: ['southwest', 'northwest', 'west', 'northeast'],
    unluckyDirections: ['east', 'southeast', 'south', 'north'],
    luckyColors: ['#C0C0C0', '#FFD700', '#FFFFFF', '#F5F5DC'],
    unluckyColors: ['#008000', '#228B22'],
    luckyNumbers: [6, 7, 2, 5, 8],
    unluckyNumbers: [3, 4, 9, 1],
    personalityTraits: ['Thực tế', 'Kiên nhẫn', 'Đáng tin cậy', 'Thận trọng'],
    careerSuggestions: ['Bất động sản', 'Ngân hàng', 'Xây dựng', 'Nông nghiệp'],
    healthNotes: ['Chú ý hệ tiêu hóa', 'Tránh stress', 'Vận động thường xuyên'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockPropertyAnalyses: FengShuiPropertyAnalysis[] = [
  {
    propertyId: '1',
    analysis: {
      facingDirection: 'south',
      sittingDirection: 'north',
      overallScore: 85,
      energyFlow: {
        entrance: 90,
        livingRoom: 85,
        bedroom: 88,
        kitchen: 75,
        bathroom: 70
      },
      strengths: [
        'Hướng Nam đón ánh sáng tự nhiên tốt',
        'Luồng khí thuận lợi từ cửa chính',
        'Vị trí phòng ngủ hợp phong thủy',
        'Cây xanh quanh nhà tạo sinh khí'
      ],
      weaknesses: [
        'Nhà bếp đối diện nhà vệ sinh',
        'Thiếu ánh sáng tự nhiên ở hành lang',
        'Cầu thang đối diện cửa chính'
      ],
      improvements: [
        {
          id: 'imp-1',
          category: 'plants',
          title: 'Đặt cây xanh ở góc thiếu sáng',
          description: 'Tăng sinh khí và cải thiện không khí',
          location: 'Hành lang tầng 2',
          priority: 'medium',
          cost: 'low',
          difficulty: 'easy',
          expectedImpact: 'Cải thiện 5-8% năng lượng tích cực',
          instructions: [
            'Chọn cây lưỡi hổ hoặc cây kim ngân',
            'Đặt chậu màu trắng hoặc vàng',
            'Tưới nước 2-3 lần/tuần'
          ],
          materials: ['Cây xanh', 'Chậu gốm', 'Đất trồng'],
          timeRequired: '30 phút',
          tips: [
            'Tránh cây có gai',
            'Không đặt quá nhiều cây trong một phòng',
            'Thay đất 6 tháng/lần'
          ]
        }
      ],
      elementAnalysis: {
        dominantElement: 'hoa',
        elementBalance: {
          kim: 15,
          moc: 25,
          thuy: 10,
          hoa: 35,
          tho: 15
        },
        recommendations: [
          'Tăng yếu tố Kim bằng màu trắng, bạc',
          'Cân bằng Hỏa bằng cách thêm nước',
          'Sử dụng đá tự nhiên để tăng Thổ'
        ]
      },
      locationAnalysis: {
        landform: 'urban',
        waterPresence: false,
        mountainSupport: true,
        roadPosition: 'front',
        surroundingBuildings: [
          {
            height: 'same',
            distance: 'moderate',
            impact: 'neutral'
          },
          {
            height: 'lower',
            distance: 'close',
            impact: 'positive'
          }
        ]
      },
      goodTimes: {
        moveInDates: [
          new Date('2024-03-15'),
          new Date('2024-04-10'),
          new Date('2024-05-20')
        ],
        contractDates: [
          new Date('2024-02-28'),
          new Date('2024-03-30'),
          new Date('2024-04-25')
        ],
        renovationPeriods: [
          {
            start: new Date('2024-04-01'),
            end: new Date('2024-05-15'),
            activities: ['Sơn lại', 'Thay đổi nội thất', 'Trồng cây']
          }
        ]
      }
    },
    userCompatibility: [
      {
        userId: 'user-1',
        compatibilityScore: 88,
        personalizedRecommendations: [
          'Hướng Nam rất phù hợp với mệnh Kim',
          'Nên đặt bàn làm việc hướng Tây Nam',
          'Phòng ngủ chính phù hợp với tuổi của bạn'
        ],
        riskFactors: [
          'Tránh đặt gương lớn đối diện giường',
          'Hạn chế màu xanh lá cây trong phòng ngủ'
        ],
        benefits: [
          'Tăng cường sức khỏe và tài lộc',
          'Hỗ trợ sự nghiệp phát triển',
          'Cải thiện mối quan hệ gia đình'
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockLocationScores: LocationScore[] = [
  {
    propertyId: '1',
    scores: {
      publicTransport: 85,
      mainRoads: 90,
      airport: 60,
      shopping: 92,
      dining: 88,
      entertainment: 75,
      healthcare: 80,
      education: 95,
      banking: 85,
      airQuality: 70,
      noiseLevel: 65,
      greenSpace: 80,
      safety: 90,
      priceGrowth: 85,
      rentalYield: 75,
      liquidity: 80,
      developmentPlan: 88
    },
    overallScore: 82,
    ranking: 'good',
    insights: [
      {
        type: 'strength',
        category: 'Education',
        title: 'Trường học chất lượng cao',
        description: 'Trong bán kính 2km có 3 trường tiểu học và 2 trường THCS uy tín',
        impact: 'high'
      },
      {
        type: 'strength',
        category: 'Shopping',
        title: 'Trung tâm thương mại gần',
        description: 'Cách Vincom Plaza chỉ 1.5km, tiện lợi mua sắm',
        impact: 'medium'
      },
      {
        type: 'weakness',
        category: 'Environment',
        title: 'Chất lượng không khí',
        description: 'Gần đường lớn nên có khói bụi, cần cây xanh để cải thiện',
        impact: 'medium'
      },
      {
        type: 'opportunity',
        category: 'Development',
        title: 'Kế hoạch phát triển Metro',
        description: 'Tuyến Metro số 2 dự kiến đi qua khu vực trong 3 năm tới',
        impact: 'high'
      }
    ],
    marketTrends: [
      {
        metric: 'Giá bán trung bình',
        currentValue: 45000000,
        previousValue: 42000000,
        change: 7.1,
        trend: 'up',
        timeframe: '6 tháng qua',
        forecast: {
          nextMonth: 45500000,
          nextQuarter: 47000000,
          nextYear: 50000000
        }
      },
      {
        metric: 'Thời gian bán trung bình',
        currentValue: 45,
        previousValue: 60,
        change: -25,
        trend: 'down',
        timeframe: '3 tháng qua'
      }
    ],
    createdAt: new Date()
  }
];

const mockPricePredictions: PricePrediction[] = [
  {
    propertyId: '1',
    currentPrice: 4500000000,
    predictions: [
      {
        timeframe: '1month',
        predictedPrice: 4550000000,
        confidence: 85,
        factors: [
          {
            factor: 'Cung cầu thị trường',
            impact: 'positive',
            weight: 30,
            description: 'Nhu cầu tăng cao trong khu vực'
          },
          {
            factor: 'Lãi suất ngân hàng',
            impact: 'neutral',
            weight: 15,
            description: 'Lãi suất ổn định'
          }
        ]
      },
      {
        timeframe: '6months',
        predictedPrice: 4800000000,
        confidence: 78,
        factors: [
          {
            factor: 'Dự án metro gần kề',
            impact: 'positive',
            weight: 40,
            description: 'Metro sẽ cải thiện kết nối giao thông'
          },
          {
            factor: 'Chính sách bất động sản',
            impact: 'negative',
            weight: 25,
            description: 'Có thể có chính sách siết tín dụng'
          }
        ]
      },
      {
        timeframe: '1year',
        predictedPrice: 5100000000,
        confidence: 72,
        factors: [
          {
            factor: 'Phát triển khu vực',
            impact: 'positive',
            weight: 35,
            description: 'Nhiều dự án mới được triển khai'
          }
        ]
      }
    ],
    analysis: {
      growth_trend: 'bullish',
      volatility: 'medium',
      investment_rating: 'buy',
      key_drivers: [
        'Vị trí đắc địa gần trung tâm',
        'Hạ tầng giao thông phát triển',
        'Cung thiếu trong phân khúc'
      ],
      risk_factors: [
        'Biến động chính sách',
        'Tình hình kinh tế vĩ mô',
        'Cạnh tranh từ dự án mới'
      ]
    },
    comparable_properties: [
      {
        propertyId: '2',
        similarityScore: 92,
        currentPrice: 4300000000,
        priceHistory: [
          {
            date: new Date('2023-01-01'),
            price: 4000000000,
            source: 'Batdongsan.com.vn',
            verified: true
          },
          {
            date: new Date('2023-06-01'),
            price: 4200000000,
            source: 'Alonhadat.com.vn',
            verified: true
          }
        ]
      }
    ],
    createdAt: new Date()
  }
];

// Service implementation
class FengShuiService {
  // Profile management
  async createProfile(data: Omit<FengShuiProfile, 'createdAt' | 'updatedAt'>): Promise<FengShuiProfile> {
    // Calculate feng shui attributes
    const element = fengShuiCalculations.yearToElement(data.birthYear);
    const kuaNumber = fengShuiCalculations.calculateKuaNumber(data.birthYear, data.gender);
    const directions = fengShuiCalculations.getDirections(kuaNumber);
    
    const profile: FengShuiProfile = {
      ...data,
      element,
      kuaNumber,
      luckyDirections: directions.lucky,
      unluckyDirections: directions.unlucky,
      luckyColors: fengShuiCalculations.elementColors[element],
      unluckyColors: [], // Calculate based on conflicting elements
      luckyNumbers: fengShuiCalculations.elementNumbers[element],
      unluckyNumbers: [], // Calculate based on conflicting elements
      personalityTraits: this.getPersonalityTraits(element),
      careerSuggestions: this.getCareerSuggestions(element),
      healthNotes: this.getHealthNotes(element),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In real app, save to database
    mockFengShuiProfiles.push(profile);
    return profile;
  }

  async getProfile(userId: string): Promise<FengShuiProfile | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockFengShuiProfiles.find(profile => profile.userId === userId) || null;
  }

  async updateProfile(userId: string, data: Partial<FengShuiProfile>): Promise<FengShuiProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockFengShuiProfiles.findIndex(profile => profile.userId === userId);
    if (index === -1) {
      throw new Error('Profile not found');
    }

    mockFengShuiProfiles[index] = {
      ...mockFengShuiProfiles[index],
      ...data,
      updatedAt: new Date()
    };

    return mockFengShuiProfiles[index];
  }

  // Property analysis
  async analyzeProperty(propertyId: string, options?: { includeUserCompatibility?: boolean }): Promise<FengShuiPropertyAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app, perform actual analysis
    const existingAnalysis = mockPropertyAnalyses.find(analysis => analysis.propertyId === propertyId);
    if (existingAnalysis) {
      return existingAnalysis;
    }

    // Generate new analysis
    const analysis: FengShuiPropertyAnalysis = {
      propertyId,
      analysis: {
        facingDirection: 'south',
        sittingDirection: 'north',
        overallScore: Math.floor(Math.random() * 30) + 70,
        energyFlow: {
          entrance: Math.floor(Math.random() * 20) + 80,
          livingRoom: Math.floor(Math.random() * 20) + 75,
          bedroom: Math.floor(Math.random() * 25) + 70,
          kitchen: Math.floor(Math.random() * 30) + 60,
          bathroom: Math.floor(Math.random() * 25) + 65
        },
        strengths: [
          'Hướng nhà đón ánh sáng tự nhiên tốt',
          'Luồng khí từ cửa chính thuận lợi',
          'Vị trí phòng ngủ hợp phong thủy'
        ],
        weaknesses: [
          'Cần cải thiện ánh sáng tự nhiên',
          'Bố trí một số phòng chưa tối ưu'
        ],
        improvements: [],
        elementAnalysis: {
          dominantElement: 'hoa',
          elementBalance: {
            kim: 20,
            moc: 25,
            thuy: 15,
            hoa: 25,
            tho: 15
          },
          recommendations: [
            'Cân bằng ngũ hành bằng màu sắc phù hợp',
            'Bố trí đồ vật theo hướng tốt'
          ]
        },
        locationAnalysis: {
          landform: 'urban',
          waterPresence: Math.random() > 0.5,
          mountainSupport: Math.random() > 0.3,
          roadPosition: 'front',
          surroundingBuildings: []
        },
        goodTimes: {
          moveInDates: [
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
          ],
          contractDates: [
            new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ],
          renovationPeriods: []
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockPropertyAnalyses.push(analysis);
    return analysis;
  }

  async getPropertyAnalysis(propertyId: string): Promise<FengShuiPropertyAnalysis | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPropertyAnalyses.find(analysis => analysis.propertyId === propertyId) || null;
  }

  // Location scoring
  async scoreLocation(propertyId: string): Promise<LocationScore> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingScore = mockLocationScores.find(score => score.propertyId === propertyId);
    if (existingScore) {
      return existingScore;
    }

    // Generate new score
    const score: LocationScore = {
      propertyId,
      scores: {
        publicTransport: Math.floor(Math.random() * 40) + 60,
        mainRoads: Math.floor(Math.random() * 30) + 70,
        airport: Math.floor(Math.random() * 50) + 50,
        shopping: Math.floor(Math.random() * 30) + 70,
        dining: Math.floor(Math.random() * 40) + 60,
        entertainment: Math.floor(Math.random() * 40) + 60,
        healthcare: Math.floor(Math.random() * 30) + 70,
        education: Math.floor(Math.random() * 20) + 80,
        banking: Math.floor(Math.random() * 30) + 70,
        airQuality: Math.floor(Math.random() * 40) + 60,
        noiseLevel: Math.floor(Math.random() * 50) + 50,
        greenSpace: Math.floor(Math.random() * 30) + 70,
        safety: Math.floor(Math.random() * 20) + 80,
        priceGrowth: Math.floor(Math.random() * 30) + 70,
        rentalYield: Math.floor(Math.random() * 40) + 60,
        liquidity: Math.floor(Math.random() * 30) + 70,
        developmentPlan: Math.floor(Math.random() * 30) + 70
      },
      overallScore: 0,
      ranking: 'good',
      insights: [],
      marketTrends: [],
      createdAt: new Date()
    };

    // Calculate overall score
    const scores = Object.values(score.scores);
    score.overallScore = Math.floor(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    
    // Determine ranking
    if (score.overallScore >= 90) score.ranking = 'excellent';
    else if (score.overallScore >= 80) score.ranking = 'good';
    else if (score.overallScore >= 70) score.ranking = 'average';
    else if (score.overallScore >= 60) score.ranking = 'below-average';
    else score.ranking = 'poor';

    mockLocationScores.push(score);
    return score;
  }

  async getLocationScore(propertyId: string): Promise<LocationScore | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLocationScores.find(score => score.propertyId === propertyId) || null;
  }

  // Price prediction
  async predictPrice(propertyId: string): Promise<PricePrediction> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const existing = mockPricePredictions.find(pred => pred.propertyId === propertyId);
    if (existing) {
      return existing;
    }

    // Generate new prediction
    const currentPrice = Math.floor(Math.random() * 2000000000) + 3000000000;
    const prediction: PricePrediction = {
      propertyId,
      currentPrice,
      predictions: [
        {
          timeframe: '1month',
          predictedPrice: currentPrice * (1 + (Math.random() * 0.02)),
          confidence: 85,
          factors: []
        },
        {
          timeframe: '6months',
          predictedPrice: currentPrice * (1 + (Math.random() * 0.1 + 0.03)),
          confidence: 75,
          factors: []
        },
        {
          timeframe: '1year',
          predictedPrice: currentPrice * (1 + (Math.random() * 0.15 + 0.05)),
          confidence: 68,
          factors: []
        }
      ],
      analysis: {
        growth_trend: Math.random() > 0.7 ? 'bullish' : Math.random() > 0.3 ? 'stable' : 'bearish',
        volatility: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        investment_rating: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'hold' : 'sell',
        key_drivers: ['Vị trí thuận lợi', 'Hạ tầng phát triển'],
        risk_factors: ['Biến động thị trường', 'Chính sách']
      },
      comparable_properties: [],
      createdAt: new Date()
    };

    mockPricePredictions.push(prediction);
    return prediction;
  }

  async getPricePrediction(propertyId: string): Promise<PricePrediction | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPricePredictions.find(pred => pred.propertyId === propertyId) || null;
  }

  // Recommendations
  async getRecommendations(userId: string, filters?: any): Promise<FengShuiRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock recommendations
    return [
      {
        id: 'rec-1',
        propertyId: '1',
        userId,
        type: 'purchase',
        recommendation: 'highly_recommended',
        score: 92,
        reasons: {
          fengshui_factors: ['Hướng nhà phù hợp với mệnh', 'Luồng khí tốt'],
          location_factors: ['Gần trường học', 'Giao thông thuận lợi'],
          market_factors: ['Giá hợp lý', 'Tiềm năng tăng trưởng cao'],
          personal_factors: ['Phù hợp với ngân sách', 'Đáp ứng nhu cầu']
        },
        summary: 'Bất động sản này rất phù hợp với phong thủy và nhu cầu của bạn',
        detailedAnalysis: 'Phân tích chi tiết...',
        pros: ['Vị trí đẹp', 'Phong thủy tốt', 'Giá cả hợp lý'],
        cons: ['Cần sửa chữa nhỏ'],
        actionPlan: {
          immediate_actions: ['Xem nhà thực tế', 'Đàm phán giá'],
          short_term_goals: ['Hoàn thiện thủ tục', 'Sắp xếp tài chính'],
          long_term_strategy: ['Tân trang theo phong thủy', 'Đầu tư nâng cấp']
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  async generateRecommendation(
    propertyId: string,
    userId: string,
    type: 'purchase' | 'rental' | 'investment'
  ): Promise<FengShuiRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const scores = [
      Math.floor(Math.random() * 20) + 80, // High score
      Math.floor(Math.random() * 30) + 60, // Medium score
      Math.floor(Math.random() * 40) + 50  // Lower score
    ];

    const score = scores[Math.floor(Math.random() * scores.length)];
    
    let recommendation: FengShuiRecommendation['recommendation'];
    if (score >= 90) recommendation = 'highly_recommended';
    else if (score >= 75) recommendation = 'recommended';
    else if (score >= 60) recommendation = 'neutral';
    else if (score >= 40) recommendation = 'not_recommended';
    else recommendation = 'avoid';

    return {
      id: `rec-${Date.now()}`,
      propertyId,
      userId,
      type,
      recommendation,
      score,
      reasons: {
        fengshui_factors: ['Hướng nhà tốt', 'Luồng khí thuận'],
        location_factors: ['Vị trí thuận lợi', 'Tiện ích đầy đủ'],
        market_factors: ['Giá cả hợp lý', 'Tăng trưởng tốt']
      },
      summary: `Đánh giá tổng thể: ${score}/100`,
      detailedAnalysis: 'Phân tích chi tiết dựa trên phong thủy và thị trường...',
      pros: ['Điểm mạnh 1', 'Điểm mạnh 2'],
      cons: ['Điểm cần cải thiện 1'],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }

  // Helper methods
  private getPersonalityTraits(element: FengShuiElement): string[] {
    const traits = {
      kim: ['Kiên định', 'Trách nhiệm', 'Thực tế', 'Có tổ chức'],
      moc: ['Sáng tạo', 'Linh hoạt', 'Năng động', 'Lạc quan'],
      thuy: ['Thông minh', 'Trực giác', 'Bí ẩn', 'Thích nghi'],
      hoa: ['Nhiệt tình', 'Năng lượng', 'Lãnh đạo', 'Tự tin'],
      tho: ['Ổn định', 'Đáng tin cậy', 'Kiên nhẫn', 'Thực tế']
    };
    return traits[element] || traits.kim;
  }

  private getCareerSuggestions(element: FengShuiElement): string[] {
    const careers = {
      kim: ['Tài chính', 'Ngân hàng', 'Bất động sản', 'Cơ khí'],
      moc: ['Giáo dục', 'Y tế', 'Nông nghiệp', 'Thiết kế'],
      thuy: ['Truyền thông', 'Du lịch', 'Vận tải', 'Nghệ thuật'],
      hoa: ['Quảng cáo', 'Giải trí', 'Nhà hàng', 'Thể thao'],
      tho: ['Xây dựng', 'Nông nghiệp', 'Bảo hiểm', 'Dịch vụ']
    };
    return careers[element] || careers.kim;
  }

  private getHealthNotes(element: FengShuiElement): string[] {
    const notes = {
      kim: ['Chú ý hệ hô hấp', 'Tránh stress', 'Vận động đều đặn'],
      moc: ['Bảo vệ gan mật', 'Ăn uống cân bằng', 'Tập yoga'],
      thuy: ['Chăm sóc thận', 'Uống đủ nước', 'Nghỉ ngơi đủ'],
      hoa: ['Bảo vệ tim mạch', 'Kiểm soát cảm xúc', 'Tránh nóng giận'],
      tho: ['Chăm sóc dạ dày', 'Ăn đúng giờ', 'Tránh lo lắng']
    };
    return notes[element] || notes.kim;
  }
}

export const fengShuiService = new FengShuiService();