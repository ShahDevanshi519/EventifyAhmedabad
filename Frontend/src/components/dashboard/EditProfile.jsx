import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building, Camera } from 'lucide-react';

export default function EditProfile({ user, setUser }) {

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    zip: user.zip || '',
    profileImage: user.profileImage || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData, isLoggedIn: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert('✅ Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

        {/* Profile Image (UNCHANGED) */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                formData.profileImage ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png'
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-300 shadow-lg"
            />

            <label className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700">
              <Camera size={18} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Click camera icon to upload photo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* First Name + Last Name SAME ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-purple-400" size={20} />
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-white 
                       bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
                       hover:shadow-xl transition-all"
          >
            Save Profile
          </button>

        </form>
      </div>
    </div>
  );
}
