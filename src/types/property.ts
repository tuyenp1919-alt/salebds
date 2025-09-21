// Property related types
export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  pricePerSqm?: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  yearBuilt?: number;
  
  // Location
  address: string;
  district: string;
  city: string;
  ward?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Features
  features: PropertyFeature[];
  amenities: string[];
  direction?: Direction;
  legalStatus: LegalStatus;
  
  // Media
  images: PropertyImage[];
  videos?: PropertyVideo[];
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  
  // Ownership & Contact
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  agentId?: string;
  agentName?: string;
  
  // SEO & Marketing
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  priority: PropertyPriority;
  featured: boolean;
  
  // Analytics
  views: number;
  favorites: number;
  inquiries: number;
  lastContactedAt?: Date;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
}

export interface PropertyImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface PropertyVideo {
  id: string;
  url: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
}

export interface PropertyFeature {
  id: string;
  name: string;
  value?: string;
  category: FeatureCategory;
}

export interface PropertyFilter {
  type?: PropertyType[];
  status?: PropertyStatus[];
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  district?: string[];
  city?: string[];
  features?: string[];
  direction?: Direction[];
  legalStatus?: LegalStatus[];
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  keywords?: string;
}

export interface PropertySearchParams {
  query?: string;
  filter?: PropertyFilter;
  sortBy?: PropertySortBy;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertyStats {
  total: number;
  byType: Record<PropertyType, number>;
  byStatus: Record<PropertyStatus, number>;
  byPriceRange: Record<string, number>;
  avgPrice: number;
  avgPricePerSqm: number;
  totalValue: number;
  recentlyAdded: number;
  expiringSoon: number;
}

export interface PropertyComparison {
  properties: Property[];
  criteria: ComparisonCriteria[];
  scores?: Record<string, number>;
}

export interface ComparisonCriteria {
  key: string;
  label: string;
  weight: number;
  type: 'number' | 'boolean' | 'enum' | 'text';
}

export interface PropertyMatch {
  property: Property;
  score: number;
  reasons: MatchReason[];
}

export interface MatchReason {
  criteria: string;
  score: number;
  explanation: string;
}

// Enums
export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'villa' 
  | 'townhouse' 
  | 'office' 
  | 'shop' 
  | 'warehouse' 
  | 'land' 
  | 'resort' 
  | 'hotel';

export type PropertyStatus = 
  | 'available' 
  | 'sold' 
  | 'rented' 
  | 'reserved' 
  | 'pending' 
  | 'expired' 
  | 'draft';

export type PropertyPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Direction = 
  | 'north' 
  | 'south' 
  | 'east' 
  | 'west' 
  | 'northeast' 
  | 'northwest' 
  | 'southeast' 
  | 'southwest';

export type LegalStatus = 
  | 'red_book' 
  | 'pink_book' 
  | 'sale_contract' 
  | 'authorization' 
  | 'waiting_book' 
  | 'other';

export type FeatureCategory = 
  | 'interior' 
  | 'exterior' 
  | 'security' 
  | 'convenience' 
  | 'environment';

export type PropertySortBy = 
  | 'price' 
  | 'area' 
  | 'created' 
  | 'updated' 
  | 'views' 
  | 'priority' 
  | 'distance';

// Project related types
export interface Project {
  id: string;
  name: string;
  description: string;
  developer: string;
  status: ProjectStatus;
  type: ProjectType;
  
  // Location
  address: string;
  district: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Details
  totalArea: number;
  totalUnits: number;
  availableUnits: number;
  priceRange: {
    min: number;
    max: number;
  };
  
  // Timeline
  launchDate?: Date;
  constructionStart?: Date;
  expectedCompletion?: Date;
  handoverDate?: Date;
  
  // Features
  amenities: string[];
  utilities: string[];
  images: PropertyImage[];
  masterPlan?: string;
  
  // Sales info
  salesHotline?: string;
  salesCenter?: string;
  salesAgent?: string;
  
  // Properties
  properties: string[]; // Property IDs
  
  // SEO
  slug: string;
  featured: boolean;
  
  // Analytics
  views: number;
  inquiries: number;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 
  | 'planning' 
  | 'approved' 
  | 'construction' 
  | 'completed' 
  | 'delivered' 
  | 'cancelled';

export type ProjectType = 
  | 'residential' 
  | 'commercial' 
  | 'mixed' 
  | 'industrial' 
  | 'resort' 
  | 'infrastructure';

export interface ProjectFilter {
  status?: ProjectStatus[];
  type?: ProjectType[];
  priceMin?: number;
  priceMax?: number;
  district?: string[];
  city?: string[];
  developer?: string[];
  completionYear?: number[];
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  inquiryType: InquiryType;
  status: InquiryStatus;
  priority: 'low' | 'medium' | 'high';
  agentId?: string;
  agentName?: string;
  responseMessage?: string;
  scheduledViewingAt?: Date;
  createdAt: Date;
  respondedAt?: Date;
  closedAt?: Date;
}

export type InquiryType = 
  | 'general' 
  | 'price' 
  | 'viewing' 
  | 'negotiation' 
  | 'purchase' 
  | 'rental';

export type InquiryStatus = 
  | 'new' 
  | 'contacted' 
  | 'scheduled' 
  | 'viewed' 
  | 'negotiating' 
  | 'converted' 
  | 'closed';

// Location & Map types
export interface LocationData {
  address: string;
  district: string;
  city: string;
  ward?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyPlaces: NearbyPlace[];
  transportation: TransportationInfo[];
  schools: SchoolInfo[];
  hospitals: HospitalInfo[];
  shopping: ShoppingInfo[];
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: PlaceType;
  distance: number;
  rating?: number;
  address?: string;
}

export type PlaceType = 
  | 'school' 
  | 'hospital' 
  | 'shopping' 
  | 'restaurant' 
  | 'park' 
  | 'transport' 
  | 'bank' 
  | 'government';

export interface TransportationInfo {
  type: 'bus' | 'metro' | 'taxi' | 'motorbike';
  name: string;
  distance: number;
  walkTime?: number;
}

export interface SchoolInfo {
  name: string;
  type: 'kindergarten' | 'primary' | 'secondary' | 'high' | 'university';
  distance: number;
  rating?: number;
}

export interface HospitalInfo {
  name: string;
  type: 'clinic' | 'hospital' | 'specialist';
  distance: number;
  rating?: number;
}

export interface ShoppingInfo {
  name: string;
  type: 'mall' | 'market' | 'supermarket' | 'convenience';
  distance: number;
  rating?: number;
}