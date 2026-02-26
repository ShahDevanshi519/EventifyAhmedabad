import React from 'react';

export default function YourBookings({ bookings }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Bookings</h2>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{booking.eventTitle}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="text-xs text-gray-500">Booking ID</p>
                      <p className="font-bold text-purple-600">{booking.id}</p>
                    </div>
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
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold hover:bg-purple-200 transition-colors">
                    View Ticket
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200 transition-colors">
                    Download
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">
                    Cancel Booking
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-8 text-center text-gray-500">
          <p className="text-lg">No bookings yet</p>
          <p className="text-sm">Start booking events to see them here</p>
        </div>
      )}
    </div>
  );
}