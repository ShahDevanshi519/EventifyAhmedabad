import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { Ticket, Calendar } from 'lucide-react';
import axios from 'axios';

export default function OverviewTab({ user, bookings }) {
  console.log('OverviewTab received - user:', user, 'bookings:', bookings);

  const [count,setCount] = useState(0);
  const [recent,setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

  const token = localStorage.getItem("AccessToken");

  if(!token){
    navigate('/signin');
    return;
  }

  axios.get("http://127.0.0.1:3000/countbooking",{
    headers:{
      Authorization:`Bearer ${token}`
    }
  }).then((res) => {
    setCount(res.data)
    console.log(res.data)
  })
  axios.get("http://127.0.0.1:3000/recentuserbooking",{
    headers:{
      Authorization:`Bearer ${token}`
    }
  }).then((res) => {
    setRecent(res.data)
    console.log(res.data)
  })
  .catch((err) => {
      if(err.response?.status === 401){
        const refreshToken = localStorage.getItem("RefreshToken");

        if(!refreshToken){
          alert("Your Session Is Expired,Please Do Logout and Login Again");
          localStorage.clear();
          navigate('/signin');
          return;
        }

        axios.post("http://127.0.0.1:3000/refreshToken",{refreshToken})
        .then((res) => {
          const newAccessToken = res.data.access_token;

          localStorage.setItem("AccessToken",newAccessToken);
          return axios.get("http://127.0.0.1:3000/countbooking",{
            headers:{
              Authorization:`Bearer ${newAccessToken}`
            }
          });
        }).then((res) => {
          setCount(res.data)
          console.log(res.data)
        }).then((res) => {
          setRecent(res.data)
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err);
          alert("Your Session Is Expired,Please Do Logout and Login Again");
          localStorage.clear();
          navigate('/signin');
        })
      }
    })

  },[])

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="glass rounded-2xl p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.email || 'User'}! 👋</h2>
        <p className="text-white/80">You're all set for your next event</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Bookings */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-bold">Total Bookings</h3>
            <Ticket className="text-purple-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-purple-600">{count}</p>
          <p className="text-sm text-gray-500 mt-2">events booked</p>
        </div>

        {/* Total Spent */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-bold">Amount Spent</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-4xl font-bold text-green-600">
            ₹{bookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">total spending</p>
        </div>

        {/* Upcoming Events */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-bold">Upcoming Events</h3>
            <Calendar className="text-pink-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-pink-600">
            {bookings?.filter(b => new Date(b.date) > new Date()).length || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">events coming soon</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Recent Bookings</h3>
        {recent && recent.length > 0 ? (
          <div className="space-y-3">
            {recent.slice(-3).reverse().map((booking) => (
              <div key={booking._id} className="glass rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800">{booking.eventId?.title}</h4>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-bold">
                    {booking.bookingStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>📅 {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</div>
                  <div>🎫 {booking.numberOfTickets} Ticekts </div>
                  <div className="text-right">₹{booking.totalAmount}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-lg p-8 text-center text-gray-500">
            <p>No bookings yet. Start exploring events!</p>
          </div>
        )}
      </div>
    </div>
  );
}