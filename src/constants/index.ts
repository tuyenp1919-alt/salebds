// Property Types
export const PROPERTY_TYPES = [
  { value: 'single-family', label: 'Nhà đơn lập', icon: '🏠' },
  { value: 'condo', label: 'Chung cư', icon: '🏢' },
  { value: 'townhouse', label: 'Nhà phố', icon: '🏘️' },
  { value: 'multi-family', label: 'Nhà nhiều gia đình', icon: '🏬' },
  { value: 'commercial', label: 'Thương mại', icon: '🏪' },
  { value: 'industrial', label: 'Công nghiệp', icon: '🏭' },
  { value: 'land', label: 'Đất', icon: '🌾' },
  { value: 'villa', label: 'Biệt thự', icon: '🏰' },
];

// Property Statuses
export const PROPERTY_STATUSES = [
  { value: 'active', label: 'Đang bán', color: 'green' },
  { value: 'pending', label: 'Chờ duyệt', color: 'yellow' },
  { value: 'sold', label: 'Đã bán', color: 'blue' },
  { value: 'withdrawn', label: 'Đã rút', color: 'gray' },
  { value: 'expired', label: 'Hết hạn', color: 'red' },
  { value: 'draft', label: 'Nháp', color: 'gray' },
];

// Customer Types
export const CUSTOMER_TYPES = [
  { value: 'buyer', label: 'Người mua', icon: '🏠' },
  { value: 'seller', label: 'Người bán', icon: '💰' },
  { value: 'investor', label: 'Nhà đầu tư', icon: '📈' },
  { value: 'renter', label: 'Người thuê', icon: '🔑' },
  { value: 'landlord', label: 'Chủ nhà cho thuê', icon: '🏘️' },
];

// Customer Statuses
export const CUSTOMER_STATUSES = [
  { value: 'active', label: 'Hoạt động', color: 'green' },
  { value: 'prospect', label: 'Tiềm năng', color: 'blue' },
  { value: 'qualified', label: 'Đã đánh giá', color: 'yellow' },
  { value: 'converted', label: 'Đã chuyển đổi', color: 'purple' },
  { value: 'inactive', label: 'Không hoạt động', color: 'gray' },
  { value: 'lost', label: 'Đã mất', color: 'red' },
];

// Transaction Types
export const TRANSACTION_TYPES = [
  { value: 'sale', label: 'Bán', icon: '💰' },
  { value: 'purchase', label: 'Mua', icon: '🏠' },
  { value: 'rent', label: 'Thuê', icon: '🔑' },
  { value: 'lease', label: 'Cho thuê', icon: '📋' },
];

// Transaction Statuses
export const TRANSACTION_STATUSES = [
  { value: 'draft', label: 'Nháp', color: 'gray' },
  { value: 'pending', label: 'Chờ xử lý', color: 'yellow' },
  { value: 'in-progress', label: 'Đang tiến hành', color: 'blue' },
  { value: 'completed', label: 'Hoàn thành', color: 'green' },
  { value: 'cancelled', label: 'Đã hủy', color: 'red' },
  { value: 'on-hold', label: 'Tạm dừng', color: 'orange' },
];

// Task Types
export const TASK_TYPES = [
  { value: 'call', label: 'Gọi điện', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'meeting', label: 'Cuộc họp', icon: '🤝' },
  { value: 'viewing', label: 'Xem nhà', icon: '🏠' },
  { value: 'follow-up', label: 'Theo dõi', icon: '📋' },
  { value: 'document', label: 'Tài liệu', icon: '📄' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'other', label: 'Khác', icon: '📝' },
];

// Task Priorities
export const TASK_PRIORITIES = [
  { value: 'low', label: 'Thấp', color: 'gray' },
  { value: 'medium', label: 'Trung bình', color: 'blue' },
  { value: 'high', label: 'Cao', color: 'orange' },
  { value: 'urgent', label: 'Khẩn cấp', color: 'red' },
];

// Task Statuses
export const TASK_STATUSES = [
  { value: 'pending', label: 'Chờ xử lý', color: 'yellow' },
  { value: 'in-progress', label: 'Đang thực hiện', color: 'blue' },
  { value: 'completed', label: 'Hoàn thành', color: 'green' },
  { value: 'cancelled', label: 'Đã hủy', color: 'red' },
  { value: 'overdue', label: 'Quá hạn', color: 'red' },
];

// Communication Types
export const COMMUNICATION_TYPES = [
  { value: 'call', label: 'Cuộc gọi', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'sms', label: 'SMS', icon: '💬' },
  { value: 'meeting', label: 'Cuộc họp', icon: '🤝' },
  { value: 'note', label: 'Ghi chú', icon: '📝' },
  { value: 'document', label: 'Tài liệu', icon: '📄' },
];

// User Roles
export const USER_ROLES = [
  { value: 'admin', label: 'Quản trị viên', permissions: ['*'] },
  { value: 'manager', label: 'Quản lý', permissions: ['customers.*', 'properties.*', 'transactions.*', 'reports.*'] },
  { value: 'agent', label: 'Nhân viên kinh doanh', permissions: ['customers.*', 'properties.read', 'transactions.*'] },
  { value: 'assistant', label: 'Trợ lý', permissions: ['customers.read', 'properties.read', 'tasks.*'] },
];

// Pagination Options
export const PAGINATION_OPTIONS = [10, 25, 50, 100];

// Date Format Options
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
};

// Currency Options
export const CURRENCIES = [
  { value: 'VND', label: 'Việt Nam Đồng', symbol: '₫' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
];

// Language Options
export const LANGUAGES = [
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
];

// Notification Types
export const NOTIFICATION_TYPES = [
  { value: 'info', label: 'Thông tin', color: 'blue' },
  { value: 'success', label: 'Thành công', color: 'green' },
  { value: 'warning', label: 'Cảnh báo', color: 'yellow' },
  { value: 'error', label: 'Lỗi', color: 'red' },
];

// Application Settings
export const APP_CONFIG = {
  NAME: 'SaleBDS',
  VERSION: '1.0.0',
  DESCRIPTION: 'Hệ thống CRM cho ngành bất động sản',
  AUTHOR: 'SaleBDS Team',
  COPYRIGHT: '© 2024 SaleBDS. All rights reserved.',
  
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  API_TIMEOUT: 30000,
  
  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'salebds_auth_token',
    REFRESH_TOKEN: 'salebds_refresh_token',
    USER_PREFERENCES: 'salebds_user_preferences',
    THEME: 'salebds_theme',
    LANGUAGE: 'salebds_language',
  },
  
  // Default Values
  DEFAULTS: {
    PAGE_SIZE: 25,
    LANGUAGE: 'vi',
    CURRENCY: 'VND',
    DATE_FORMAT: 'dd/MM/yyyy',
    THEME: 'light',
  },
  
  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  
  // Map Configuration
  MAP: {
    DEFAULT_CENTER: { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh City
    DEFAULT_ZOOM: 12,
  },
};