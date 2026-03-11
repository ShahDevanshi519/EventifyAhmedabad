import React, { useEffect } from 'react';
import { Check, Download, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingStep3({ event, seatCount, totalAmount, bookingData, onClose }) {
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/purity
  const bookingId = `EVT${Math.random().toString(36).substring(7).toUpperCase()}`;

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({ id: bookingId, eventTitle: event.title, date: event.date, seats: seatCount, totalAmount, bookingData, bookedAt: new Date().toISOString() });
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, []);

  const handleGoToDashboard = () => { navigate('/dashboard'); onClose(); }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg text-center">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={48} className="text-white"/>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h2>
      <p className="text-gray-700">Your tickets have been successfully booked</p>

      <div className="bg-purple-50 p-4 rounded-lg space-y-2 text-left">
        <div className="flex justify-between font-semibold text-gray-800"><span>Booking Ref:</span><span>{bookingId}</span></div>
        <div className="grid grid-cols-2 gap-2 text-gray-800">
          <div>Event: <strong>{event.title}</strong></div>
          <div>Seats: <strong>{seatCount}</strong></div>
          <div>Date: <strong>{new Date(event.date).toLocaleDateString('en-IN')}</strong></div>
          <div>Total: <strong>₹{totalAmount}</strong></div>
        </div>
      </div>

      <div className="space-y-2 text-left text-gray-700">
        <div>Email: {bookingData.userDetails?.email}</div>
        <div>Phone: {bookingData.userDetails?.phone}</div>
        <div>Booked On: {new Date().toLocaleString('en-IN')}</div>
      </div>

      <div className="space-y-3 pt-4">
        <button onClick={handleGoToDashboard} className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center gap-2">
          Go to My Bookings <ArrowRight size={20}/>
        </button>
        <button className="w-full py-3 rounded-lg font-bold border-2 border-purple-500 text-purple-500 flex items-center justify-center gap-2 hover:bg-purple-50 transition">
          <Download size={20}/> Download Ticket
        </button>
        <button className="w-full py-3 rounded-lg font-bold border-2 border-purple-500 text-purple-500 flex items-center justify-center gap-2 hover:bg-purple-50 transition">
          <Share2 size={20}/> Share Booking
        </button>
      </div>

      <button onClick={onClose} className="text-purple-500 font-bold hover:text-purple-700 transition">Close</button>
    </div>
  );
}