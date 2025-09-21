import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, Camera, Shield, Bell, Globe, Calendar } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 987 654 321',
    address: '12 Nguyễn Huệ, Q.1, TP.HCM',
    position: 'Sales Executive',
    joinedAt: '2023-05-20',
    bio: 'Nhân viên kinh doanh BĐS với 3 năm kinh nghiệm, đam mê công nghệ và phân tích dữ liệu.',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
          <button className="absolute bottom-3 right-3 bg-white/80 hover:bg-white text-gray-700 px-3 py-1 rounded flex items-center gap-2">
            <Camera size={16} />
            Đổi ảnh bìa
          </button>
        </div>

        {/* Avatar & Basic */}
        <div className="px-6 -mt-10">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
              <p className="text-gray-600">{profile.position}</p>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Edit3 size={16} />
                  Chỉnh sửa
                </button>
              ) : (
                <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save size={16} />
                  Lưu
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Họ và tên</label>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    name="email"
                    value={profile.email}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Số điện thoại</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Địa chỉ</label>
                  <input
                    name="address"
                    value={profile.address}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Giới thiệu</h2>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={onChange}
                disabled={!editing}
                className="w-full px-3 py-2 border rounded-lg min-h-[120px] disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Liên hệ</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><Mail size={14} /> {profile.email}</div>
                <div className="flex items-center gap-2"><Phone size={14} /> {profile.phone}</div>
                <div className="flex items-center gap-2"><MapPin size={14} /> {profile.address}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin công việc</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><User size={14} /> Vị trí: {profile.position}</div>
                <div className="flex items-center gap-2"><Calendar size={14} /> Ngày gia nhập: {new Date(profile.joinedAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Bảo mật & Thông báo</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Shield size={14} /> Xác thực 2 lớp</div>
                  <button className="px-3 py-1 border rounded-lg text-sm">Bật</button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Bell size={14} /> Nhận thông báo</div>
                  <button className="px-3 py-1 border rounded-lg text-sm">Bật</button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Globe size={14} /> Ngôn ngữ</div>
                  <button className="px-3 py-1 border rounded-lg text-sm">Tiếng Việt</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;