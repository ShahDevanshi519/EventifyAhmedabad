import { Table, Edit, Trash2, Eye, X } from "lucide-react";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ViewEvents() {

  const [events,setEvents] = useState([]);
  const [selectedEvent,setSelectedEvent] = useState(null);

  useEffect(()=>{
    axios.get("http://localhost:3000/display-event")
    .then((res)=> setEvents(res.data))
    .catch((err)=> console.log(err))
  },[])

  const deleteEvent = (id) => {
    const confirm = window.confirm("Are You Sure You Want To Delete This Event?");
    if(!confirm){
      return;
    }

    axios.delete(`http://localhost:3000/admin/deleteEvent/${id}`)
    .then((res) => {
      if(res.data.flag === 1){
        alert(res.data.msg);
        setEvents(events.filter(events => events._id != id))
      }else{
        alert(res.data.msg)
      }
    }).catch((err) => console.log(err))
  }

  return (
    <div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Table size={28} className="text-purple-600"/> Events
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">EventID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Image</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Price</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event,index)=>(
              <tr key={event._id} className="border-t hover:bg-pink-50">

                <td className="p-4">{index+1}</td>
                <td className="p-4">{event.title}</td>

                <td className="p-4">
                  <img
                    src={`http://localhost:3000${event.eventImage}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </td>

                <td className="p-4">{event.date}</td>
                <td className="p-4">{event.time}</td>
                <td className="p-4 text-purple-600 font-semibold">₹{event.price}</td>

                <td className="p-4 flex gap-2">

                  {/* VIEW */}
                  <button
                    onClick={()=>setSelectedEvent(event)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg"
                  >
                    <Eye size={16}/>
                  </button>

                  {/* EDIT */}
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Edit size={16}/>
                  </button>

                  {/* DELETE */}
                  <button onClick={() => deleteEvent(event._id)}className="p-2 bg-red-100 text-red-600 rounded-lg">
                    <Trash2 size={16}/>
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* POPUP MODAL */}

        {selectedEvent && (

      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl w-[650px] max-h-[80vh] overflow-y-auto relative shadow-xl p-8">

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            onClick={()=>setSelectedEvent(null)}
          >
            <X size={22}/>
          </button>

          <h2 className="text-2xl font-bold mb-6 text-purple-700">
            Event Details
          </h2>

          {/* Event Image */}
          <img
            src={`http://localhost:3000${selectedEvent.eventImage}`}
            className="w-full h-60 object-cover rounded-xl mb-6"
            alt={selectedEvent.title}
          />

          <div className="grid grid-cols-2 gap-4 text-gray-700">

            <p><b>Title:</b> {selectedEvent.title}</p>
            <p><b>Category:</b> {selectedEvent.category}</p>

            <p><b>Date:</b> {selectedEvent.date}</p>
            <p><b>Time:</b> {selectedEvent.time}</p>

            <p><b>Venue:</b> {selectedEvent.venue}</p>
            <p><b>Area:</b> {selectedEvent.area}</p>

            <p><b>Price:</b> ₹{selectedEvent.price}</p>
            <p><b>Total Seats:</b> {selectedEvent.totalseats}</p>

            <p><b>Available Seats:</b> {selectedEvent.seats}</p>
            <p><b>Rating:</b> {selectedEvent.rating}</p>

            <p><b>Reviews:</b> {selectedEvent.reviews}</p>
            <p><b>Trending:</b> {selectedEvent.isTrending ? "Yes":"No"}</p>

            <p><b>Live:</b> {selectedEvent.isLive ? "Yes":"No"}</p>
            <p><b>Loved:</b> {selectedEvent.isLoved ? "Yes":"No"}</p>

          </div>

          <div className="mt-4">
            <p><b>Description:</b></p>
            <p className="text-gray-600">{selectedEvent.description}</p>
          </div>

          <div className="mt-4">
            <p><b>What To Expect:</b></p>
            <p className="text-gray-600">{selectedEvent.whatToExpect}</p>
          </div>

          <div className="mt-4">
            <p><b>Note:</b></p>
            <p className="text-gray-600">{selectedEvent.note}</p>
          </div>

        </div>

      </div>

      )}

    </div>
  );
}