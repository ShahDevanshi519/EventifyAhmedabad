import React from 'react';
import { Check, Download, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingStep3({ event, bookingData, totalAmount, onClose }) {
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/purity
  const bookingId = `EVT-${Math.random().toString(36).substring(7).toUpperCase()}`;

  return (
    <div className="text-center space-y-6 animate-in zoom-in duration-500">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
          <Check size={40} />
        </div>
      </div>

      <h2 className="text-3xl font-black text-gray-800">Booking Confirmed!</h2>
      
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-6 text-left shadow-sm">
        <h3 className="font-black text-xl text-purple-700 mb-4">{event.title}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-gray-400">BOOKING ID</p><p className="font-bold">{bookingId}</p></div>
          <div><p className="text-gray-400">SEATS</p><p className="font-bold">{bookingData.seatCount}</p></div>
          <div><p className="text-gray-400">USER</p><p className="font-bold">{bookingData.userDetails.fullName}</p></div>
          <div><p className="text-gray-400">PAID</p><p className="font-bold">₹{totalAmount}</p></div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <button onClick={() => { navigate('/dashboard'); onClose(); }} className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
          View My Bookings <ArrowRight size={20}/>
        </button>
        <div className="flex gap-2">
          <button className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2"><Download size={18}/> Ticket</button>
          <button className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2"><Share2 size={18}/> Share</button>
        </div>
      </div>
    </div>
  );
}