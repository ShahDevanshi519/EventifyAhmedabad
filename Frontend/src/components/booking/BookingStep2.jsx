import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

export default function BookingStep2({ event, seatCount, totalAmount, onNext }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({ cardNumber: '', expiryDate: '', cvv: '', cardName: '' });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handleSubmit = (e) => { e.preventDefault(); onNext({ paymentDetails: { method: paymentMethod, ...cardData } }); };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white">
      <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>

      <div className="space-y-3">
        {[
          { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
          { value: 'upi', label: 'UPI', icon: '📱' },
          { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
          { value: 'wallet', label: 'Wallet', icon: '👛' },
        ].map((method) => (
          <label key={method.value} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            paymentMethod === method.value ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300'
          }`}>
            <input type="radio" name="paymentMethod" value={method.value} checked={paymentMethod === method.value} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5"/>
            <span className="text-xl">{method.icon}</span>
            <span className="font-medium text-gray-800">{method.label}</span>
          </label>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Card Details</h3>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 text-purple-500" size={20}/>
            <input type="text" name="cardNumber" value={cardData.cardNumber} onChange={handleCardChange} placeholder="1234 5678 9012 3456" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"/>
          </div>
          <input type="text" name="cardName" value={cardData.cardName} onChange={handleCardChange} placeholder="Cardholder Name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"/>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="expiryDate" value={cardData.expiryDate} onChange={handleCardChange} placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"/>
            <input type="text" name="cvv" value={cardData.cvv} onChange={handleCardChange} placeholder="CVV" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"/>
          </div>
        </div>
      )}

      <div className="bg-purple-50 p-4 rounded-lg space-y-2 font-semibold text-gray-800">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{event.price * seatCount}</span></div>
        <div className="flex justify-between"><span>Convenience Fee</span><span>₹{Math.floor(event.price * seatCount * 0.1)}</span></div>
        <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold"><span>Total Amount</span><span className="text-purple-600">₹{totalAmount}</span></div>
      </div>

      <button type="submit" className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500">
        Proceed to Confirmation
      </button>
    </form>
  );
}