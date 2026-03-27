import { Table, Eye, X,Trash2,Edit } from "lucide-react";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ViewTicket() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/admin/ticket/display")
      .then((res) => setTickets(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handelDelete = (id) =>{
    const confirmation = window.confirm("Are You Sure You Want To Delete This?");
    if(!confirmation){
      return;
    }

    axios.delete(`http://127.0.0.1:3000/tickettype/delete/${id}`)
    .then((res) => {
      alert(res.data.msg);
      setTickets(tickets.filter(ticket => ticket._id !== id))
    }).catch((err) => console.log(err))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Table size={28} className="text-purple-600" /> Tickets
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Event Title</th>
              <th className="p-4">Ticket Type</th>
              <th className="p-4">Price</th>
              <th className="p-4">Available Seats</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id} className="border-t hover:bg-pink-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{ticket.eventId?.title}</td>
                <td className="p-4">{ticket.type}</td>
                <td className="p-4">₹{ticket.price}</td>
                <td className="p-4">{ticket.availableSeats}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg"
                  >
                    <Eye size={16} />
                  </button>
                  {/* EDIT */}
                  {/* <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Edit size={16}/>
                  </button> */}
                  
                  {/* DELETE */}
                  <button onClick={() => handelDelete(ticket._id)} className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <Trash2 size={16}/>
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[650px] max-h-[80vh] overflow-y-auto relative shadow-xl p-8">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={() => setSelectedTicket(null)}
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-purple-700">
              Ticket & Event Details
            </h2>

            {/* Event Details */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Event Info</h3>
              <p><b>Title:</b> {selectedTicket.eventId?.title}</p>
              <p><b>Category:</b> {selectedTicket.eventId?.category}</p>
              <p><b>Date:</b> {selectedTicket.eventId?.date}</p>
              <p><b>Venue:</b> {selectedTicket.eventId?.venue}</p>
              <p><b>Total Seats:</b> {selectedTicket.eventId?.totalseats}</p>
            </div>

            {/* Ticket Details */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Ticket Info</h3>
              <p><b>Type:</b> {selectedTicket.type}</p>
              <p><b>Price:</b> ₹{selectedTicket.price}</p>
              <p><b>Available Seats:</b> {selectedTicket.availableSeats}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}