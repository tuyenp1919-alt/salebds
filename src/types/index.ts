// ============ USER & AUTH TYPES ============
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  team?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export type UserRole = 'admin' | 'manager' | 'sales' | 'marketing';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// ============ CUSTOMER (CRM) TYPES ============
export interface Customer {
  id: string;
  // Primary identity
  fullName?: string; // preferred new field
  name?: string; // legacy field used in several components
  phone: string;
  email?: string;
  avatar?: string;
  
  // CRM fields used in UI components (legacy-compatible)
  company?: string | null;
  position?: string | null;
  address?: string | null;
  status: CustomerStatus;
  priority?: 'low' | 'medium' | 'high';
  source?: CustomerSource | string; // allow free text sources like "Giới thiệu"
  totalValue?: number; // Lifetime value or potential deal value
  lastContactedAt?: Date | null;
  
  // Assignment
  assignedTo?: string; // user ID
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  
  // Nhu cầu (optional in current mocks)
  budget?: {
    min: number;
    max: number;
    currency: 'VND' | 'USD';
  };
  preferences?: {
    propertyType: PropertyType[];
    location: string[];
    area?: { min: number; max: number };
    bedrooms?: number;
    purpose: 'buy' | 'rent' | 'invest';
  };
  
  // Thông tin cá nhân (cho phong thủy)
  birthYear?: number;
  notes?: string;
  tags?: string[];
}

export type CustomerStatus = 
  // Legacy statuses used by current UI and mock service
  | 'lead' 
  | 'prospect' 
  | 'customer' 
  | 'inactive'
  // Extended statuses for richer pipelines
  | 'new' 
  | 'contacted' 
  | 'interested' 
  | 'viewing' 
  | 'negotiating' 
  | 'closed' 
  | 'lost';

export type CustomerSource = 
  | 'website' 
  | 'facebook' 
  | 'zalo' 
  | 'referral' 
  | 'walk-in' 
  | 'phone' 
  | 'other';

// ============ PROPERTY & PROJECT TYPES ============
export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  projectId: string;
  
  // Thông tin cơ bản
  propertyType: PropertyType;
  status: PropertyStatus;
  price: {
    amount: number;
    currency: 'VND' | 'USD';
    unit: 'total' | 'per_m2';
  };
  
  // Diện tích & thông số
  area: {
    land?: number; // m2
    floor?: number; // m2
    usable?: number; // m2
  };
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  direction?: Direction;
  
  // Vị trí
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
  
  // Media
  images: PropertyImage[];
  videos?: PropertyVideo[];
  virtualTour?: string;
  
  // Pháp lý & tiện ích
  legalStatus: LegalStatus;
  amenities: string[];
  nearbyFacilities: NearbyFacility[];
  
  // SEO & Marketing
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // user ID
}

export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'villa' 
  | 'townhouse' 
  | 'shophouse' 
  | 'office' 
  | 'land' 
  | 'warehouse';

export type PropertyStatus = 
  | 'available' 
  | 'reserved' 
  | 'sold' 
  | 'rented' 
  | 'off_market';

export type LegalStatus = 
  | 'red_book' // Sổ đỏ
  | 'pink_book' // Sổ hồng
  | 'contract' // Hợp đồng
  | 'waiting' // Chờ sổ
  | 'disputed'; // Tranh chấp

export type Direction = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
  isMain: boolean;
}

export interface PropertyVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  duration?: number;
}

export interface NearbyFacility {
  id: string;
  name: string;
  type: FacilityType;
  distance: number; // meters
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type FacilityType = 
  | 'school' 
  | 'hospital' 
  | 'shopping_mall' 
  | 'market' 
  | 'park' 
  | 'public_transport' 
  | 'restaurant' 
  | 'bank' 
  | 'gas_station';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  developer: string;
  
  // Vị trí dự án
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
  
  // Thông tin dự án
  totalArea: number; // m2
  totalUnits: number;
  completionDate?: Date;
  handoverDate?: Date;
  
  // Phân khúc giá
  priceRange: {
    min: number;
    max: number;
    currency: 'VND' | 'USD';
  };
  
  // Media & tài liệu
  images: PropertyImage[];
  videos?: PropertyVideo[];
  documents: ProjectDocument[];
  masterPlan?: string;
  
  // Marketing info
  highlights: string[];
  paymentPlans: PaymentPlan[];
  promotions: Promotion[];
  
  status: ProjectStatus;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 
  | 'planning' 
  | 'construction' 
  | 'completed' 
  | 'delivered';

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'brochure' | 'floorplan' | 'contract' | 'policy';
  url: string;
  size?: number;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  schedule: PaymentSchedule[];
  downPayment: number; // percentage
}

export interface PaymentSchedule {
  phase: string;
  percentage: number;
  dueDate: string;
  description?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  conditions?: string;
}

