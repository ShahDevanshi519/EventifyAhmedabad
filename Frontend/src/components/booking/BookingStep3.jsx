import React from 'react';
import { Check, Download, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingStep3({ event, bookingData, onClose }) {

  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/purity
  const bookingId = `EVT-${Math.random().toString(36).substring(7).toUpperCase()}`;

  const { ticketSelections, totalAmount, userDetails } = bookingData;
  const totalTickets = ticketSelections.reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div className="text-center space-y-6">

      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
          <Check size={40} />
        </div>
      </div>

      <h2 className="text-3xl font-black text-gray-800">Booking Confirmed!</h2>

      {/* Booking Card */}
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-6 text-left shadow-sm space-y-4">
        <h3 className="font-black text-xl text-purple-700">{event.title}</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-gray-400">BOOKING ID</p><p className="font-bold">{bookingId}</p></div>
          <div><p className="text-gray-400">TOTAL SEATS</p><p className="font-bold">{totalTickets}</p></div>
          <div><p className="text-gray-400">NAME</p><p className="font-bold">{userDetails.fullName}</p></div>
          <div><p className="text-gray-400">PAID</p><p className="font-bold">₹{totalAmount}</p></div>
        </div>

        {/* Ticket Type Breakdown */}
        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ticket Details</p>
          {ticketSelections.map((t) => (
            <div key={t.type} className="flex justify-between text-sm">
              <span className={`font-bold ${t.type === 'VIP' ? 'text-yellow-600' : 'text-purple-600'}`}>
                {t.type}
              </span>
              <span className="text-gray-600">
                {t.quantity} × ₹{t.pricePerTicket} = ₹{t.quantity * t.pricePerTicket}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => { navigate('/dashboard'); onClose(); }}
          className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          View My Bookings <ArrowRight size={20} />
        </button>
        <div className="flex gap-2">
          <button className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2">
            <Download size={18} /> Ticket
          </button>
          <button className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2">
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>

    </div>
  );
}