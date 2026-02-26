import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

export default function BookingStep2({ event, seatCount, totalAmount, onNext }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ paymentDetails: { method: paymentMethod, ...cardData } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h3>
        <div className="space-y-3">
          {[
            { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
            { value: 'upi', label: 'UPI', icon: '📱' },
            { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
            { value: 'wallet', label: 'Wallet', icon: '👛' },
          ].map((method) => (
            <label
              key={method.value}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                paymentMethod === method.value
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5"
              />
              <span className="text-xl">{method.icon}</span>
              <span className="font-medium text-gray-800">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Card Details */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Card Details</h3>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="text"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              value={cardData.cardName}
              onChange={handleCardChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleCardChange}
                placeholder="123"
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-bold">₹{event.price * seatCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Convenience Fee</span>
          <span className="font-bold">₹{Math.floor(event.price * seatCount * 0.1)}</span>
        </div>
        <div className="border-t border-purple-200 pt-2 flex justify-between">
          <span className="font-bold text-lg">Total Amount</span>
          <span className="font-bold text-lg text-purple-600">₹{totalAmount}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full btn-gradient text-white py-3 rounded-lg font-bold"
      >
        Proceed to Confirmation
      </button>
    </form>
  );
}