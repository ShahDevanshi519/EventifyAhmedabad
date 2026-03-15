import React, { useState } from 'react';
import { CreditCard, User, Mail, Phone, Calendar, Ticket, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function BookingStep2({ event, bookingData, totalAmount, onNext, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const {navigate} = useNavigate();

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("AccessToken");

    const finalPayload = {
      eventId: event._id,
      numberOfTickets: bookingData.seatCount,
      totalAmount: totalAmount,
      userDetails: bookingData.userDetails 
    };

    axios.post("http://127.0.0.1:3000/booking", finalPayload,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((res) => {
        if (res.data.flag === 1) {
          onNext({ paymentDetails: { method: paymentMethod } });
        } else {
          alert("Booking failed: " + (res.data.message || "Unknown error"));
        }
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
                    return axios.post("http://127.0.0.1:3000/booking",finalPayload,{
                      headers:{
                        Authorization:`Bearer ${newAccessToken}`
                      }
                    });
                  }).then((res) => {
                    if(res.data.flag === 1){
                      onNext({ paymentDetails: { method: paymentMethod } });
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
              })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-start border-b pb-3">
          <div>
            <h4 className="font-bold text-purple-700 text-lg">{event.title}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Calendar size={12}/> {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Ticket size={12}/> {bookingData.seatCount} Seats
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 truncate">
            <User size={14}/> {bookingData.userDetails.fullName}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={14}/> {bookingData.userDetails.email}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={14}/> {bookingData.userDetails.phone}
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-bold">
            Price: ₹{event.price} / ticket
          </div>
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          {['card', 'upi'].map((m) => (
            <button 
              key={m} 
              type="button" 
              onClick={() => setPaymentMethod(m)}
              className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 font-semibold capitalize
              ${paymentMethod === m ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100'}`}
            >
              <CheckCircle2 size={16} className={paymentMethod === m ? 'block' : 'hidden'}/> {m}
            </button>
          ))}
        </div>
      </div>

      {/* TOTAL AMOUNT BOX */}
      <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-lg">
        <div className="flex justify-between text-sm opacity-80 mb-2 font-medium">
          <span>Subtotal ({bookingData.seatCount} tickets)</span>
          <span>₹{event.price * bookingData.seatCount}</span>
        </div>
        <div className="flex justify-between items-center border-t border-white/20 pt-2">
          <span className="font-bold">Total Amount (inc. fees)</span>
          <span className="text-2xl font-black">₹{totalAmount}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button 
          type="button" 
          onClick={onBack} 
          className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-70"
        >
          {loading ? "Processing..." : `Pay ₹${totalAmount}`}
        </button>
      </div>
    </form>
  );
}