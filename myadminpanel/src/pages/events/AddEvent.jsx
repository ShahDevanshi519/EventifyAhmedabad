import { Calendar } from "lucide-react";
import axios from 'axios';
import React, { useState } from 'react';
export default function AddEvent() {
  const [event,setEvent] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/event-api",event)
    .then(res => {
      console.log(res)
      alert("Event Added Successfully");
    })
    .catch(err => {
        console.log(err)
        alert("Error Handling In Event")
      })
  }
  
  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Calendar size={28} className="text-purple-600" />
          Add New Event
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-3xl">

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Event Title */}
          <input
            type="text"
            placeholder="Event Title"
            name="title"
            onChange={(e) => {setEvent({...event,title:e.target.value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
          />

          {/* Event Category */}
          <select name="mycategory" onChange={(e) => {setEvent({...event,mycategory:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400">
              <option value="">---Select Category---</option>
              <option value="Music">Music</option>
              <option value="Comedy">Comedy</option>
              <option value="Workshops">Workshops</option>
              <option value="Sports">Sports</option>
              <option value="Festivals">Festivals</option>
          </select>
          
          {/* Event Image */}
          <><input type="text" name="eventImage" placeholder="EventImage" onChange={(e) => {setEvent({...event,eventImage:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"/></>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              onChange={(e) => {setEvent({...event,date:e.target.value})}}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <input
              type="time"
              name="time"
              onChange={(e) => {setEvent({...event,time:e.target.value})}}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          {/* Venue */}
          <input type="text" name="venue" placeholder="Enter Venue" onChange={(e) => {setEvent({...event,venue:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"/>
          
          {/* Area */}
          <select name="area" onChange={(e) => {setEvent({...event,area:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400">
            <option value="">---Select Area---</option>
            <option value="Navrangpura">Navrangpura</option>
            <option value="Sarkhej">Sarkhej</option>
            <option value="Maninagar">Maninagar</option>
            <option value="Satelite">Satelite</option>
            <option value="Bopal">Bopal</option>
            <option value="Thltej">Thltej</option>
            <option value="Vastrapur">Vastrapur</option>
            <option value="Gota">Gota</option>
            <option value="Prahladnagar">Prahladnagar</option>
            <option value="SG Highway">SG Highway</option>
            <option value="Chandkheda">Chandkheda</option>
          </select>
          {/* <input type="text" name="area" placeholder="Enter Area" onChange={(e) => {setEvent({...event,area:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"/> */}

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            onChange={(e) => {setEvent({...event,price:e.target.value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          {/* Total Seats */}
          <input
            type="number"
            name="totalseats"
            placeholder="Enter TotalSeats"
            onChange={(e) => {setEvent({...event,totalseats:e.target.value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          {/* Seats */}
          <input
            type="number"
            name="seats"
            placeholder="Enter Seats"
            onChange={(e) => {setEvent({...event,seats:e.target.value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          {/* Description */}
          <textarea
            placeholder="Event Description"
            name="description"
            onChange={(e) => {setEvent({...event,description:e.target.value})}}
            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none h-32"
          ></textarea>

          {/* Rating */}
          <input type="number" name="rating" step="0.1" min="0" max="5" placeholder="rating" onChange={(e) => {setEvent({...event,rating:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"></input>

          {/* Reviews */}
          <input type="number" name="reviews" placeholder="reviews" onChange={(e) => {setEvent({...event,reviews:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"></input>

         {/* Flags */}
        <div className="flex items-center gap-6 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isTrending"
              onChange={(e) => {setEvent({...event,isTrending:e.target.checked})}}
              className="w-5 h-5 rounded border-white-300 focus:ring-2 focus:ring-purple-400"
            />
            Trending
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLive"
              onChange={(e) => {setEvent({...event,isLive:e.target.checked})}}
              className="w-5 h-5 rounded border-white-300 focus:ring-2 focus:ring-purple-400"
            />
            Live
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLoved"
              onChange={(e) => {setEvent({...event,isLoved:e.target.checked})}}
              className="w-5 h-5 rounded border-white-300 focus:ring-2 focus:ring-purple-400"
            />
            Loved
          </label>
        </div>

        {/* WhatToExpect */}
        {/* <label>What To Expect</label> */}
        <textarea name="whatToExpect" rows="2" placeholder="Enter WhatToExpect" onChange={(e) => {setEvent({...event,whatToExpect:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none h-32"></textarea>
        
        {/* Note */}
        <input type="text" name="note" placeholder="Enter Note" onChange={(e) => {setEvent({...event,note:e.target.value})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"/>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-300 transition-all duration-300"
          >
            Add Event
          </button>

        </form>
      </div>
    </div>
  );
}