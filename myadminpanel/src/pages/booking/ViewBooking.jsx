import { Table, Trash2 } from "lucide-react";
import axios from 'axios';
import React , { useState , useEffect} from "react";

export default function ViewBooking() {
  const [booking,setBooking] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/display-booking")
    .then(res => setBooking(res.data))
    .catch(err => console.log(err))
  },[])

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Table size={28} className="text-purple-600" />
        Booking Table
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User Name</th>
              <th className="p-4">Event Name</th>
              <th className="p-4">Total Seats</th>
              <th className="p-4">Total Price</th>
              <th className="p-4">Booking Status</th>
              <th className="p-4">Booking Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {booking.map((book,index) => (
              <tr key={book._id} className="border-t hover:bg-pink-50 transition">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{book.userId?.fullName}</td>
                <td className="p-4">{book.eventId?.title}</td>
                <td className="p-4">{book.numberOfTickets}</td>
                <td className="p-4">{book.totalAmount}</td>
                <td className="p-4">{book.bookingStatus}</td>
                <td className="p-4">{book.bookingDate}</td>
                <td className="p-4 flex gap-2">
                {/* <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                  <Edit size={16} />
                  </button> */}
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                  <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}