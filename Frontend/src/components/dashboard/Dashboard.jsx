import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import OverviewTab from './OverviewTab';
import EditProfile from './EditProfile';
import YourBookings from './YourBookings';
import ChangePassword from './ChangePassword';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "" });
  const [bookings, setBookings] = useState([]);

  const activeTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    console.log('Dashboard mounted');

    const userName = localStorage.getItem("userName");
    console.log("Dashboard userName:", userName);

    // If no username → redirect
    if (!userName) {
      navigate('/signin');
      return;
    }

    // Set user
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser({ name: userName });

    // Optional: get bookings
    const bookingsData = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(bookingsData);

  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-16">
      <div className="px-4 sm:px-6 lg:px-8 pt-8">

        <div className="grid items-start grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* Welcome Message */}
            <div className="mb-6 bg-white shadow-md rounded-xl p-4">
              <h1 className="text-2xl font-bold text-purple-700">
                Welcome {user.name}
              </h1>
            </div>

            {/* Tabs */}
            {activeTab === 'overview' && (
              <OverviewTab user={user} bookings={bookings} />
            )}

            {activeTab === 'profile' && (
              <EditProfile user={user} setUser={setUser} />
            )}

            {activeTab === 'bookings' && (
              <YourBookings bookings={bookings} />
            )}

            {activeTab === 'password' && (
              <ChangePassword />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}