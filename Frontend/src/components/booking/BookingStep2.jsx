import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Ticket, CheckCircle2, Copy } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

export default function BookingStep2({ event, bookingData, onNext, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const { ticketSelections, totalAmount, userDetails } = bookingData;
  const totalTickets = ticketSelections.reduce((sum, t) => sum + t.quantity, 0);

  // Generates a real UPI string that apps like GPay/PhonePe can actually read
  const upiString = `upi://pay?pa=eventify@upi&pn=Eventify&am=${totalAmount}&cu=INR`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('eventify@upi');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("AccessToken");

    const finalPayload = {
      eventId: event._id,
      ticketTypes: ticketSelections,
      numberOfTickets: totalTickets,
      totalAmount: totalAmount,
    };

    const doBooking = (authToken) => {
      return axios.post("http://127.0.0.1:3000/booking", finalPayload, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    };

    doBooking(token)
      .then((res) => {
        if (res.data.flag === 1) {
          onNext({ paymentDetails: { method: paymentMethod } });
        } else {
          alert(res.data.msg || "Booking Failed");
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          const refreshToken = localStorage.getItem("RefreshToken");
          if (!refreshToken) {
            alert("Session Expired. Please Login Again.");
            localStorage.clear();
            navigate('/signin');
            return;
          }
          axios.post("http://127.0.0.1:3000/refreshToken", { refreshToken })
            .then((res) => {
              const newToken = res.data.access_token;
              localStorage.setItem("AccessToken", newToken);
              return doBooking(newToken);
            })
            .then((res) => {
              if (res.data.flag === 1) {
                onNext({ paymentDetails: { method: paymentMethod } });
              } else {
                alert(res.data.msg);
              }
            })
            .catch(() => {
              localStorage.clear();
              navigate('/signin');
            });
        } else {
          alert("Something Went Wrong. Please Try Again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-start border-b pb-3">
          <div>
            <h4 className="font-bold text-purple-700 text-lg">{event.title}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Calendar size={12} /> {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Ticket size={12} /> {totalTickets} Seats
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm border-b pb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={14} /> {userDetails.fullName}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={14} /> {userDetails.email}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={14} /> {userDetails.phone}
          </div>
        </div>

        {/* Ticket Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ticket Breakdown</p>
          {ticketSelections.map((t) => (
            <div key={t.type} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  t.type === 'VIP' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {t.type}
                </span>
                <span className="text-gray-600">× {t.quantity}</span>
              </div>
              <span className="font-semibold text-gray-800">
                ₹{t.pricePerTicket * t.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            key="upi"
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 font-semibold capitalize
            ${paymentMethod === 'upi' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-600'}`}
          >
            {paymentMethod === 'upi' && <CheckCircle2 size={16} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill={paymentMethod === 'upi' ? '#7c3aed' : '#9ca3af'} />
              <text x="3" y="17" fontSize="10" fontWeight="bold" fill="white">UPI</text>
            </svg>
            UPI
          </button>

          <button
            key="scanner"
            type="button"
            onClick={() => setPaymentMethod('scanner')}
            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 font-semibold capitalize
            ${paymentMethod === 'scanner' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-600'}`}
          >
            {paymentMethod === 'scanner' && <CheckCircle2 size={16} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'scanner' ? '#7c3aed' : '#9ca3af'} strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h2v2H7zM15 7h2v2h-2zM7 15h2v2H7zM15 15h2v2h-2zM11 11h2v2h-2z" fill="currentColor" />
            </svg>
            Scan & Pay
          </button>
        </div>

        {/* UPI Input Panel */}
        {paymentMethod === 'upi' && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 mt-2">
            <p className="text-sm font-semibold text-gray-700">Enter your UPI ID</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="yourname@upi"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
              <button type="button" className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Verify</button>
            </div>
          </div>
        )}

        {/* Professional QR Panel */}
        {paymentMethod === 'scanner' && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 mt-2">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                {/* Real Scannable QR Component */}
                <QRCode 
                  value={upiString}
                  size={160}
                  level="H" // High error correction
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">UPI ID</p>
                <p className="font-bold text-gray-800 text-sm">eventify@upi</p>
              </div>
              <button type="button" onClick={handleCopyUPI} className="flex items-center gap-1 text-xs font-semibold text-purple-600">
                <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">Scan QR and pay <span className="font-bold text-gray-700">₹{totalAmount}</span> to confirm.</p>
          </div>
        )}
      </div>

      {/* Footer & Actions */}
      <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center border-t border-white/20 pt-3">
          <span className="font-bold">Total Payable</span>
          <span className="text-2xl font-black">₹{totalAmount}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-500">Back</button>
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