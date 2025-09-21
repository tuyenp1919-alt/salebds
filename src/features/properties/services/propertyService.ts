import { Property, PropertyFilter, PropertySearchParams, PropertyStats, Project, ProjectFilter } from '@/types/property';

// Mock properties data
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Căn hộ cao cấp Vinhomes Central Park 3PN',
    description: 'Căn hộ 3 phòng ngủ, 2 phòng tắm với view sông Sài Gòn tuyệt đẹp. Nội thất cao cấp, đầy đủ tiện ích.',
    type: 'apartment',
    status: 'available',
    price: 8500000000,
    pricePerSqm: 85000000,
    area: 100,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    yearBuilt: 2020,
    address: '208 Nguyễn Hữu Cảnh, Phường 22',
    district: 'Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    ward: 'Phường 22',
    coordinates: {
      lat: 10.7880,
      lng: 106.7130
    },
    features: [
      { id: '1', name: 'Điều hòa', value: 'Daikin inverter', category: 'interior' },
      { id: '2', name: 'Nội thất', value: 'Cao cấp', category: 'interior' },
      { id: '3', name: 'Ban công', value: 'View sông', category: 'exterior' }
    ],
    amenities: ['Hồ bơi', 'Gym', 'Sân tennis', 'Thang máy cao tốc', 'An ninh 24/7'],
    direction: 'south',
    legalStatus: 'red_book',
    images: [
      { id: '1', url: '/images/property1-1.jpg', title: 'Phòng khách', isPrimary: true, order: 1 },
      { id: '2', url: '/images/property1-2.jpg', title: 'Phòng ngủ master', isPrimary: false, order: 2 },
      { id: '3', url: '/images/property1-3.jpg', title: 'Nhà bếp', isPrimary: false, order: 3 }
    ],
    ownerId: 'owner1',
    ownerName: 'Nguyễn Văn Minh',
    ownerPhone: '0901234567',
    ownerEmail: 'minh.nguyen@email.com',
    agentId: 'agent1',
    agentName: 'Trần Thị Lan',
    slug: 'can-ho-vinhomes-central-park-3pn',
    priority: 'high',
    featured: true,
    views: 1250,
    favorites: 48,
    inquiries: 23,
    lastContactedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    title: 'Nhà phố liền kề Melosa Garden Q.9 (5x20m)',
    description: 'Nhà phố 3 tầng, thiết kế hiện đại, sân vườn rộng rãi. Khu vực an ninh, nhiều tiện ích.',
    type: 'townhouse',
    status: 'available',
    price: 7200000000,
    pricePerSqm: 72000000,
    area: 100,
    bedrooms: 4,
    bathrooms: 3,
    floors: 3,
    yearBuilt: 2023,
    address: 'Đường Nguyễn Xiển, Phường Long Thạnh Mỹ',
    district: 'Quận 9',
    city: 'TP. Hồ Chí Minh',
    ward: 'Phường Long Thạnh Mỹ',
    coordinates: {
      lat: 10.8411,
      lng: 106.8071
    },
    features: [
      { id: '4', name: 'Sân vườn', value: '50m²', category: 'exterior' },
      { id: '5', name: 'Gara ô tô', value: '1 xe', category: 'exterior' },
      { id: '6', name: 'Hệ thống smart home', value: 'Đầy đủ', category: 'convenience' }
    ],
    amenities: ['Công viên trung tâm', 'Trường học quốc tế', 'Siêu thị', 'Bệnh viện'],
    direction: 'east',
    legalStatus: 'red_book',
    images: [
      { id: '4', url: '/images/property2-1.jpg', title: 'Mặt tiền', isPrimary: true, order: 1 },
      { id: '5', url: '/images/property2-2.jpg', title: 'Phòng khách', isPrimary: false, order: 2 }
    ],
    ownerId: 'owner2',
    ownerName: 'Lê Hoài Nam',
    ownerPhone: '0912345678',
    agentId: 'agent1',
    agentName: 'Trần Thị Lan',
    slug: 'nha-pho-melosa-garden-q9',
    priority: 'medium',
    featured: false,
    views: 890,
    favorites: 32,
    inquiries: 18,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-19'),
    publishedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Biệt thự đơn lập Riviera Point Q.7 (10x20m)',
    description: 'Biệt thự cao cấp 3 tầng + tum, sân vườn rộng, hồ bơi riêng. Nội thất nhập khẩu.',
    type: 'villa',
    status: 'available',
    price: 25000000000,
    pricePerSqm: 125000000,
    area: 200,
    bedrooms: 5,
    bathrooms: 4,
    floors: 4,
    yearBuilt: 2019,
    address: '74-76 Nguyễn Lương Bằng, Tân Phú',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    ward: 'Phường Tân Phú',
    features: [
      { id: '7', name: 'Hồ bơi', value: '6x12m', category: 'exterior' },
      { id: '8', name: 'Thang máy', value: '1 cái', category: 'convenience' },
      { id: '9', name: 'Sân thượng', value: 'BBQ area', category: 'exterior' }
    ],
    amenities: ['Club house', 'Sân tennis', 'Playground', 'Marina', 'Spa'],
    direction: 'southeast',
    legalStatus: 'red_book',
    images: [
      { id: '6', url: '/images/property3-1.jpg', title: 'Toàn cảnh', isPrimary: true, order: 1 }
    ],
    ownerId: 'owner3',
    ownerName: 'Phạm Minh Tuấn',
    ownerPhone: '0923456789',
    ownerEmail: 'tuan.pham@email.com',
    slug: 'biet-thu-riviera-point-q7',
    priority: 'urgent',
    featured: true,
    views: 2100,
    favorites: 95,
    inquiries: 67,
    lastContactedAt: new Date('2024-01-21'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-09')
  },
  {
    id: '4',
    title: 'Đất nền KDC Saigon Mystery Villas Q.2',
    description: 'Lô đất góc 2 mặt tiền, vị trí đẹp, thích hợp xây biệt thự hoặc đầu tư.',
    type: 'land',
    status: 'available',
    price: 12000000000,
    pricePerSqm: 80000000,
    area: 150,
    address: 'Đường Nguyễn Cơ Thạch, Phường An Lợi Đông',
    district: 'Quận 2',
    city: 'TP. Hồ Chí Minh',
    ward: 'Phường An Lợi Đông',
    features: [
      { id: '10', name: 'Mặt tiền', value: '2 mặt tiền', category: 'exterior' },
      { id: '11', name: 'Hạ tầng', value: 'Hoàn thiện', category: 'exterior' }
    ],
    amenities: ['Điện 3 pha', 'Nước máy', 'Cáp quang', 'Đường nhựa'],
    legalStatus: 'red_book',
    images: [
      { id: '7', url: '/images/property4-1.jpg', title: 'Lô đất', isPrimary: true, order: 1 }
    ],
    ownerId: 'owner4',
    ownerName: 'Vũ Thị Hằng',
    ownerPhone: '0934567890',
    slug: 'dat-nen-saigon-mystery-villas-q2',
    priority: 'medium',
    featured: false,
    views: 560,
    favorites: 28,
    inquiries: 12,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    publishedAt: new Date('2024-01-14')
  },
  {
    id: '5',
    title: 'Mặt bằng kinh doanh Nguyễn Trãi Q.1',
    description: 'Mặt bằng tầng trệt, vị trí đắc địa, thích hợp kinh doanh F&B, thời trang.',
    type: 'shop',
    status: 'available',
    price: 150000000, // rent per month
    area: 80,
    address: '125 Nguyễn Trãi, Phường Bến Thành',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    ward: 'Phường Bến Thành',
    features: [
      { id: '12', name: 'Mặt tiền', value: '4m', category: 'exterior' },
      { id: '13', name: 'Tầng lửng', value: 'Có', category: 'interior' }
    ],
    amenities: ['Điện 3 pha', 'Nước máy', 'Internet', 'Bảo vệ 24/7'],
    legalStatus: 'pink_book',
    images: [
      { id: '8', url: '/images/property5-1.jpg', title: 'Mặt tiền', isPrimary: true, order: 1 }
    ],
    ownerId: 'owner5',
    ownerName: 'Đặng Văn Hùng',
    ownerPhone: '0945678901',
    slug: 'mat-bang-nguyen-trai-q1',
    priority: 'high',
    featured: true,
    views: 1800,
    favorites: 75,
    inquiries: 45,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-07')
  }
];

