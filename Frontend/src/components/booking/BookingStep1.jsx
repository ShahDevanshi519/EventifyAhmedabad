import React, { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';

export default function BookingStep1({ event, seatCount, onNext }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ userDetails: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Details</h3>
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Summary */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Event</span>
          <span className="font-bold text-gray-800">{event.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Seats</span>
          <span className="font-bold text-gray-800">{seatCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Price/Seat</span>
          <span className="font-bold text-gray-800">₹{event.price}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
          className="mt-1"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the terms and conditions and cancellation policy
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formData.fullName || !formData.email || !formData.phone || !formData.terms}
        className="w-full btn-gradient text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Payment
      </button>
    </form>
  );
}