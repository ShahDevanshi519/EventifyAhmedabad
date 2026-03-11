import React, { useState,useEffect } from 'react';
import { User, Mail, Phone, Plus, Minus, Ticket } from 'lucide-react';
import axios from 'axios';

export default function BookingStep1({ event, onNext }) {
  const [localSeatCount, setLocalSeatCount] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    terms: false,
  });



  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log(userId);
    if (!userId) {
      window.location.href = '/signin';
      return;
    }
  
    axios.get("http://127.0.0.1:3000/booking/display",{
      params:{userId}
    }).then((res) => {
      setFormData(res.data)
      console.log(res.data)
    })
    .catch((err) => console.log(err))
  },[])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const incrementSeats = () => setLocalSeatCount(prev => prev + 1);
  const decrementSeats = () => {
    if (localSeatCount > 1) setLocalSeatCount(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = '/signin';
      return;
    }

    const bookingdata = {
      userId,
      eventId: event._id,
      numberOfTickets: localSeatCount,
      totalAmount: localSeatCount * event.price,
      userDetails: { ...formData }
    };

    axios.post("http://127.0.0.1:3000/booking", bookingdata)
      .then((res) => {
        if (res.data.flag === 1) console.log("Data saved");
      })
      .catch((err) => console.log(err));

    onNext({ userDetails: formData, seatCount: localSeatCount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-purple-500" size={20} />
          <input type="text" name="fullName" value={formData.fullName || ""} onChange={handleChange} placeholder="Full Name"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none" required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-purple-500" size={20} />
          <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none" required
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 text-purple-500" size={20} />
          <input type="tel" name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone Number"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none" required
          />
        </div>
      </div>

      <div className="p-4 border border-purple-100 rounded-xl bg-purple-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="text-purple-600" size={24} />
            <div>
              <p className="font-bold text-gray-800">Select Number Of Tickets</p>
              <p className="text-xs text-gray-500">₹{event.price} per ticket</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-1 rounded-lg border shadow-sm">
            <button type="button" onClick={decrementSeats} className="p-1 hover:bg-red-50 text-red-500 transition-colors"><Minus size={20} /></button>
            <span className="text-lg font-black w-6 text-center">{localSeatCount}</span>
            <button type="button" onClick={incrementSeats} className="p-1 hover:bg-green-50 text-green-600 transition-colors"><Plus size={20} /></button>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl space-y-3 text-black border border-gray-200 shadow-sm">
        <div className="flex justify-between text-sm opacity-80">
          <span>Booking for</span>
          <span className="font-medium text-purple-600">{event.title}</span>
        </div>
        <div className="flex justify-between text-sm opacity-80">
          <span>Subtotal ({localSeatCount} tickets)</span>
          <span className="font-semibold">₹{localSeatCount * event.price}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
          <span className="font-bold">Total Amount</span>
          <span className="text-2xl font-black text-purple-600">₹{localSeatCount * event.price}</span>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} className="mt-1" required />
        <label htmlFor="terms" className="text-gray-700 text-sm">I agree to the terms and conditions</label>
      </div>

      <button type="submit" disabled={!formData.fullName || !formData.email || !formData.phone || !formData.terms}
        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg disabled:opacity-50 transition-all">
        Confirm & Pay ₹{localSeatCount * event.price}
      </button>
    </form>
  );
}