import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";

export default function AllEvents() {

  const { area } = useParams();

  const [events, setEvents] = useState([]);

  const [filters, setFilters] = useState({
    price: 5000,
    area: area || "all",
    date: "all",
    category: "all",
  });

  useEffect(() => {

    if (area) {
      axios.get(`http://localhost:3000/events/area/${area}`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log("AREA API ERROR:", err);
      });

    } else {
      axios.get("http://localhost:3000/display-event")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log("ALL EVENTS API ERROR:", err);
      });
    }
  }, [area]);

  useEffect(() => {
    if (area) {
      setFilters(prev => ({
        ...prev,
        area: area
      }));

    } else {
      setFilters(prev => ({
        ...prev,
        area: "all"
      }));
    }
  }, [area]);
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);

    const today = new Date();
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


    // PRICE
    if(event.price > filters.price)
      return false;


    // AREA
    if(filters.area !== "all" &&
       event.area.toLowerCase() !== filters.area.toLowerCase())
      return false;


    // CATEGORY
    if(filters.category !== "all" &&
       event.category.toLowerCase() !== filters.category.toLowerCase())
      return false;


    // DATE
    if(filters.date === "today")
      return eventDate.toDateString() === today.toDateString();

    if(filters.date === "tomorrow")
      return eventDate.toDateString() === tomorrow.toDateString();

    if(filters.date === "week")
      return eventDate >= today && eventDate <= weekEnd;

    if(filters.date === "nextweek")
      return eventDate >= nextWeekStart && eventDate <= nextWeekEnd;

    if(filters.date === "nextmonth")
      return eventDate >= today && eventDate <= nextMonthEnd;


    return true;

  });



  return (

    <div className="min-h-screen bg-purple-50">

      <div className="flex w-full">

        {/* FILTER */}
        <div className="w-70 bg-white rounded-xl shadow p-4 sticky top-0 h-screen">

          <h1 className="text-3xl font-bold p-6">

            {area
              ? `Events in ${area.charAt(0).toUpperCase() + area.slice(1)}`
              : "All Events in Ahmedabad"
            }

          </h1>

          <EventFilter
            filters={filters}
            onFilterChange={setFilters}
          />

        </div>



        {/* EVENTS */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">

          {filteredEvents.length > 0 ?

            filteredEvents.map((event) => (

              <EventCard
                key={event._id}
                event={event}
                onAddToWishlist={() => {}}
              />

            ))

            :

            <p className="text-xl text-gray-500 col-span-full text-center">
              No events found
            </p>

          }

        </div>

      </div>

    </div>

  );

}