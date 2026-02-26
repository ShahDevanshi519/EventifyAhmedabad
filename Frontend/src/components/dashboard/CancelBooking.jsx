import React, { useState } from 'react';

export default function CancelBooking({ bookings }) {
  const [cancelledBookings, setCancelledBookings] = useState([]);

  const handleCancel = (bookingId) => {
    setCancelledBookings([...cancelledBookings, bookingId]);
    alert('✅ Booking cancelled successfully! Refund will be processed within 5-7 business days.');
  };

  const activebookings = bookings.filter((b) => !cancelledBookings.includes(b.id));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Cancel Booking</h2>

      {activebookings.length > 0 ? (
        <div className="space-y-4">
          {activebookings.map((booking) => (
            <div key={booking.id} className="glass rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{booking.eventTitle}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-bold">{new Date(booking.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seats</p>
                      <p className="font-bold">{booking.seats}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-green-600">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="px-6 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors whitespace-nowrap"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-8 text-center text-gray-500">
          <p className="text-lg">No active bookings to cancel</p>
        </div>
      )}

      {cancelledBookings.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Cancelled Bookings</h3>
          <div className="space-y-3">
            {bookings
              .filter((b) => cancelledBookings.includes(b.id))
              .map((booking) => (
                <div key={booking.id} className="glass rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{booking.eventTitle}</p>
                      <p className="text-sm text-gray-600">
                        Refund: ₹{booking.totalAmount} (5-7 business days)
                      </p>
                    </div>
                    <span className="text-red-600 font-bold">Cancelled</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}