import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    price: 5000,
    area: "all",
    date: "all",
    category: "all",
  });

 
  useEffect(() => {
    axios.get("http://localhost:3000/display-event")
      .then((res) => {
        // console.log("API DATA:", res.data);
        setEvents(res.data);
      })
      .catch((err) => {
        console.log("API ERROR:", err);
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    console.log("Filtering Event:", event.title);

    // Price filter
    if (event.price > filters.price) 
      return false;

    // Date filter
     const eventDate = new Date(event.date);
     const today = new Date();

  // Reset time for accurate comparison
     today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7);

      const nextWeekEnd = new Date(today);
      nextWeekEnd.setDate(today.getDate() + 14);

      const nextMonthEnd = new Date(today);
      nextMonthEnd.setMonth(today.getMonth() + 1);

      // PRICE FILTER
      if (event.price > filters.price)
        return false;

      // AREA FILTER
      if (
        filters.area !== "all" &&
        event.area.toLowerCase() !== filters.area.toLowerCase()
      )
        return false;

      // CATEGORY FILTER
      if (
        filters.category !== "all" &&
        event.category.toLowerCase() !== filters.category.toLowerCase()
      )
        return false;

      // DATE FILTER
      if (filters.date === "today") {
        return eventDate.toDateString() === today.toDateString();
      }

      if (filters.date === "tomorrow") {
        return eventDate.toDateString() === tomorrow.toDateString();
      }

      if (filters.date === "week") {
        return eventDate >= today && eventDate <= weekEnd;
      }

      if (filters.date === "nextweek") {
        return eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
      }

      if (filters.date === "nextmonth") {
        return eventDate >= today && eventDate <= nextMonthEnd;
      }


    // Area filter
    if (filters.area !== "all" && event.area.toLowerCase() !== filters.area.toLowerCase()) 
      return false;

    // Category filter
    if (filters.category !== "all" && event.category.toLowerCase() !== filters.category.toLowerCase()) 
      return false;
    return true;
  });

  console.log("Filtered Events:", filteredEvents);

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="flex w-full">
        {/* FILTER SIDEBAR */}
        <div className="w-70 bg-white rounded-xl shadow p-4 sticky top-0 h-screen">
          <h1 className="text-3xl font-bold p-6">All Events</h1>
          <EventFilter onFilterChange={setFilters} />
        </div>

        {/* EVENTS */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} onAddToWishlist={() => {}} />
            ))
          ) : (
            <p className="text-xl text-gray-500 col-span-full text-center">
              No events found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
