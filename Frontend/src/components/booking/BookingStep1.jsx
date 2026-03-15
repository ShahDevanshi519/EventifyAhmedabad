import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Ticket, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function BookingStep1({ event, onNext, savedData }) {
  const [localSeatCount, setLocalSeatCount] = useState(savedData.seatCount);
  const [formData, setFormData] = useState(savedData.userDetails);
  const navigate = useNavigate();

  useEffect(() => {
    // const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("AccessToken");
    if (!token) {
      window.location.href = '/signin';
      return;
    }
  
    axios.get("http://127.0.0.1:3000/booking/display",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((res) => {
      setFormData(res.data)
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
                    return axios.post("http://127.0.0.1:3000/booking/display",{
                      headers:{
                        Authorization:`Bearer ${newAccessToken}`
                      }
                    });
                  }).then((res) => {
                    if(res.data.flag === 1){
                     setFormData(res.data)
                     console.log(res.data)
                    }else{
                      alert(res.data.msg);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    alert("Your Session Is Expired,Please Do Logout and Login Again")
                    localStorage.clear();
                    navigate('/signin');
                  })
                }
              });
  },[])


  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-purple-500" size={20} />
          <input 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" 
            placeholder="Full Name" 
            value={formData.fullName} 
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-purple-500" size={20} />
          <input 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" 
            placeholder="Email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-purple-500" size={20} />
          <input 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" 
            placeholder="Phone Number" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>

      <div className="p-4 bg-purple-50 rounded-2xl flex justify-between items-center border border-purple-100">
        <div className="flex items-center gap-3">
          <Ticket className="text-purple-600" />
          <span className="font-bold">Tickets (₹{event.price}/ea)</span>
        </div>
        <div className="flex items-center gap-4 bg-white px-3 py-1 rounded-xl shadow-sm border">
          <button onClick={() => setLocalSeatCount(Math.max(1, localSeatCount - 1))}><Minus size={18} /></button>
          <span className="font-bold text-lg">{localSeatCount}</span>
          <button onClick={() => setLocalSeatCount(localSeatCount + 1)}><Plus size={18} /></button>
        </div>
      </div>

      <button 
        onClick={() => onNext({ userDetails: formData, seatCount: localSeatCount })}
        disabled={!formData.fullName || !formData.email}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 active:scale-95 transition-all"
      >
        Proceed to Payment
      </button>
    </div>
  );
}