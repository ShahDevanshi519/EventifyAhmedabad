import React, { useState } from 'react';
import { X, Check, ArrowLeft } from 'lucide-react';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';

export default function BookingModal({ event, onClose }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    userDetails: { fullName: '', email: '', phone: '' },
    seatCount: 1,
    paymentDetails: {},
  });

  // Calculate total with 10% convenience fee
  const subtotal = event.price * bookingData.seatCount;
  const convenienceFee = Math.floor(subtotal * 0.1);
  const totalAmount = subtotal + convenienceFee;

  const handleStepComplete = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl animate-scale-in">
        
        {/* Header with Back Button */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {step > 1 && step < 3 && (
              <button onClick={handleBack} className="p-2 hover:bg-white/20 rounded-full transition">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold">
              {step === 3 ? "Booking Confirmed" : "Complete Your Booking"}
            </h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition"><X size={24} /></button>
        </div>

        {/* Progress Tracker */}
        {step < 3 && (
          <div className="px-8 py-6 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= stepNum ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > stepNum ? <Check size={20} /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${step > stepNum ? 'bg-purple-600' : 'bg-gray-300'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          {step === 1 && (
            <BookingStep1 
              event={event} 
              onNext={handleStepComplete} 
              savedData={bookingData} 
            />
          )}
          {step === 2 && (
            <BookingStep2 
              event={event} 
              bookingData={bookingData} 
              totalAmount={totalAmount} 
              onNext={handleStepComplete} 
              onBack={handleBack} 
            />
          )}
          {step === 3 && (
            <BookingStep3 
              event={event} 
              bookingData={bookingData} 
              totalAmount={totalAmount} 
              onClose={onClose} 
            />
          )}
        </div>
      </div>
    </div>
  );
}