// Mock projects data
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Vinhomes Central Park',
    description: 'Khu đô thị phức hợp cao cấp tại trung tâm TP.HCM với nhiều tiện ích đẳng cấp',
    developer: 'Tập đoàn Vingroup',
    status: 'completed',
    type: 'mixed',
    address: 'Nguyễn Hữu Cảnh, Bình Thạnh',
    district: 'Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7880, lng: 106.7130 },
    totalArea: 26000000, // 26ha
    totalUnits: 12500,
    availableUnits: 850,
    priceRange: { min: 5000000000, max: 20000000000 },
    launchDate: new Date('2015-01-15'),
    expectedCompletion: new Date('2025-12-31'),
    amenities: ['Công viên Trung tâm 14ha', 'Trung tâm thương mại', 'Trường học quốc tế'],
    utilities: ['Hệ thống điện backup', 'Nước tinh khiết', 'Internet tốc độ cao'],
    images: [
      { id: '1', url: '/images/project1-1.jpg', title: 'Toàn cảnh dự án', isPrimary: true, order: 1 }
    ],
    properties: ['1'],
    slug: 'vinhomes-central-park',
    featured: true,
    views: 15000,
    inquiries: 450,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Melosa Garden',
    description: 'Khu đô thị sinh thái tại Quận 9 với thiết kế xanh và tiện ích đầy đủ',
    developer: 'Khang Điền',
    status: 'construction',
    type: 'residential',
    address: 'Nguyễn Xiển, Quận 9',
    district: 'Quận 9',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8411, lng: 106.8071 },
    totalArea: 5200000, // 5.2ha
    totalUnits: 2000,
    availableUnits: 1200,
    priceRange: { min: 4000000000, max: 12000000000 },
    launchDate: new Date('2022-06-01'),
    expectedCompletion: new Date('2025-06-30'),
    amenities: ['Công viên cây xanh', 'Hồ bơi', 'Sân chơi trẻ em'],
    utilities: ['Điện lưới quốc gia', 'Nước sạch', 'Hệ thống thoát nước'],
    images: [
      { id: '2', url: '/images/project2-1.jpg', title: 'Phối cảnh dự án', isPrimary: true, order: 1 }
    ],
    properties: ['2'],
    slug: 'melosa-garden',
    featured: true,
    views: 8500,
    inquiries: 280,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18')
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  // Properties
  async getProperties(params?: PropertySearchParams): Promise<{
    properties: Property[];
    total: number;
    page: number;
    limit: number;
  }> {
    await delay(600);

    let filteredProperties = [...MOCK_PROPERTIES];

    // Apply search query
    if (params?.query) {
      const query = params.query.toLowerCase();
      filteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.district.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (params?.filter) {
      const filter = params.filter;

      if (filter.type?.length) {
        filteredProperties = filteredProperties.filter(p => filter.type!.includes(p.type));
      }

      if (filter.status?.length) {
        filteredProperties = filteredProperties.filter(p => filter.status!.includes(p.status));
      }

      if (filter.priceMin !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.price >= filter.priceMin!);
      }

      if (filter.priceMax !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.price <= filter.priceMax!);
      }

      if (filter.areaMin !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.area >= filter.areaMin!);
      }

      if (filter.areaMax !== undefined) {
        filteredProperties = filteredProperties.filter(p => p.area <= filter.areaMax!);
      }

      if (filter.bedrooms?.length) {
        filteredProperties = filteredProperties.filter(p => 
          p.bedrooms && filter.bedrooms!.includes(p.bedrooms)
        );
      }

      if (filter.district?.length) {
        filteredProperties = filteredProperties.filter(p => filter.district!.includes(p.district));
      }

      if (filter.direction?.length) {
        filteredProperties = filteredProperties.filter(p => 
          p.direction && filter.direction!.includes(p.direction)
        );
      }
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredProperties.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (params.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'area':
            aValue = a.area;
            bValue = b.area;
            break;
          case 'created':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'views':
            aValue = a.views;
            bValue = b.views;
            break;
          case 'priority':
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          default:
            return 0;
        }

        if (params.sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    return {
      properties: paginatedProperties,
      total: filteredProperties.length,
      page,
      limit,
    };
  },

  async getProperty(id: string): Promise<Property | null> {
    await delay(300);
    return MOCK_PROPERTIES.find(p => p.id === id) || null;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    return this.getProperty(id);
  },

  async createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites' | 'inquiries'>): Promise<Property> {
    await delay(800);

    const newProperty: Property = {
      ...data,
      id: Date.now().toString(),
      views: 0,
      favorites: 0,
      inquiries: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_PROPERTIES.unshift(newProperty);
    return newProperty;
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    await delay(600);

    const index = MOCK_PROPERTIES.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }

    const updatedProperty = {
      ...MOCK_PROPERTIES[index],
      ...data,
      updatedAt: new Date(),
    };

    MOCK_PROPERTIES[index] = updatedProperty;
    return updatedProperty;
  },

  async deleteProperty(id: string): Promise<void> {
    await delay(400);

    const index = MOCK_PROPERTIES.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }

    MOCK_PROPERTIES.splice(index, 1);
  },

  // Projects
  async getProjects(filter?: ProjectFilter): Promise<Project[]> {
    await delay(500);

    let filteredProjects = [...MOCK_PROJECTS];

    if (filter) {
      if (filter.status?.length) {
        filteredProjects = filteredProjects.filter(p => filter.status!.includes(p.status));
      }

      if (filter.type?.length) {
        filteredProjects = filteredProjects.filter(p => filter.type!.includes(p.type));
      }

      if (filter.district?.length) {
        filteredProjects = filteredProjects.filter(p => filter.district!.includes(p.district));
      }
    }

    return filteredProjects;
  },

  async getProject(id: string): Promise<Project | null> {
    await delay(300);
    return MOCK_PROJECTS.find(p => p.id === id) || null;
  },

  // Statistics
  async getPropertyStats(): Promise<PropertyStats> {
    await delay(400);

    const stats: PropertyStats = {
      total: MOCK_PROPERTIES.length,
      byType: {} as any,
      byStatus: {} as any,
      byPriceRange: {},
      avgPrice: 0,
      avgPricePerSqm: 0,
      totalValue: 0,
      recentlyAdded: 0,
      expiringSoon: 0,
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    MOCK_PROPERTIES.forEach(property => {
      // Count by type
      stats.byType[property.type] = (stats.byType[property.type] || 0) + 1;

      // Count by status
      stats.byStatus[property.status] = (stats.byStatus[property.status] || 0) + 1;

      // Price ranges
      const priceRange = property.price < 5000000000 ? 'under_5b' :
                        property.price < 10000000000 ? '5b_10b' :
                        property.price < 20000000000 ? '10b_20b' : 'over_20b';
      stats.byPriceRange[priceRange] = (stats.byPriceRange[priceRange] || 0) + 1;

      // Sum values
      stats.totalValue += property.price;

      // Recent properties
      if (new Date(property.createdAt) >= thirtyDaysAgo) {
        stats.recentlyAdded++;
      }

      // Expiring soon
      if (property.expiresAt && property.expiresAt <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
        stats.expiringSoon++;
      }
    });

    stats.avgPrice = stats.total > 0 ? stats.totalValue / stats.total : 0;
    
    const totalArea = MOCK_PROPERTIES.reduce((sum, p) => sum + p.area, 0);
    stats.avgPricePerSqm = totalArea > 0 ? stats.totalValue / totalArea : 0;

    return stats;
  },

  // Search & Recommendations
  async searchProperties(query: string): Promise<Property[]> {
    await delay(400);

    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return MOCK_PROPERTIES.filter(property =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm) ||
      property.district.toLowerCase().includes(searchTerm) ||
      property.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm))
    );
  },

  async getRecommendedProperties(customerId: string, limit = 6): Promise<Property[]> {
    await delay(500);

    // Mock recommendation logic - in reality would use AI/ML
    const recommended = MOCK_PROPERTIES
      .filter(p => p.status === 'available')
      .sort((a, b) => (b.views + b.favorites) - (a.views + a.favorites))
      .slice(0, limit);

    return recommended;
  },

  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    await delay(300);

    return MOCK_PROPERTIES
      .filter(p => p.featured && p.status === 'available')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  },

  async getSimilarProperties(propertyId: string, limit = 4): Promise<Property[]> {
    await delay(400);

    const baseProperty = MOCK_PROPERTIES.find(p => p.id === propertyId);
    if (!baseProperty) return [];

    return MOCK_PROPERTIES
      .filter(p => 
        p.id !== propertyId &&
        p.status === 'available' &&
        (p.type === baseProperty.type || 
         p.district === baseProperty.district ||
         Math.abs(p.price - baseProperty.price) < baseProperty.price * 0.3)
      )
      .slice(0, limit);
  },

  async incrementPropertyViews(id: string): Promise<void> {
    await delay(100);

    const index = MOCK_PROPERTIES.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PROPERTIES[index].views++;
      MOCK_PROPERTIES[index].updatedAt = new Date();
    }
  },

  async togglePropertyFavorite(id: string, increment: boolean): Promise<void> {
    await delay(100);

    const index = MOCK_PROPERTIES.findIndex(p => p.id === id);
    if (index !== -1) {
      if (increment) {
        MOCK_PROPERTIES[index].favorites++;
      } else if (MOCK_PROPERTIES[index].favorites > 0) {
        MOCK_PROPERTIES[index].favorites--;
      }
      MOCK_PROPERTIES[index].updatedAt = new Date();
    }
  }
};

export default propertyService;