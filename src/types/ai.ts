// AI Assistant & Chatbot types

export interface AIAssistant {
  id: string;
  name: string;
  avatar: string;
  role: AIRole;
  expertise: string[];
  personality: AIPersonality;
  isActive: boolean;
  stats: {
    totalConversations: number;
    satisfactionRating: number;
    responsesGenerated: number;
    avgResponseTime: number; // seconds
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIConversation {
  id: string;
  assistantId: string;
  userId: string;
  customerId?: string;
  propertyId?: string;
  title: string;
  messages: AIMessage[];
  context: ConversationContext;
  status: ConversationStatus;
  tags: string[];
  metadata: {
    customerSentiment?: 'positive' | 'neutral' | 'negative';
    intent?: ConversationIntent;
    leadScore?: number;
    followUpRequired?: boolean;
    priority?: 'low' | 'medium' | 'high';
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  type: MessageType;
  metadata?: MessageMetadata;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  timestamp: Date;
  isEdited?: boolean;
  editedAt?: Date;
}

export interface MessageMetadata {
  confidence?: number; // AI confidence score 0-1
  alternatives?: string[]; // Alternative responses
  processingTime?: number; // milliseconds
  tokens?: {
    input: number;
    output: number;
  };
  model?: string;
  temperature?: number;
  sources?: string[]; // Knowledge sources used
  actions?: MessageAction[]; // Suggested actions
}

export interface MessageAction {
  id: string;
  type: ActionType;
  label: string;
  description?: string;
  parameters?: Record<string, any>;
  confidence?: number;
  executed?: boolean;
  executedAt?: Date;
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface ConversationContext {
  currentProperty?: string; // Property ID being discussed
  customerInfo?: {
    budget?: number;
    preferences?: CustomerPreferences;
    requirements?: PropertyRequirements;
  };
  previousInteractions?: string[]; // Previous conversation IDs
  referenceDocuments?: string[]; // Document IDs
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  sessionData?: Record<string, any>;
}

export interface CustomerPreferences {
  propertyTypes?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  areas?: string[];
  amenities?: string[];
  directions?: string[];
  legalStatus?: string[];
  moveInDate?: Date;
  urgency?: 'low' | 'medium' | 'high';
}

export interface PropertyRequirements {
  bedrooms?: {
    min?: number;
    max?: number;
  };
  bathrooms?: {
    min?: number;
    max?: number;
  };
  area?: {
    min?: number;
    max?: number;
  };
  floors?: number;
  parking?: boolean;
  garden?: boolean;
  balcony?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
}

export interface AIRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  confidence: number;
  data: any; // Property, customer, or action data
  reasoning: string[];
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  validUntil?: Date;
  executed?: boolean;
  feedback?: RecommendationFeedback;
  createdAt: Date;
}

export interface RecommendationFeedback {
  rating: number; // 1-5
  comment?: string;
  helpful: boolean;
  userId: string;
  submittedAt: Date;
}

export interface AIKnowledgeBase {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  metadata: {
    source?: string;
    author?: string;
    version?: string;
    lastReviewed?: Date;
  };
  tags: string[];
  isActive: boolean;
  priority: number;
  searchKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AITemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  content: string;
  variables: TemplateVariable[];
  usageCount: number;
  rating: number;
  isActive: boolean;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface AIAnalytics {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalConversations: number;
    totalMessages: number;
    averageResponseTime: number;
    customerSatisfaction: number;
    conversionRate: number;
    topIntents: IntentMetric[];
    busyHours: HourMetric[];
    commonQuestions: QuestionMetric[];
    errorRate: number;
  };
  insights: AIInsight[];
  recommendations: string[];
  generatedAt: Date;
}

export interface IntentMetric {
  intent: ConversationIntent;
  count: number;
  percentage: number;
  avgConfidence: number;
}

export interface HourMetric {
  hour: number; // 0-23
  count: number;
  avgResponseTime: number;
}

export interface QuestionMetric {
  question: string;
  count: number;
  category: string;
  avgSentiment: number;
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestions: string[];
  dataPoints: any[];
  confidence: number;
}

// Enums and Types
export type AIRole = 
  | 'sales_assistant' 
  | 'property_advisor' 
  | 'customer_support' 
  | 'market_analyst' 
  | 'content_creator'
  | 'legal_advisor';

export type AIPersonality = 
  | 'professional' 
  | 'friendly' 
  | 'enthusiastic' 
  | 'analytical' 
  | 'supportive'
  | 'expert';

export type MessageSender = 'user' | 'assistant' | 'system';

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'file' 
  | 'voice' 
  | 'video' 
  | 'location' 
  | 'property_card'
  | 'quick_reply'
  | 'typing_indicator';

export type ConversationStatus = 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'escalated' 
  | 'archived';

export type ConversationIntent = 
  | 'property_search' 
  | 'price_inquiry' 
  | 'viewing_request' 
  | 'general_info' 
  | 'complaint'
  | 'market_analysis'
  | 'legal_advice'
  | 'investment_advice'
  | 'mortgage_info'
  | 'area_recommendation';

export type ActionType = 
  | 'schedule_viewing' 
  | 'send_brochure' 
  | 'create_lead' 
  | 'transfer_agent'
  | 'send_property_list'
  | 'calculate_mortgage'
  | 'book_consultation'
  | 'send_market_report';

export type AttachmentType = 
  | 'image' 
  | 'document' 
  | 'video' 
  | 'audio' 
  | 'location' 
  | 'contact'
  | 'property'
  | 'contract';

export type RecommendationType = 
  | 'property_match' 
  | 'price_adjustment' 
  | 'content_creation' 
  | 'follow_up'
  | 'cross_sell'
  | 'upsell'
  | 'market_opportunity'
  | 'customer_retention';

export type KnowledgeCategory = 
  | 'property_info' 
  | 'market_data' 
  | 'legal_docs' 
  | 'procedures'
  | 'faq'
  | 'company_policy'
  | 'product_features'
  | 'competitor_analysis';

export type TemplateCategory = 
  | 'welcome_message' 
  | 'property_description' 
  | 'price_negotiation' 
  | 'follow_up'
  | 'objection_handling'
  | 'closing_script'
  | 'market_update'
  | 'social_media_post';

export type InsightType = 
  | 'conversation_pattern' 
  | 'customer_behavior' 
  | 'performance_trend' 
  | 'opportunity'
  | 'risk_alert'
  | 'efficiency_improvement'
  | 'content_gap'
  | 'training_need';

// AI Configuration
export interface AIConfig {
  model: {
    name: string;
    version: string;
    provider: 'openai' | 'anthropic' | 'google' | 'azure' | 'local';
    parameters: {
      temperature: number;
      maxTokens: number;
      topP: number;
      frequencyPenalty: number;
      presencePenalty: number;
    };
  };
  features: {
    voiceRecognition: boolean;
    textToSpeech: boolean;
    imageAnalysis: boolean;
    documentProcessing: boolean;
    realTimeTranslation: boolean;
    sentimentAnalysis: boolean;
    entityExtraction: boolean;
  };
  limits: {
    maxConversationLength: number;
    maxDailyMessages: number;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  security: {
    dataRetentionDays: number;
    encryptMessages: boolean;
    anonymizeData: boolean;
    auditLog: boolean;
  };
}

// Training & Learning
export interface AITrainingData {
  id: string;
  type: TrainingDataType;
  source: string;
  content: any;
  labels: string[];
  quality: TrainingQuality;
  metadata: Record<string, any>;
  createdAt: Date;
  processedAt?: Date;
}

export interface AILearningSession {
  id: string;
  type: LearningType;
  data: AITrainingData[];
  config: TrainingConfig;
  status: TrainingStatus;
  metrics: TrainingMetrics;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export type TrainingDataType = 
  | 'conversation' 
  | 'document' 
  | 'faq' 
  | 'feedback' 
  | 'correction'
  | 'property_data'
  | 'market_data'
  | 'customer_data';

export type TrainingQuality = 'high' | 'medium' | 'low';

export type LearningType = 
  | 'fine_tuning' 
  | 'knowledge_update' 
  | 'behavior_adjustment' 
  | 'preference_learning';

export type TrainingStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
  earlyStoppingPatience: number;
}

export interface TrainingMetrics {
  accuracy: number;
  loss: number;
  validationAccuracy: number;
  validationLoss: number;
  trainingTime: number;
  examples: number;
}

// Integration types
export interface AIIntegration {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  config: Record<string, any>;
  status: IntegrationStatus;
  lastSync?: Date;
  errorCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IntegrationType = 
  | 'crm' 
  | 'email' 
  | 'sms' 
  | 'social_media' 
  | 'calendar'
  | 'analytics'
  | 'storage'
  | 'payment'
  | 'communication';

export type IntegrationStatus = 
  | 'active' 
  | 'inactive' 
  | 'error' 
  | 'pending'
  | 'maintenance';