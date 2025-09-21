import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Bell, Shield, Palette, Globe, 
  Database, CreditCard, Users, Building, Save, Moon, Sun
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '@/contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: Settings },
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'company', label: 'Công ty', icon: Building }
  ];

  const handleSave = () => {
    toast.success('Đã lưu cài đặt thành công!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cài đặt</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Cài đặt chung</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngôn ngữ
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Múi giờ
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>GMT+7 (Việt Nam)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Định dạng ngày
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Thông tin cá nhân</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        defaultValue="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        defaultValue="0123456789"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="demo@salebds.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      defaultValue="123 Đường ABC, Quận XYZ, TP.HCM"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Cài đặt thông báo</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Thông báo email', desc: 'Nhận thông báo qua email' },
                    { label: 'Thông báo SMS', desc: 'Nhận tin nhắn SMS' },
                    { label: 'Thông báo Push', desc: 'Thông báo trên trình duyệt' },
                    { label: 'Khách hàng mới', desc: 'Khi có khách hàng mới đăng ký' },
                    { label: 'Giao dịch', desc: 'Cập nhật về các giao dịch' },
                    { label: 'Báo cáo', desc: 'Báo cáo định kỳ' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Bảo mật</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Đổi mật khẩu</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-medium mb-4">Xác thực 2 yếu tố</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Tăng cường bảo mật cho tài khoản của bạn
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Kích hoạt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Giao diện</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Chế độ màu
                    </label>
                    <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? (
                          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Sun className="w-5 h-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {theme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {theme === 'dark' ? 'Giảm ánh sáng cho mắt' : 'Giao diện sáng rõ ràng'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200 dark:bg-gray-700 transition-colors"
                      >
                        <span className={`inline-block w-4 h-4 transform transition-transform bg-white dark:bg-gray-300 rounded-full ${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu chủ đạo
                    </label>
                    <div className="flex gap-2">
                      {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cỡ chữ
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Nhỏ</option>
                      <option>Trung bình</option>
                      <option>Lớn</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Thông tin công ty</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên công ty
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="Công ty BĐS ABC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã số thuế
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ công ty
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      defaultValue="456 Đường XYZ, Quận ABC, TP.HCM"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điện thoại
                      </label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        defaultValue="028 1234 5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input 
                        type="url" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        defaultValue="https://salebds.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t flex justify-end gap-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Hủy
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;