import React, { useEffect } from 'react';
import { Check, Download, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingStep3({ event, seatCount, totalAmount, bookingData, onClose }) {
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/purity
  const bookingId = `EVT${Math.random().toString(36).substring(7).toUpperCase()}`;

  useEffect(() => {
    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({
      id: bookingId,
      eventTitle: event.title,
      date: event.date,
      seats: seatCount,
      totalAmount,
      bookingData,
      bookedAt: new Date().toISOString(),
    });
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, []);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
    onClose();
  };

  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
            <Check size={48} className="text-white" />
          </div>
          <div
            className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping"
            style={{ opacity: 0.5 }}
          ></div>
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 text-lg">Your tickets have been successfully booked</p>
      </div>

      {/* Booking Details */}
      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
          <p className="text-2xl font-bold text-blue-700">{bookingId}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-xs text-gray-600">Event</p>
            <p className="font-bold text-gray-800">{event.title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Seats</p>
            <p className="font-bold text-gray-800">{seatCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Date</p>
            <p className="font-bold text-gray-800">
              {new Date(event.date).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Amount</p>
            <p className="font-bold text-gray-800">₹{totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Confirmation Details */}
      <div className="text-left space-y-2 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Confirmation Email:</strong> {bookingData.userDetails?.email}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Phone:</strong> {bookingData.userDetails?.phone}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Booked On:</strong> {new Date().toLocaleString('en-IN')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleGoToDashboard}
          className="w-full btn-gradient text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          Go to My Bookings
          <ArrowRight size={20} />
        </button>
        <button className="w-full flex items-center justify-center gap-2 border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors">
          <Download size={20} />
          Download Ticket
        </button>
        <button className="w-full flex items-center justify-center gap-2 border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors">
          <Share2 size={20} />
          Share Booking
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
      >
        Close
      </button>
    </div>
  );
}