// API Service Types
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  apiKey?: string;
}

// Authentication API
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: import('./index').User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: import('./index').UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Customer API
export interface CreateCustomerRequest {
  fullName: string;
  phone: string;
  email?: string;
  source: import('./index').CustomerSource;
  budget: {
    min: number;
    max: number;
    currency: 'VND' | 'USD';
  };
  preferences: {
    propertyType: import('./index').PropertyType[];
    location: string[];
    area?: { min: number; max: number };
    bedrooms?: number;
    purpose: 'buy' | 'rent' | 'invest';
  };
  birthYear?: number;
  notes?: string;
  tags?: string[];
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  status?: import('./index').CustomerStatus;
}

export interface CustomerListRequest {
  page?: number;
  limit?: number;
  status?: import('./index').CustomerStatus;
  source?: import('./index').CustomerSource;
  assignedTo?: string;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
}

// Property API
export interface CreatePropertyRequest {
  title: string;
  description: string;
  projectId: string;
  propertyType: import('./index').PropertyType;
  price: {
    amount: number;
    currency: 'VND' | 'USD';
    unit: 'total' | 'per_m2';
  };
  area: {
    land?: number;
    floor?: number;
    usable?: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  direction?: import('./index').Direction;
  location: {
    address: string;
    ward: string;
    district: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  legalStatus: import('./index').LegalStatus;
  amenities: string[];
  tags: string[];
  images?: File[];
}

export interface PropertySearchRequest {
  page?: number;
  limit?: number;
  propertyType?: import('./index').PropertyType;
  status?: import('./index').PropertyStatus;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  direction?: import('./index').Direction;
  location?: {
    city?: string;
    district?: string;
    ward?: string;
  };
  legalStatus?: import('./index').LegalStatus;
  amenities?: string[];
  search?: string;
  featured?: boolean;
  sortBy?: 'price' | 'area' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Project API  
export interface CreateProjectRequest {
  name: string;
  description: string;
  developer: string;
  location: {
    address: string;
    ward: string;
    district: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  totalArea: number;
  totalUnits: number;
  completionDate?: Date;
  handoverDate?: Date;
  priceRange: {
    min: number;
    max: number;
    currency: 'VND' | 'USD';
  };
  highlights: string[];
  paymentPlans: import('./index').PaymentPlan[];
  promotions?: import('./index').Promotion[];
  tags: string[];
  images?: File[];
}

// Interaction API
export interface CreateInteractionRequest {
  customerId: string;
  type: import('./index').InteractionType;
  title: string;
  description?: string;
  date: Date;
  outcome?: string;
  nextAction?: {
    action: string;
    dueDate: Date;
    reminder: boolean;
  };
  propertyIds?: string[];
  attachments?: File[];
}

export interface InteractionListRequest {
  customerId?: string;
  userId?: string;
  type?: import('./index').InteractionType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// AI Service API
export interface AIMatchingRequest {
  customerId: string;
  includeAnalysis?: boolean;
}

export interface AIContentGenerationRequest {
  type: 'post' | 'email' | 'brochure';
  propertyId?: string;
  projectId?: string;
  platform?: import('./index').MarketingPlatform;
  tone?: 'professional' | 'casual' | 'persuasive' | 'friendly';
  length?: 'short' | 'medium' | 'long';
  includeImages?: boolean;
}

export interface FengShuiAnalysisRequest {
  birthYear: number;
  propertyDirection: import('./index').Direction;
}

// Analytics API
export interface KPIRequest {
  userId?: string;
  teamId?: string;
  period: {
    start: string;
    end: string;
  };
  granularity?: 'day' | 'week' | 'month';
}

export interface ReportGenerationRequest {
  type: import('./index').ReportType;
  period: {
    start: string;
    end: string;
    granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
  filters?: import('./index').ReportFilter[];
  format?: 'json' | 'pdf' | 'excel';
}

// Notification API
export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: import('./index').NotificationType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  data?: any;
  expiresAt?: Date;
}

export interface NotificationListRequest {
  userId: string;
  read?: boolean;
  type?: import('./index').NotificationType;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  page?: number;
  limit?: number;
}

// File Upload API
export interface FileUploadRequest {
  files: File[];
  folder?: string;
  resize?: {
    width: number;
    height: number;
    quality?: number;
  };
}

export interface FileUploadResponse {
  files: {
    originalName: string;
    filename: string;
    url: string;
    size: number;
    mimetype: string;
  }[];
}

// Location API
export interface LocationSearchRequest {
  query: string;
  type?: 'city' | 'district' | 'ward' | 'street';
  limit?: number;
}

export interface LocationResponse {
  id: string;
  name: string;
  fullName: string;
  type: 'city' | 'district' | 'ward' | 'street';
  coordinates?: {
    lat: number;
    lng: number;
  };
  parent?: {
    id: string;
    name: string;
    type: string;
  };
}

// Marketing API
export interface SocialMediaPostRequest {
  platform: import('./index').MarketingPlatform;
  content: string;
  images?: string[];
  scheduledAt?: Date;
  hashtags?: string[];
}

export interface EmailCampaignRequest {
  subject: string;
  content: string;
  recipients: string[];
  templateId?: string;
  scheduledAt?: Date;
  attachments?: string[];
}

// Training API
export interface TrainingProgressRequest {
  userId: string;
  materialId: string;
  completed: boolean;
  score?: number;
  timeSpent?: number;
}

export interface QuizSubmissionRequest {
  quizId: string;
  answers: {
    questionId: string;
    answer: string | number;
  }[];
  timeSpent: number;
}

export interface QuizResultResponse {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  results: {
    questionId: string;
    correct: boolean;
    userAnswer: string | number;
    correctAnswer: string | number;
    explanation?: string;
  }[];
}

// WebSocket Events
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface NotificationEvent extends WebSocketEvent {
  type: 'notification';
  data: import('./index').Notification;
}

export interface CustomerUpdateEvent extends WebSocketEvent {
  type: 'customer_update';
  data: {
    customerId: string;
    status: import('./index').CustomerStatus;
    updatedBy: string;
  };
}

export interface InteractionEvent extends WebSocketEvent {
  type: 'interaction_created';
  data: import('./index').Interaction;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  errors?: ValidationError[];
  timestamp: Date;
}

// Service Response Types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResponse<T> extends PaginatedResponse<T> {
  query: string;
  filters: Record<string, any>;
  facets?: Record<string, { value: string; count: number }[]>;
}

// Cache Types
export interface CacheConfig {
  ttl: number; // seconds
  key: string;
  tags?: string[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  expiresAt: Date;
  tags?: string[];
}

// Export all API types
export type {
  // Re-export main types for convenience
  User,
  Customer,
  Property,
  Project,
  Interaction,
  Notification,
  KPIMetrics,
  MarketingContent,
} from './index';