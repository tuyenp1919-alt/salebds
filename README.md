# 🏠 SaleBDS - CRM & AI Assistant cho Sale Bất Động Sản

![SaleBDS](https://img.shields.io/badge/SaleBDS-CRM%20%2B%20AI-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.4-3178c6)
![Vite](https://img.shields.io/badge/Vite-4.0.0-646cff)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2.4-38bdf8)
![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8)

Ứng dụng CRM toàn diện hỗ trợ nhân viên kinh doanh bất động sản với AI tư vấn, quản lý khách hàng, phân tích phong thủy và marketing tự động.

## 🌟 Tính Năng Chính

### 🎯 CRM - Quản Lý Khách Hàng
- ✅ **Quản lý Pipeline** - Theo dõi khách từ Lead → Deal
- 📞 **Lịch sử tương tác** - Call, Email, Meeting, Site visit
- 🔔 **Nhắc nhở thông minh** - Tự động reminder chăm sóc khách
- 📊 **Phân tích hành vi** - Insight về khách hàng tiềm năng

### 🏢 Kho Dự Án & Sản Phẩm BĐS
- 🔍 **Tìm kiếm thông minh** - Filter theo giá, vị trí, loại hình
- ⚖️ **So sánh sản phẩm** - Side-by-side comparison
- 📤 **Chia sẻ nhanh** - Gửi thông tin qua Zalo, Messenger
- 📈 **Phân tích thị trường** - Giá trị đầu tư, tiềm năng tăng giá

### 🤖 AI Assistant & Tư Vấn
- 💬 **Chatbot AI** - Trả lời tức thì về sản phẩm, chính sách
- 🎯 **AI Matching** - Gợi ý căn phù hợp với nhu cầu khách
- 📄 **Sinh báo giá tự động** - PDF proposal với logo công ty
- 🎭 **Script hội thoại** - Gợi ý kịch bản tư vấn

### 📊 Dashboard & Analytics
- 📈 **KPI Dashboard** - Tracking doanh số, conversion rate
- 🏆 **Leaderboard** - Xếp hạng sale theo performance
- 📋 **Báo cáo chi tiết** - Tuần/Tháng/Quý, export Excel/PDF
- 🎯 **Forecast** - Dự đoán doanh thu và xu hướng

### 🎨 Marketing Tools
- ✍️ **Sinh content AI** - Post Facebook, email campaign
- 🎬 **Tạo video marketing** - TikTok, Reels, Shorts
- 🖼️ **Design poster/banner** - Template tự động
- 📱 **Social media scheduler** - Đăng bài tự động

### 🧭 Phân Tích Phong Thủy & Vị Trí
- 🏠 **Hướng nhà theo tuổi** - Đông/Tây Tứ Trạch
- 🗺️ **Đánh giá location** - Gần trường, bệnh viện, TTTM
- 💰 **Dự đoán giá** - AI analysis tiềm năng đầu tư
- 🎨 **Màu sắc hợp mệnh** - Tư vấn theo phong thủy

### 📚 Đào Tạo & Knowledge Base
- 🎥 **Video training** - Kỹ năng bán hàng, sản phẩm
- 🧠 **Mini Quiz** - Test kiến thức nhân viên
- 📖 **Thư viện bán hàng** - Xử lý phản đối, closing techniques
- 🎯 **Simulation** - Practice scenarios

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18.2** - UI Library với Hooks & Concurrent features
- **TypeScript 4.9** - Type safety và better DX
- **Vite 4.0** - Super fast build tool
- **TailwindCSS 3.2** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Query (TanStack Query)** - Server state management

### State Management
- **Zustand** - Lightweight state management
- **React Context** - Auth, Theme, Notifications
- **React Hook Form + Zod** - Form handling với validation

### UI Components
- **Headless UI** - Accessible components
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Notification system
- **Recharts & Chart.js** - Data visualization

### PWA & Performance
- **Vite PWA Plugin** - Service Worker, offline support
- **Workbox** - Advanced caching strategies
- **Code Splitting** - Lazy loading cho performance
- **React Error Boundaries** - Graceful error handling

### Development Tools
- **ESLint & Prettier** - Code quality và formatting
- **TypeScript** - Type checking
- **Vite DevTools** - Development experience
- **React DevTools** - Component debugging

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+ 
- npm hoặc yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/tuyenp1919-alt/salebds.git
cd salebds

# Install dependencies
npm install

# Start development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong browser.

### Demo Account
```
Email: demo@salebds.com
Password: demo123
```

## 📱 Mobile-First Design

- ✅ **Responsive Design** - Tối ưu cho mobile, tablet, desktop
- ✅ **Touch-friendly** - UI components dễ thao tác bằng tay
- ✅ **PWA Support** - Cài đặt như native app
- ✅ **Offline Mode** - Hoạt động không cần internet
- ✅ **Voice Input** - Nhập khách hàng bằng giọng nói

## 🏗️ Cấu Trúc Project

```
salebds/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── common/         # Shared components
│   │   ├── layout/         # Layout components
│   │   └── features/       # Feature-specific components
│   ├── contexts/           # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── stores/            # State management
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── styles/            # CSS files
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Development

### Commands
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

### Environment Variables
```bash
# .env.local
VITE_API_URL=https://api.salebds.com
VITE_GEMINI_API_KEY=your_gemini_key
VITE_MAPS_API_KEY=your_maps_key
VITE_FIREBASE_CONFIG=your_firebase_config
```

## 📦 Build & Deployment

### GitHub Pages
```bash
npm run build
npm run deploy
```

### Custom Domain Setup
1. Tạo file `CNAME` trong `public/` với domain của bạn
2. Cấu hình DNS CNAME record
3. Deploy lên GitHub Pages

### Docker (Optional)
```bash
# Build image
docker build -t salebds .

# Run container
docker run -p 3000:3000 salebds
```

## 🎯 Roadmap

### Phase 1 - Core CRM (Completed ✅)
- [x] Authentication & User management
- [x] Customer management với pipeline
- [x] Basic property database
- [x] Interaction tracking

### Phase 2 - AI Integration (In Progress 🚧)
- [ ] AI-powered customer matching
- [ ] Auto content generation
- [ ] Chatbot integration
- [ ] Feng shui analysis

### Phase 3 - Advanced Features (Planned 📋)
- [ ] Video call integration
- [ ] Advanced analytics
- [ ] Marketing automation
- [ ] Mobile app (React Native)

### Phase 4 - Enterprise Features (Future 🔮)
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] API for integrations
- [ ] White-label solutions

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

## 📝 License

Dự án này được phân phối dưới [MIT License](LICENSE).

## 👥 Team

**Tuyen Pham** - Full Stack Developer
- GitHub: [@tuyenp1919-alt](https://github.com/tuyenp1919-alt)
- Email: tuyenpham@example.com

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) - Amazing UI library
- [Tailwind Labs](https://tailwindcss.com/) - Beautiful utility CSS
- [Vercel](https://vercel.com/) - Inspiration for great UX
- [Real Estate Vietnam](https://batdongsan.com.vn/) - Domain insights

---

⭐ **Star this repo if you find it helpful!**

**Live Demo:** [https://tuyenp1919-alt.github.io/salebds](https://tuyenp1919-alt.github.io/salebds)