// ============ SALES PIPELINE & DEAL MANAGEMENT TYPES ============
export type DealStage = 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
export type DealStatus = 'active' | 'won' | 'lost' | 'paused';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  status: DealStatus;
  probability: number;
  expectedCloseDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  customer?: Customer;
  property?: Property;
  notes?: string;
  activities?: DealActivity[];
  commission?: {
    rate: number;
    amount: number;
  };
}

export interface DealActivity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'stage_change' | 'update';
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

// ============ INTERACTION & ACTIVITY TYPES ============
export interface Interaction {
  id: string;
  customerId: string;
  userId: string; // sales person
  type: InteractionType;
  title: string;
  description?: string;
  date: Date;
  outcome?: string;
  nextAction?: {
    action: string;
    dueDate: Date;
    reminder: boolean;
  };
  propertyIds?: string[]; // properties discussed
  attachments?: Attachment[];
  createdAt: Date;
}

export type InteractionType = 
  | 'call' 
  | 'email' 
  | 'meeting' 
  | 'site_visit' 
  | 'message' 
  | 'contract_sent' 
  | 'contract_signed';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// ============ AI & ANALYSIS TYPES ============
export interface AIRecommendation {
  id: string;
  customerId: string;
  propertyIds: string[];
  score: number; // 0-100 matching score
  reasons: string[];
  fengShuiAnalysis?: FengShuiAnalysis;
  createdAt: Date;
}

export interface FengShuiAnalysis {
  customerElement: string; // Kim, Mộc, Thủy, Hỏa, Thổ
  suitableDirections: Direction[];
  avoidDirections: Direction[];
  luckyColors: string[];
  recommendations: string[];
  compatibilityScore: number; // 0-100
}

export interface LocationAnalysis {
  propertyId: string;
  scores: {
    accessibility: number; // 0-100
    amenities: number;
    investment_potential: number;
    education: number;
    healthcare: number;
    shopping: number;
    transportation: number;
  };
  overallScore: number;
  insights: string[];
  priceHistory?: PricePoint[];
  pricePrediction?: PricePoint[];
}

export interface PricePoint {
  date: Date;
  price: number;
  source: string;
}

// ============ MARKETING & CONTENT TYPES ============
export interface MarketingContent {
  id: string;
  propertyId?: string;
  projectId?: string;
  type: ContentType;
  title: string;
  content: string;
  media: ContentMedia[];
  platform: MarketingPlatform[];
  status: ContentStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export type ContentType = 
  | 'post' 
  | 'story' 
  | 'video' 
  | 'brochure' 
  | 'flyer' 
  | 'email_template';

export type MarketingPlatform = 
  | 'facebook' 
  | 'zalo' 
  | 'instagram' 
  | 'tiktok' 
  | 'youtube' 
  | 'email' 
  | 'website';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface ContentMedia {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  caption?: string;
  order: number;
}

// ============ ANALYTICS & KPI TYPES ============
export interface KPIMetrics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    // Lead metrics
    newLeads: number;
    qualifiedLeads: number;
    conversionRate: number;
    
    // Sales metrics
    totalDeals: number;
    totalRevenue: number;
    averageDealSize: number;
    closingRate: number;
    
    // Activity metrics
    callsMade: number;
    meetingsHeld: number;
    siteVisits: number;
    emailsSent: number;
    
    // Pipeline metrics
    pipelineValue: number;
    averageSalesCycle: number; // days
  };
}

export interface SalesReport {
  id: string;
  type: ReportType;
  period: TimePeriod;
  data: any; // flexible data structure
  generatedAt: Date;
  generatedBy: string;
  filters?: ReportFilter[];
}

export type ReportType = 
  | 'sales_performance' 
  | 'lead_analysis' 
  | 'property_performance' 
  | 'team_comparison' 
  | 'revenue_forecast';

export interface TimePeriod {
  start: Date;
  end: Date;
  granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

// ============ NOTIFICATION & REMINDER TYPES ============
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionUrl?: string;
  data?: any;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType = 
  | 'reminder' 
  | 'lead_assigned' 
  | 'deal_update' 
  | 'system' 
  | 'marketing' 
  | 'achievement';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: Date;
  type: ReminderType;
  relatedId?: string; // customer ID, property ID, etc.
  completed: boolean;
  createdAt: Date;
}

export type ReminderType = 
  | 'follow_up' 
  | 'meeting' 
  | 'call' 
  | 'contract_deadline' 
  | 'payment_due' 
  | 'custom';

// ============ API & STATE TYPES ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// ============ FORM & UI TYPES ============
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'select' | 'textarea' | 'date' | 'number' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: any; // Zod schema
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ============ TRAINING & KNOWLEDGE TYPES ============
export interface TrainingMaterial {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'simulation';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // minutes
  url?: string;
  content?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // minutes
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface UserProgress {
  userId: string;
  materialId: string;
  completed: boolean;
  score?: number;
  completedAt?: Date;
  timeSpent?: number; // minutes
}

// Export all types for easy importing
export * from './api';
export * from './property';
export * from './ai';
