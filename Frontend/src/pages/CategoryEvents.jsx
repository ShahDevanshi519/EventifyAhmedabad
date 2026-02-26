import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
// import { dummyEvents } from "../data/dummyEvents";
import { categories } from "../data/categories";
import EventFilter from "../components/events/EventFilter";
import EventCard from "../components/events/EventCard";
import axios from 'axios';

export default function CategoryEvents() {
  const { category } = useParams();
  const [events,setEvents] = useState([]);

  const categoryData = categories.find(
    (c) => c.name.toLowerCase() === category
  );

  useEffect(() => {
    axios.get(`http://localhost:3000/event/category/${category}`)
    .then((res) => {
      setEvents(res.data)
      console.log(res.data)
    })
    .catch((err) => console.log(err))
  },[category])

  const [filters, setFilters] = useState({
    price: 5000,
    area: "all",
    date: "all",
    // category: "all",
  });

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-500">Category not found</p>
      </div>
    );
  }

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
    // if (filters.category !== "all" && event.category.toLowerCase() !== filters.category.toLowerCase()) 
    //   return false;
    return true;
  });

  // return (
  //   <div className="min-h-screen bg-purple-50 pt-10 pb-16">
  //     <div className="max-w-7xl mx-auto px-4 relative">

  //       {/* Category Header */}
  //       <div
  //         className={`rounded-2xl p-6 mb-8 bg-gradient-to-r ${categoryData.color} text-white lg:ml-72`}
  //       >
  //         <h1 className="text-3xl font-bold">
  //           {categoryData.icon} {categoryData.name} Events
  //         </h1>
  //       </div>

  //       {/* Main Layout */}
  //       <div className="relative flex">

  //         {/* Sidebar / Filter (Fixed) */}
  //         <div className="hidden lg:block w-74 fixed top-24 left-0 h-[calc(100vh-6rem)] bg-white rounded-xl shadow p-4 overflow-auto z-10">
  //           <h1 className="text-3xl font-bold p-6">All Events</h1>
  //           <EventFilter onFilterChange={setFilters} />
  //         </div>

          

  //         {/* Event Cards */}
  //         <div className="flex-1 lg:ml-72 w-full">
  //           {filteredEvents.length ? (
  //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-40">
  //               {filteredEvents.map((event) => (
  //                 <div key={event.id} className="p-1" min-w-0>
  //                   <EventCard
  //                     event={event}
  //                     onAddToWishlist={() => {}}
  //                     className="rounded-lg"
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <p className="text-lg text-gray-500 text-center">
  //               No events found
  //             </p>
  //           )}
  //         </div>

  //       </div>

  //     </div>
  //   </div>
  // );

  return (
  <div className="min-h-screen bg-purple-50 pt-10 pb-16">
    <div className="px-4 relative">

      {/* Main Layout */}
      <div className="relative flex">

        {/* Sidebar / Filter */}
        <div className="hidden lg:block w-74 sticky top-24 self-start h-[calc(100vh-8rem)] bg-white rounded-xl shadow p-4 overflow-auto">
            <h1 className="text-3xl font-bold p-6">All Events</h1>
            <EventFilter onFilterChange={setFilters} />
        </div>

        
        <div className="flex-1 lg:pl-8 w-full">
          
          {/* Category Header */}
          <div className={`rounded-2xl p-6 mb-8 bg-gradient-to-r ${categoryData.color} text-white`}>
            <h1 className="text-3xl font-bold">
              {categoryData.icon} {categoryData.name} Events
            </h1>
          </div>

          {/* Event Cards Grid */}
          {filteredEvents.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id} className="min-w-0">
                  <EventCard
                    event={event}
                    onAddToWishlist={() => {}}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-500 text-center">
              No events found
            </p>
          )}
        </div>

      </div>
    </div>
  </div>
);
}
