import { Calendar } from "lucide-react";
import axios from 'axios';
import React, { useState,useEffect} from 'react';
import { useParams,useNavigate } from "react-router-dom";
export default function EditEvent() {
  const [event,setEvent] = useState({});
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:3000/admin/eventdisplay/${id}`)
    .then((res) => {
        setEvent(res.data)
    })
    .catch((err) => console.log(err))
  },[])

const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  for (let key in event) {
    formData.append(key, event[key]);
  }

  if (typeof event.eventImage === "string") {
    formData.delete("eventImage");
  }

  axios.put(`http://127.0.0.1:3000/admin/updatevent/${id}`, formData)
    .then((res) => {
      {
        alert(res.data.msg)
        navigate('/admin/events/view');
    };
    })
    .catch((err) => console.log(err));
};
  
  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Calendar size={28} className="text-purple-600" />
          Edit Event
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-3xl">

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Event Title */}
          <input
            type="text"
            placeholder="Event Title"
            name="title"
            value={event.title || ""}
            onChange={(e) => {setEvent({...event,title:e.target.value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
          />

          {/* Event Category */}
          <select name="category" value={event.category || ""} onChange={(e) => {setEvent({...event,category:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400">
              <option value="">---Select Category---</option>
              <option value="Music">Music</option>
              <option value="Comedy">Comedy</option>
              <option value="Workshops">Workshops</option>
              <option value="Sports">Sports</option>
              <option value="Festivals">Festivals</option>
          </select>
          
          {/* Event Image */}
          <div className="w-full border border-gray-200 p-4 rounded-2xl space-y-2">
            {event.eventImage && typeof event.eventImage === 'string' && (
              <p className="text-sm text-gray-500 truncate">
                Current Image: <span className="text-purple-600 font-medium">{event.eventImage}</span>
              </p>
            )}
            {/* File input to change image */}
            <input
              type="file"
              name="eventImage"
              onChange={(e) => setEvent({ ...event, eventImage: e.target.files[0] })}
              className="w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={event.date ? event.date.split("T")[0] : ""}
              onChange={(e) => {setEvent({...event,date:e.target.value})}}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <input
              type="time"
              name="time"
              value={event.time || ""}
              onChange={(e) => {setEvent({...event,time:e.target.value})}}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          {/* Venue */}
          <input type="text" name="venue" value={event.venue || ""} placeholder="Enter Venue" onChange={(e) => {setEvent({...event,venue:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"/>
          
          {/* Area */}
          <select name="area" value={event.area || ""} onChange={(e) => {setEvent({...event,area:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400">
            <option value="">---Select Area---</option>
            <option value="Navrangpura">AshramRoad</option>
            <option value="Sarkhej">Bapunagar</option>
            <option value="Maninagar">Bodakdev</option>
            <option value="Satelite">Bopal</option>
            <option value="Bopal">Chandkheda</option>
            <option value="Thltej">Gota</option>
            <option value="Vastrapur">Law Garden</option>
            <option value="Gota">Maninagar</option>
            <option value="Prahladnagar">Naroda</option>
            <option value="SG Highway">Navrangpura</option>
            <option value="Chandkheda">Nikol</option>
            <option value="Chandkheda">Prahladnagar</option>
            <option value="Chandkheda">SBR</option>
            <option value="Chandkheda">SG Highway</option>
            <option value="Chandkheda">Satelite</option>
            <option value="Chandkheda">Thaltej</option>
            <option value="Chandkheda">University</option>
            <option value="Chandkheda">Vastrapur</option>
          </select>

          {/* Price */}
          <input
            type="number"
            name="price"
            value={event.price || ""}
            min="0"
            placeholder="Price (₹)"
            onChange={(e) => {
                let value = Number(e.target.value);
                if (value < 0) value = 0;
                setEvent({ ...event, price: value });
            }}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />

          {/* Total Seats */}
          <input
            type="number"
            name="totalseats"
            value={event.totalseats || ""}
            placeholder="Enter TotalSeats"
            onChange={(e) => {
                let value = Number(e.target.value)
                if(value < 0) value = 0;
                setEvent({...event,totalseats:value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          {/* Description */}
          <textarea
            placeholder="Event Description"
            name="description"
            value={event.description || ""}
            onChange={(e) => {setEvent({...event,description:e.target.value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none h-32"
          ></textarea>

          {/* Rating */}
          <input type="number" name="rating" value={event.rating || ""} step="0.1" min="0" max="5" placeholder="rating" onChange={(e) => {setEvent({...event,rating:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"></input>

          {/* Reviews */}
          <input type="number" name="reviews" value={event.reviews || ""} placeholder="reviews" onChange={(e) => {setEvent({...event,reviews:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"></input>

         {/* Flags */}
        <div className="flex items-center gap-6 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isTrending"
              checked={event.isTrending || false}
              onChange={(e) => {setEvent({...event,isTrending:e.target.checked})}}
              className="w-5 h-5 rounded border-white-300 focus:ring-2 focus:ring-purple-400"
            />
            Trending
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLive"
              checked={event.isLive || false}
              onChange={(e) => {setEvent({...event,isLive:e.target.checked})}}
              className="w-5 h-5 rounded border-white-300 focus:ring-2 focus:ring-purple-400"
            />
            Live
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLoved"
              checked={event.isLoved || false}
              onChange={(e) => {setEvent({...event,isLoved:e.target.checked})}}
              className="w-5 h-5 rounded border-white-300 focus:ring-2 focus:ring-purple-400"
            />
            Loved
          </label>
        </div>

        {/* WhatToExpect */}
        {/* <label>What To Expect</label> */}
        <textarea name="whatToExpect" value={event.whatToExpect || ""} rows="2" placeholder="Enter WhatToExpect" onChange={(e) => {setEvent({...event,whatToExpect:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none h-32"></textarea>
        
        {/* Note */}
        <input type="text" name="note" value={event.note || ""} placeholder="Enter Note" onChange={(e) => {setEvent({...event,note:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"/>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-300 transition-all duration-300"
          >
            Update Event
          </button>

        </form>
      </div>
    </div>
  );
}