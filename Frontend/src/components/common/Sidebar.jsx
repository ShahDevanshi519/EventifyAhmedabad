import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, Ticket, XCircle, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Edit Profile', icon: User, path: '/dashboard?tab=profile' },
    { label: 'Your Bookings', icon: Ticket, path: '/dashboard?tab=bookings' },
    { label: 'Change Password', icon: Lock, path: '/dashboard?tab=password' },
    // { label: 'Cancel Booking', icon: XCircle, path: '/dashboard?tab=cancel' },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('user');
    localStorage.removeItem('bookings');
    localStorage.removeItem('signupData');
    navigate('/');
  };

  return (
    <div className="hidden lg:block w-full sticky top-24 left-0 h-[calc(100vh-6rem)] p-6 space-y-4 bg-white rounded-2xl shadow overflow-auto z-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Menu</h2>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-100 transition-all font-medium"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all font-bold mt-8"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
