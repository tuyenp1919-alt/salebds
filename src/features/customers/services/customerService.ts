import { Customer } from '@/types';

// Mock data cho development
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0901234567',
    company: 'Công ty ABC',
    position: 'Giám đốc',
    address: 'Quận 1, TP. Hồ Chí Minh',
    status: 'lead',
    priority: 'high',
    source: 'Facebook',
    notes: 'Quan tâm đến dự án căn hộ cao cấp',
    totalValue: 5000000000,
    tags: ['VIP', 'Căn hộ'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lastContactedAt: new Date('2024-01-18'),
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'tranthibinh@yahoo.com',
    phone: '0912345678',
    company: 'Công ty XYZ',
    position: 'Trưởng phòng',
    address: 'Quận 7, TP. Hồ Chí Minh',
    status: 'prospect',
    priority: 'medium',
    source: 'Google Ads',
    notes: 'Đang tìm hiểu về nhà phố liền kề',
    totalValue: 3000000000,
    tags: ['Nhà phố', 'Gia đình'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-19'),
    lastContactedAt: new Date('2024-01-17'),
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    email: 'leminhcuong@outlook.com',
    phone: '0923456789',
    company: null,
    position: null,
    address: 'Quận Tân Bình, TP. Hồ Chí Minh',
    status: 'customer',
    priority: 'high',
    source: 'Giới thiệu',
    notes: 'Đã mua căn hộ 3PN, quan tâm đầu tư thêm',
    totalValue: 8000000000,
    tags: ['Đầu tư', 'Căn hộ', 'VIP'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-21'),
    lastContactedAt: new Date('2024-01-19'),
  },
  {
    id: '4',
    name: 'Phạm Thị Dung',
    email: 'phamthidung@gmail.com',
    phone: '0934567890',
    company: 'Startup DEF',
    position: 'Co-founder',
    address: 'Quận 2, TP. Hồ Chí Minh',
    status: 'lead',
    priority: 'low',
    source: 'Zalo',
    notes: 'Quan tâm đến văn phòng nhỏ',
    totalValue: 1500000000,
    tags: ['Văn phòng', 'Startup'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
    lastContactedAt: null,
  },
  {
    id: '5',
    name: 'Hoàng Văn Em',
    email: 'hoangvanem@hotmail.com',
    phone: '0945678901',
    company: 'Ngân hàng GHI',
    position: 'Chuyên viên',
    address: 'Quận 9, TP. Hồ Chí Minh',
    status: 'inactive',
    priority: 'low',
    source: 'Website',
    notes: 'Đã liên hệ nhưng không phản hồi',
    totalValue: 0,
    tags: ['Không phản hồi'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14'),
    lastContactedAt: new Date('2024-01-12'),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service functions
export const customerService = {
  // Lấy danh sách khách hàng
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  }> {
    await delay(500); // Simulate network delay

    let filteredCustomers = [...MOCK_CUSTOMERS];

    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        customer.company?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (params?.status && params.status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.status === params.status
      );
    }

    // Apply priority filter
    if (params?.priority && params.priority !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.priority === params.priority
      );
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredCustomers.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (params.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'created':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'lastContact':
            aValue = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0;
            bValue = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0;
            break;
          case 'value':
            aValue = a.totalValue || 0;
            bValue = b.totalValue || 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    return {
      customers: paginatedCustomers,
      total: filteredCustomers.length,
      page,
      limit,
    };
  },

  // Lấy thông tin một khách hàng
  async getCustomer(id: string): Promise<Customer | null> {
    await delay(300);
    return MOCK_CUSTOMERS.find(customer => customer.id === id) || null;
  },

  // Tạo khách hàng mới
  async createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    await delay(800);

    const newCustomer: Customer = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_CUSTOMERS.unshift(newCustomer);
    return newCustomer;
  },

  // Cập nhật khách hàng
  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    await delay(800);

    const index = MOCK_CUSTOMERS.findIndex(customer => customer.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy khách hàng');
    }

    const updatedCustomer = {
      ...MOCK_CUSTOMERS[index],
      ...data,
      updatedAt: new Date(),
    };

    MOCK_CUSTOMERS[index] = updatedCustomer;
    return updatedCustomer;
  },

  // Xóa khách hàng
  async deleteCustomer(id: string): Promise<void> {
    await delay(500);

    const index = MOCK_CUSTOMERS.findIndex(customer => customer.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy khách hàng');
    }

    MOCK_CUSTOMERS.splice(index, 1);
  },

  // Cập nhật lần liên hệ cuối
  async updateLastContact(id: string, date: Date = new Date()): Promise<Customer> {
    await delay(300);

    const index = MOCK_CUSTOMERS.findIndex(customer => customer.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy khách hàng');
    }

    const updatedCustomer = {
      ...MOCK_CUSTOMERS[index],
      lastContactedAt: date,
      updatedAt: new Date(),
    };

    MOCK_CUSTOMERS[index] = updatedCustomer;
    return updatedCustomer;
  },

  // Tìm kiếm khách hàng theo nhiều tiêu chí
  async searchCustomers(query: {
    name?: string;
    email?: string;
    phone?: string;
    tags?: string[];
    status?: string[];
    priority?: string[];
    createdFrom?: Date;
    createdTo?: Date;
    valueFrom?: number;
    valueTo?: number;
  }): Promise<Customer[]> {
    await delay(600);

    let results = [...MOCK_CUSTOMERS];

    // Filter by name
    if (query.name) {
      results = results.filter(customer =>
        customer.name.toLowerCase().includes(query.name!.toLowerCase())
      );
    }

    // Filter by email
    if (query.email) {
      results = results.filter(customer =>
        customer.email.toLowerCase().includes(query.email!.toLowerCase())
      );
    }

    // Filter by phone
    if (query.phone) {
      results = results.filter(customer =>
        customer.phone.includes(query.phone!)
      );
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter(customer =>
        query.tags!.some(tag => customer.tags?.includes(tag))
      );
    }

    // Filter by status
    if (query.status && query.status.length > 0) {
      results = results.filter(customer =>
        query.status!.includes(customer.status)
      );
    }

    // Filter by priority
    if (query.priority && query.priority.length > 0) {
      results = results.filter(customer =>
        query.priority!.includes(customer.priority)
      );
    }

    // Filter by created date range
    if (query.createdFrom) {
      results = results.filter(customer =>
        new Date(customer.createdAt) >= query.createdFrom!
      );
    }

    if (query.createdTo) {
      results = results.filter(customer =>
        new Date(customer.createdAt) <= query.createdTo!
      );
    }

    // Filter by value range
    if (query.valueFrom !== undefined) {
      results = results.filter(customer =>
        (customer.totalValue || 0) >= query.valueFrom!
      );
    }

    if (query.valueTo !== undefined) {
      results = results.filter(customer =>
        (customer.totalValue || 0) <= query.valueTo!
      );
    }

    return results;
  },

  // Thống kê khách hàng
  async getCustomerStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    bySource: Record<string, number>;
    totalValue: number;
    averageValue: number;
    recentCount: number; // Số khách hàng mới trong 30 ngày
  }> {
    await delay(400);

    const stats = {
      total: MOCK_CUSTOMERS.length,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      totalValue: 0,
      averageValue: 0,
      recentCount: 0,
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    MOCK_CUSTOMERS.forEach(customer => {
      // Count by status
      stats.byStatus[customer.status] = (stats.byStatus[customer.status] || 0) + 1;

      // Count by priority
      stats.byPriority[customer.priority] = (stats.byPriority[customer.priority] || 0) + 1;

      // Count by source
      if (customer.source) {
        stats.bySource[customer.source] = (stats.bySource[customer.source] || 0) + 1;
      }

      // Sum total value
      stats.totalValue += customer.totalValue || 0;

      // Count recent customers
      if (new Date(customer.createdAt) >= thirtyDaysAgo) {
        stats.recentCount++;
      }
    });

    // Calculate average value
    stats.averageValue = stats.total > 0 ? stats.totalValue / stats.total : 0;

    return stats;
  },
};

export default customerService;