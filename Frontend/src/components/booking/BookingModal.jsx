import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';

export default function BookingModal({ event, seatCount, onClose }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    userDetails: {},
    paymentDetails: {},
  });

  const totalAmount = event.price * seatCount + Math.floor(event.price * seatCount * 0.1);

  const handleStepComplete = (data) => {
    setBookingData({
      ...bookingData,
      ...data,
    });
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Complete Your Booking</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-8 border-b border-purple-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= stepNum
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step > stepNum ? <Check size={20} /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step > stepNum ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-gray-600">
            <span>User Details</span>
            <span>Payment</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <BookingStep1
              event={event}
              seatCount={seatCount}
              onNext={handleStepComplete}
            />
          )}
          {step === 2 && (
            <BookingStep2
              event={event}
              seatCount={seatCount}
              totalAmount={totalAmount}
              onNext={handleStepComplete}
            />
          )}
          {step === 3 && (
            <BookingStep3
              event={event}
              seatCount={seatCount}
              totalAmount={totalAmount}
              bookingData={bookingData}
              onClose={onClose}
            />
          )}
        </div>

        {/* Footer Buttons */}
        {step < 3 && (
          <div className="px-6 py-4 border-t border-purple-200 flex gap-4">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex-1 px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}