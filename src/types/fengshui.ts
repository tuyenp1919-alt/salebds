// ============ FENG SHUI TYPES ============

export type FengShuiElement = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

export type Direction = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';

export interface FengShuiProfile {
  userId: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;
  gender: 'male' | 'female';
  element: FengShuiElement;
  kuaNumber: number;
  luckyDirections: Direction[];
  unluckyDirections: Direction[];
  luckyColors: string[];
  unluckyColors: string[];
  luckyNumbers: number[];
  unluckyNumbers: number[];
  personalityTraits: string[];
  careerSuggestions: string[];
  healthNotes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FengShuiPropertyAnalysis {
  propertyId: string;
  analysis: {
    // Hướng nhà
    facingDirection: Direction;
    sittingDirection: Direction;
    
    // Phân tích chi tiết
    overallScore: number; // 0-100
    energyFlow: {
      entrance: number; // 0-100
      livingRoom: number;
      bedroom: number;
      kitchen: number;
      bathroom: number;
    };
    
    // Điểm mạnh và yếu
    strengths: string[];
    weaknesses: string[];
    improvements: FengShuiImprovement[];
    
    // Phân tích theo ngũ hành
    elementAnalysis: {
      dominantElement: FengShuiElement;
      elementBalance: Record<FengShuiElement, number>; // 0-100 each
      recommendations: string[];
    };
    
    // Phân tích vị trí
    locationAnalysis: {
      landform: 'mountain' | 'water' | 'urban' | 'suburban';
      waterPresence: boolean;
      mountainSupport: boolean;
      roadPosition: 'front' | 'back' | 'left' | 'right' | 'corner';
      surroundingBuildings: {
        height: 'higher' | 'same' | 'lower';
        distance: 'close' | 'moderate' | 'far';
        impact: 'positive' | 'neutral' | 'negative';
      }[];
    };
    
    // Thời gian tốt
    goodTimes: {
      moveInDates: Date[];
      contractDates: Date[];
      renovationPeriods: {
        start: Date;
        end: Date;
        activities: string[];
      }[];
    };
  };
  
  // Tương thích với người dùng
  userCompatibility?: {
    userId: string;
    compatibilityScore: number; // 0-100
    personalizedRecommendations: string[];
    riskFactors: string[];
    benefits: string[];
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface FengShuiImprovement {
  id: string;
  category: 'color' | 'furniture' | 'decoration' | 'lighting' | 'plants' | 'mirror' | 'water' | 'structure';
  title: string;
  description: string;
  location: string; // which room/area
  priority: 'high' | 'medium' | 'low';
  cost: 'free' | 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'moderate' | 'difficult';
  expectedImpact: string;
  instructions: string[];
  materials?: string[];
  timeRequired?: string;
  tips: string[];
}

// Location Analysis Types
export interface LocationScore {
  propertyId: string;
  scores: {
    // Accessibility
    publicTransport: number; // 0-100
    mainRoads: number;
    airport: number;
    
    // Amenities
    shopping: number;
    dining: number;
    entertainment: number;
    healthcare: number;
    education: number;
    banking: number;
    
    // Environment
    airQuality: number;
    noiseLevel: number;
    greenSpace: number;
    safety: number;
    
    // Investment
    priceGrowth: number;
    rentalYield: number;
    liquidity: number;
    developmentPlan: number;
  };
  overallScore: number;
  ranking: 'excellent' | 'good' | 'average' | 'below-average' | 'poor';
  insights: LocationInsight[];
  marketTrends: MarketTrend[];
  createdAt: Date;
}

export interface LocationInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface MarketTrend {
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number; // percentage
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  forecast?: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
}

// Price Prediction Types
export interface PricePrediction {
  propertyId: string;
  currentPrice: number;
  predictions: {
    timeframe: '1month' | '3months' | '6months' | '1year' | '2years' | '5years';
    predictedPrice: number;
    confidence: number; // 0-100
    factors: PriceFactor[];
  }[];
  analysis: {
    growth_trend: 'bullish' | 'bearish' | 'stable';
    volatility: 'high' | 'medium' | 'low';
    investment_rating: 'buy' | 'hold' | 'sell';
    key_drivers: string[];
    risk_factors: string[];
  };
  comparable_properties: {
    propertyId: string;
    similarityScore: number;
    currentPrice: number;
    priceHistory: PricePoint[];
  }[];
  createdAt: Date;
}

export interface PriceFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // 0-100
  description: string;
}

export interface PricePoint {
  date: Date;
  price: number;
  source: string;
  verified: boolean;
}

// Recommendations
export interface FengShuiRecommendation {
  id: string;
  propertyId: string;
  userId?: string;
  type: 'purchase' | 'rental' | 'investment';
  recommendation: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended' | 'avoid';
  score: number; // 0-100
  
  reasons: {
    fengshui_factors: string[];
    location_factors: string[];
    market_factors: string[];
    personal_factors?: string[];
  };
  
  summary: string;
  detailedAnalysis: string;
  
  pros: string[];
  cons: string[];
  
  actionPlan?: {
    immediate_actions: string[];
    short_term_goals: string[];
    long_term_strategy: string[];
  };
  
  createdAt: Date;
  expiresAt: Date;
}

export interface FengShuiCalculation {
  // Birth year to element conversion
  yearToElement: (year: number) => FengShuiElement;
  
  // Kua number calculation
  calculateKuaNumber: (birthYear: number, gender: 'male' | 'female') => number;
  
  // Lucky/unlucky directions
  getDirections: (kuaNumber: number) => {
    lucky: Direction[];
    unlucky: Direction[];
  };
  
  // Element interactions
  elementRelations: {
    enhancing: Record<FengShuiElement, FengShuiElement>; // produces
    weakening: Record<FengShuiElement, FengShuiElement>; // consumes  
    conflicting: Record<FengShuiElement, FengShuiElement>; // destroys
  };
  
  // Color mappings
  elementColors: Record<FengShuiElement, string[]>;
  
  // Number mappings
  elementNumbers: Record<FengShuiElement, number[]>;
}

export type FengShuiService = {
  // Profile management
  createProfile: (data: Omit<FengShuiProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FengShuiProfile>;
  getProfile: (userId: string) => Promise<FengShuiProfile | null>;
  updateProfile: (userId: string, data: Partial<FengShuiProfile>) => Promise<FengShuiProfile>;
  
  // Property analysis
  analyzeProperty: (propertyId: string, options?: { includeUserCompatibility?: boolean }) => Promise<FengShuiPropertyAnalysis>;
  getPropertyAnalysis: (propertyId: string) => Promise<FengShuiPropertyAnalysis | null>;
  
  // Location scoring
  scoreLocation: (propertyId: string) => Promise<LocationScore>;
  getLocationScore: (propertyId: string) => Promise<LocationScore | null>;
  
  // Price prediction
  predictPrice: (propertyId: string) => Promise<PricePrediction>;
  getPricePrediction: (propertyId: string) => Promise<PricePrediction | null>;
  
  // Recommendations
  getRecommendations: (userId: string, filters?: any) => Promise<FengShuiRecommendation[]>;
  generateRecommendation: (propertyId: string, userId: string, type: 'purchase' | 'rental' | 'investment') => Promise<FengShuiRecommendation>;
};