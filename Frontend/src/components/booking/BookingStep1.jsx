import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Ticket, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function BookingStep1({ event, onNext, savedData }) {

  const [formData, setFormData] = useState(savedData.userDetails);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selections, setSelections] = useState({});   // { General: 0, VIP: 0 }
  const [loadingTickets, setLoadingTickets] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("AccessToken");
    if (!token) { window.location.href = '/signin'; return; }

    axios.get("http://127.0.0.1:3000/booking/display", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setFormData(res.data);
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
          localStorage.setItem("AccessToken", res.data.access_token);
          return axios.get("http://127.0.0.1:3000/booking/display", {
            headers: { Authorization: `Bearer ${res.data.access_token}` }
          });
        })
        .then((res) => {
          setFormData(res.data);
        })
        .catch(() => {
          localStorage.clear();
          navigate('/signin');
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log("Event ID being sent:", event._id)
    axios.get(`http://127.0.0.1:3000/ticketTypes/${event._id}`)
    .then((res) => {
      if (res.data.flag === 1) {
        setTicketTypes(res.data.data);
        const init = {};
        res.data.data.forEach((t) => { init[t.type] = 0; });
        setSelections(init);
      }
    })
    .catch((err) => {
      console.error("Failed to load ticket types", err);
    })
    .finally(() => {
      setLoadingTickets(false);
    });
  }, [event._id]);

  const updateCount = (type, delta, max) => {
    setSelections((prev) => ({
      ...prev,
      [type]: Math.min(max, Math.max(0, (prev[type] || 0) + delta))
    }));
  };

  // Total tickets selected across all types
  const totalTickets = Object.values(selections).reduce((a, b) => a + b, 0);

  // Calculate totals
  const subtotal = ticketTypes.reduce((sum, t) => {
    return sum + (selections[t.type] || 0) * t.price;
  }, 0);
  const convenienceFee = Math.floor(subtotal * 0.1);
  const grandTotal = subtotal + convenienceFee;

  const handleNext = () => {
    // Build ticketSelections array — only types where quantity > 0
    const ticketSelections = ticketTypes
      .filter((t) => selections[t.type] > 0)
      .map((t) => ({
        type: t.type,
        quantity: selections[t.type],
        pricePerTicket: t.price
      }));

    if (ticketSelections.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    onNext({
      userDetails: formData,
      ticketSelections: ticketSelections,
      totalAmount: grandTotal
    });
  };

  return (
    <div className="space-y-6">

      {/* User Details */}
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-purple-500" size={20} />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Full Name"
            value={formData.fullName || ''}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-purple-500" size={20} />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-purple-500" size={20} />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Phone Number"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Ticket Type Selection */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Ticket size={18} className="text-purple-600" /> Select Tickets
        </h3>

        {loadingTickets ? (
          <div className="text-center text-gray-400 py-6">Loading ticket types...</div>
        ) : ticketTypes.length === 0 ? (
          <div className="text-center text-gray-400 py-6">No ticket types available.</div>
        ) : (
          ticketTypes.map((ticket) => (
            <div
              key={ticket._id}
              className="p-4 bg-purple-50 rounded-2xl flex justify-between items-center border border-purple-100"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    ticket.type === 'VIP'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {ticket.type}
                  </span>
                  <span className="font-bold text-gray-800">₹{ticket.price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {ticket.availableSeats} seats available
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-xl shadow-sm border">
                <button
                  onClick={() => updateCount(ticket.type, -1, ticket.availableSeats)}
                  className="text-purple-600 hover:text-purple-800 transition"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-lg w-6 text-center">
                  {selections[ticket.type] || 0}
                </span>
                <button
                  onClick={() => updateCount(ticket.type, +1, ticket.availableSeats)}
                  className="text-purple-600 hover:text-purple-800 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Price Summary — only show when tickets selected */}
      {totalTickets > 0 && (
        <div className="bg-purple-600 text-white p-4 rounded-2xl space-y-1">
          {ticketTypes.filter(t => selections[t.type] > 0).map((t) => (
            <div key={t.type} className="flex justify-between text-sm opacity-80">
              <span>{t.type} × {selections[t.type]}</span>
              <span>₹{selections[t.type] * t.price}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm opacity-80">
            <span>Convenience Fee (10%)</span>
            <span>₹{convenienceFee}</span>
          </div>
          <div className="flex justify-between font-black text-lg border-t border-white/20 pt-2">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!formData.fullName || !formData.email || totalTickets === 0}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Payment
      </button>

    </div>
  );
}