import { Table, Edit, Trash2 } from "lucide-react"; // added icons
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ViewEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/display-event")
    .then((res) => setEvents(res.data))
    .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Table size={28} className="text-purple-600" /> Events
      </h2>

      {/* Scrollable container */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Event Image</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Venue</th>
              <th className="p-4">Area</th>
              <th className="p-4">Price</th>
              <th className="p-4">TotalSeats</th>
              <th className="p-4">Seats</th>
              <th className="p-4">Description</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Reviews</th>
              <th className="p-4">IsTrending</th>
              <th className="p-4">IsLive</th>
              <th className="p-4">IsLoved</th>
              <th className="p-4">WhatToExpect</th>
              <th className="p-4">Note</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, index) => (
              <tr key={event._id} className="border-t hover:bg-pink-50 transition">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.category}</td>
                <td className="p-4">
                <div className="w-[100px] h-[100px]">
                <img
                  src={`http://localhost:3000${event.eventImage}`}
                  className="w-full h-full rounded-full object-cover"
                  alt={event.title}
                  />
                </div>
                </td>
                <td className="p-4">{event.date}</td>
                <td className="p-4">{event.time}</td>
                <td className="p-4">{event.venue}</td>
                <td className="p-4">{event.area}</td>
                <td className="p-4 font-semibold text-purple-600">₹{event.price}</td>
                <td className="p-4">{event.totalseats}</td>
                <td className="p-4">{event.seats}</td>
                <td className="p-4">{event.description}</td>
                <td className="p-4">{event.rating}</td>
                <td className="p-4">{event.reviews}</td>
                <td className="p-4">{event.isTrending ? "Yes" : "No"}</td>
                <td className="p-4">{event.isLive ? "Yes" : "No"}</td>
                <td className="p-4">{event.isLoved ? "Yes" : "No"}</td>
                <td className="p-4">{event.whatToExpect}</td>
                <td className="p-4">{event.note}</td>
                <td className="p-4 flex gap-2">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                    <Edit size={16} />
                  </button>
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