import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ticket } from "lucide-react";

export default function AddTicket() {
  const [events, setEvents] = useState([]);
  const [ticket, setTicket] = useState({
    eventId: "",
    type: "",
    price: "",
    availableSeats: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get("http://localhost:3000/fetch/event/title")
      .then(res => {
        console.log(res.data)
        setEvents(res.data)})
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    // Event dropdown
    if (!ticket.eventId || ticket.eventId === "") {
      newErrors.eventId = "Please select an event";
    }

    // Ticket type dropdown
    if (!ticket.type || ticket.type === "") {
      newErrors.type = "Please select a ticket type";
    }

    // Price - required and not negative
    if (ticket.price === "" || ticket.price === undefined) {
      newErrors.price = "Price is required";
    } else if (Number(ticket.price) < 0) {
      newErrors.price = "Price cannot be negative";
    }

    // Available Seats - required and not negative
    if (ticket.availableSeats === "" || ticket.availableSeats === undefined) {
      newErrors.availableSeats = "Available Seats is required";
    } else if (Number(ticket.availableSeats) < 0) {
      newErrors.availableSeats = "Available Seats cannot be negative";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    axios.post("http://localhost:3000/admin/tickets", ticket)
    .then((res) => {
        alert(res.data.msg)
        setTicket({eventId:"",type:"",price:"",availableSeats:""})
    })
    .catch((err) => console.log(err))
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* Header */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Ticket size={28} className="text-purple-600" />
        Add Ticket Type
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-3xl">

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Event Dropdown */}
          <div>
            <select
              name="eventId"
              value={ticket.eventId}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">--- Select Event ---</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
            {errors.eventId && <p className="text-red-500 text-sm mt-1 ml-1">{errors.eventId}</p>}
          </div>

          {/* Ticket Type */}
          <div>
            <select
              name="type"
              value={ticket.type}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">--- Select Ticket Type ---</option>
              <option value="General">General</option>
              <option value="VIP">VIP</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1 ml-1">{errors.type}</p>}
          </div>

          {/* Price */}
          <div>
            <input
              type="number"
              name="price"
              value={ticket.price}
              min="0"
              placeholder="Enter Price (₹)"
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < 0) value = 0;
                setTicket({ ...ticket, price: value });
                setErrors({ ...errors, price: "" });
              }}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1 ml-1">{errors.price}</p>}
          </div>

          {/* Available Seats */}
          <div>
            <input
              type="number"
              name="availableSeats"
              value={ticket.availableSeats}
              min="0"
              placeholder="Available Seats"
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < 0) value = 0;
                setTicket({ ...ticket, availableSeats: value });
                setErrors({ ...errors, availableSeats: "" });
              }}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.availableSeats && <p className="text-red-500 text-sm mt-1 ml-1">{errors.availableSeats}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-300 transition-all duration-300"
          >
            Add Ticket
          </button>

        </form>
      </div>
    </div>
  );
}