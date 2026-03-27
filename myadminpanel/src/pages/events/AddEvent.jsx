import { Calendar } from "lucide-react";
import axios from 'axios';
import React, { useState } from 'react';
export default function AddEvent() {
  const [event,setEvent] = useState({});
  const [errors,setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const newErrors = {};

    if (!event.title || event.title.trim() === "") {
      newErrors.title = "Title is required";
    } else if (/\d/.test(event.title)) {
      newErrors.title = "Title must not contain numbers";
    }

    // Category
    if (!event.mycategory || event.mycategory === "") {
      newErrors.mycategory = "Category is required";
    }

    // Event Image
    if (!event.eventImage) {
      newErrors.eventImage = "Event Image is required";
    }

    // Date - must be today or future
    if (!event.date) {
      newErrors.date = "Date is required";
    } else if (event.date < today) {
      newErrors.date = "Date must be today or a future date";
    }

    // Time
    if (!event.time || event.time === "") {
      newErrors.time = "Time is required";
    }

    // Venue
    if (!event.venue || event.venue.trim() === "") {
      newErrors.venue = "Venue is required";
    }

    // Area
    if (!event.area || event.area === "") {
      newErrors.area = "Area is required";
    }

    // Price - not negative
    if (event.price === undefined || event.price === "") {
      newErrors.price = "Price is required";
    } else if (Number(event.price) < 0) {
      newErrors.price = "Price cannot be negative";
    }

    // Total Seats - not negative
    if (event.totalseats === undefined || event.totalseats === "") {
      newErrors.totalseats = "Total Seats is required";
    } else if (Number(event.totalseats) < 0) {
      newErrors.totalseats = "Total Seats cannot be negative";
    }

    // Description - must be only string (no digits)
    if (!event.description || event.description.trim() === "") {
      newErrors.description = "Description is required";
    } else if (/^\d+$/.test(event.description.trim())) {
      newErrors.description = "Description must contain text, not only numbers";
    }

    // Rating
    if (event.rating === undefined || event.rating === "") {
      newErrors.rating = "Rating is required";
    }

    // Reviews
    if (event.reviews === undefined || event.reviews === "") {
      newErrors.reviews = "Reviews is required";
    }

    if(!event.whatToExpect || event.whatToExpect.trim() === ""){
      newErrors.whatToExpect = "What To Expect Is Required";
    }

    if(!event.note || event.note.trim() === ""){
      newErrors.note = "Note Is Required";
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

  const formData = new FormData();

  for (let key in event) {
    formData.append(key, event[key]);
  }

  axios.post("http://localhost:3000/event-api", formData)
    .then(() => {
      alert("Event Added Successfully");
      setEvent({});
    })
    .catch(() => {
      alert("Error Handling In Event");
    });
};
  
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
          <div>
            <input
              type="text"
              placeholder="Event Title"
              name="title"
              value={event.title || ""}
              onChange={(e) => {setEvent({...event,title:e.target.value}); setErrors({...errors,title:""})}}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1 ml-1">{errors.title}</p>}
          </div>

          {/* Event Category */}
          <div>
            <select name="mycategory" onChange={(e) => {setEvent({...event,mycategory:e.target.value}); setErrors({...errors,mycategory:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400">
                <option value="">---Select Category---</option>
                <option value="Music">Music</option>
                <option value="Comedy">Comedy</option>
                <option value="Workshops">Workshops</option>
                <option value="Sports">Sports</option>
                <option value="Festivals">Festivals</option>
            </select>
            {errors.mycategory && <p className="text-red-500 text-sm mt-1 ml-1">{errors.mycategory}</p>}
          </div>
          
          {/* Event Image */}
          <div>
            <input type="file" name="eventImage" onChange={(e) => {setEvent({ ...event, eventImage: e.target.files[0] }); setErrors({...errors,eventImage:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"/>
            {errors.eventImage && <p className="text-red-500 text-sm mt-1 ml-1">{errors.eventImage}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                name="date"
                min={today}
                onChange={(e) => {setEvent({...event,date:e.target.value}); setErrors({...errors,date:""})}}
                className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1 ml-1">{errors.date}</p>}
            </div>
            <div>
              <input
                type="time"
                name="time"
                onChange={(e) => {setEvent({...event,time:e.target.value}); setErrors({...errors,time:""})}}
                className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              {errors.time && <p className="text-red-500 text-sm mt-1 ml-1">{errors.time}</p>}
            </div>
          </div>

          {/* Venue */}
          <div>
            <input type="text" name="venue" placeholder="Enter Venue" onChange={(e) => {setEvent({...event,venue:e.target.value}); setErrors({...errors,venue:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"/>
            {errors.venue && <p className="text-red-500 text-sm mt-1 ml-1">{errors.venue}</p>}
          </div>
          
          {/* Area */}
          <div>
            <select name="area" onChange={(e) => {setEvent({...event,area:e.target.value}); setErrors({...errors,area:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400">
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
            {errors.area && <p className="text-red-500 text-sm mt-1 ml-1">{errors.area}</p>}
          </div>

          {/* Price */}
          <div>
            <input
              type="number"
              name="price"
              value={event.price || ""}
              min="0"
              placeholder="Price (₹)"
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < 0) value = 0;
                setEvent({ ...event, price: value });setErrors({...errors,price:""})
              }}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1 ml-1">{errors.price}</p>}
          </div>

          {/* Total Seats */}
          <div>
            <input
              type="number"
              name="totalseats"
              placeholder="Enter TotalSeats"
              min="0"
              onChange={(e) => {
                let value = Number(e.target.value)
                if(value < 0) value = 0
                setEvent({...event,totalseats:value}); setErrors({...errors,totalseats:""})}}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            {errors.totalseats && <p className="text-red-500 text-sm mt-1 ml-1">{errors.totalseats}</p>}
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Event Description"
              name="description"
              onChange={(e) => {setEvent({...event,description:e.target.value}); setErrors({...errors,description:""})}}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none h-32"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1 ml-1">{errors.description}</p>}
          </div>

          {/* Rating */}
          <div>
            <input type="number" name="rating" step="0.1" min="0" max="5" placeholder="rating" onChange={(e) => {setEvent({...event,rating:e.target.value}); setErrors({...errors,rating:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"></input>
            {errors.rating && <p className="text-red-500 text-sm mt-1 ml-1">{errors.rating}</p>}
          </div>

          {/* Reviews */}
          <div>
            <input type="number" name="reviews" placeholder="reviews" onChange={(e) => {setEvent({...event,reviews:e.target.value}); setErrors({...errors,reviews:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"></input>
            {errors.reviews && <p className="text-red-500 text-sm mt-1 ml-1">{errors.reviews}</p>}
          </div>

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
        <textarea name="whatToExpect" rows="2" placeholder="Enter WhatToExpect" onChange={(e) => {setEvent({...event,whatToExpect:e.target.value}); setErrors({...errors,whatToExpect:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none h-32"></textarea>
        {errors.whatToExpect && <p className="text-red-500 text-sm mt-1 ml-1">{errors.whatToExpect}</p>}

        {/* Note */}
        <input type="text" name="note" placeholder="Enter Note" onChange={(e) => {setEvent({...event,note:e.target.value}); setErrors({...errors,note:""})}} className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"/>
        {errors.note && <p className="text-red-500 text-sm mt-1 ml-1">{errors.note}</p>}
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